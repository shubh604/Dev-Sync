import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";
import "./RequestCard.css";
import socket from "../../socket";

function RequestCard(props) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(props.type === "sent");
const [pending, setPending] = useState(props.type === "pending");
    const [saving, setSaving] = useState(false);


    async function AcceptRequestHandler() {
        try {
            setSaving(true);
            setLoading(true);
            const res = await axios.post(`http://localhost:4500/api/v1/profile/request/accept/${props.obj._id}`, {}, { withCredentials: true });
           
            setPending(false);
            toast.success("Request Accepted!🎉")
        } catch(error) {
             toast.error(error?.response?.data?.message || "Something went wrong");
        }
        finally{
            setLoading(false);
            setSaving(false);
        }
    }

    async function cancelRequestHandler() {
        try {
            setLoading(true);
            setSaving(true);
            const res = await axios.delete(`http://localhost:4500/api/v1/profile/request/cancel/${props.obj._id}`, { withCredentials: true });
            setSent(false);
            toast.success("Request Cancelled!");
            socket.emit("request-count-change", {
                receiverId:`${props.obj._id}`,
                action: "decrement"
            });
        } catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
        finally{
            setLoading(false);
            setSaving(false);
        }
    }

    async function DeleteRequestHandler() {
        try {
            setLoading(true);
            setSaving(true);
            const res = await axios.delete(`http://localhost:4500/api/v1/profile/request/delete/${props.obj._id}`, { withCredentials: true });
            setPending(false);
            toast.success("Request Deleted!")
        } catch(error) {
           toast.error(error?.response?.data?.message || "Something went wrong");
        }
        finally{
            setLoading(false);
            setSaving(false);
        }
    }

    return (
        <>
            {loading && <Spinner />}

            { ((props.type==="sent" && sent) || (props.type==="pending" && pending)) &&

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
                    {pending && (
                        <>
                            <button className="btn success-btn saveBtn"  onClick={AcceptRequestHandler}  disabled={saving}>Accept</button>
                            <button className="btn danger-btn saveBtn" onClick={DeleteRequestHandler}  disabled={saving}>Decline</button>
                        </>
                    )}
                    {sent && (
                        <button  className="btn secondary-btn saveBtn" onClick={cancelRequestHandler}  disabled={saving}>Cancel</button>
                    )}
                </div>
            </div>
}
        </>
    );
}

export default RequestCard;