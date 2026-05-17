const jwt = require("jsonwebtoken");

function authentication(req,res, next){

    try{

        //token fetch
        const token = req.cookies.token;

        if(!token){
            return res.json({
                success:false,
                message:"token missing!"
            })
        }

        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            console.log("payload" , payload);
        }
        catch(error){

            if(error.name === "TokenExpiredError"){

                return res.status(401).json({
                    success:false,
                    message:"Token expired"
                });
            }

            if(error.name === "JsonWebTokenError"){

                return res.status(401).json({
                    success:false,
                    message:"Invalid token"
                });
            }

            return res.status(500).json({
                success:false,
                message:"Authentication failed"
            });
            }

        next();

    }
    catch(error){
        return res.json({
            success:false,
            message:"internal server error, authentication failed!"
        })
    }

}

module.exports = authentication;