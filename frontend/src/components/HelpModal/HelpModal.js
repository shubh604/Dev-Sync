import { useState } from "react";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import toast from "react-hot-toast";
import "./HelpModal.css";

function HelpModal(props) {
    const [loading, setLoading] = useState(false);
    const [helpData, setHelpData] = useState({ title: "", description: "" });


    function changeHandler(event) {
        const { name, value } = event.target;
        setHelpData((prev) => ({ ...prev, [name]: value }));
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:4500/api/v1/profile/help-board/create", helpData, { withCredentials: true });
            console.log(res.data);
            if (res.data.success) {
                props.setMyPosts((prev) => ([res.data.data, ...prev]));
                props.setOpenModal(false);
            } 
        } catch(error) {
           toast.error(error?.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    }

    return (
        <div className="modalOverlay">
            {loading && <Spinner />}
           
            <div className="modalContainer">
                <button className="closeBtn" onClick={() => props.setOpenModal(false)}>✕</button>
                <h2>Create Help Post</h2>

                <form onSubmit={submitHandler}>
                    <input type="text" name="title" placeholder="Enter title" value={helpData.title} onChange={changeHandler} />
                    <textarea name="description" placeholder="Describe your problem" rows="5" value={helpData.description} onChange={changeHandler} />
                    <button type="submit" className="submitBtn">Create Post</button>
                </form>

            </div>
        </div>
    );
}

export default HelpModal;