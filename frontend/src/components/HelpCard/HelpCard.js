import axios from "axios";
import "./HelpCard.css";

function HelpCard(props) {

    async function sendRequestHandler() {
        try {
            const res = await axios.post(
                `http://localhost:4500/api/v1/profile/request/send/${props.help.createdBy._id}`,
                {},
                { withCredentials: true }
            );
            console.log(res);
            props.setHelps((prev) => {
                return prev.map((item) => {
                    if (item._id === props.help._id) {
                        return { ...item, connectionStatus: "pending", requestType: "sent" };
                    }
                    return item;
                });
            });
        } catch(error) {
            console.log(error);
        }
    }

    async function acceptRequestHandler() {
        try {
            const res = await axios.post(
                `http://localhost:4500/api/v1/profile/request/accept/${props.help.createdBy._id}`,
                {},
                { withCredentials: true }
            );
            console.log(res);
            props.setHelps((prev) => {
                return prev.map((item) => {
                    if (item._id === props.help._id) {
                        return { ...item, connectionStatus: "accepted", requestType: null };
                    }
                    return item;
                });
            });
        } catch(error) {
            console.log(error);
        }
    }

    async function deleteHelpHandler() {
        try {
            const res = await axios.delete(
                `http://localhost:4500/api/v1/profile/help-board/delete/${props.help._id}`,
                { withCredentials: true }
            );
            console.log(res);
            props.setHelps((prev) => {
                return prev.filter((item) => item._id !== props.help._id);
            });
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="helpCard">
            <div className="helpCardTop">
                <div className="helpUserSection">
                    {props.help.createdBy.profilePic
                        ? <img src={props.help.createdBy.profilePic} alt="profile" className="helpProfilePic" />
                        : <div className="helpFallback">{props.help.createdBy.firstName?.charAt(0)?.toUpperCase()}</div>
                    }
                    <div className="helpUserInfo">
                        <h3>{props.help.createdBy.firstName} {props.help.createdBy.lastName}</h3>
                        <p>{props.help.createdBy.bio ? props.help.createdBy.bio : "No bio available"}</p>
                    </div>
                </div>
                <div className="helpStatus">Status : Open</div>
            </div>

            <div className="helpContent">
                <h2>{props.help.title}</h2>
                <p>{props.help.description}</p>
            </div>

            <div className="helpActions">
                {props.help.connectionStatus === "none" &&
                    <button className="helpBtn primaryBtn" onClick={sendRequestHandler}>Connect</button>
                }
                {props.help.connectionStatus === "pending" && props.help.requestType === "sent" &&
                    <button className="helpBtn pendingBtn" disabled>Pending</button>
                }
                {props.help.connectionStatus === "pending" && props.help.requestType === "received" &&
                    <button className="helpBtn acceptBtn" onClick={acceptRequestHandler}>Accept</button>
                }
                {props.help.connectionStatus === "accepted" &&
                    <button className="helpBtn helpNowBtn">Help Now 🚀</button>
                }
                {props.type === "my-help-card" &&
                    <button className="helpBtn deleteBtn" onClick={deleteHelpHandler}>Delete Post</button>
                }
            </div>
        </div>
    );

}

export default HelpCard;