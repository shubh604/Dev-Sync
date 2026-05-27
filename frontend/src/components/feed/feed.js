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
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/feed`,
          { withCredentials: true }
        );
        
        setPosts(response.data.data);

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