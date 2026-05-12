import { useContext, useEffect, useState } from "react";
import {AppContext} from "../../context/appContext";
import Logout from "../logout/logut";
import ProfileDropDown from "../profileDropdown/profileDropdown";
const { useLocation, NavLink } = require("react-router-dom");



function Navbar(){

    const location = useLocation();
    const {user} = useContext(AppContext);

    const [openDropdown , setOpenDropdown] = useState(false);
    const [logoutClick, setLogoutClick]= useState(false);
    
    const path = location.pathname;

    function myProfileClickHandler(){
        setOpenDropdown(prev => !prev);
    }
    
    return (
        <div>    

            {user===null && <div>
                <NavLink to="/">logo</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Signup</NavLink>
            </div>}


            {user!==null && <div>
                    <NavLink to="/" onClick={()=>setOpenDropdown(false)}>logo</NavLink>
                    <NavLink to="/profile/feed" onClick={()=>setOpenDropdown(false)}>Feed</NavLink>
                    <NavLink to="/profile/connections" onClick={()=>setOpenDropdown(false)}>Connections</NavLink>

                    <button onClick={myProfileClickHandler}>Profile</button>

                    {openDropdown && <ProfileDropDown  setOpenDropdown={setOpenDropdown} setLogoutClick={setLogoutClick}/>}

                </div>}
                
            
            <div>
                {logoutClick && <Logout setLogoutClick={setLogoutClick} />}
            </div>



        </div>
    )
}

export default Navbar;