import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import "./logout.css";

function Logout(props) {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [response, setResponse] = useState("");

    async function yesHandler() {
        try {
            const res = await axios.put(
                "http://localhost:4500/api/v1/logout",
                {},
                { withCredentials: true }
            );

            console.log("res received", res);

            if (res.data.success === true) {
                setUser(null);
                setResponse(res.data.message);
                props.setLogoutClick(false);
                navigate("/");
            } else {
                setResponse(res.data.message);
            }
        } catch(error) {
            console.log(error?.response?.data?.message);
            setResponse(error?.response?.data?.message || "Something went wrong");
        }
    }

    function cancelHandler() {
        props.setLogoutClick(false);
    }

    return (
        <div className="logoutOverlay">
            <div className="logoutBox">
                <p className="logoutText">Are you sure you want to log out?</p>
                <div className="logoutBtns">
                    <button className="yesBtn" onClick={yesHandler}>Yes</button>
                    <button className="cancelBtn" onClick={cancelHandler}>Cancel</button>
                </div>
                <p className="logoutResponse">{response}</p>
            </div>
        </div>
    );

}

export default Logout;