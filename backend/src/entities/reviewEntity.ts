import { ObjectId } from "mongoose";

export class courseReview{
    constructor(
        public readonly courseId:ObjectId ,
        public readonly reviewerId:ObjectId,
        public readonly comment:string,
        public readonly rating:string,
        public readonly date :Date
    ){}
} 