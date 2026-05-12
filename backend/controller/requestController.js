const Connection = require("../model/connectionSchema");

//button - send connection request
async function sendRequest(req,res){
    try{

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
            message:"Request sent successfully",
            connection
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

        }).populate("toUser");

        return res.json({
            success:true,
            sentRequests: requests
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

        }).populate("fromUser");

        return res.json({
            success:true,
            sentRequests: requests
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
            message:"Request accepted successfully",
            connection
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
            message:"Request deleted successfully"
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
            message:"Request cancelled successfully"
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

            fromUser: currentUser,
            toUser,
            status:"accepted"

        });

        if(!connection){
            return res.json({
                success:false,
                message:"Request not found"
            })
        }

        return res.json({
            success:true,
            message:"Request cancelled successfully"
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

        return res.json({ success: true, connections: people });
    }
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}
    
async function getFeed(req,res){
    try{
        const currentUser = req.user.id;

        // sirf accepted connections find karo
        const connections = await Connection.find({
        $or: [
            { fromUser: currentUser },
            { toUser: currentUser }
        ],
        status: "accepted"
        });

        // accepted walo ko exclude karo + apne aap ko
        const excludeIds = new Set([currentUser.toString()]);
        connections.forEach(c => {
        excludeIds.add(c.fromUser.toString());
        excludeIds.add(c.toUser.toString());
        });

        const users = await User.find({
        _id: { $nin: Array.from(excludeIds) }
        }).select("-password");

        return res.json({ success: true, users });
    }   
    catch(error){
        res.json({
            success: false,
            message:"Internal server error",
            error:error.message
        })
    }
}

module.exports = {getConnections,getFeed,getsentRequest,getpendingRequest,sendRequest,acceptRequest,deleteRequest,cancelRequest,removeConnection}