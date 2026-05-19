import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Card.css";

function Card(props) {

    const navigate = useNavigate();

    async function sendRequestHandler() {
        try {
            const userId = props.obj._id;
            const res = await axios.post(
                `http://localhost:4500/api/v1/profile/request/send/${userId}`,
                {},
                { withCredentials: true }
            );
            console.log(res);
        } catch(error) {
            console.log(error);
        }
    }

    async function acceptRequestHandler() {
        try {
            const res = await axios.post(
                `http://localhost:4500/api/v1/profile/request/accept/${props.obj._id}`,
                { withCredentials: true }
            );
            console.log(res);
        } catch(error) {
            console.log(error);
        }
    }

    function editButtonHandler() {
        navigate("/profile/edit-profile");
    }

    async function removeConnectionHandler() {
        try {
            const res = await axios.post(
                `http://localhost:4500/api/v1/profile/connection/remove/${props.obj._id}`,
                {},
                { withCredentials: true }
            );
            console.log(res);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="card">
            <div className="outer">
                {props.obj.profilePic
                    ? <img className="image" src={props.obj.profilePic} alt="profile" />
                    : <div className="image fallbackImage">{props.obj?.firstName?.charAt(0)?.toUpperCase()}</div>
                }
            </div>

            <h2>{props.obj.firstName} {props.obj.lastName}</h2>

            <p className="bio">{props.obj.bio ? props.obj.bio : "No bio available"}</p>

            <div className="skillsSection">
                <p className="skillsHeading">Skills</p>
                {props.obj.skills?.length > 0
                    ? props.obj.skills.map((skill, index) => <span className="skill" key={index}>{skill}</span>)
                    : <p>No skills added</p>
                }
            </div>

            <br />

            {props.buttonType === "Edit Profile" &&
                <button className="btn" onClick={editButtonHandler}>Edit Profile</button>
            }

            {props.buttonType === "FeedCard" &&
                <>
                    {props.obj.connectionStatus === "none" &&
                        <button className="btn" onClick={sendRequestHandler}>Connect</button>
                    }
                    {props.obj.connectionStatus === "pending" && props.obj.requestType === "sent" &&
                        <button className="btn" disabled>Request Sent</button>
                    }
                    {props.obj.connectionStatus === "pending" && props.obj.requestType === "received" &&
                        <button className="btn" onClick={acceptRequestHandler}>Accept</button>
                    }
                    {props.obj.connectionStatus === "accepted" &&
                        <button className="btn">Chat</button>
                    }
                </>
            }

            {props.buttonType === "connection" &&
                <div className="connectionButtons">
                    <button className="btn">Chat</button>
                    <button className="btn removeBtn" onClick={removeConnectionHandler}>Remove Connection</button>
                </div>
            }

        </div>
    );

}

export default Card;