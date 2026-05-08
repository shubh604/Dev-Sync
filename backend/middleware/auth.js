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
        }
        catch(error){
            return res.json({
                success:false,
                message:"invalid token"
            })
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