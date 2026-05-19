import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./forgot-password.css";

function ForgotPassword() {

    const [curr, setCurr] = useState({ email: "" });
    const { user, setUser } = useContext(AppContext);
    const [response, setResponse] = useState("");

    function changeHandler(event) {
        setCurr({ email: event.target.value });
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:4500/api/v1/forgot-password",
                curr,
                { withCredentials: true }
            );
            console.log("data sent", curr);
            console.log("res received", res);
            if (res.data.success === true) {
                setUser(res.data.user);
                setResponse(res.data.message);
            } else {
                setResponse(res.data.message);
            }
        } catch(error) {
            console.log(error?.response?.data?.message);
            setResponse(error?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="forgotPage">
            <div className="forgotContainer">
                <h1 className="forgotHeading">Forgot Password</h1>
                <p className="forgotText">Enter your email address and we'll send you a password reset link 🔐</p>
                <form className="forgotForm" onSubmit={submitHandler}>
                    <div className="inputGroup">
                        <label htmlFor="id1">Email</label>
                        <input type="email" id="id1" value={curr.email} name="email" onChange={changeHandler} placeholder="Enter your email" />
                    </div>
                    <button className="resetBtn">Reset Password</button>
                </form>
                <div className="responseMessage">
                    <p>{response}</p>
                </div>
                <div className="loginSection">
                    <p>Remembered your password?</p>
                    <NavLink className="loginLink" to="/login">Login</NavLink>
                </div>
            </div>
        </div>
    );

}

export default ForgotPassword;