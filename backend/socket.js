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
                console.log("Online Users :", onlineUsers);
                await User.findByIdAndUpdate(userId, { status: "online" });
                io.emit("user-status-change", { userId, status: "online" });
            } catch(error) {
                console.log("Join Error :", error);
            }
        });


        

        socket.on("send-message", async (data) => {
            try {
                const { senderId, receiverId, text } = data;
                const newMessage = await Message.create({ senderId, receiverId, text });

                // sender ko bhi bhejo
                socket.emit("receive-message", newMessage);

                // receiver ko bhejo
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