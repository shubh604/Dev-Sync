import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import ErrorModal from "../ErrorModal/ErrorModal";
import "./logout.css";

function Logout(props) {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [error, setError] = useState({ show: false, title: "", message: "" });

    async function yesHandler() {
        try {
            setLoading(true);
            const res = await axios.put("http://localhost:4500/api/v1/logout", {}, { withCredentials: true });
            console.log("res received", res);
            if (res.data.success === true) {
                setSuccessModal(true);
                setTimeout(() => { setUser(null); props.setLogoutClick(false); navigate("/"); }, 1000);
            } else {
                setError({ show: true, title: "Logout Failed", message: res.data.message });
            }
        } catch(error) {
            console.log(error?.response?.data?.message);
            setError({ show: true, title: "Logout Error", message: error?.response?.data?.message || "Something went wrong" });
        }
        setLoading(false);
    }

    function cancelHandler() {
        props.setLogoutClick(false);
    }

    return (
        <div className="logoutOverlay">
            {loading && <Spinner />}
            {error.show && <ErrorModal obj={error} onClose={() => setError({ show: false, title: "", message: "" })} />}
            {successModal && <ErrorModal obj={{ title: "Logout Successful 👋", message: "You have been logged out successfully" }} onClose={() => setSuccessModal(false)} />}

            <div className="logoutBox">
                <p className="logoutText">Are you sure you want to log out?</p>
                <div className="logoutBtns">
                    <button className="yesBtn" onClick={yesHandler}>Yes</button>
                    <button className="cancelBtn" onClick={cancelHandler}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Logout;