import { useState } from "react";
import MyProfile from "../myProfile/MyProfile";
import EditProfile from "../EditProfile/EditProfile";
import Logout from "../logout/logut";
import { Navigate, NavLink, useLinkClickHandler, useNavigate } from "react-router-dom";

function ProfileDropDown(props){

    function clickHandler(){
       props.setOpenDropdown(false);
    }

    function logoutclickHandler(){
        props.setLogoutClick(true);
    }

    return(

        <div>

            <NavLink to="/profile/my-profile" onClick={clickHandler} >My Profile</NavLink>
            <NavLink to="/profile/edit-profile" onClick={clickHandler}>Edit Profile</NavLink>
            <p onClick={()=>{logoutclickHandler();clickHandler();}}>Logout</p>
            
            
        </div>

    )

}

export default ProfileDropDown;