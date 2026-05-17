import { useContext, useState , useEffect} from "react";
import AppContextProvider from "../../context/appContext";
import {AppContext} from "../../context/appContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";


function ChangePassword(){

    const {user,setUser} = useContext(AppContext);
    const [response,setResponse]= useState("");
    const navigate = useNavigate();

    const [curr,setCurr] = useState({"oldPassword":"" , "newPassword":"" , "confirmPassword" : ""});

    function changeHandler(event){
        setCurr((prev)=>{
            return{
                ...prev,
                [event.target.name] : event.target.value
            }
        })
    }

    async function submitHandler(event){
        event.preventDefault();
        try{
            
            const res = await axios.put("http://localhost:4500/api/v1/profile/change-password",curr,{withCredentials:true});

            if(res.data.success===true){
                setUser(res.data.user);
                console.log("succes:true " ,res.data.message);
                console.log("user" ,user);
                setResponse(res.data.message);
                setTimeout(()=>{setUser(res.data.user);navigate("/")},3000);
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

    return (

        <div>
            <h1>CHANGE PASSWORD</h1>

            <form onSubmit={submitHandler}>


                <div>
                    <label htmlFor="id1">Old Password</label>
                    <input type="text" id="id1" name="oldPassword" value={curr.oldPassword} onChange={changeHandler} placeholder="Enter old password"></input>
                </div>

                <div>
                    <label htmlFor="id2">New Password</label>
                    <input type="text" id="id2" name="newPassword" value={curr.newPassword} onChange={changeHandler} placeholder="Enter new password"></input>
                </div>

                <div>
                    <label htmlFor="id3">Confirm Password</label>
                    <input type="text" id="id3" name="confirmPassword" value={curr.confirmPassword} onChange={changeHandler} placeholder="Enter cofirm password"></input>
                </div>

                <button>Change Password</button>

            </form>

            <div><p>{response}</p></div>

        </div>

    )


}

export default ChangePassword;