const transporter = require("../config/transporter");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const Cloudinary = require("cloudinary").v2;
require("dotenv").config();

async function upload_file_to_cloudinary(file, folder) {
    const folder_object = {
        folder : folder,
        resource_type: "auto",
    };
    return await Cloudinary.uploader.upload(file.tempFilePath, folder_object);
}

async function updateProfileController(req,res){

    try{
        const userId = req.user.id;

        const{firstName, lastName, bio, skills}= req.body || {};

        const user = await User.findById(userId);
        if(!user){
            return res.json({
                success:false,
                message:"user not found!"
            })
        }

        if(firstName){
            if(firstName.trim().length < 2){
                return res.json({
                    success:false,
                    message:"First name must contain at least 2 characters"
                });
            }
            user.firstName = firstName.trim();
        }

        // last name validation
        if(lastName){

            if(lastName.trim().length < 2){
                return res.json({
                    success:false,
                    message:"Last name must contain at least 2 characters"
                });
            }

            user.lastName = lastName.trim();
        }

        // bio validation
        if(bio){
            if(bio.length > 200){
                return res.json({
                    success:false,
                    message:"Bio cannot exceed 200 characters"
                });
            }
            user.bio = bio.trim();
        }

        // skills validation
        if(skills){
            user.skills = skills
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);
        }

        // profile image upload
        if(req.files && req.files.profilePic){

            const profilePic = req.files.profilePic;

            const supported_types = [".jpg", ".jpeg", ".png"];

            const pathModule = require("path");
            let extension = pathModule.extname(profilePic.name).toLowerCase();

            if (!supported_types.includes(extension)) {
                return res.json({
                    success: false,
                    message: "Extension or File format not supported!"
                });
            }

            // upload
            const response = await upload_file_to_cloudinary(profilePic, "Dev-Connect-Profiles");

            user.profilePic = response.secure_url;
        }

        // save updated user
        await user.save();

        return res.json({
            success:true,
            message:"Changes updated successfully",
            user
        });

    }
    catch(error){

        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error : error.message
        });

    }

}

async function changePasswordController(req,res){

    try{
        const userId = req.user.id;

        const {oldPassword,newPassword,confirmPassword} = req.body;

        if( !oldPassword || !newPassword || !confirmPassword){
            return res.json({
                success: false,
                message: "fill complete details"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.json({
                success: false,
                message: "No such user exists"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch){
            return res.json({
                success: false,
                message: "old password incorrect"
            })
        }

        if(newPassword.length<6){
            return res.json({
                success: false,
                message: "password must be of atleast 6 characters."
            })
        }

        if(oldPassword === newPassword){
            return res.json({
                success:false,
                message:"New password cannot be same as old password"
            })
        }

        if(newPassword!==confirmPassword){
            return res.json({
                success: false,
                message: "Passwords don't match"
            })
        }

        //yha tkk -> password sahi h, bcrypt kro -> update krdo
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(newPassword,10);
        }
        catch{
            return res.json({
                success: false,
                message: "Problem in hashing password!"
            })
        }

        user.password = hashedPassword;

        await user.save();

        return res.json({
            success: true,
            message: "Password updated successfully!",
            data: user
        })
    }
    catch(error){
        return res.json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }

}

async function forgotPasswordController(req,res){
    try{
        //1. fetch email
        const {email} = req.body;
        
        //2. email format validation check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.json({
                success:false,
                message:"Invalid email format"
            });
        }

        //3. user existence check
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message: "If account exists, reset link has been sent"
            }
            )
        }

        //4. token generate kro 
        const payload = {id : user._id};
        const token = jwt.sign(payload,process.env.RESET_SECRET,{expiresIn:"10m"});

        //5. Password reset link 
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        //6. Sending this password reset link to email id
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Reset Password",
            html: `
                <h2>Password Reset</h2>
                <p>Click below link to reset password</p>
                <a href="${resetLink}">Reset Password</a>
                `
        })

        return res.json({
            success: true,
            message:"Reset link sent to email"
        })


    }
    catch(error){
        return res.json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

async function resetPasswordController(req,res){
    try{
        
        //1. fetch details
        const {token,newPassword,confirmPassword} = req.body;

        //2. empty validation
        if(!token || !newPassword || !confirmPassword){
            return res.json({
                success: false,
                message: "fill complete details"
            })
        }

        //3. password validation
        if(newPassword.length<6){
            return res.json({
                success: false,
                message: "Password must be of atleast 6 characters"
            })
        }

        if(newPassword !== confirmPassword){
            return res.json({
                success: false,
                message: "Passwords don't match"
            })
        }

        //4. token verification
        let payload = jwt.verify(token,process.env.RESET_SECRET);

        if(!payload){
            return res.json({
                success: false,
                message: "invalid or expired token"
            })
        }

        //5. check user existence
        const user  = await User.findById(payload.id);

        if(!user){
            return res.json({
                success: false,
                message: "no such user exist"
            })
        }

        //6. bcyrpt password and update
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(newPassword,10);
        }
        catch(error){
            return res.json({
                success: false,
                message: "Password hashing error"
            })
        }

        user.password = hashedPassword;

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Password Reset Successful",
            html: `
                <h2>Password Reset Successful</h2>

                <p>
                    Your password has been reset successfully.
                </p>

                <p>
                    If this wasn't you, please secure your account immediately.
                </p>
            `
        });

        await user.save();

        return res.json({
            success: true,
            message: "Password reset successful"
        })
        

    }
    catch(error){
        return res.json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = {updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController};
