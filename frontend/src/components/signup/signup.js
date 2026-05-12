import { useContext, useState , useEffect} from "react";
import AppContextProvider from "../../context/appContext";
import {AppContext} from "../../context/appContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

function Signup(){

    const [curr,setCurr] = useState({"firstName" :"", "lastName" : "", "email" : "", "password":"", "confirmPassword":""});
    const {user,setUser} = useContext(AppContext);
    const [response,setResponse] = useState("");
    
    const navigate = useNavigate();
    
    function changeHandler(event){
        setCurr((prev)=>{
            return{
                ...prev,
                [event.target.name] : event.target.value
            }
        })
    }

    useEffect(()=>{
    
            if(user){
                navigate("/");
            }
    
        },[user,navigate]);

    async function submitHandler(event){
        event.preventDefault();

        try{
            const res = await axios.post("http://localhost:4500/api/v1/signup",curr,{withCredentials:true});
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
            console.log("error " , error.res.data.message);
            setResponse(error.res.data.message);
        }

    }

    return(
        <div>

            {!user &&
            
            <div>
                
                <h1>Signup Form</h1>
            
            <div>
                <form onSubmit={submitHandler}>

                    <div>
                        <label htmlFor="id1">First Name</label>
                        <input type="text" id="id1" name="firstName" value={curr.firstName} onChange={changeHandler} placeholder="Enter first name"></input>
                    </div>

                    <div>
                        <label htmlFor="id2">Last Name</label>
                        <input type="text" id="id2" name="lastName" value={curr.lastName} onChange={changeHandler} placeholder="Enter last name"></input>
                    </div>

                    <div>
                        <label htmlFor="id3">Email</label>
                        <input type="text" id="id3" name="email" value={curr.email} onChange={changeHandler} placeholder="Enter email"></input>
                    </div>

                    <div>
                        <label htmlFor="id4">Password</label>
                        <input type="password" id="id4" name="password" value={curr.password} onChange={changeHandler} placeholder="Enter passsword"></input>
                    </div>

                    <div>
                        <label htmlFor="id5">Confirm Password</label>
                        <input type="password" id="id5" name="confirmPassword" value={curr.confirmPassword} onChange={changeHandler} placeholder="Confirm password"></input>
                    </div>

                    <button>Submit</button>

                </form>

                <div>
                    <p>Already have an account? <span><NavLink to="/login">login here</NavLink></span></p>
                </div>

                <div><p>{response}</p></div>

                </div>
                
            </div>}
       
            
        </div>
    )
}

export default Signup;