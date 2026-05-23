import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/appContext";
import RequestCard from "../RequestCard/RequestCard";
import Spinner from "../Spinner/Spinner";
import socket from "../../socket";
import "./RequestsCard.css";
import toast from "react-hot-toast";

function RequestsCards(props) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, setPendingRequests } = useContext(AppContext);

    useEffect(() => {
        if (props.type === "pending") {
            socket.emit("clear-pending-requests", user._id);
            setPendingRequests(0);
        }
    }, []);

    useEffect(() => {
        async function fetchRequests() {
            try {
                let res;
                if (props.type === "sent") {
                    res = await axios.get("http://localhost:4500/api/v1/profile/requests/sent", { withCredentials: true });
                } else if (props.type === "pending") {
                    res = await axios.get("http://localhost:4500/api/v1/profile/requests/pending", { withCredentials: true });
                }
                setRequests(res.data.data);
            } catch(error) {
                toast.error(error?.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, [props.type]);

    return (
        <div className="requestsPage">
            {loading && <Spinner />}
            
            {!loading && (
                <div className="requests-card-container">
                    <h1 className="requests-heading">{props.type === "sent" ? "Requests Sent" : "Pending Requests"}</h1>
                    <div className="requestsList">
                        {requests.length > 0
                            ? requests.map((request) => <RequestCard obj={request} type={props.type} key={request._id} />)
                            : <p className="no-requests">No requests found.</p>
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

export default RequestsCards;