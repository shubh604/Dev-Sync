import { NavLink } from "react-router-dom";
import "./profileDropdown.css";

function ProfileDropDown(props) {
    function clickHandler() { props.setOpenDropdown(false); }
    function logoutclickHandler() { props.setLogoutClick(true); }

    return (
        <div className="profileDropdown">
            <NavLink to="/profile/my-profile" onClick={clickHandler} className="dropdownLink">My Profile</NavLink>
            <NavLink to="/profile/change-password" onClick={clickHandler} className="dropdownLink">Change Password</NavLink>
            <p className="logoutText" onClick={() => { logoutclickHandler(); clickHandler(); }}>Logout</p>
        </div>
    );
}

export default ProfileDropDown;