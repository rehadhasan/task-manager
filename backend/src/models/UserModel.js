const mongoose = require('mongoose')

let DataSchema = mongoose.Schema(
    {
        email:{type:String, unique:true,required:true},
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        mobile:{type:String,required:true},
        password:{type:String,required:true},
        photo:{type:String,default:""}
    },
    {
        versionKey:false,
        timestamps:true
    }
)

const UserModel = mongoose.model('users', DataSchema)

module.exports = UserModel;