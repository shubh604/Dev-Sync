import { useContext, useState } from "react";
import AppContextProvider from "../../context/appContext";
import {AppContext} from "../../context/appContext";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";

function ResetPassword(){
    console.log("reset page");

    const {token} = useParams();

    const [curr, setCurr] = useState({"token":token , "newPassword": "" , "confirmPassword" : ""});
    const {user,setUser} = useContext(AppContext);

    const [resetStatus,setResetStatus] = useState(false);
    const [response,setResponse] = useState("");

    function changeHandler(event){

        setCurr((prev)=>{
            return{
                ...prev,
                [event.target.name]:event.target.value
            }
        })
    }

    async function submitHandler(event){
        event.preventDefault();

        try{
            const res = await axios.post("http://localhost:4500/api/v1/reset-password",curr,{withCredentials:true});
            console.log("data sent ", curr);
            console.log("res received" , res);

            if(res.data.success===true){
                setUser(res.data.user);
                console.log("succes:true " ,res.data.message);
                console.log("user" ,user);
                setResetStatus(true);
                setResponse(res.data.message);
            }
            else{
                console.log("succes:false " ,res.data.message);
                setResponse(res.data.message);
            }

        }
        catch(error){
            console.log(error.response.data.message);      
            setResponse(error.response.data.message);
        }

    }

    return(
        <div>

            <h1>Reset Password</h1>

            <form onSubmit={submitHandler}>

                <div>
                    <label htmlFor="id1">New Password</label>
                    <input type="password" id="id1" value={curr.newPassword} name="newPassword" onChange={changeHandler} placeholder="Enter new passsword"></input>
                </div>

                <div>
                    <label htmlFor="id2">Confirm Password</label>
                    <input type="password" id="id2" value={curr.confirmPassword} name="confirmPassword" onChange={changeHandler} placeholder="Enter confirm passsword"></input>
                </div>

                <button>Reset</button>

            </form>

            <div>
                {resetStatus===true && <div> <p>Password reset succeddful!</p> <NavLink to="/login">Go to login</NavLink> </div>}
            </div>

            <div><p>{response}</p></div>

        </div>
    )

}

export default ResetPassword;