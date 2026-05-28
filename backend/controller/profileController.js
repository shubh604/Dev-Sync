const apiInstance = require("../config/transporter");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const Cloudinary = require("cloudinary").v2;
require("dotenv").config();

const fs = require("fs");

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

        const{firstName, lastName, bio}= req.body ;
        const skills = JSON.parse(req.body.skills);

        console.log("firstname: ",firstName ,"lastName: ", lastName ,"bio: ", bio ,"skills: ",skills);

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found!"
            })
        }

        if(firstName){
            if(firstName.trim().length < 2){
                return res.status(400).json({
                    success:false,
                    message:"First name must contain at least 2 characters"
                });
            }
            if(firstName.trim().length >15){
    return res.status(400).json({
        success:false,
        message:"First name cannot exceed 15 characters"
    });
}
            user.firstName = firstName.trim();
            console.log("updated firstname: " , user.firstName);
        }

        // last name validation
        if(lastName){

            if(lastName.trim().length < 2){
                return res.status(400).json({
                    success:false,
                    message:"Last name must contain at least 2 characters"
                });
                
            }

            if(lastName.trim().length > 15){
    return res.status(400).json({
        success:false,
        message:"Last name cannot exceed 15 characters"
    });
}

            user.lastName = lastName.trim();
            console.log("updated LASTNAME: " , user.lastName);
        }

        // bio validation
        if(bio){
            if(bio.trim().length > 50){
                return res.status(400).json({
                    success:false,
                    message:"Bio cannot exceed 50 characters"
                });
            }
            user.bio = bio.trim();
            console.log("updated bio: " , user.bio);
        }

        // skills validation
        if(skills){

    if(!Array.isArray(skills)){
        return res.status(400).json({
            success:false,
            message:"Skills must be an array"
        });
    }

    if(skills.length > 5){
        return res.status(400).json({
            success:false,
            message:"You can add maximum 5 skills"
        });
    }

    const cleanedSkills = skills
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

    const totalLength = cleanedSkills.join("").length;

    if(totalLength > 50){
        return res.status(400).json({
            success:false,
            message:"Total skills length cannot exceed 50 characters"
        });
    }

    user.skills = cleanedSkills;

    console.log("updated skills: ", user.skills);
}

        // profile image upload
        if(req.files && req.files.profilePic){
            console.log("profile");
            let profilePic = req.files.profilePic;
            if (Array.isArray(profilePic)) {
            profilePic = profilePic[0];
            }

            const supported_types = [".jpg", ".jpeg", ".png"];

            const pathModule = require("path");
            const extension = pathModule.extname(profilePic.name).toLowerCase();

            if (!supported_types.includes(extension)) {
                return res.status(400).json({
                    success: false,
                    message: "Extension or File format not supported!"
                });
            }

            // upload
            const response = await upload_file_to_cloudinary(profilePic, "Dev-Connect-Profiles");
           
            fs.unlinkSync(profilePic.tempFilePath);
            user.profilePic = response.secure_url;
        }

        // save updated user
        await user.save();

        const frontendUser = await User.findById(userId).select("-password");

        return res.status(200).json({
            success:true,
            message:"Changes updated successfully",
            user : frontendUser
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
            return res.status(400).json({
                success: false,
                message: "fill complete details"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "No such user exists"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "old password incorrect"
            })
        }

        if(newPassword.length<6){
            return res.status(400).json({
                success: false,
                message: "password must be of atleast 6 characters."
            })
        }

        if(oldPassword === newPassword){
            return res.status(400).json({
                success:false,
                message:"New password cannot be same as old password"
            })
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
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
            return res.status(500).json({
                success: false,
                message: "Problem in hashing password!"
            })
        }

        user.password = hashedPassword;

        await user.save();
        const frontendUser = await User.findById(userId).select("-password");

        return res.status(200).json({
            success: true,
            message: "Password updated successfully!",
            user: frontendUser
        })
    }
    catch(error){
        return res.status(500).json({
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
            return res.status(400).json({
                success:false,
                message:"Invalid email format"
            });
        }

        //3. user existence check
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "No such user Found",
            }
            )
        }

        //4. token generate kro 
        const payload = {id : user._id};
        const token = jwt.sign(payload,process.env.RESET_SECRET,{expiresIn:"10m"});

        //5. Password reset link 
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        console.log("Reset password mail sending service start.")
        //6. Sending this password reset link to email id
      
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

                    subject: "Reset Password 🔒",

                    htmlContent: `
                        <div>
                            Your HTML here
                        </div>
                    `
                });

            console.log("MAIL SUCCESS:", mailResponse);

        } catch (mailError) {

            console.log(
                "MAIL ERROR:",
                mailError.response?.body || mailError
            );

        }
        return res.status(200).json({
            success: true,
            message:"Reset link sent to email",
        })


    }
    catch(error){
        return res.status(500).json({
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

        console.log("token: ",token , "new pass: ", newPassword, "confirm: " , confirmPassword);

        //2. empty validation
        if(!token || !newPassword || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "fill complete details"
            })
        }

        //3. password validation
        if(newPassword.length<6){
            return res.status(400).json({
                success: false,
                message: "Password must be of atleast 6 characters"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords don't match"
            })
        }

        //4. token verification
        let payload = jwt.verify(token,process.env.RESET_SECRET);

        if(!payload){
            return res.status(400).json({
                success: false,
                message: "invalid or expired token"
            })
        }

        //5. check user existence
        const user  = await User.findById(payload.id);

        if(!user){
            return res.status(404).json({
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
            return res.status(500).json({
                success: false,
                message: "Password hashing error"
            })
        }

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
           
        })
        

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = {updateProfileController,changePasswordController,forgotPasswordController,resetPasswordController};
