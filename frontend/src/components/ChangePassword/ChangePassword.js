import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {

    const { user, setUser } = useContext(AppContext);
    const [response, setResponse] = useState("");
    const navigate = useNavigate();
    const [curr, setCurr] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    function changeHandler(event) {
        setCurr((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            const res = await axios.put(
                "http://localhost:4500/api/v1/profile/change-password",
                curr,
                { withCredentials: true }
            );

            if (res.data.success === true) {
                setUser(res.data.user);
                setResponse(res.data.message);
                setTimeout(() => { navigate("/"); }, 1000);
            } else {
                setResponse(res.data.message);
            }
        } catch(error) {
            console.log(error?.response?.data?.message);
            setResponse(error?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="changePasswordPage">
            <div className="changePasswordContainer">
                <h1 className="changeHeading">Change Password</h1>
                <p className="changeSubText">Keep your account secure by updating your password regularly 🔐</p>
                <form className="changeForm" onSubmit={submitHandler}>
                    <div className="inputGroup">
                        <label htmlFor="id1">Old Password</label>
                        <input type="password" id="id1" name="oldPassword" value={curr.oldPassword} onChange={changeHandler} placeholder="Enter old password" />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="id2">New Password</label>
                        <input type="password" id="id2" name="newPassword" value={curr.newPassword} onChange={changeHandler} placeholder="Enter new password" />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="id3">Confirm Password</label>
                        <input type="password" id="id3" name="confirmPassword" value={curr.confirmPassword} onChange={changeHandler} placeholder="Confirm password" />
                    </div>
                    <button className="changeBtn">Change Password</button>
                </form>
                <div className="responseMessage">
                    <p>{response}</p>
                </div>
            </div>
        </div>
    );

}

export default ChangePassword;