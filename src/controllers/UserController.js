const UserModel = require('../models/UserModel')
const OTPModel = require('../models/OTPModel')
const {EncodeToken} = require("../utility/TokenHelper");
const domain = require("domain");
const SendEmailHelper = require('../utility/SendEmailHelper');
const {upgrade} = require("nodemailer/.ncurc");

exports.UserRegistration = async (req,res)=>{
    try{
        let Body = req.body;
        let data = await UserModel.create(Body)
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.UserLogin = async (req,res)=>{
    try{
        let Body = req.body;
        let email = Body['email'];
        let password = Body['password'];

        //Find User
        let result = await UserModel.find({email:email,password:password}).countDocuments()

        if(result === 1){
            //Select UserID
            let userID = await UserModel.find({email:email}).select('_id')
            let data = await UserModel.find({email:email})

            //Create Token
            let token = await EncodeToken(email,userID[0]['_id'])

            //Set Cookie
            let CookieOptions = {expires:new Date(Date.now()+24*6060*1000), httpOnly:false, credentials:true}
            res.cookie("token", token, CookieOptions)

            res.status(200).json({status:"success", data:data[0], token:token})
        }else{
            res.status(200).json({status:"fail", data:"No User Found"})
        }
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.UserRead = async (req,res)=>{
    try{
        let email = req.headers.email;
        let data = await UserModel.find({email:email})
        res.status(200).json({status:"success", data:data[0]})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}

exports.UserUpdate = async (req,res)=>{
    try{
        let Body = req.body;
        let email = req.headers.email;
        let data = await UserModel.updateOne({email:email}, Body)
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.UserDelete = async (req,res)=>{
    try{
        let userID = req.headers.userID;
        let data = await UserModel.deleteOne({_id:userID})
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}

exports.UserSendOTP = async (req,res)=>{
    try{
        let email = req.params.email;
        let result = await UserModel.find({email:email}).countDocuments()

        if(result===1){
            let code = Math.floor(100000+Math.random()*900000)
            await OTPModel.updateOne({email:email},{$set:{email:email,otp:code,status:'0'}},{upsert:true})

            let EmailSubject = 'Task Manager Email Verification';
            let EmailText = 'Your verification code is'+' '+code;
            await SendEmailHelper(email,EmailText,EmailSubject)

            res.status(200).json({status:"success", data:"6 digit otp has been send your email"})
        }else{
            res.status(200).json({status:"fail", data:"No User Found"})
        }
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.UserVerifyOTP = async (req,res)=>{
    try{
        let email = req.params.email;
        let otp = req.params.otp;
        let result = await OTPModel.find({email:email,otp:otp,status:'0'}).countDocuments()

        if(result===1){
            await OTPModel.updateOne({email:email,otp:otp}, {email:email,otp:otp,status:'1'}, {upsert:true})
            res.status(200).json({status:"success", data:"Verification Success"})
        }else{
            res.status(200).json({status:"fail", data:"Invalid otp"})
        }
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.UserResetPass = async (req,res)=>{
    try{
        let email = req.params.email;
        let otp = req.params.otp;
        let password = req.params.password;
        let result = await OTPModel.find({email:email,otp:otp,status:'1'}).countDocuments()

        if(result===1){
            await OTPModel.updateOne({email:email,otp:otp,status:'1'},{email:email,otp:'0',status:'0'}, {upsert:true})
            await UserModel.updateOne({email:email},{password:password})
            res.status(200).json({status:"success", data:"Password Forgotten Successful"})
        }else{
            res.status(200).json({status:"fail", data:"Something Went Wrong Try Again"})
        }
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}