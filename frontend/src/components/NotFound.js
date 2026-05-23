import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function NotFoundRedirect() {

    const navigate = useNavigate();

    useEffect(()=>{

   toast.error("Page not found");

   setTimeout(()=>{
      navigate("/");
   },1000);

},[])
    return null;
}

export default NotFoundRedirect;