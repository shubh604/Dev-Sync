import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";
import ErrorModal from "../ErrorModal/ErrorModal";
import "./Card.css";
import toast from "react-hot-toast";
import socket from "../../socket";
function Card(props) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(props.obj.connectionStatus);
    const [requestType, setRequestType] = useState(props.obj.requestType);
    const [error, setError] = useState({ show: false, title: "", message: "" });

    console.log(props);

    async function sendRequestHandler() {
        try {
            setLoading(true);
            const userId = props.obj._id;
            const res = await axios.post(`http://localhost:4500/api/v1/profile/request/send/${userId}`,{},{ withCredentials: true });
            setConnectionStatus("pending");
            setRequestType("sent");
            toast.success("Request sent successfully🎉")
            socket.emit("request-count-change", {
                receiverId:userId,
                action: "increment"
            });
        } catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    async function acceptRequestHandler() {
        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:4500/api/v1/profile/request/accept/${props.obj._id}`,{},{ withCredentials: true });
            setConnectionStatus("accepted");
            toast.success("Request Accepted🎉")
    
        } catch(error) {
             toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    function editButtonHandler() {
        navigate("/profile/edit-profile");
    }

    async function removeConnectionHandler() {
        try {
            setLoading(true);
            const res = await axios.delete(
                `http://localhost:4500/api/v1/profile/connection/remove/${props.obj._id}`,
                { withCredentials: true }
            );
            toast.success("Connection removed!")
            props.setConnections((prev) => prev.filter((connection) => connection._id !== props.obj._id));
        } catch(error) {
             toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    function chatHandler() {
        navigate(`/profile/dev-chat/${props.obj._id}`);
    }

    function chatHandler1(){
        navigate(`/profile/dev-chat/${props.obj._id}`, {state: {fron: "feed"}} );
    }

    return (
        <>
            {loading && <Spinner />}
            {error.show && <ErrorModal obj={error} onClose={() => setError({ show: false, title: "", message: "" })} />}

            <div className={`card ${props.buttonType === "connection" ? "connectionCard" : ""}`}>
                <div className="cardLeft">
                    <div className="outer">
                        {props.obj.profilePic
                            ? <img className="image" src={props.obj.profilePic} alt="profile" />
                            : <div className="image fallbackImage">{props.obj?.firstName?.charAt(0)?.toUpperCase()}</div>
                        }
                    </div>
                    <div className="cardContent">
                        <h2>{props.obj.firstName} {props.obj.lastName}</h2>
                        <p className="bio">{props.obj.bio ? props.obj.bio : "No bio available"}</p>
                        <div className="skillsSection">
                            <p className="skillsHeading"></p>
                            <div className="skillsWrapper">
                                {props.obj.skills?.length > 0
                                    ? props.obj.skills.map((skill, index) => <span className="skill" key={index}>{skill}</span>)
                                    : <p>No skills added</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {props.buttonType === "Edit Profile" &&
                    <button className="btn" onClick={editButtonHandler}>Edit-Profile</button>
                }

                {props.buttonType === "FeedCard" &&
                    <div className="feedBtnWrapper">
                        {connectionStatus === "none" && <button className="btn" onClick={sendRequestHandler}>Connect</button>}
                        {connectionStatus === "pending" && requestType === "sent" && <button className="btn" disabled>Request-Sent</button>}
                        {connectionStatus === "pending" && requestType === "received" && <button className="btn" onClick={acceptRequestHandler}>Accept-Req</button>}
                        {connectionStatus === "accepted" && <button className="btn" onClick={chatHandler1}>Dev-Chat{props.obj.messages> 0 && <span className="badge">{props.obj.messages}</span>}</button>}
                    </div>
                }

                {props.buttonType === "connection" &&
                    <div className="connectionButtons">
                        <button className="btn" onClick={chatHandler}>Dev-Chat{props.obj.messages> 0 && <span className="badge">{props.obj.messages}</span>}</button>
                        <button className="btn removeBtn" onClick={removeConnectionHandler}>Remove-Connection</button>
                    </div>
                }
            </div>
        </>
    );

}

export default Card;