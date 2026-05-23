import "./home.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import toast from "react-hot-toast";
function Home() {
    const navigate = useNavigate();

    const {user} = useContext(AppContext);

    function onclickHandler() {
        if(user){
            navigate("/profile/feed");
        }else{
            toast.error("Please login to explore the feed");
            
        }
    }
    return (
        <div className="homePage">
            <div className="heroSection">
                <h1 className="heroHeading">Welcome to DevSync 🚀</h1>
                <p className="heroText">Connect with developers, showcase your skills, explore opportunities, and grow together in the tech community.</p>
                <p className="heroSubText">Build connections. Share ideas. Learn faster. Become better together 💻✨</p>
                <button className="heroBtn" onClick={onclickHandler}>Explore Feed</button>
            </div>
        </div>
    );
}

export default Home;