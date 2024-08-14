import mongoose, { Mongoose } from 'mongoose'


const courseModel = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,

    },
    category: {
        type: String,
    },
    courselevel: {
        type: String
    },
    price:{
        type:String
    },
    isApproved:{
        type:String,
        default:'pending'
    },
    courseImage: {
        type: String
    },
    Introvideo:{
         type:String
    },
    InstructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    
    module: [
        {
            title: {
                type: String
            },
            videoURL: {
                type: String
            },
            description: {
                type: String
            },
            duration: {
                type: String
            }
        }
    ]

})

export const courseSchema = mongoose.model('Courses', courseModel)
