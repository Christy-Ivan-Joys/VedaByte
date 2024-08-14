import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const cartItemSchema = new Schema({
  courseId:{
    type:mongoose.Types.ObjectId,
    ref:'Courses',
    required:true
  }
})

const enrollSchema = new Schema({
      enrollId:{
        type:mongoose.Types.ObjectId,
        ref:'Enrollment',
      }
})


const studentModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  profileImage: {
    type: String,
    default: null

  },
  googleUserId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'Active'
  },
  cart: {
    type: [cartItemSchema],
    default: []
  },     
  isBlocked: {
    type: Boolean,
    default: false
  },
  enrollments:{
    type:[Schema.Types.ObjectId],
    ref:'Enrollment',
    default:[]
  },
  reviews:{
    type:[Schema.Types.ObjectId],
    ref:'Courses',
    default:[]
  }         
})            

studentModel.pre('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('is modified false')
    return next()
  }
  if (!this.password){
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const studentSchema = mongoose.model('Student', studentModel)

