import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import Logout from "../logout/logut";
import ProfileDropDown from "../profileDropdown/profileDropdown";
import { useLocation, NavLink } from "react-router-dom";

import "./Navbar.css";

function Navbar(){

    const location = useLocation();
    const { user } = useContext(AppContext);
    const [openDropdown , setOpenDropdown] = useState(false);
    const [logoutClick, setLogoutClick] = useState(false);

    function myProfileClickHandler(){
        setOpenDropdown(prev => !prev);
    }

    return (

        <div className="navbar">

            {   
                user === null 
            
                ?

                (
                    <div className="authBtns">

                        <NavLink className="logo" to="/">DevSync</NavLink>

                        <NavLink className="navLink" to="/login">Login</NavLink>

                        <NavLink className="navLink" to="/signup">Signup</NavLink>

                    </div>

                )

                :

                (

                    <div className="leftNav">

                        <NavLink className="logo" to="/" onClick={() => setOpenDropdown(false)}>DevSync</NavLink>

                        <NavLink className="navLink" to="/profile/feed" onClick={() => setOpenDropdown(false)}>Feed</NavLink>

                        <NavLink className="navLink" to="/profile/help-hub" onClick={() => setOpenDropdown(false)}> Help-Hub</NavLink>

                        <NavLink className="navLink" to="/profile/connections" onClick={() => setOpenDropdown(false)}>Connections</NavLink>

                        <NavLink className="navLink" to="/profile/requests/sent" onClick={() => setOpenDropdown(false)}>Requests Sent</NavLink>

                        <NavLink className="navLink" to="/profile/requests/pending" onClick={() => setOpenDropdown(false)}>Requests Received</NavLink>

                        <div className="Profile-nav-div">
                            <button className="profileBtn" onClick={myProfileClickHandler}> Profile</button>
                        </div>

                        {
                            openDropdown && <ProfileDropDown setOpenDropdown={setOpenDropdown} setLogoutClick={setLogoutClick}/>
                        }

                    </div>

                )
            }

            <div>

                {
                    logoutClick && <Logout setLogoutClick={setLogoutClick} />
                }

            </div>

        </div>
    )
}

export default Navbar;