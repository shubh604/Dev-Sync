const HelpPost = require("../model/helpPostSchema");
const User = require("../model/User");
const Connection = require("../model/connectionSchema");
const { connections } = require("mongoose");

async function CreateHelpPost(req,res){
    try{

        const userId = req.user.id;
        const { title, description } = req.body;

        //check user existence
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        //validate the number of active number of posts by curr user.
        const activePosts = await HelpPost.countDocuments({
            createdBy: userId,
            status: "open"
        })

        if (activePosts >= 3) {
            return res.json({
                success: false,
                message:"Maximum active posts limit reached. Please resolve or delete an existing post first."
            });
        }

        // create help post
        const post = await HelpPost.create({title, description,createdBy: userId});

        return res.json({
            success: true,
            message:"Your post has been created",
            data: post
        })

    }
    catch(error){

        if(error.name === "ValidationError"){
            return res.status(400).json({
            success:false,
            message: Object.values(error.errors)[0].message
        });
        }
        
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function DeleteHelpPost(req,res){
    try{

        const currentUser = req.user.id;
        const postId = req.params.postId;

        // check user exists or not
        const userExists = await User.findById(currentUser);
        if (!userExists) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // check post exists or not
        const postExists = await HelpPost.findById(postId);
        if (!postExists) {
            return res.json({
                success: false,
                message: "Post not found"
            });
        }

        // validate ownership(kya post curr user ne hi create kri h, kisi aur ki to nhi delete kr rha vo) + delete
        const deletedPost = await HelpPost.findOneAndDelete({
            _id: postId,
            createdBy: currentUser
        });

        if (!deletedPost) {
            return res.json({
                success: false,
                message: "Unauthorized access. You can only delete your own posts."
            });
        }

        return res.json({
            success: true,
            message: "Your post has been deleted successfully!",
            data: deletedPost
        });

    }
    catch(error){
        
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function GetMyPosts(req,res){
    try{

        const currentUser = req.user.id;

        // check user exists or not
        const userExists = await User.findById(currentUser);
        if (!userExists) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // get all posts created by current user
        const posts = await HelpPost.find({
            createdBy: currentUser
        }).sort({ createdAt: -1 });

        // no posts found
        if (posts.length === 0) {
            return res.json({
                success: true,
                message:"You do not have any posts yet. Create your first post!",
                data: []
            });
        }

        return res.json({
            success: true,
            message: "Your posts have been fetched successfully!",
            data: posts
        });


    }
    catch(error){
        
        return res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function GetHelpPosts(req,res){

    try{

        const currentUser = req.user.id;

        // check user exists or not

        const userExists = await User.findById(currentUser);

        if(!userExists){

            return res.status(404).json({

                success:false,

                message:"User not found"
            });
        }

        // fetch all help posts except current user's posts

        const posts = await HelpPost.find({

            createdBy:{ $ne: currentUser }

        })

        .populate("createdBy", "-password")

        .sort({ createdAt:-1 });

        // no posts found

        if(posts.length === 0){

            return res.json({

                success:true,

                message:"No posts available in help hub.",

                data:[]
            });
        }

        // fetch all connections of current user

        const connections = await Connection.find({

            $or:[

                { fromUser: currentUser },

                { toUser: currentUser }

            ]

        });

        // create connection map

        const connectionMap = new Map();

        connections.forEach((conn)=>{

            let otherUser;

            let requestType = null;

            // if current user sent request

            if(conn.fromUser.toString() === currentUser.toString()){

                otherUser = conn.toUser.toString();

                requestType = "sent";
            }

            // if current user received request

            else{

                otherUser = conn.fromUser.toString();

                requestType = "received";
            }

            connectionMap.set(

                otherUser,

                {

                    status:conn.status,

                    requestType:requestType
                }

            );

        });

        // attach connection status with every help post

        const final_posts_with_curr_status_with_user = posts.map((post)=>{

            const connectionData = connectionMap.get(

                post.createdBy._id.toString()
            );

            let status = "none";

            let requestType = null;

            if(connectionData){

                status = connectionData.status;

                requestType = connectionData.requestType;
            }

            return{

                ...post.toObject(),

                connectionStatus:status,

                requestType:requestType
            };

        });

        return res.json({

            success:true,

            message:"Help feed fetched successfully!",

            data:final_posts_with_curr_status_with_user
        });

    }

    catch(error){

        console.log(error);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error",

            error:error.message
        });
    }
}

module.exports = {CreateHelpPost, DeleteHelpPost, GetHelpPosts, GetMyPosts};