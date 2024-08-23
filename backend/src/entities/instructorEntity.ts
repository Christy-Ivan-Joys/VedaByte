import Module from "module";
import mongoose, { Date, ObjectId } from "mongoose";
import { Qualification,section,Certification } from "../types";

export class instructor {
    constructor(
        public readonly _id: ObjectId | any,
        public readonly name: string,
        public readonly email: string,
        public readonly contact: string,
        public readonly password: string | null,
        public readonly googleUserId: string | null,
        public readonly profileImage: string | null,
        public readonly qualifications:Qualification[],
        public readonly certifications:Certification[],
        public readonly profession:string | null
        ) { }
}

export class InstructorWithId {
    constructor(
        public readonly _id: mongoose.Types.ObjectId,
        public readonly name: string,
        public readonly email: string,
        public readonly contact?: string | null,
        public readonly profileImage?: string | null,
        public readonly googleUserId?: String | null,
       
    ) { }
}

export class course {
    constructor(
        public readonly _id: mongoose.Types.ObjectId,
        public readonly name: string,
        public readonly category: string,
        public readonly description: string,
        public readonly courseImage: string,
        public readonly price: string,
        public readonly courselevel: string,
        public readonly Introvideo: string,
        public readonly isApproved: boolean,
        public readonly module: section,
        public readonly InstructorId: InstructorDetails,
        public readonly createdAt:Date
    ) { }
}
interface InstructorDetails {
    _id: ObjectId,
    name: string,
    email: string,
    contact: string,
    password: string | null,
    googleUserId: string | null,
    profileImage: string | null,
}

