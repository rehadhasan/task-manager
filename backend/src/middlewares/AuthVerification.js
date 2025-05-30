const {DecodeToken} = require("../utility/TokenHelper");


module.exports = async (req,res,next)=>{
    try{
        let token = req.headers['token']
        if(!token){
            token = req.cookies['token']
        }

        let Decoded = DecodeToken(token)

        if(Decoded === null){
            res.status(401).json({status:"fail", data:"Unauthorized"})
        }else{
            let email = Decoded['email']
            let userID = Decoded['userID']
            req.headers.email = email;
            req.headers.userID = userID;
            next()
        }
    }
    catch (e) {
        res.status(401).json({status:"fail", data:e})
    }
}