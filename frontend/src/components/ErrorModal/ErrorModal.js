import "./ErrorModal.css";

function ErrorModal(props){

    return(

        <div className="errorOverlay">

            <div className="errorModal">

                <h2>Something went wrong 😭</h2>
                <p>{props.message}</p>
                <button onClick={()=>{props.setOpenError(false);}}>Close</button>

            </div>

        </div>

    )
    
}

export default ErrorModal;