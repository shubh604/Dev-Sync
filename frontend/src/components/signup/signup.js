import {useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./signup.css";
import toast from "react-hot-toast";

function Signup() {
    const [curr, setCurr] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);


    function changeHandler(event) {
        setCurr((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            setSaving(true);
           
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/signup`, curr, { withCredentials: true });
            if (res.data.success === true) {
                toast.success("Signup Successful 🎉");
                navigate("/login"); 
            } 
        } catch(error) {
            
            toast.error(error.response?.data?.message || "Signup Failed");
        }
        finally{
            setSaving(false);
        }
       
    }

    return (
        <div className="signupPage">
          
            
                <div className="signupContainer">
                    <h1 className="signupHeading">Create Account</h1>
                    <p className="signupSubText">Join DevSync and connect with developers worldwide ✨</p>

                    <form className="signupForm" onSubmit={submitHandler}>
                        <div className="inputGroup">
                            <label htmlFor="id1">First Name</label>
                            <input type="text" id="id1" name="firstName" value={curr.firstName} onChange={changeHandler} placeholder="Enter first name" />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="id2">Last Name</label>
                            <input type="text" id="id2" name="lastName" value={curr.lastName} onChange={changeHandler} placeholder="Enter last name" />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="id3">Email</label>
                            <input type="email" id="id3" name="email" value={curr.email} onChange={changeHandler} placeholder="Enter email" />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="id4">Password</label>
                            <input type="password" id="id4" name="password" value={curr.password} onChange={changeHandler} placeholder="Enter password" />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="id5">Confirm Password</label>
                            <input type="password" id="id5" name="confirmPassword" value={curr.confirmPassword} onChange={changeHandler} placeholder="Confirm password" />
                        </div>
                        <button className="signupBtn saveBtn" disabled={saving}>Signup</button>
                    </form>

                    <div className="loginText">
                        <p>
                            Already have an account?{" "}
                            <NavLink className="loginLink" to="/login">Login here</NavLink>
                        </p>
                    </div>
                </div>
         
        </div>
    );
}

export default Signup;