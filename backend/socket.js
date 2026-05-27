const Message = require("./model/ChatSchema");
const User = require("./model/User");
const Connection = require("./model/connectionSchema");

const onlineUsers = {};
const activeChats = {};

module.exports = function (io) {

    io.on("connection", (socket) => {

        socket.on("join", async (userId) => {
            try {
                onlineUsers[userId] = socket.id;
                await User.findByIdAndUpdate(userId, { status: "online" });
                io.emit("user-status-change", { userId, status: "online" });

                const userData = await User.findById(userId);
                socket.emit("initial-counts", {
                    unreadMessages: userData.unreadMessageCount,
                    pendingRequests: userData.pendingRequestCount,
                });
            } catch (error) {
                console.log("Join Error:", error);
            }
        });


        socket.on("active-chat", ({ userId, chattingWith }) => {
            activeChats[userId] = chattingWith;
        });


        socket.on("leave-chat", (userId) => {
            delete activeChats[userId];
        });


        socket.on("clear-chat-unread", async ({ currentUser, receiverId }) => {
            try {
                const connection = await Connection.findOne({
                    $or: [
                        { fromUser: currentUser, toUser: receiverId },
                        { fromUser: receiverId, toUser: currentUser },
                    ],
                });

                if (!connection) return;

                let unreadCount = 0;

                if (connection.toUser.toString() === currentUser.toString()) {
                    unreadCount = connection.toMsgCount;
                    connection.toMsgCount = 0;
                } else {
                    unreadCount = connection.fromMsgCount;
                    connection.fromMsgCount = 0;
                }

                await connection.save();

                await User.findByIdAndUpdate(currentUser, {
                    $inc: { unreadMessageCount: -unreadCount },
                });
            } catch (error) {
                console.log("Clear Chat Unread Error:", error);
            }
        });

        socket.on("send-message", async ({ senderId, receiverId, text }) => {
            try {
                const newMessage = await Message.create({ senderId, receiverId, text });

                const isCurrentlyChatting = activeChats[receiverId] === senderId;

                if (!isCurrentlyChatting) {
                    await User.findByIdAndUpdate(receiverId, {
                        $inc: { unreadMessageCount: 1 },
                    });

                    const connection = await Connection.findOne({
                        $or: [
                            { fromUser: senderId, toUser: receiverId },
                            { fromUser: receiverId, toUser: senderId },
                        ],
                    });

                    if (connection) {
                        const field =
                            connection.fromUser.toString() === senderId.toString()
                                ? "toMsgCount"
                                : "fromMsgCount";

                        await Connection.findByIdAndUpdate(connection._id, {
                            $inc: { [field]: 1 },
                        });
                    }
                }

                const populatedMessage = await Message.findById(newMessage._id)
                    .populate("senderId", "name profilePic")
                    .populate("receiverId", "name profilePic");

                const receiverSocketId = onlineUsers[receiverId];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive-message", populatedMessage);
                }
            } catch (error) {
                console.log("Error in sending message:", error);
            }
        });

        
        socket.on("disconnect", async () => {
            console.log("User Disconnected:", socket.id);
            try {
                for (let userId in onlineUsers) {
                    if (onlineUsers[userId] === socket.id) {
                        delete onlineUsers[userId];
                        delete activeChats[userId];
                        await User.findByIdAndUpdate(userId, {
                            status: "offline",
                            lastSeen: Date.now(),
                        });
                        io.emit("user-status-change", { userId, status: "offline" });
                        break;
                    }
                }
            } catch (error) {
                console.log("Disconnect Error:", error);
            }
        });
    });
};