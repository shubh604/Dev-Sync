import { useNavigate } from "react-router-dom";
import "./Card.css"

function Card(props){

    const navigate = useNavigate();

    function editButtonHandler(){
        navigate("/profile/edit-profile");
    }

    return(

        <div>

            <div className="outer">
                {props.obj.profilePic ? (<img className="image" src={props.obj.profilePic}></img>)  : (<div className="image">{props.obj?.firstName?.charAt(0).toUpperCase()}</div>)}   
            </div>

            <p>{props.obj.firstName}{props.obj.lastName}</p>

            <p>{props.obj.bio}</p>

            <p>Skills:</p>

            {
                props.obj.skills.map((skill,index)=>(
                    <span key={index}>
                        {skill}{" "}
                    </span>
                ))
            }

            <br/><br/><br/><br/>
            {props.buttonType==="Edit Profile" && <button onClick={editButtonHandler}>Edit Profile</button>}

        </div>

    )

}

export default Card;