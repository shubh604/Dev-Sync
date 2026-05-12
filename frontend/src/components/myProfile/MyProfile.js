import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import Card from "../Card/Card";

function MyProfile(){

    const {user,setUser} = useContext(AppContext);

    return (

        <div>
            <h1>MY PROFILE</h1>

            <Card obj={user} buttonType="Edit Profile" />

        </div>

    )

}

export default MyProfile;