import { useEffect, useState } from "react";
import axios from "axios";
import HelpCard from "../HelpCard/HelpCard";
import HelpModal from "../HelpModal/HelpModal";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";
import "./MyHelpHub.css";

function MyHelpHub() {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);


    useEffect(() => {
        async function fetchMyPosts() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/help-board/my-posts`, { withCredentials: true });
                setMyPosts(response.data.data);
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
        fetchMyPosts();
    }, []);

    return (
        <div className="myHelpHubPage">
            {loading && <Spinner />}
         
            {!loading && (
                <>
                    <div className="myHelpHero">
                        <div className="heroContent">
                            <h1>My Help Hub 🚀</h1>
                            <p>Manage your help posts and connect with developers.</p>
                        </div>
                        <button className="createHelpBtn" onClick={() => setOpenModal(true)}>+ Ask For Help</button>
                    </div>

                    <div className="myPostsContainer">
                        {myPosts.length > 0
                            ? myPosts.map((post) => <HelpCard key={post._id} help={post} type="my-help-card" setHelps={setMyPosts} />)
                            : <p className="emptyText">No help posts yet.</p>
                        }
                    </div>
                </>
            )}

            {openModal && <HelpModal setOpenModal={setOpenModal} setMyPosts={setMyPosts} />}
        </div>
    );
}

export default MyHelpHub;