import RequestCard from "../RequestCard/RequestCard";
import axios from "axios";
import { useState, useEffect } from "react";
import "./RequestsCard.css";

function RequestsCards(props) {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            try {
                let res;
                if (props.type === "sent") {
                    res = await axios.get(
                        "http://localhost:4500/api/v1/profile/requests/sent",
                        { withCredentials: true }
                    );
                } else if (props.type === "pending") {
                    res = await axios.get(
                        "http://localhost:4500/api/v1/profile/requests/pending",
                        { withCredentials: true }
                    );
                }
                console.log(res.data);
                setRequests(res.data.data);
            } catch(error) {
                console.log(error);
                console.log(error.response);
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, [props.type]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="requests-card-container">
            <h1 className="requests-heading">{props.type === "sent" ? "Requests Sent" : "Pending Requests"}</h1>
            {requests.length > 0
                ? requests.map((request) => <RequestCard obj={request} type={props.type} key={request._id} />)
                : <p className="no-requests">No requests found.</p>
            }
        </div>
    );

}

export default RequestsCards;