const mongoose = require('mongoose')

let DataSchema = mongoose.Schema(
    {
        email:{type:String, required:true},
        title:{type:String, required:true},
        description:{type:String, required:true},
        status:{type:String, default:"new"}
    },
    {
        versionKey:false,
        timestamps:true
    }
)

const TaskModel = mongoose.model('tasks', DataSchema)

module.exports = TaskModel;