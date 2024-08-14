import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const qualificationSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
})
const certificationSchema = new mongoose.Schema({
    certification:{
        type:String,
        required:true
    }
})


const instructorModel = new mongoose.Schema({

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
    googleUserId: {
        type: String,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'Active'
    },
    profession:{
        type:String,
         default:null
    },
    qualifications: {
        type: [qualificationSchema],
        default: []
    },
    certifications: {
        type: [certificationSchema],
        default: []
    }
})

instructorModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    if (!this.password) {
        return
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

export const instructorSchema = mongoose.model('Instructor', instructorModel)

