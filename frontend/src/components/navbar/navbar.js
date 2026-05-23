import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import Logout from "../logout/logut";
import ProfileDropDown from "../profileDropdown/profileDropdown";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const { user, unreadMessages, pendingRequests } = useContext(AppContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [logoutClick, setLogoutClick] = useState(false);

    function toggleMenu() {
        setMenuOpen((prev) => !prev);
        setOpenDropdown(false);
    }

    function toggleProfile() {
        setOpenDropdown((prev) => !prev);
        setMenuOpen(false);
    }

    function closeAll() {
        setMenuOpen(false);
        setOpenDropdown(false);
    }

    return (
        <div className="navbar">
            <div className="navbarInner">
                <NavLink className="logo" to="/" onClick={closeAll}>DevSync</NavLink>

                {user &&
                    <div className="mobileActions">
                        <button className="menuBtn" onClick={toggleMenu}>☰</button>
                        <button className="profileBtn" onClick={toggleProfile}>
                            {user.profilePic
                                ? <img src={user.profilePic} alt="Profile" className="profilePic" />
                                : <div className="fallbackProfile">{user.firstName?.charAt(0)?.toUpperCase()}</div>
                            }
                        </button>
                    </div>
                }

                {!user
                    ? <div className="desktopLinks">
                        <NavLink className="navLink" to="/login">Login</NavLink>
                        <NavLink className="navLink" to="/signup">Signup</NavLink>
                    </div>
                    : <>
                        <div className="desktopLinks">
                            <NavLink className="navLink" to="/profile/feed">Feed</NavLink>
                            <NavLink className="navLink" to="/profile/help-hub">Help-Hub</NavLink>
                            <NavLink className="navLink" to="/profile/connections">
                                Connections {unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
                            </NavLink>
                            <NavLink className="navLink" to="/profile/requests/sent">Requests-Sent</NavLink>
                            <NavLink className="navLink" to="/profile/requests/pending">
                                Requests-Received {pendingRequests > 0 && <span className="badge">{pendingRequests}</span>}
                            </NavLink>
                            <button className="profileBtn desktopProfile" onClick={toggleProfile}>
                                {user.profilePic
                                    ? <img src={user.profilePic} alt="Profile" className="profilePic" />
                                    : <div className="fallbackProfile">{user.firstName?.charAt(0)?.toUpperCase()}</div>
                                }
                            </button>
                        </div>

                        {menuOpen &&
                            <div className="mobileMenu">
                                <NavLink className="mobileLink" to="/profile/feed" onClick={closeAll}>Feed</NavLink>
                                <NavLink className="mobileLink" to="/profile/help-hub" onClick={closeAll}>Help-Hub</NavLink>
                                <NavLink className="mobileLink" to="/profile/connections" onClick={closeAll}>
                                    Connections {unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
                                </NavLink>
                                <NavLink className="mobileLink" to="/profile/requests/sent" onClick={closeAll}>Requests-Sent</NavLink>
                                <NavLink className="mobileLink" to="/profile/requests/pending" onClick={closeAll}>
                                    Requests-Received {pendingRequests > 0 && <span className="badge">{pendingRequests}</span>}
                                </NavLink>
                            </div>
                        }

                        <div className="profileDropdownWrapper">
                            {openDropdown && <ProfileDropDown setOpenDropdown={setOpenDropdown} setLogoutClick={setLogoutClick} />}
                        </div>
                    </>
                }
            </div>

            {logoutClick && <Logout setLogoutClick={setLogoutClick} />}
        </div>
    );

}

export default Navbar;