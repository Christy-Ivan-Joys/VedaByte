import mongoose from "mongoose";
import { enrolledCourses } from "../types";

export class enrollment{
    constructor(
        public readonly _id:mongoose.Types.ObjectId,
        public readonly student:mongoose.Types.ObjectId | null | undefined ,
        public readonly EnrolledCourses:enrolledCourses[],
        public readonly Total :number,
       
    ){}
}               