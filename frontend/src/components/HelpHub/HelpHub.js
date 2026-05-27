import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HelpCard from "../HelpCard/HelpCard";
import Spinner from "../Spinner/Spinner";
import "./HelpHub.css";
import toast from "react-hot-toast";

function HelpHub() {
    const [helps, setHelps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ show: false, title: "", message: "" });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHelps() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/help-board/help-feed`, { withCredentials: true });
                setHelps(response.data.data);
            } catch(error) {
               const message = error?.response?.data?.message;

            if(
                message === "token missing!" ||
                message === "Token expired" ||
                message === "Invalid token"
            ){
                toast.error("Please login again");
            }

            else{
                toast.error(message || "Something went wrong");
            }
            } finally {
                setLoading(false);
            }
        }
        fetchHelps();
    }, []);

    return (
        <div className="helpHubPage">
            {loading && <Spinner />}
         

            {!loading && (
                <>
                    <div className="helpHeroSection">
                        <div className="heroLeft">
                            <h1>Welcome to Help Hub 🚀</h1>
                            <p>Collaborate with developers, solve problems together, and help the community grow.</p>
                        </div>
                        <button className="myHelpBtn" onClick={() => navigate("/profile/my-help-hub")}>My Help Hub →</button>
                    </div>

                    <div className="helpFeedSection">
           
                        <div className="helpFeedContainer">
                            {helps.length > 0
                                ? helps.map((help) => <HelpCard key={help._id} help={help} setHelps={setHelps} />)
                                : <p className="noHelpText">No help posts found.</p>
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default HelpHub;