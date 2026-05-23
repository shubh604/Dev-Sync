import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./EditProfile.css";
import Spinner from "../Spinner/Spinner"

function EditProfile() {

  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
  
          if(user){
              setLoading(false);
          }
      },[user]);

  const [curr, setCurr] = useState({firstName: user.firstName,lastName: user.lastName,bio: user.bio, skills: user.skills.join(",")});

  function changeHandler(event) {
    setCurr((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      };
    });
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
 

      const formData = new FormData();
      formData.append("firstName", curr.firstName);
      formData.append("lastName", curr.lastName);
      formData.append("bio", curr.bio);
      formData.append("skills", JSON.stringify(curr.skills.split(",")));
      if(image){
   formData.append("profilePic", image);
}

      const res = await axios.put("http://localhost:4500/api/v1/profile/update",formData,{ withCredentials: true });

      if(res.data.success === true){
        setUser(res.data.user);
        toast.success("Profile updated successfully");
        setTimeout(()=>{
   navigate("/profile/my-profile");
},1000);
      }
    } 
    catch(error){

       toast.error(error.response?.data?.message || "Profile update failed");   
}
  
}

  return (
    <div className="editProfilePage">

      {loading && <Spinner />}

      {!loading &&
      
        <div className="editProfileContainer">

        <h1 className="editHeading">Edit Profile</h1>

        <p className="editSubText">
          Update your details and keep your developer profile fresh ✨
        </p>

        <form className="editForm" onSubmit={submitHandler}>

          <div className="inputGroup">
            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} />
            <p className="fileText">Supported formats: .png .jpg .jpeg</p>
          </div>

          <div className="inputGroup">
            <label htmlFor="id1">First Name</label>
            <input type="text" id="id1" name="firstName" value={curr.firstName} onChange={changeHandler} placeholder="Enter first name" />
          </div>

          <div className="inputGroup">
            <label htmlFor="id2">Last Name</label>
            <input type="text" id="id2" name="lastName" value={curr.lastName} onChange={changeHandler} placeholder="Enter last name" />
          </div>

          <div className="inputGroup">
            <label htmlFor="id3">Bio</label>
            <input type="text" id="id3" name="bio" value={curr.bio} onChange={changeHandler} placeholder="Enter bio" />
          </div>

          <div className="inputGroup">
            <label htmlFor="id4">Skills</label>
            <input type="text" id="id4" name="skills" value={curr.skills} onChange={changeHandler} placeholder="Enter skills (comma-separated)" />
          </div>

          <button className="saveBtn">Save Changes</button>

        </form>

      </div>
      
      
      }

    </div>
  );
}

export default EditProfile;