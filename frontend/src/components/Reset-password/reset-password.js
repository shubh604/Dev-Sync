import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import "./Reset-password.css";

function ResetPassword() {

    console.log("reset page");

    const { token } = useParams();
    const [curr, setCurr] = useState({ token: token, newPassword: "", confirmPassword: "" });
    const { user, setUser } = useContext(AppContext);
    const [resetStatus, setResetStatus] = useState(false);
    const [response, setResponse] = useState("");

    function changeHandler(event) {
        setCurr((prev) => {
            return { ...prev, [event.target.name]: event.target.value }
        })
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:4500/api/v1/reset-password",
                curr,
                { withCredentials: true }
            );
            console.log("data sent", curr);
            console.log("res received", res);
            if (res.data.success === true) {
                setUser(res.data.user);
                setResetStatus(true);
                setResponse(res.data.message);
            } else {
                setResponse(res.data.message);
            }
        } catch(error) {
            console.log(error.response.data.message);
            setResponse(error.response.data.message);
        }
    }

    return (
        <div className="resetPage">
            <div className="resetContainer">
                <h1 className="resetHeading">Reset Password</h1>
                <form className="resetForm" onSubmit={submitHandler}>
                    <div className="inputGroup">
                        <label htmlFor="id1">New Password</label>
                        <input type="password" id="id1" value={curr.newPassword} name="newPassword" onChange={changeHandler} placeholder="Enter new password" />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="id2">Confirm Password</label>
                        <input type="password" id="id2" value={curr.confirmPassword} name="confirmPassword" onChange={changeHandler} placeholder="Confirm password" />
                    </div>
                    <button className="resetBtn">Reset Password</button>
                </form>
                <div>
                    {resetStatus === true &&
                        <div className="successBox">
                            <p className="successText">Password reset successful!</p>
                            <NavLink className="loginLink" to="/login">Go to Login</NavLink>
                        </div>
                    }
                </div>
                <div className="responseMessage">
                    <p>{response}</p>
                </div>
            </div>
        </div>
    );

}

export default ResetPassword;