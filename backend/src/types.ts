import {Request}  from 'express'
import session from 'express-session'
import { course } from './entities/instructorEntity';
import mongoose from 'mongoose';
 export interface AuthenticatedRequest extends Request{
    user?:any
}
declare module 'express-session' {
    interface SessionData {
      otp: string;
      token: string;
      refreshToken:string;
    }
  }
declare module 'socket.io'{
  interface Socket{
      user ? : string
      student?:any,
      instructor?:any
      }
}
  export type Product ={
         courseId:course
  }

  export type enrolledCourses={
    courseId:mongoose.Types.ObjectId,
    Progress:number,
    completed:boolean,
    EnrolledAt:Date,
    modules:enrollmentModule[]
    status:boolean
  }

  export type enrollmentModule={
    moduleId:mongoose.Types.ObjectId,
    progress:number,
    IsCompleted:boolean,
    _id:mongoose.Types.ObjectId
  }
  export type Enroll={
    _id:mongoose.Types.ObjectId,
    student:mongoose.Types.ObjectId,
    EnrolledCourses:enrolledCourses,
    Total:number
  }
  
  interface Module {
    _id: mongoose.Types.ObjectId;
    title:string,
    progress:string
  }
  
  // interface Course {
  //   _id: mongoose.Types.ObjectId;
  //   modules: Module[];
  // }
  
 export interface Qualification {
  degree: string,
  institution:string
}
export interface section {
  title: string,
  videoURL: string,
  duration: string,
  description: string
}
export interface Certification{
  certification:string
}
export type cartItem = {
  courseId: course
}
export type token ={

}

