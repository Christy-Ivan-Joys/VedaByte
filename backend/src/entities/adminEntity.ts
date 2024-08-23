import { ObjectId } from "mongoose";

export class admin{
  constructor(
    public readonly _id:ObjectId,
    public readonly email:string,
    public readonly password:string,
  ){}
}                        