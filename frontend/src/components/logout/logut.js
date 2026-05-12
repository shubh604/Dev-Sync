import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../context/appContext";
import axios from "axios";

function Logout(props){

    const navigate = useNavigate();
    const {user,setUser} = useContext(AppContext);
    const [response,setResponse] = useState("");

    async function yesHandler(){

        try{
            const res = await axios.put("http://localhost:4500/api/v1/logout",{}, {withCredentials:true});
            console.log("res received" , res);

            if(res.data.success===true){

                setUser(null);
                console.log("succes:true " ,res.data.message);
                console.log("user" ,user);
                setResponse(res.data.message);
                props.setLogoutClick(false);
                navigate("/");
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

    function cancelHandler(){
        props.setLogoutClick(false);
    }

    return(

       
            <div>
                <p>Are you sure u want to log out?</p>
                <button onClick={yesHandler}>Yes</button>
                <button onClick={cancelHandler}>cancel</button>
            </div>
        
    )

}

export default Logout;