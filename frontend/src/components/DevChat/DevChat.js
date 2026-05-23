import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import { AppContext } from "../../context/appContext";
import Spinner from "../Spinner/Spinner";
import ErrorModal from "../ErrorModal/ErrorModal";
import "./DevChat.css";

function DevChat() {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [receiverStatus, setReceiverStatus] = useState("offline");
    const [error, setError] = useState({ show: false, title: "", message: "" });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        async function loadChats() {
            try {
                const response = await axios.get(`http://localhost:4500/api/v1/profile/dev-chat/${receiverId}`, { withCredentials: true });
                setMessages(response.data.data);
                setReceiverStatus(response.data.receiverStatus);
            } catch(error) {
                console.log(error);
                setError({ show: true, title: "Error", message: "Unable to load chats" });
            } finally {
                setLoading(false);
            }
        }
        loadChats();
    }, [receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!user) return;

        const statusHandler = ({ userId, status }) => {
            if (userId === receiverId) setReceiverStatus(status);
        };

        const messageHandler = async (newMessage) => {
            try {
                setMessages((prev) => {
                    const alreadyExists = prev.some((msg) => msg.senderId === newMessage.senderId && msg.text === newMessage.text && msg.receiverId === newMessage.receiverId);
                    if (alreadyExists) return prev;
                    return [...prev, newMessage];
                });
                const audio = new Audio("/receive_sound.mp3");
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

    function sendMessageHandler() {
        if (!text.trim()) return;
        const newMessage = { senderId: user._id, receiverId, text };
        setMessages((prev) => [...prev, newMessage]);
        const audio = new Audio("/send_sound.mp3");
        audio.play().catch((err) => { console.log("Send sound error :", err); });
        socket.emit("send-message", newMessage);
        setText("");
    }

    return (
        <div className="devChatPage">
            {loading && <Spinner />}
            {error.show && <ErrorModal obj={error} onClose={() => setError({ show: false, title: "", message: "" })} />}

            {!loading && (
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
                                <div key={index} className={senderId?.toString() === user?._id?.toString() ? "myMessageContainer" : "otherMessageContainer"}>
                                    <div className={senderId?.toString() === user?._id?.toString() ? "myMessage" : "otherMessage"}>{msg.text}</div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef}></div>
                    </div>

                    <div className="chatInputSection">
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..." className="chatInput" onKeyDown={(e) => { if (e.key === "Enter") sendMessageHandler(); }} />
                        <button className="sendBtn" onClick={sendMessageHandler}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DevChat;