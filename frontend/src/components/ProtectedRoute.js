import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {

    const { user } = useContext(AppContext);
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;