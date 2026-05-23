import axios from "axios";
import "./HelpCard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";

function HelpCard(props) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(props.help.connectionStatus);
    const [requestType, setRequestType] = useState(props.help.requestType);
    const [helpStatus, setHelpStatus] = useState(props.help.status);
    const [readMore, setReadMore] = useState(false);
    async function sendRequestHandler() {
        try {
            setLoading(true);
            await axios.post(`http://localhost:4500/api/v1/profile/request/send/${props.help.createdBy._id}`, {}, { withCredentials: true });
            setConnectionStatus("pending");
            setRequestType("sent");
            toast.success("Request Sent!");
        } catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    async function acceptRequestHandler() {
        try {
            setLoading(true);
            await axios.post(`http://localhost:4500/api/v1/profile/request/accept/${props.help.createdBy._id}`, {}, { withCredentials: true });
            setConnectionStatus("accepted");
            setRequestType(null);
            toast.success("Request Accepted!");
        } catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    async function deleteHelpHandler() {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:4500/api/v1/profile/help-board/delete/${props.help._id}`, { withCredentials: true });
            props.setHelps((prev) => prev.filter((item) => item._id !== props.help._id));
            toast.success("Help-post Deleted!");
        } catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    async function helpStatusHandler(newStatus) {
        try {
            setLoading(true);
            await axios.post(`http://localhost:4500/api/v1/profile/help-board/update-status/${props.help._id}`, { status: newStatus }, { withCredentials: true });
            setHelpStatus(newStatus);
            toast.success("Status updated!");
        } catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    function helpnowHandler() {
        navigate(`/profile/dev-chat/${props.help.createdBy._id}`);
    }

    return (
        <>
            {loading && <Spinner />}
            <div className="helpCard">
                <div className="helpCardTop">
                    <div className="helpUserSection">
                        {props.type !== "my-help-card" && (
                            <>
                                {props.help.createdBy.profilePic
                                    ? <img src={props.help.createdBy.profilePic} alt="profile" className="helpProfilePic" />
                                    : <div className="helpFallback">{props.help.createdBy.firstName?.charAt(0)?.toUpperCase()}</div>
                                }
                            </>
                        )}
                        <div className="helpUserInfo">
                            {props.type === "my-help-card"
                                ? <h3>Your Help Post</h3>
                                : <>
                                    <h3>{props.help.createdBy.firstName} {props.help.createdBy.lastName}</h3>
                                    <p>{props.help.createdBy.bio ? props.help.createdBy.bio : "No bio available"}</p>
                                  </>
                            }
                        </div>
                    </div>
                    <div className={`helpStatus ${helpStatus}`}>{helpStatus}</div>
                </div>

                {props.type === "my-help-card" && (
                    <div className="myHelpStatusSection">
                        <p className="myHelpStatusText">
                            {helpStatus === "open" && "Waiting for help 👀"}
                            {helpStatus === "active" && "Someone is helping you 🚀"}
                            {helpStatus === "resolved" && "Issue resolved 🎉"}
                        </p>
                        <select className="helpStatusSelect" value={helpStatus} onChange={(e) => helpStatusHandler(e.target.value)}>
                            <option value="open">Open</option>
                            <option value="active">Active</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                )}

                <div className="helpContent">
                    <h2>{props.help.title}</h2>
                    <p className="helpDescription">
   {props.help.description}
</p>
                </div>

                <div className="helpActions">
                    {helpStatus === "resolved"
                        ? <button className="helpBtn resolvedBtn" disabled>Resolved ✅</button>
                        : connectionStatus === "accepted"
                            ? <button className="helpBtn helpNowBtn" onClick={helpnowHandler}>Help Now 🚀</button>
                            : <>
                                {connectionStatus === "none" && <button className="helpBtn primaryBtn" onClick={sendRequestHandler}>Connect</button>}
                                {connectionStatus === "pending" && requestType === "sent" && <button className="helpBtn pendingBtn" disabled>Pending</button>}
                                {connectionStatus === "pending" && requestType === "received" && <button className="helpBtn acceptBtn" onClick={acceptRequestHandler}>Accept</button>}
                              </>
                    }
                    {props.type === "my-help-card" && <button className="helpBtn deleteBtn" onClick={deleteHelpHandler}>Delete Post</button>}
                </div>
            </div>
        </>
    );

}

export default HelpCard;