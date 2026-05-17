import { useContext, useState , useEffect} from "react";
import AppContextProvider from "../../context/appContext";
import {AppContext} from "../../context/appContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";


function EditProfile(){

    // Images/files cannot be sent properly through normal JSON objects.
    // So we use FormData for multipart/form-data requests.
    // Text fields automatically go into req.body
    // and file fields automatically go into req.files on backend.

    const {user,setUser} = useContext(AppContext);
    const [response,setResponse]= useState("");
    const navigate = useNavigate();

    const [image,setImage] = useState(null);

    const [curr,setCurr] = useState({"firstName": user.firstName , "lastName": user.lastName, "bio":user.bio,"skills":user.skills.join(", ")});

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

            const formData = new FormData();

            formData.append("firstName",curr.firstName);
            formData.append("lastName",curr.lastName);
            formData.append("bio",curr.bio);
            formData.append("skills",JSON.stringify(curr.skills.split(",")));
            formData.append("profilePic",image);
            
            const res = await axios.put("http://localhost:4500/api/v1/profile/update",formData,{withCredentials:true});

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
            Edit Profile

            <p>Fill the details in the below form which you want to update/edit</p>

            <form onSubmit={submitHandler}>

                <div>
                    <label>Profile Image </label>
                    <input type="file" accept="image/*" onChange={(event)=>{ setImage(event.target.files[0]); }} />
                    <p>supported file formats: .png .jpg .jpeg</p>
                </div>

                <div>
                    <label htmlFor="id1">First Name</label>
                    <input type="text" id="id1" name="firstName" value={curr.firstName} onChange={changeHandler} placeholder="Enter first name"></input>
                </div>

                <div>
                    <label htmlFor="id2">Last Name</label>
                    <input type="text" id="id2" name="lastName" value={curr.lastName} onChange={changeHandler} placeholder="Enter last name"></input>
                </div>

                <div>
                    <label htmlFor="id3">Bio</label>
                    <input type="text" id="id3" name="bio" value={curr.bio} onChange={changeHandler} placeholder="Enter bio"></input>
                </div>

                <div>
                    <label htmlFor="id4">Skills</label>
                    <input type="text" id="id4" name="skills" value={curr.skills} onChange={changeHandler} placeholder="Enter skills"></input>
                </div>

                <button>Save Changes</button>

            </form>

            <div><p>{response}</p></div>

        </div>

    )

}

export default EditProfile;