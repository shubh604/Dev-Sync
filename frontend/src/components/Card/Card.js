

function Card(props){


    return(

        <div>

            <div>
                <img src={props.obj.profilePic}></img>
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

            <button>{props.buttonType}</button>

        </div>

    )

}

export default Card;