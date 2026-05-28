const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const apiInstance = require("../config/transporter");
require("dotenv").config();

async function signupController(req, res) {

    try {

        let {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        } = req.body;

        // empty validation
        if (!firstName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required except Last Name."
            });
        }

        // first name validation
        if (firstName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "First name must contain at least 2 characters"
            });
        }

        // last name validation
        if (lastName && lastName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Last name must contain at least 2 characters"
            });
        }

        lastName = lastName ? lastName.trim() : "";

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // confirm password check
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Confirm password doesn't match"
            });
        }

        // existing user check
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(
            password.trim(),
            10
        );

        // create user
        const user = await User.create({
            firstName: firstName.trim(),
            lastName,
            email: email.trim(),
            password: hashedPassword
        });

        console.log("MAIL SEND START");

        try {

            const mailResponse =
                await apiInstance.sendTransacEmail({

                    sender: {
                        email: process.env.MAIL_USER,
                        name: "Dev-Sync"
                    },

                    to: [
                        { email }
                    ],

                    subject: "Welcome to Dev-Sync 🎉",

                    htmlContent: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #1e293b; max-width: 600px; margin: auto; padding: 20px;">

                            <h2 style="color: #2563eb;">
                                Welcome to Dev-Sync 🚀
                            </h2>

                            <p>
                                Your account has been created successfully, and we're excited to have you on board! 🎉
                            </p>

                            <p>
                                Dev-Sync is a space where developers connect, support each other, and grow together.
                            </p>

                            <p>
                                Start connecting, keep building, and enjoy your journey with Dev-Sync 🚀
                            </p>

                            <p style="margin-top: 30px;">
                                Happy Coding,<br/>
                                <strong>Team Dev-Sync 💙</strong>
                            </p>

                        </div>
                    `
                });

            console.log("MAIL SUCCESS:", mailResponse);

        } catch (mailError) {

            await User.findByIdAndDelete(user._id);

            console.log(
                "MAIL ERROR:",
                mailError.response?.body || mailError
            );

            return res.status(500).json({
                success: false,
                message: "Failed to send welcome email"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User signed up successfully!",
            user: null
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        });
    }
}

async function loginController(req, res){

    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Enter All Details"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email format"
            });
        }

        const user = await User.findOne({email: email.trim()});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }

        let frontendUser = null;

        if (await bcrypt.compare(password, user.password)) {
            const payload = {id: user._id};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "30d"});
            const options = {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

                httpOnly: true,

                secure: process.env.NODE_ENV === "production",

                sameSite:
                    process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax"
            };
            console.log("hii");
            frontendUser = await User.findOne({email: email.trim()}).select("-password");
            console.log("frontend user" , frontendUser);
            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully!",
                token: token,
                user: frontendUser
            });
        } 
        else {
            return res.status(400).json({
                success: false,
                message: "Password doesn't match!",
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            data: error.message
        })
    }
}


function logoutController(req, res){

    try{
        res.clearCookie("token");
        return res.status(200).json({
            success:true,
            message:"logged out successfully!",
            user : null
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

module.exports = {signupController, loginController, logoutController};