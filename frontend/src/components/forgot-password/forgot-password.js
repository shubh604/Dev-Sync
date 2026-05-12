import { useContext, useState } from "react";
import AppContextProvider from "../../context/appContext";
import {AppContext} from "../../context/appContext";
import axios from "axios";
import { NavLink } from "react-router-dom";

function ForgotPassword(){

    const [curr,setCurr] = useState({"email" : ""});
    const {user,setUser} = useContext(AppContext);
    const [response,setResponse] = useState("");

    function changeHandler(event){

        setCurr({email:event.target.value});

    }

    async function submitHandler(event){
        event.preventDefault();

        try{
            const res = await axios.post("http://localhost:4500/api/v1/forgot-password",curr,{withCredentials:true});
            console.log("data sent ", curr);
            console.log("res received" , res);

            if(res.data.success===true){
                setUser(res.data.user);
                console.log("succes:true " ,res.data.message);
                console.log("user" ,user);
                setResponse(res.data.message);
            }
            else{
                console.log("succes:false " ,res.data.message);
                setResponse(res.data.message);
            }

        }
        catch(error){
            console.log(error.res.data.message); 
            setResponse(error.res.data.message);     
        }

    }

    return (
        <div>
            <form onSubmit={submitHandler}>

                    <div>
                        <label htmlFor="id1">Email</label>
                        <input type="text" id="id1" value={curr.email} name="email" onChange={changeHandler} placeholder="Enter your email"></input>
                    </div>
                    <button>Reset password</button>
                </form>

                <div><p>{response}</p></div>

                <p>Remembered your password?</p>

                <NavLink to="/login">
                Login
                </NavLink>
        </div>
    )

}

export default ForgotPassword;
