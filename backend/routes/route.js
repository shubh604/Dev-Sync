const express = require("express");
const router = express.Router();
const User = require("../model/User");

const authentication = require("../middleware/auth");

const {signupController, loginController, logoutController} = require("../controller/authController");
const {updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController} = require("../controller/profileController");
const {getConnections, getFeed, getsentRequest, getpendingRequest,sendRequest,acceptRequest,deleteRequest,cancelRequest,removeConnection} = require("../controller/requestController");

router.post("/signup" , signupController);
router.post("/login" , loginController);
router.put("/logout" , authentication, logoutController);

router.put("/profile/update" , authentication , updateProfileController );
router.put("/profile/change-password" , authentication, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

router.get("/connections", authentication, getConnections);
router.get("/feed", authentication, getFeed);
router.get("/requests/sent" , authentication , getsentRequest);
router.get("/requests/pending" , authentication , getpendingRequest);

router.post("/request/send/:userId" , authentication , sendRequest);
router.post("/request/accept/:userId" , authentication , acceptRequest);
router.delete("/request/delete/:userId" , authentication , deleteRequest);
router.delete('/request/cancel/:userId',    authentication, cancelRequest);
router.delete('/connection/remove/:userId', authentication, removeConnection);






router.get("/me", authentication, async(req,res)=>{

    try{

        const user = await User.findById(req.user.id).select("-password");
        console.log(user);
        res.json({
            success:true,
            user : user
        })

    }
    catch(error){
        res.json({
            success:false,
            message:"error fetching user"
            
        })
    }

})


module.exports = router;