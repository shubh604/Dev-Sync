import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import Card from "../Card/Card";
import "./MyProfile.css";

function MyProfile() {

    const { user } = useContext(AppContext);

    return (
        <div className="profilePage">
            <h1 className="profileHeading">My Profile</h1>
            <div className="profileCardContainer">
                <Card obj={user} buttonType="Edit Profile" />
            </div>
        </div>
    );

}

export default MyProfile;