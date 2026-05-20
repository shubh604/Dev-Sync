const Message = require("../model/ChatSchema");
const User = require("../model/User");

async function ChatController(req, res) {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.receiverId;
        console.log("Sender ID :", senderId);
        console.log("Receiver ID :", receiverId);

        const chats = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        const receiver = await User.findById(receiverId);

        res.json({ success: true, message: "Chats loaded successfully", data: chats, receiverLastSeen: receiver.lastSeen, receiverStatus: receiver.status    });
    } catch(error) {
        console.log(error);
        res.json({ success: false, message: "Error in loading chats" });
    }
}

module.exports = { ChatController };