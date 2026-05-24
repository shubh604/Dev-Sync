const Message = require("./model/ChatSchema");
const User = require("./model/User");
const Connection = require("./model/connectionSchema");

const onlineUsers = {};
const activeChats = {};

// on -> receive
// emit -> send

module.exports = function(io) {

    io.on("connection", (socket) => {
        console.log("User Connected :", socket.id);

        socket.on("join", async (userId) => {
            try {
                onlineUsers[userId] = socket.id;
                await User.findByIdAndUpdate(userId, { status: "online" });
                io.emit("user-status-change", { userId, status: "online" });
                const userData = await User.findById(userId);
                socket.emit("initial-counts", {
                    unreadMessages: userData.unreadMessageCount,
                    pendingRequests: userData.pendingRequestCount
                });
            } catch(error) {
                console.log("Join Error :", error);
            }
        });

        socket.on("active-chat", ({ userId, chattingWith }) => {
   activeChats[userId] = chattingWith;
});
socket.on("leave-chat", (userId) => {

    delete activeChats[userId];

    console.log("Active Chats :", activeChats);

});
socket.on("clear-chat-unread", async ({ currentUser, receiverId }) => {

    try {

        const connection = await Connection.findOne({
            $or: [
                {
                    fromUser: currentUser,
                    toUser: receiverId
                },
                {
                    fromUser: receiverId,
                    toUser: currentUser
                }
            ]
        });

        if (!connection) return;

        // current user is toUser
        if (connection.toUser.toString() === currentUser.toString()) {

            connection.toMsgCount = 0;

        } else {

            connection.fromMsgCount = 0;

        }

        await connection.save();

    } catch(error) {

        console.log("Clear Chat Unread Error :", error);

    }

});

        socket.on("request-count-change", async ({ receiverId, action }) => {
    try {

        const value = action === "increment" ? 1 : -1;

        await User.findByIdAndUpdate(receiverId, {
            $inc: {
                pendingRequestCount: value
            }
        });

        const receiverSocketId = onlineUsers[receiverId];

        if (receiverSocketId) {

            const updatedUser = await User.findById(receiverId);

            io.to(receiverSocketId).emit("pending-request-updated", {
                pendingRequests: updatedUser.pendingRequestCount
            });
        }

    } catch(error) {
        console.log("Request Count Error :", error);
    }
});

        socket.on("clear-pending-requests", async (userId) => {
            try {
                await User.findByIdAndUpdate(userId, { pendingRequestCount: 0 });
            } catch(error) {
                console.log("Clear Pending Error :", error);
            }
        });

        socket.on("clear-unread-messages", async (userId) => {
            try {
                await User.findByIdAndUpdate(userId, { unreadMessageCount: 0 });
            } catch(error) {
                console.log("Clear Unread Error :", error);
            }
        });

      socket.on("send-message", async (data) => {
    try {

        const { senderId, receiverId, text } = data;

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text
        });

        // check if receiver is currently chatting with sender
        const isCurrentlyChatting =
            activeChats[receiverId] === senderId;
            console.log(activeChats);

        // only increment unread if NOT chatting
        if (!isCurrentlyChatting) {

            await User.findByIdAndUpdate(receiverId, {
                $inc: { unreadMessageCount: 1 }
            });

            const connection = await Connection.findOne({
    $or: [
        {
            fromUser: senderId,
            toUser: receiverId
        },
        {
            fromUser: receiverId,
            toUser: senderId
        }
    ]
});

if (connection) {
    
    // sender is fromUser
    if (connection.fromUser.toString() === senderId.toString()) {
        await Connection.findByIdAndUpdate(connection._id, {
   $inc: { toMsgCount: 1 }
});

    } else {
        await Connection.findByIdAndUpdate(connection._id, {
   $inc: { fromMsgCount: 1 }
});

    }

}

            

        }

        const receiverSocketId = onlineUsers[receiverId];

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("senderId", "name profilePic")
            .populate("receiverId", "name profilePic");

        if (receiverSocketId) {

            io.to(receiverSocketId).emit(
                "receive-message",
                populatedMessage
            );

        }

    } catch (error) {

        console.log("Error in sending message :", error);

    }
});


        


        socket.on("disconnect", async () => {
            console.log("User Disconnected :", socket.id);
            try {
                for (let userId in onlineUsers) {
                    if (onlineUsers[userId] === socket.id) {
                        delete onlineUsers[userId];
                        delete activeChats[userId];
                        await User.findByIdAndUpdate(userId, { status: "offline", lastSeen: Date.now() });
                        io.emit("user-status-change", { userId, status: "offline" });
                        break;
                    }
                }
            } catch(error) {
                console.log("Disconnect Error :", error);
            }
        });

    });

};