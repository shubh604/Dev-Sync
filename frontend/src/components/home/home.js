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
        }
    }
    return (
        <div className="homePage">
            <div className="heroSection">
                <h1 className="heroHeading">Welcome to DevSync </h1>
            <p className="heroText">
                Connect with developers, share knowledge, seek support, and grow within a collaborative tech community.
                </p>

                <p className="heroSubText">
                Collaborate, learn, and build meaningful professional connections.
                </p>

                {user && <button className="heroBtn" onClick={onclickHandler}>Explore Feed</button>}
                {!user && <button className="heroBtn" onClick={() => navigate("/login")}>Get Started</button>}
            </div>
        </div>
    );
}

export default Home;