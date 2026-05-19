const Connection = require("../model/connectionSchema");
const User = require("../model/User");

//button - send connection request
async function sendRequest(req,res){
    try{
        console.log("send request controller called");
        const fromUser = req.user.id;
        const toUser = req.params.userId;

        // khud ko request na bheje
        if(fromUser === toUser){
            return res.json({
                success:false,
                message:"You cannot send request to yourself"
            })
        }

        // check user exists or not
        const userExists = await User.findById(toUser);

        if(!userExists){
            return res.json({
                success:false,
                message:"User not found"
            })
        }

        // check already request/connection exists
        const existingConnection = await Connection.findOne({

            $or:[

                {fromUser:fromUser,toUser:toUser},

                {fromUser:toUser,toUser:fromUser}

            ]

        });

        if(existingConnection){
            return res.json({
                success:false,
                message:"Request already exists"
            })
        }

        // create request
        const connection = await Connection.create({
            fromUser,
            toUser,
            status:"pending"
        });

        return res.json({
            success:true,
            message:"Your request has been successfully sent!",
        })
    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

//button - sent requests
//return array of people to whom requests has been sent.
async function getsentRequest(req,res){
    try{
        const userId = req.user.id;

        if(!userId){
            return res.json({
                success: false,
                message:"no such user exists"
            })
        }

        // get all sent requests
        const requests = await Connection.find({
            fromUser: userId,
            status: "pending"
        }).populate("toUser", "-password");

        const people = requests.map((request) => request.toUser);

        return res.json({
            success:true,
            message: "Sent Requests have been Updated Successfully!",
            data: people
        })

    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

// button - pending requests

//returns an array of people who have sent requests to the curr user.
async function getpendingRequest(req,res){
    try{
        const currUserId = req.user.id;

        if(!currUserId){
            return res.json({
                success:false,
                message:"no such user exists!"
            })
        }

        // get all sent requests
        const requests = await Connection.find({

            toUser : currUserId,
            status: "pending"

        }).populate("fromUser","-password");

        const people = requests.map((request) => request.fromUser);

        return res.json({
            success:true,
            message : "Pending Requests have been Updated Successfully!",
            data : people
        })
    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

//pending requests mei jaake accept krna request ko
async function acceptRequest(req,res){
    try{

        const currentUser = req.user.id;

        const fromUser = req.params.userId;

        // find pending request
        const connection = await Connection.findOne({
            fromUser,
            toUser: currentUser,
            status: "pending"

        });

        if(!connection){
            return res.json({
                success:false,
                message:"Request not found"
            })
        }

        // update status
        connection.status = "accepted";

        await connection.save();

        return res.json({
            success:true,
            message:"Request has been accepted successfully!",
        })

    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

// pending requests mei jaake delete krdi request
async function deleteRequest(req,res){
    try{
    
        const currentUser = req.user.id;

        const fromUser = req.params.userId;

        // find incoming pending request
        const connection = await Connection.findOneAndDelete({

            fromUser,
            toUser: currentUser,
            status:"pending"

        });

        if(!connection){
            return res.json({
                success:false,
                message:"Request not found"
            })
        }

        return res.json({
            success:true,
            message:"Request has been deleted successfully!"
        })
    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

// jisne request bheji thi usne sent requests mei jaake cancel request kr diya
async function cancelRequest(req,res){
    try{
        const currentUser = req.user.id;
        const toUser = req.params.userId;

        const connection = await Connection.findOneAndDelete({

            fromUser : currentUser,
            toUser: toUser,
            status:"pending"

        });

        if(!connection){
            return res.json({
                success:false,
                message:"Request not found"
            })
        }

        return res.json({
            success:true,
            message:"Request has been cancelled successfully!"
        })

    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

//koi connection h usse remove krna h
async function removeConnection(req,res){
    try{

        const currentUser = req.user.id;

        const toUser = req.params.userId;

        // delete sent pending request
        const connection = await Connection.findOneAndDelete({

            $or: [

                {
                    fromUser: currentUser,
                    toUser: toUser
                },

                {
                    fromUser: toUser,
                    toUser: currentUser
                }

            ],

            status: "accepted"
        });


        if(!connection){
            return res.json({
                success:false,
                message:"Connection not found"
            })
        }

        return res.json({
            success:true,
            message:"Connection has been removed successfully"
        })

    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}


//connections mei check kro jismei to user , ya from user , curr user hai. 
//ab un connections mei se jinka statsus accepted h vo honge connections.
//ab in connections mei jo accepted hai, us mei agar to user : curr user hai , to from user return kro 
//aur agar from user : curr user hai , to to user return kro.

//returning an array of connected people like : [ {
    //      _id: "123",
    //      firstName: "Shubh",
    //      lastName: "Kaur",
    //      email: "abc@gmail.com",
    //      profilePic: "...",
    //      connectionStatus: "connect"
    //   }, {} , {}]
async function getConnections(req,res){
    try{
        const currentUser = req.user.id;

        const connections = await Connection.find({
        $or: [
            { fromUser: currentUser },
            { toUser: currentUser }
        ],
        status: "accepted"
        }).populate("fromUser toUser", "-password");

        // always other person ka data return karo
        const people = connections.map(c =>
        c.fromUser._id.toString() === currentUser.toString()
            ? c.toUser
            : c.fromUser
        );

        return res.json({ success: true, message:"Connections have been Fetched Successfully!", data: people });
    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}


//mtlb pehle saare connections leke aayi mai jo bhi curr user ke h..chahe sirf usse req bheji h ya usse connected h,
//  then map bnaaya jis mei aagya jin jin se vo connection mei h + status, then all user ki list mei curr user hta ke saare users aaye,
//  then in sb users mei agar vo connection map mei h, to mtlb vo obv accepted ya pending hoga. 
// To accepted h to kuch na kro (feed mei mt dikhao), pending h to same status ke saath store kro, 
// aur agar map mei nhi h to "connect" status ke saath store kro.

//returning an array of all people like : [ {
    //      _id: "123",
    //      firstName: "Shubh",
    //      lastName: "Kaur",
    //      email: "abc@gmail.com",
    //      profilePic: "...",
    //      connectionStatus: "connect"
    //   }, {} , {}]
    // agar connectd hai to connectionstatus -> chat , agar request bheji h ya aayi hui h to ->pending, agar kuch ni h to ->connect

async function getFeed(req, res) {

    try {

        const currentUser = req.user.id;

        const connections = await Connection.find({

            $or: [

                { fromUser: currentUser },

                { toUser: currentUser }

            ]

        });

        const users = await User.find({

            _id: { $ne: currentUser }

        }).select("-password");

        const connectionMap = new Map();

        connections.forEach((conn) => {

            let otherUser;

            let requestType;

            if(conn.fromUser.toString() === currentUser.toString()){

                otherUser = conn.toUser.toString();

                requestType = "sent";
            }

            else{

                otherUser = conn.fromUser.toString();

                requestType = "received";
            }

            connectionMap.set(

                otherUser,

                {

                    status: conn.status,

                    requestType: requestType
                }
            );

        });

        const feed = users.map((user) => {

            const connectionData =
                connectionMap.get(user._id.toString());

            let status = "none";

            let requestType = null;

            if(connectionData){

                status = connectionData.status;

                requestType = connectionData.requestType;
            }

            return {

                ...user.toObject(),

                connectionStatus: status,

                requestType: requestType
            };

        });

        return res.json({

            success:true,

            message:"feed fetched successfully",

            data:feed
        });

    }

    catch (error) {

        return res.status(500).json({

            success:false,

            message:"Internal server error",

            error:error.message
        });
    }
}

module.exports = {getConnections,getFeed,getsentRequest,getpendingRequest,sendRequest,acceptRequest,deleteRequest,cancelRequest,removeConnection}