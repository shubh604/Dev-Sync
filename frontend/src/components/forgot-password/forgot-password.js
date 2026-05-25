import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";
import "./forgot-password.css";

function ForgotPassword() {

  const [curr, setCurr] = useState({ email: "" });
  const [saving, setSaving] = useState(false);
  


  function changeHandler(event) {
    setCurr({ email: event.target.value });
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const res = await axios.post(
        "http://localhost:4500/api/v1/forgot-password",
        curr,
        { withCredentials: true }
      );
      
       
        toast.success(res.data.message || "Password reset link sent to your email 🎉");

    } catch(error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally{
      setSaving(false);
    }

  }

  return (
    <div className="forgotPage">


      <div className="forgotContainer">

        <h1 className="forgotHeading">Forgot Password</h1>

        <p className="forgotText">
          Enter your email address and we'll send you a password reset link 🔐
        </p>

        <form className="forgotForm" onSubmit={submitHandler}>

          <div className="inputGroup">
            <label htmlFor="id1">Email</label>
            <input type="email" id="id1" value={curr.email} name="email" onChange={changeHandler} placeholder="Enter your email" />
          </div>

          <button className="resetBtn saveBtn"  disabled={saving}>Reset Password</button>

        </form>

        <div className="loginSection">
          <p>Remembered your password?</p>
          <NavLink className="loginLink" to="/login">Login</NavLink>
        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;