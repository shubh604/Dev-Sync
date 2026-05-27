import {useEffect, useState } from "react";
import axios from "axios";
import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import socket from "../../socket";
import "./connection.css";
import toast from "react-hot-toast";

function Connections() {

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);


  async function fetchConnections() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/connections`, { withCredentials: true });
      setConnections(res.data.data);
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
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="connectionsPage">

      {loading && <Spinner />}

      {!loading &&
        <>
       { console.log("connections" , connections)}
          <h1 className="connectionHeading">Connections</h1>

          <div className="connectionsContainer">
            {connections.length > 0
              ? connections.map((connection) =>
                  <Card key={connection._id} obj={connection} buttonType="connection" setConnections={setConnections} />
                )
                
              : <p className="emptyText">No connections found.</p>
            }
          </div>
        </>
      }

    </div>
  );
}

export default Connections;