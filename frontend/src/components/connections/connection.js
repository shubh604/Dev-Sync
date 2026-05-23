import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import socket from "../../socket";
import "./connection.css";
import toast from "react-hot-toast";

function Connections() {

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);
  const { setUnreadMessages } = useContext(AppContext);
  const { setPendingRequests } = useContext(AppContext);

  useEffect(() => {
    socket.emit("clear-unread-messages", user._id);
    setUnreadMessages(0);
  }, []);

  async function fetchConnections() {
    try {
      const res = await axios.get("http://localhost:4500/api/v1/profile/connections",{ withCredentials: true });
      setConnections(res.data.data);
    } catch(error) {
       toast.error(error?.response?.data?.message || "Something went wrong");
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