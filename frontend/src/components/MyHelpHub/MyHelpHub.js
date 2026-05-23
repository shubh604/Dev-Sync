import { useEffect, useState } from "react";
import axios from "axios";
import HelpCard from "../HelpCard/HelpCard";
import HelpModal from "../HelpModal/HelpModal";
import Spinner from "../Spinner/Spinner";
import ErrorModal from "../ErrorModal/ErrorModal";
import "./MyHelpHub.css";

function MyHelpHub() {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState({ show: false, title: "", message: "" });

    useEffect(() => {
        async function fetchMyPosts() {
            try {
                const response = await axios.get("http://localhost:4500/api/v1/profile/help-board/my-posts", { withCredentials: true });
                console.log(response.data);
                setMyPosts(response.data.data);
            } catch(error) {
                console.log(error);
                setError({ show: true, title: "My Help Hub Error", message: error.response?.data?.message || "Unable to fetch posts" });
            } finally {
                setLoading(false);
            }
        }
        fetchMyPosts();
    }, []);

    return (
        <div className="myHelpHubPage">
            {loading && <Spinner />}
            {error.show && <ErrorModal obj={error} onClose={() => setError({ show: false, title: "", message: "" })} />}

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