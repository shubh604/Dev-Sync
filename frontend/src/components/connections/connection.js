import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Card/Card";
import "./connection.css";

function Connections() {

    const [connections, setConnections] = useState([]);

    async function fetchConnections() {
        try {
            const res = await axios.get(
                "http://localhost:4500/api/v1/profile/connections",
                { withCredentials: true }
            );
            setConnections(res.data.data);
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    return (
        <div>
            <h1>Connections</h1>
            {connections.length > 0
                ? connections.map((connection) => <Card key={connection._id} obj={connection} buttonType="connection" />)
                : <p>No connections found.</p>
            }
        </div>
    );

}

export default Connections;