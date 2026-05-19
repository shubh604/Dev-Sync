import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {

    const [curr, setCurr] = useState({ email: "", password: "" });
    const { user, setUser } = useContext(AppContext);
    const [response, setResponse] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    function changeHandler(event) {
        setCurr((prev) => {
            return { ...prev, [event.target.name]: event.target.value }
        })
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:4500/api/v1/login",
                curr,
                { withCredentials: true }
            );
            if (res.data.success === true) {
                console.log("success:true", res.data.message);
                setResponse(res.data.message);
                setTimeout(() => { setUser(res.data.user); navigate("/"); }, 3000);
            } else {
                setResponse(res.data.message);
            }
        } catch(error) {
            console.log(error?.response?.data?.message);
            setResponse(error?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="loginPage">
            {!user &&
                <div className="loginContainer">
                    <h1 className="loginHeading">Welcome Back</h1>
                    <form className="loginForm" onSubmit={submitHandler}>
                        <div className="inputGroup">
                            <label htmlFor="id1">Email</label>
                            <input type="email" id="id1" value={curr.email} name="email" onChange={changeHandler} placeholder="Enter your email" />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="id2">Password</label>
                            <input type="password" id="id2" value={curr.password} name="password" onChange={changeHandler} placeholder="Enter your password" />
                        </div>
                        <button className="loginBtn">Login</button>
                    </form>
                    <div className="extraLinks">
                        <NavLink className="forgotLink" to="/forgot-password">Forgot Password?</NavLink>
                        <p className="signupText">Don't have an account? {" "}<NavLink className="signupLink" to="/signup">Signup here</NavLink></p>
                    </div>
                    <div className="responseMessage">
                        <p>{response}</p>
                    </div>
                </div>
            }
        </div>
    );

}

export default Login;