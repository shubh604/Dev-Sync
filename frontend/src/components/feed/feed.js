import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import "./Feed.css";

function Feed() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
            try {
                const response = await axios.get(
                    "http://localhost:4500/api/v1/profile/feed",
                    { withCredentials: true }
                );
                console.log("feed response", response.data);
                setPosts(response.data.data);
            } catch(error) {
                console.log("Feed error", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeed();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="feedContainer">
            {posts.length > 0
                ? posts.map((post) => (
                    <div key={post._id}>
                        <Card obj={post} buttonType="FeedCard" />
                    </div>
                ))
                : <p>No posts found</p>
            }
        </div>
    );

}

export default Feed;