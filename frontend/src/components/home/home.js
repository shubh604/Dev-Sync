import "./home.css";
import {useNavigate} from "react-router-dom";


function Home(){

    const navigate = useNavigate(); 

    return(

        <div className="homePage">

            <div className="heroSection">

                <h1 className="heroHeading">

                    Welcome to DevSync 🚀

                </h1>

                <p className="heroText">

                    Connect with developers, showcase your skills,
                    explore opportunities, and grow together in the
                    tech community.

                </p>

                <p className="heroSubText">

                    Build connections. Share ideas. Learn faster.
                    Become better together 💻✨

                </p>

                <button className="heroBtn" onClick={() => navigate("/profile/feed")}>

                    Explore Feed

                </button>

            </div>

        </div>
    )
}

export default Home;