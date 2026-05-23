import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { AppContext } from "./context/appContext";
import socket from './socket';

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import NotFound from './components/NotFound';

import Home from './components/home/home';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import Navbar from './components/navbar/navbar';
import ForgotPassword from './components/forgot-password/forgot-password';
import ResetPassword from './components/Reset-password/reset-password';
import Feed from './components/feed/feed';
import Connections from './components/connections/connection';
import Logout from './components/logout/logut';
import RequestsCards from './components/RequestsCard/RequestsCard';
import HelpHub from './components/HelpHub/HelpHub';
import MyHelpHub from './components/MyHelpHub/MyHelpHub';
import DevChat from './components/DevChat/DevChat';
import MyProfile from './components/myProfile/MyProfile';
import EditProfile from './components/EditProfile/EditProfile';
import ChangePassword from './components/ChangePassword/ChangePassword';
import Spinner from "./components/Spinner/Spinner";
import ErrorModal from "./components/ErrorModal/ErrorModal";
import ProtectedRoute from './components/ProtectedRoute';
function App() {


    const { user, setUser } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ show: false, title: "", message: "" });

    useEffect(() => {
        if (user) socket.emit("join", user._id);
    }, [user]);

    async function fetchingUser() {
        try {
            const res = await axios.get("http://localhost:4500/api/v1/me", { withCredentials: true });
            if (res.data.success === true) {
                setUser(res.data.user);
            }
        }catch (error) {
            if(error.response?.status !== 401){
                setError({ show: true, title: "Error Fetching User", message: error.response?.data?.message || "Something went wrong while fetching user data" });
                }
                setUser(null);
        }
        setLoading(false);
    }

    useEffect(() => { fetchingUser(); }, []);

    return (
        <div className="App">
            {loading && <Spinner />}
            {error.show && <ErrorModal obj={error} onClose={() => setError({ show: false, title: "", message: "" })} />}

            {!loading && (
                <div>
                    <Navbar />
                    <Toaster position="top-right" />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/profile/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                        <Route path="/profile/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
                        <Route path="/profile/requests/sent" element={<ProtectedRoute><RequestsCards type="sent" /></ProtectedRoute>} />
                        <Route path="/profile/requests/pending" element={<ProtectedRoute><RequestsCards type="pending" /></ProtectedRoute>} />
                        <Route path="/profile/help-hub" element={<ProtectedRoute><HelpHub /></ProtectedRoute>} />
                        <Route path="/profile/my-help-hub" element={<ProtectedRoute><MyHelpHub /></ProtectedRoute>} />
                        <Route path="/profile/dev-chat/:receiverId" element={<ProtectedRoute><DevChat /></ProtectedRoute>} />
                        <Route path="/profile/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
                        <Route path="/profile/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                        <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                
                </div>
            )}
        </div>
    );
}

export default App;