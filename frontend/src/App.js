import logo from './logo.svg';
import './App.css';

import { Routes, Route } from 'react-router-dom';
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

import { useContext ,useEffect, useState} from 'react';
import AppContextProvider from './context/appContext';
import {AppContext} from "./context/appContext";
import axios from "axios";
import MyProfile from './components/myProfile/MyProfile';
import EditProfile from './components/EditProfile/EditProfile';
import ChangePassword from './components/ChangePassword/ChangePassword';

import socket from './socket';

function App() {

  const {user,setUser} = useContext(AppContext);
  const [loading,setloading] = useState(true);

  useEffect(() => {

    if(user){
        socket.emit("join", user._id);
    }

}, [user]);

  //mtlb har refresh pe call hoga, aur agar user logged in hua to user mei user ka data aa jaayega else null rahgea.
  async function fetchingUser(){
    try{
        const res = await axios.get("http://localhost:4500/api/v1/me",{withCredentials: true});
        if(res.data.success === true){
            setUser(res.data.user);
            console.log("success:true", res.data.message);
            console.log("user", res.data.user);
        }
        else{
            console.log("success:false", res.data.message);
        }
    }
    catch(error){
        console.log("No user found");
        if(error.response){
            console.log(error.response.data.message);
        }
    }
    setloading(false);
}

useEffect(()=>{

    fetchingUser();

},[]);


  return (
    <div className="App">

      {loading && <h2>Loading.......</h2>}

      {!loading && 

      
        <div>

          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path='/reset-password/:token' element={<ResetPassword />}></Route>
            <Route path='/profile/feed' element={<Feed />}></Route>
            <Route path='/profile/connections' element={<Connections />}></Route>
            <Route path='/profile/requests/sent' element={<RequestsCards type="sent" />}></Route>
            <Route path='/profile/requests/pending' element={<RequestsCards type="pending" />}></Route>

            <Route path='/profile/help-hub' element={<HelpHub />}></Route>
            <Route path="/profile/my-help-hub" element={<MyHelpHub />}></Route>
            <Route path="/profile/dev-chat/:receiverId" element={<DevChat />}></Route>

            <Route path="/profile/my-profile" element={<MyProfile/>}></Route>
            <Route path='/profile/edit-profile' element={<EditProfile/>}></Route>
            <Route path='/profile/change-password' element={<ChangePassword />}></Route>


      
        </Routes>


        </div>
      }

      

    </div>
  );
}

export default App;
