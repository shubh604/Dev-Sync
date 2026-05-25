import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import { AppContext } from "../../context/appContext";
import Spinner from "../Spinner/Spinner";
import "./DevChat.css";
import toast from "react-hot-toast";


function DevChat() {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [receiverStatus, setReceiverStatus] = useState("offline");
    const messagesEndRef = useRef(null);
   const sendAudioRef = useRef(new Audio("/send_sound.mp3"));
const receiveAudioRef = useRef(new Audio("/receive_sound.mp3"));

useEffect(() => {

    socket.emit("active-chat", {
        userId: user._id,
        chattingWith: receiverId
    });

    socket.emit("clear-chat-unread", {
        currentUser: user._id,
        receiverId
    });


    return () => {
        socket.emit("leave-chat", user._id);
    };

}, [receiverId, user]);


    useEffect(() => {
        async function loadChats() {
            try {
                const response = await axios.get(`http://localhost:4500/api/v1/profile/dev-chat/${receiverId}`, { withCredentials: true });
                setMessages(response.data.data);
                setReceiverStatus(response.data.receiverStatus);
                
            } catch(error) {
                toast.error("Unable to fetch chats!");
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

            const alreadyExists = prev.some(
                (msg) => msg._id === newMessage._id
            );

            if (alreadyExists) return prev;

            return [...prev, newMessage];
        });
        
         
    receiveAudioRef.current.currentTime = 0;

receiveAudioRef.current.play().catch((err) => {
    console.log("Receive sound error :", err);
});
    } catch (error) {
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

        const newMessage = {
            senderId: user._id,
            receiverId,
            text,
        };

        // optimistic update
        setMessages((prev) => [...prev, newMessage]);

        socket.emit("send-message", newMessage);
sendAudioRef.current.currentTime = 0;

sendAudioRef.current.play().catch((err) => {
    console.log("Send sound error :", err);
});


        setText("");
    }

    return (
        <div className="devChatPage">
            {loading && <Spinner />}
       

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
                                <div key={msg._id || index} className={senderId?.toString() === user?._id?.toString() ? "myMessageContainer" : "otherMessageContainer"}>
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