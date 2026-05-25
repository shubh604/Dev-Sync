import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

import "./login.css";
import toast from "react-hot-toast";
function Login() {
    const [curr, setCurr] = useState({ email: "", password: "" });
    const { user, setUser } = useContext(AppContext);
    const [saving, setSaving] = useState(false);
   
    const navigate = useNavigate();

    useEffect(() => {
        if(user) navigate("/");
    }, [user, navigate]);

    function changeHandler(event) {
        setCurr((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            setSaving(true);
            const res = await axios.post("http://localhost:4500/api/v1/login", curr, { withCredentials: true });
            if (res.data.success === true) {
                console.log("success:true", res.data.message);
                toast.success("Login Successful 🎉");
                 setUser(res.data.user); 
                 navigate("/"); 
            } 
        } catch(error) {
            toast.error(error.response?.data?.message || "Login Failed");
        }
        finally{
            setSaving(false);
        }
       
    }

    return (
        <div className="loginPage">
           
         
           
                <div className="loginContainer">
                    <h1 className="loginHeading">Welcome Back</h1>
                    <p className="loginSubText">Login and continue your DevSync journey 🚀</p>

                    <form className="loginForm" onSubmit={submitHandler}>
                        <div className="inputGroup">
                            <label htmlFor="id1">Email</label>
                            <input type="email" id="id1" value={curr.email} name="email" onChange={changeHandler} placeholder="Enter your email" />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="id2">Password</label>
                            <input type="password" id="id2" value={curr.password} name="password" onChange={changeHandler} placeholder="Enter your password" />
                        </div>
                        <button className="loginBtn saveBtn"  disabled={saving}>Login</button>
                    </form>

                    <div className="extraLinks">
                        <NavLink className="forgotLink" to="/forgot-password">Forgot Password?</NavLink>
                        <p className="signupText">
                            Don't have an account?{" "}
                            <NavLink className="signupLink" to="/signup">Signup here</NavLink>
                        </p>
                    </div>
                </div>
       
        </div>
    );
}

export default Login;