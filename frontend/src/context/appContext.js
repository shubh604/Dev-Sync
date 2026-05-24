import { createContext, useState, useEffect } from "react";
import socket from "../socket";
const AppContext = createContext();


function AppContextProvider({children}){

    //---------------REQUIREMENTS-----------------------------------------------------
    const [user,setUser] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);

    useEffect(() => {

    const initialCountsHandler = ({ unreadMessages, pendingRequests }) => {
        setUnreadMessages(unreadMessages);
        setPendingRequests(pendingRequests);
    };

    socket.on("initial-counts", initialCountsHandler);

    return () => {
        socket.off("initial-counts", initialCountsHandler);
    };

}, []);
   //---------------SENDING/PROVING THE CONTEXT TO CHILDREN----------------------------

    //value = kya kya cheezein provide krni h children ko 
    const value = {user,setUser, unreadMessages, pendingRequests, setUnreadMessages, setPendingRequests};

    

    //syntax to provide/send the values present in AppContext file to the children.
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}


export default AppContextProvider;
export { AppContext };