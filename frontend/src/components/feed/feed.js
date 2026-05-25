import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import "./Feed.css";
import toast from "react-hot-toast";

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
        
        setPosts(response.data.data);

      } catch(error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  return (
    <div className="feedPage">

      {loading && <Spinner />}

      {!loading &&

     
        <div className="feedContainer">
         
          {posts.length > 0
            ? posts.map((post) => (
                <Card key={post._id} obj={post} buttonType="FeedCard" />
              ))
            : <p className="emptyText">No posts found</p>
          }
        </div>
      }

    </div>
  );
}

export default Feed;