import mongoose, { ObjectId,Types } from "mongoose";

interface iCartItem {
    courseId: Types.ObjectId;
  }

export class user {
    constructor(
        public readonly _id:mongoose.Types.ObjectId,
        public readonly name: string,
        public readonly email: string,
        public readonly cart: iCartItem[],
        public readonly enrollments:mongoose.Types.ObjectId[],
        public readonly reviews:mongoose.Types.ObjectId[],
        public readonly isBlocked: boolean,
        public readonly wallet:number,
        // public readonly lastSeen:
        public readonly contact?: string | null,
        public readonly password?: string | null,
        public readonly googleUserId?: String | null,
        public readonly profileImage?: string | null,
        public readonly status?: string | null,
    ) {}
}

export class userWithId {
    constructor(
        public readonly _id: ObjectId,
        public readonly name: string,
        public readonly email: string,
        public readonly cart: { courseId:mongoose.Types.ObjectId }[],
        public readonly isBlocked: boolean,
        public readonly contact?: string | null,
        public readonly profileImage?: string | null,
        public readonly googleUserId?: String | null,
        public readonly status?: string | null,
    ) { }
}
