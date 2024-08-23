import { enrollment } from "../entities/enrollmentEntity"
import { course, instructor } from "../entities/instructorEntity"
import { courseReview } from "../entities/reviewEntity"
import { user } from "../entities/userEntity"
import { Response,Request } from "express"
import { cartItem, enrolledCourses } from "../types"
import { category } from "../entities/categoryEntity"

export interface iUserInteractor {
    createUser(input: any): Promise<user | any>
    userLogin(user:any,res:Response):void
    sendOtp(email:string,req:Request):Promise<string>
    allCourses(): void
    addNewCartItem(input:any): void
    checkoutSession(products:cartItem[],userId:string):Promise<string | null>
    enrollCourse(id: string, total: string): void
    passwordChange(newPassword: string, currentPassword: string, userId: string):Promise<user>
    changeProfileImage(url:string,userId:string):Promise<user | null>
    updateProfileDetails(user: any, details: any):Promise<user | null>
    verifyRefreshToken(token:string,res:Response):Promise<string>
    removeCartItem(userId: string, ItemId: string):Promise<user | null>
    fetchEnrolledCourses(userId:string):Promise<enrolledCourses[] | null>
    fetchAllEnrollments(userId:string):Promise<enrollment[]|null>
    fetchAllCategories():Promise<category[]>
    updateModuleProgress(data:any,userId:string):Promise<enrollment | any>
    fetchAllTutors():Promise<instructor[]>
    getAllCourses(InstructorId:string):Promise<course[]>
    fetchAllMessages(InstructorId:string,studentId:string):Promise<any>
    postCourseReview(data:any):Promise<user | null>
    getCourseReviews(courseId:string):Promise<courseReview[]>
    cancelEnrollment(data:any):Promise<any>
    updateUser(id: string, data: any): void
    deleteUser(id: string): void
    getUser(id: string):void
    makeWalletIntent(amount:number):Promise<any>
    addMoneyToWallet(amount:number,userId:string):Promise<user | null>
    allWalletTransactions():Promise<any>
}

