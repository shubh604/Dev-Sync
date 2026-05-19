import { useEffect, useState } from "react";
import axios from "axios";
import HelpCard from "../HelpCard/HelpCard";
import HelpModal from "../HelpModal/HelpModal";
import "./MyHelpHub.css";

function MyHelpHub() {

    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        async function fetchMyPosts() {
            try {
                const response = await axios.get(
                    "http://localhost:4500/api/v1/profile/help-board/my-posts",
                    { withCredentials: true }
                );
                console.log(response.data);
                setMyPosts(response.data.data);
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchMyPosts();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="myHelpHubPage">
            <div className="myHelpHero">
                <div>
                    <h1>My Help Hub 🚀</h1>
                    <p>Manage your help posts and connect with developers.</p>
                </div>
                <button className="createHelpBtn" onClick={() => { setOpenModal(true); }}>+ Ask For Help</button>
            </div>
            <div className="myPostsContainer">
                {myPosts.length > 0
                    ? myPosts.map((post) => <HelpCard key={post._id} help={post} type="my-help-card" setHelps={setMyPosts} />)
                    : <p>No help posts yet.</p>
                }
            </div>
            {openModal && <HelpModal setOpenModal={setOpenModal} setMyPosts={setMyPosts} />}
        </div>
    );

}

export default MyHelpHub;