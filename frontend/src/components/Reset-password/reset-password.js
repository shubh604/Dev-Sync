import {useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import "./Reset-password.css";
import toast from "react-hot-toast";

function ResetPassword() {
    console.log("reset page");
    const { token } = useParams();
    const [curr, setCurr] = useState({ token: token, newPassword: "", confirmPassword: "" });
    const [resetStatus, setResetStatus] = useState(false);

        const [saving, setSaving] = useState(false);
    

    function changeHandler(event) {
        setCurr((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            setSaving(true);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/reset-password`, curr, { withCredentials: true });
                setResetStatus(true);
                toast.success("Password reset successful 🎉");
            
        } catch(error) {
            toast.error(error.response?.data?.message || "Password reset failed");
        }
        finally{
            setSaving(false);
        }
    }

    return (
        <div className="resetPage">

            <div className="resetContainer">
                <h1 className="resetHeading">Reset Password</h1>
                <p className="resetSubText">Create a strong password and secure your DevSync account 🔐</p>

                <form className="resetForm" onSubmit={submitHandler}>
                    <div className="inputGroup">
                        <label htmlFor="id1">New Password</label>
                        <input type="password" id="id1" value={curr.newPassword} name="newPassword" onChange={changeHandler} placeholder="Enter new password" />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="id2">Confirm Password</label>
                        <input type="password" id="id2" value={curr.confirmPassword} name="confirmPassword" onChange={changeHandler} placeholder="Confirm password" />
                    </div>
                    <button className="resetBtn saveBtn" disabled={saving} >Reset Password</button>
                </form>

                {resetStatus && (
                <NavLink className="loginLink" to="/login">Go to Login →</NavLink>
)}
            </div>
        </div>
    );
}

export default ResetPassword;