
import { useContext, useState , useEffect} from "react";
import AppContextProvider from "../../context/appContext";
import {AppContext} from "../../context/appContext";
import axios from "axios";
import { NavLink, useAsyncValue, useNavigate } from "react-router-dom";


function Login(){

    const [curr,setCurr] = useState({"email" : "", "password":""});
    const {user,setUser} = useContext(AppContext);
    const [response,setResponse]= useState("");
    const navigate = useNavigate();

    useEffect(()=>{

        if(user){
            navigate("/");
        }

    },[user]);

    
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
            const res = await axios.post("http://localhost:4500/api/v1/login",curr,{withCredentials:true});

            if(res.data.success===true){
                
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

    return(

        

        <div>

        

            {!user && 

                
            <div>
                <h1>Login Form</h1>
                <div>
                    <form onSubmit={submitHandler}>

                        <div>
                            <label htmlFor="id1">Email</label>
                            <input type="text" id="id1" value={curr.email} name="email" onChange={changeHandler} placeholder="Enter your email"></input>
                        </div>

                        <div>
                            <label htmlFor="id2">Password</label>
                            <input type="password" id="id2" value={curr.password} name="password" onChange={changeHandler} placeholder="Enter your passsword"></input>
                        </div>
                        
                        <button>Submit</button>
                    </form>

                    <NavLink to="/forgot-password">Forgot Password?</NavLink>
                
                    <div>
                        <p>Don't have an account? <span><NavLink to="/signup">Signup here</NavLink></span></p>
                    </div>

                </div>

                <div><p>{response}</p></div>

            </div>
                
            }

            

        </div>
    )
}

export default Login;