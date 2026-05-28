const express = require("express");
const router = express.Router();
const User = require("../model/User");

const authentication = require("../middleware/auth");

const {signupController, loginController, logoutController} = require("../controller/authController");
const {updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController} = require("../controller/profileController");
const {getConnections, getFeed, getsentRequest, getpendingRequest,sendRequest,acceptRequest,deleteRequest,cancelRequest,removeConnection} = require("../controller/requestController");

const {CreateHelpPost, DeleteHelpPost, GetHelpPosts, GetMyPosts , helpStatusController} = require("../controller/helpPostController");

const {ChatController} = require("../controller/ChatController");

router.post("/signup" , signupController);
router.post("/login" , loginController);
router.put("/logout" , authentication, logoutController);

router.put("/profile/update" , authentication , updateProfileController );
router.put("/profile/change-password" , authentication, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

router.get("/profile/connections", authentication, getConnections);
router.get("/profile/feed", authentication, getFeed);
router.get("/profile/requests/sent" , authentication , getsentRequest);
router.get("/profile/requests/pending" , authentication , getpendingRequest);

router.post("/profile/request/send/:userId" , authentication , sendRequest);
router.post("/profile/request/accept/:userId" , authentication , acceptRequest);
router.delete("/profile/request/delete/:userId" , authentication , deleteRequest);
router.delete('/profile/request/cancel/:userId',    authentication, cancelRequest);
router.delete('/profile/connection/remove/:userId', authentication, removeConnection);

router.post("/profile/help-board/create", authentication, CreateHelpPost);
router.get("/profile/help-board/help-feed", authentication, GetHelpPosts);
router.get("/profile/help-board/my-posts", authentication, GetMyPosts);
router.delete("/profile/help-board/delete/:postId", authentication, DeleteHelpPost);

router.post("/profile/help-board/update-status/:postId", authentication, helpStatusController);

router.get("/profile/dev-chat/:receiverId", authentication , ChatController);

router.get("/me", authentication, async(req,res)=>{

    try{

        const user = await User.findById(req.user.id).select("-password");
        console.log(user);
        res.status(200).json({
            success:true,
            user : user
        })

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"error fetching user"
            
        })
    }

})


module.exports = router;