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
  const [saving, setSaving] = useState(false);
  
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
      setSaving(true);

      const formData = new FormData();
      formData.append("firstName", curr.firstName);
      formData.append("lastName", curr.lastName);
      formData.append("bio", curr.bio);
      formData.append("skills", JSON.stringify(curr.skills.split(",")));
      if(image){
   formData.append("profilePic", image);
}

      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/update`,formData,{ withCredentials: true });

      if(res.data.success === true){
        setUser(res.data.user);
        toast.success("Profile updated successfully");
        setTimeout(()=>{
   navigate("/profile/my-profile");
},1000);
      }
    } 
    catch(error){

      const message = error?.response?.data?.message;

            if(
                message === "token missing!" ||
                message === "Token expired" ||
                message === "Invalid token"
            ){
                toast.error("Please login again");
            }

            else{
                toast.error(message || "Something went wrong");
            }
}
finally{
  setSaving(false);
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

            <div
              className="dropArea"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                  e.preventDefault();
                  setImage(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById("fileInput").click()}
          >
            {image 
              ? <p>📁 {image.name}</p> 
              : <>
                  <p>Drag & drop or click to upload</p>
                  <p className="fileText">Supported formats: .png .jpg .jpeg</p>
                </>
          }
              <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setImage(e.target.files[0])}
              />
          </div>
    
            
          </div>

          <div className="inputGroup">
            <label htmlFor="id1">First Name</label>
            <input type="text" id="id1" name="firstName" value={curr.firstName} maxLength={15} onChange={changeHandler} placeholder="Enter first name" />
          </div>

          <div className="inputGroup">
            <label htmlFor="id2">Last Name</label>
            <input type="text" id="id2" name="lastName" value={curr.lastName} maxLength={15} onChange={changeHandler} placeholder="Enter last name" />
          </div>

          <div className="inputGroup">
            <label htmlFor="id3">Bio</label>
            <input type="text" id="id3" name="bio" value={curr.bio} onChange={changeHandler} placeholder="Enter bio" />
          </div>

          <div className="inputGroup">
            <label htmlFor="id4">Skills</label>
            <input type="text" id="id4" name="skills" value={curr.skills} onChange={changeHandler} placeholder="Enter skills (comma-separated)" />
          </div>

          <button className="saveBtn saveBtn1"  disabled={saving} >Save Changes</button>

        </form>

      </div>
      
      
      }

    </div>
  );
}

export default EditProfile;