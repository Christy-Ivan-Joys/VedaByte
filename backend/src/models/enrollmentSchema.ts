import mongoose, { Schema, mongo } from 'mongoose'




const EnrolledCourse = new Schema({
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    Progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completed: {
        type: Boolean,
        default: false
    },

    EnrolledAt: {
        type: Date,
        default: Date.now()
    },
    modules: [
        
        {
          moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course.modules' },
          progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
          },
          IsCompleted:{
            type:Boolean,
             default:false
          }
        }
      ],
      status:{
        type:Boolean,
        default:true
      }
})


const EnrollmentModel = new mongoose.Schema({
    
    student: {

        type: Schema.Types.ObjectId,
        ref: 'Student',

    },
    EnrolledCourses: {

        type: [EnrolledCourse],
        default: []

    },

    Total: {

        type: Number,
        required: true
    },
  
})

export const enrollmentSchema = mongoose.model('Enrollment',EnrollmentModel)