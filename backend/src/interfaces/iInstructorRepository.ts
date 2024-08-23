import { instructor, course } from "../entities/instructorEntity";
import { user } from "../entities/userEntity";

export interface instructorRepositoryInterface {

    create(data: instructor): Promise<instructor | null>
    findUser(email: string): Promise<instructor | null>
    UserDetails(email: string): Promise<instructor | null | any>
    addCourse(data: any): Promise<course | null | any>
    fetchCourses(data: string): Promise<course[] | any>
    update(id: string, data: any): Promise<instructor | any>
    fetchStudents(InstructorId: string): Promise<user | null>
    getCategories():Promise<any>
    updateCourse(id:string,data:any):Promise<any>
    getInstructorMessages(studentId:string,InstructorId:string):Promise<any>
    courseCounts(courseIds:any):Promise<any>
    getEnrollmentDetailsByCourseIds(courseIds:any):Promise<any>
}
