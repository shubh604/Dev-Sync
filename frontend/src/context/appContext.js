import { createContext, useState } from "react";
import socket from "../socket";
const AppContext = createContext();


function AppContextProvider({children}){

    //---------------REQUIREMENTS-----------------------------------------------------
    const [user,setUser] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);

    socket.on("initial-counts", ({ unreadMessages, pendingRequests }) => {
        setUnreadMessages(unreadMessages);
        setPendingRequests(pendingRequests);
    });

   //---------------SENDING/PROVING THE CONTEXT TO CHILDREN----------------------------

    //value = kya kya cheezein provide krni h children ko 
    const value = {user,setUser, unreadMessages, pendingRequests, setUnreadMessages, setPendingRequests};

    

    //syntax to provide/send the values present in AppContext file to the children.
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}


export default AppContextProvider;
export { AppContext };