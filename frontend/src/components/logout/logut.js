import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";
import "./logout.css";

function Logout(props) {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [error, setError] = useState({ show: false, title: "", message: "" });
    const [saving , setSaving] = useState(false);

    async function yesHandler() {
        try {
            setLoading(true);
            setSaving(true);
            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/logout`, {}, { withCredentials: true });
            console.log("res received", res);
            setSuccessModal(true);
            setUser(null); 
            props.setLogoutClick(false); 
            toast.success("Logged Out Successfully!");
            navigate("/", { replace: true });
        } catch(error) {
            const message = error?.response?.data?.message;

            if(
                message === "token missing!" ||
                message === "Token expired" ||
                message === "Invalid token"
            ){
                toast.error("Please login again");
            }

            else{
                toast.error(message || "Something went wrong");
            }
        }
        finally{
            setLoading(false);
            setSaving(false);
        }
    }

    function cancelHandler() {
        props.setLogoutClick(false);
    }

    return (
        <div className="logoutOverlay">
            {loading && <Spinner />}
            
        

            <div className="logoutBox">
                <p className="logoutText">Are you sure you want to log out?</p>
                <div className="logoutBtns">
                    <button className="yesBtn saveBtn" onClick={yesHandler}  disabled={saving}>Yes</button>
                    <button className="cancelBtn"  onClick={cancelHandler} >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Logout;