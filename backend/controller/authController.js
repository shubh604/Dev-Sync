const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/transporter");
require("dotenv").config();

async function signupController(req, res){

    try{
        let {firstName, lastName, email, password, confirmPassword} = req.body;

        //empty field validation check
        if(!firstName || !email || !password || !confirmPassword){
            console.log("empty form");
            return res.status(400).json({
                success: false,
                message: "All fields are required except Last Name."
            })
        }

        //firstname validation
        if(firstName){
            if(firstName.trim().length < 2){
                return res.status(400).json({
                    success:false,
                    message:"First name must contain at least 2 characters"
                });
            }
        }

        // last name validation
        if(lastName){
            if(lastName.trim().length < 2){
                return res.status(400).json({
                    success:false,
                    message:"Last name must contain at least 2 characters"
                });
            }
        }
        else{
            lastName="";
        }

        //email format validation check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email format"
            });
        }

        //password validation check
        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be of atleast 6 characters"
            });
        }

        //password and confirm password check
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "confirm password doesn't match"
            })
        }

        

        //existing user check
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "Email id already exists!"
            })
        }

        
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password.trim(),10);
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Error in hashing password"
            });
        }

        //valid user -> create entry in db
        const user = await User.create({firstName: firstName.trim(), lastName: lastName, email: email.trim(), password: hashedPassword});
       
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Welcome to Dev-Sync 🎉",
            html: `
                <h2>Welcome to Dev-Sync 🚀</h2>

                <p>
                    Your account has been created successfully.
                </p>

                <p>
                    We're excited to have you on board!
                </p>

                <p>
                Build connections. Share ideas. Learn faster. Become better together 💻✨
                </p>

                <p>
                    Happy Coding 💻
                </p>
            `
        });

        return res.status(201).json({
            success: true,
            message: "User signed up successfully!",
            user : null
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            data : error
        })
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
                httpOnly: true 
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