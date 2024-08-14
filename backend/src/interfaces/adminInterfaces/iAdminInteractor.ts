import { course, instructor } from "../../entities/instructorEntity"
import { Response } from "express"
import { user } from "../../entities/userEntity"

export interface adminInteractorInterface{
    loginAdmin(input:any,res:Response):void
    getStudents():Promise<user[]| null>
    getTutors():Promise<instructor[] | null>
    statusChange(input:any):Promise<user | instructor | null>
    getApplications():void
    courseApproval(id:string,action:string):void
    addNewCategory(category:string,image:string):void
    getAllCategories():void
    verifyRefreshToken(token:string,res:Response):void
}