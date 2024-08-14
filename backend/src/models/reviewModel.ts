import mongoose, { Mongoose } from "mongoose";



const reviewModel = new mongoose.Schema({
    courseId:{
        type:mongoose.Types.ObjectId,
        ref:'Courses',
    },
    reviewerId:{
        type:mongoose.Types.ObjectId,
        ref:'Student',
        require:true
    },
    comment:{
        type:String,
        require:true,
    },
    rating:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        default:Date.now()
    }

})

export const reviewSchema = mongoose.model('Review',reviewModel)