import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {

    const { user } = useContext(AppContext);

    if (!user) {
        toast.error("Please login first");
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;