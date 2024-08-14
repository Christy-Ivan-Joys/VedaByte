import { user } from '../entities/userEntity'
import { enrollment } from '../entities/enrollmentEntity'
import { category } from '../entities/categoryEntity'
import { course, instructor } from '../entities/instructorEntity'
import { courseReview } from '../entities/reviewEntity'


export interface iUserRepository {
    create(data: user): Promise<user | null>
    update(id: string, data: any): Promise<user | null>
    delete(id: string): Promise<user | null>
    login(data: any): Promise<user | null>
    findUser(email: string): Promise<user | null | any>
    userDetails(email: string): Promise<user | null | any>
    coursesData():Promise<course | null>
    addToCart(id:string,studentId:string):Promise<user | null>
    findUserWithId(id:string):Promise<user | null>
    enrollment(data:any):Promise< |null>
    allEnrolledCourses(userId:string):Promise<enrollment[] | null>
    fetchEnrollments(userId:string):Promise<enrollment[] | null>
    getAllCategories():Promise<category[]>
    updateModuleProgress(enrollmentId:string,courseId:string,moduleId:string,progress:number):Promise<enrollment | null>
    getAllMessages(InstructorId:string,studentId:string):Promise<any>
    getAllInstructors():Promise<instructor[]>
    findInstructorCourses(InstructorId:string):Promise<course[]>
    addCourseReview(data:any):Promise<courseReview>
    fetchReviews(courseId:string):Promise<courseReview[]>
    findEnrollment(enrollmentId:string):Promise<enrollment | null>
    enrollmentsUpdate(enrollmentId:string,data:any):Promise<enrollment | null>
    
}   