const express = require("express");
const router = express.Router();

const authentication = require("../middleware/auth");

const {signupController, loginController, logoutController} = require("../controller/authController");
const {updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController} = require("../controller/profileController");

router.post("/signup" , signupController);
router.post("/login" , loginController);
router.put("/logout" , authentication, logoutController);

router.put("/profile/update" , authentication , updateProfileController );
router.put("/profile/change-password" , authentication, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
module.exports = router;