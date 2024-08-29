import { course, instructor } from "../entities/instructorEntity"
import { Response } from "express"

export  interface instructorInteractorInterface{
        createInstructor(input:any):void
        loginInstructor(input:any,res:any):void
        createCourse(input:any):void
        allCourses(input:string):void
        updateProfileImage(imageURL: string, user: any):void
        refreshTokenValidation(token: string, res: Response):void 
        updateProfileDetails(user: any, details: any):void
        sendOtp(email:string):void
        fetchEnrolledStudents(InstructorId:string):void
        fetchCategories():void
        editCourse(id:string,data:any):void
        fetchInstructorMessages(studentId:string,InstructorId:string):void
        addQualification(data:any,InstructorId:string):Promise<instructor>
        addCertification(data:any,InstructorId:string):Promise<instructor>
        addNewSection(title:string,description:string,videoURL:string,courseId:string):Promise<course>
        deleteSection(sectionId:string):Promise<course>
        getGraphData(instructorId:string):Promise<any>
        instructorMessages(instructorId:string):Promise<any>
        
}