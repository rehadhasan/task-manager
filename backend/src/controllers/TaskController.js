const TaskModel = require('../models/TaskModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

exports.CreateTask = async (req,res)=>{
    try{
        let Body = req.body;
        let email = req.headers.email;
        Body['email'] = email;
        let data = await TaskModel.create(Body)
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.UpdateTask = async (req,res)=>{
    try{
        let taskID = new ObjectId(req.params.taskID);
        let status = req.params.status;
        let data = await TaskModel.updateOne({_id:taskID}, {status:status})
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.DeleteTask = async (req,res)=>{
    try{
        let taskID = new ObjectId(req.params.taskID);
        let data = await TaskModel.deleteOne({_id:taskID})
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}

exports.ListTaskByStatus = async (req,res)=>{
    try{
        let email = req.headers.email;
        let status = req.params.status;
        let data = await TaskModel.find({email:email,status:status})
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}


exports.CountTaskStatus = async (req,res)=>{
    try{
        let email = req.headers.email;
        let matchStage = {$match:{email:email}}
        let groupStage = {$group:{_id:"$status", sum:{$count:{}}}}
        let data = await TaskModel.aggregate([
            matchStage,
            groupStage
        ])
        res.status(200).json({status:"success", data:data})
    }catch (e) {
        res.status(200).json({status:"fail", data:e})
    }
}