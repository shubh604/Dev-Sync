import { createContext, useState } from "react";

const AppContext = createContext();

function AppContextProvider({children}){

    //---------------REQUIREMENTS-----------------------------------------------------
    const [user,setUser] = useState(null);


   //---------------SENDING/PROVING THE CONTEXT TO CHILDREN----------------------------

    //value = kya kya cheezein provide krni h children ko 
    const value = {user,setUser};

    //syntax to provide/send the values present in AppContext file to the children.
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}


export default AppContextProvider;
export { AppContext };