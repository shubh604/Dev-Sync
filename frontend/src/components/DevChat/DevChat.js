import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import { AppContext } from "../../context/appContext";
import "./DevChat.css";

function DevChat() {

    const { receiverId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [receiverStatus, setReceiverStatus] = useState("offline");

    // load old chats
    useEffect(() => {
        async function loadChats() {
            try {
                const response = await axios.get(
                    `http://localhost:4500/api/v1/profile/dev-chat/${receiverId}`,
                    { withCredentials: true }
                );
                setMessages(response.data.data);
                setReceiverStatus(response.data.receiverStatus);
                console.log("old status", response.data.receiverStatus);
            } catch(error) {
                console.log(error);
            }
        }
        loadChats();
    }, [receiverId]);

    // socket listeners
    useEffect(() => {
        if (!user) return;

        const statusHandler = ({ userId, status }) => {
            if (userId === receiverId) setReceiverStatus(status);
        };

        const messageHandler = async (newMessage) => {
            try {
                setMessages((prev) => [...prev, newMessage]);
                const audio = new Audio("/message-tone.mp3");
                await audio.play();
            } catch(error) {
                console.log("Audio Error :", error);
            }
        };

        socket.on("user-status-change", statusHandler);
        socket.on("receive-message", messageHandler);

        return () => {
            socket.off("user-status-change", statusHandler);
            socket.off("receive-message", messageHandler);
        };
    }, [user, receiverId]);

    // send message
    function sendMessageHandler() {
        if (!text.trim()) return;
        socket.emit("send-message", { senderId: user._id, receiverId, text });
        setText("");
    }

    return (
        <div className="devChatPage">
            <div className="chatCard">
                <div className="chatHeader">
                    <button className="backBtn" onClick={() => navigate(-1)}>← Back</button>
                    <h2>DevChat 💬</h2>
                    <span className={`userStatus ${receiverStatus}`}>{receiverStatus}</span>
                </div>
                <div className="chatContainer">
                    {messages.map((msg, index) => {
                        const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                        return (
                            <div key={index} className={senderId.toString() === user._id.toString() ? "myMessageContainer" : "otherMessageContainer"}>
                                <div className={senderId.toString() === user._id.toString() ? "myMessage" : "otherMessage"}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="chatInputSection">
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..." className="chatInput" />
                    <button className="sendBtn" onClick={sendMessageHandler}>Send</button>
                </div>
            </div>
        </div>
    );

}

export default DevChat;