import { useState } from "react";
import axios from "axios";
import "./HelpModal.css";

function HelpModal(props) {

    const [helpData, setHelpData] = useState({ title: "", description: "" });
    const [response, setResponse] = useState("");

    function changeHandler(event) {
        const { name, value } = event.target;
        setHelpData((prev) => ({ ...prev, [name]: value }));
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:4500/api/v1/profile/help-board/create",
                helpData,
                { withCredentials: true }
            );
            console.log(res.data);
            if (res.data.success) {
                props.setMyPosts((prev) => ([res.data.data, ...prev]));
                props.setOpenModal(false);
            } else {
                setResponse(res.data.message);
            }
        } catch(error) {
            console.log(error);
            setResponse(error.response?.data?.message);
        }
    }

    return (
        <div className="modalOverlay">
            <div className="modalContainer">
                <button className="closeBtn" onClick={() => { props.setOpenModal(false); }}>✕</button>
                <h2>Create Help Post</h2>
                <form onSubmit={submitHandler}>
                    <input type="text" name="title" placeholder="Enter title" value={helpData.title} onChange={changeHandler} />
                    <textarea name="description" placeholder="Describe your problem" rows="5" value={helpData.description} onChange={changeHandler} />
                    <button type="submit" className="submitBtn">Create Post</button>
                </form>
                <p>{response}</p>
            </div>
        </div>
    );

}

export default HelpModal;