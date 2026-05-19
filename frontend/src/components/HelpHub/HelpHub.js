import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HelpCard from "../HelpCard/HelpCard";
import "./HelpHub.css";

function HelpHub() {

    const [helps, setHelps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHelps() {
            try {
                const response = await axios.get(
                    "http://localhost:4500/api/v1/profile/help-board/help-feed",
                    { withCredentials: true }
                );
                console.log("help feed response", response.data);
                setHelps(response.data.data);
            } catch(error) {
                console.log("Help feed error", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHelps();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="helpHubPage">
            <div className="helpHeroSection">
                <div className="heroLeft">
                    <h1>Welcome to Help Hub 🚀</h1>
                    <p>Collaborate with developers, solve problems together, and help the community grow.</p>
                </div>
                <button className="myHelpBtn" onClick={() => { navigate("/profile/my-help-hub"); }}>My Help Hub →</button>
            </div>
            <div className="helpFeedSection">
                <h2 className="feedHeading">Explore Help Posts</h2>
                <div className="helpFeedContainer">
                    {helps.length > 0
                        ? helps.map((help) => <HelpCard key={help._id} help={help} setHelps={setHelps} />)
                        : <p className="noHelpText">No help posts found.</p>
                    }
                </div>
            </div>
        </div>
    );

}

export default HelpHub;