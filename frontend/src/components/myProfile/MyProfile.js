import {useContext,useState, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import "./MyProfile.css";

import toast from "react-hot-toast";
function MyProfile() {

    const { user } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        if(user){
            setLoading(false);
        }
    },[user]);

    return (
        <div className="profilePage">
            {loading && <Spinner />}
            
            {!loading && user && (
                <>
                    <h1 className="profileHeading">My Profile</h1>
                    <div className="profileCardContainer">
                        <Card obj={user} buttonType="Edit Profile" />
                    </div>
                </>
            )}
        </div>
    );
}

export default MyProfile;