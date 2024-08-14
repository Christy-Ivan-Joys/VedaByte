import { admin } from "../../entities/adminEntity"
import { category } from "../../entities/categoryEntity"
import { course, instructor } from "../../entities/instructorEntity"
import { user } from "../../entities/userEntity"

export interface AdminRepositoryInterface{
        login(data:admin):Promise<admin | null | any>
        allStudents():Promise<user | null | any>
        allTutors():Promise<instructor | any>
        userStatus(id:any,status:string):Promise< user |any >
        tutorStatus(id:any,status:string):Promise<instructor |any>
        allApplications():Promise<course | null | any>
        courseApproveOrReject(id:string,action:string):Promise<course | null>
        addCategory(category:string,image:string):Promise<any>
        findCategory(category:string):Promise<category | null>
        fetchAllCategories():Promise<any>
}       