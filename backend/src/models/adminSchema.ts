import mongoose from "mongoose";
import bcrypt from 'bcryptjs'



const adminModel = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

adminModel.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)

})  

export const adminSchema  = mongoose.model('Admin',adminModel)