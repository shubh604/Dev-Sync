import axios from "axios";
import "./RequestCard.css";

function RequestCard(props) {

    async function AcceptRequestHandler() {
        try {
            const res = await axios.post(
                `http://localhost:4500/api/v1/profile/request/accept/${props.obj._id}`,
                {},
                { withCredentials: true }
            );
            console.log(res);
            window.location.reload();
        } catch(error) {
            console.log(error);
        }
    }

    async function cancelRequestHandler() {
        try {
            const res = await axios.delete(
                `http://localhost:4500/api/v1/profile/request/cancel/${props.obj._id}`,
                { withCredentials: true }
            );
            console.log(res);
            window.location.reload();
        } catch(error) {
            console.log(error);
        }
    }

    async function DeleteRequestHandler() {
        try {
            const res = await axios.delete(
                `http://localhost:4500/api/v1/profile/request/delete/${props.obj._id}`,
                { withCredentials: true }
            );
            console.log(res);
            window.location.reload();
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="request-card">
            <div className="request-left">
                {props.obj.profilePic
                    ? <img src={props.obj.profilePic} alt="profile-pic" className="request-profile-pic" />
                    : <div className="request-fallback">{props.obj.firstName?.charAt(0)?.toUpperCase()}</div>
                }
                <div className="request-info">
                    <h2>{props.obj.firstName} {props.obj.lastName}</h2>
                    <p>{props.obj.bio ? props.obj.bio : "No bio available"}</p>
                </div>
            </div>
            <div className="request-actions">
                {props.type === "pending" && (
                    <>
                        <button className="btn success-btn" onClick={AcceptRequestHandler}>Accept</button>
                        <button className="btn danger-btn" onClick={DeleteRequestHandler}>Decline</button>
                    </>
                )}
                {props.type === "sent" && (
                    <button className="btn secondary-btn" onClick={cancelRequestHandler}>Cancel</button>
                )}
            </div>
        </div>
    );

}

export default RequestCard;