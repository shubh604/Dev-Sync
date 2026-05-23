const Message = require("./model/ChatSchema");
const User = require("./model/User");

const onlineUsers = {};

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
                const newMessage = await Message.create({ senderId, receiverId, text });
                socket.emit("receive-message", newMessage);
                await User.findByIdAndUpdate(receiverId, { $inc: { unreadMessageCount: 1 } });
                const receiverSocketId = onlineUsers[receiverId];
                if (receiverSocketId) io.to(receiverSocketId).emit("receive-message", newMessage);
            } catch(error) {
                console.log("Error in sending message :", error);
            }
        });

        socket.on("disconnect", async () => {
            console.log("User Disconnected :", socket.id);
            try {
                for (let userId in onlineUsers) {
                    if (onlineUsers[userId] === socket.id) {
                        delete onlineUsers[userId];
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