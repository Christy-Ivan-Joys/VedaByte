import mongoose from "mongoose"
import { user } from "./userEntity"
import { instructor } from "./instructorEntity"


export class message{
    constructor(
        public readonly _id:mongoose.Types.ObjectId,
        public readonly sender:user,
        public readonly recipient:instructor,
        public readonly message :string,
        public readonly Time:string | null
    ){}
}   