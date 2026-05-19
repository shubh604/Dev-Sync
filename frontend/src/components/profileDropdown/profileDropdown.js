import { NavLink } from "react-router-dom";

import "./profileDropdown.css";

function ProfileDropDown(props){

    function clickHandler(){

        props.setOpenDropdown(false);

    }

    function logoutclickHandler(){

        props.setLogoutClick(true);

    }

    return(

        <div className="profileDropdown">

            <NavLink
                className="dropdownLink"
                to="/profile/my-profile"
                onClick={clickHandler}
            >
                My Profile
            </NavLink>

            <NavLink
                className="dropdownLink"
                to="/profile/change-password"
                onClick={clickHandler}
            >
                Change Password
            </NavLink>

            <p
                className="logoutText"
                onClick={()=>{
                    logoutclickHandler();
                    clickHandler();
                }}
            >
                Logout
            </p>

        </div>

    )

}

export default ProfileDropDown;