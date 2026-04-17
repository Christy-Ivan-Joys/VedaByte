import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


interface Admin {
    email: string;
    password: string;
  }

const adminModel = new mongoose.Schema<Admin>({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

adminModel.pre('save', async function () {
    if (!this.isModified('password')) {
      return;
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

export const adminSchema  = mongoose.model('Admin',adminModel)