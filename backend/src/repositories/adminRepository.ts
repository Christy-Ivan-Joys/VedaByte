import { admin } from "../entities/adminEntity";
import { course, instructor } from "../entities/instructorEntity";
import { user } from "../entities/userEntity";
import { AdminRepositoryInterface } from "../interfaces/adminInterfaces/iAdminRepository";
import { adminSchema } from "../models/adminSchema";
import { categorySchema } from "../models/categorySchema";
import { courseSchema } from "../models/courseSchema";
import { instructorSchema } from "../models/instructorSchema";
import { studentSchema } from "../models/studentSchema";
import { category } from "../entities/categoryEntity";

export class AdminRepository implements AdminRepositoryInterface {
    private db: typeof adminSchema
    private studentsDB: typeof studentSchema
    private tutorDB: typeof instructorSchema
    private courseDB: typeof courseSchema
    private categoryDB: typeof categorySchema
    constructor() {
        this.db = adminSchema
        this.studentsDB = studentSchema
        this.tutorDB = instructorSchema
        this.courseDB = courseSchema
        this.categoryDB = categorySchema
    }
    async login({ email, password }: admin) {
        const user = await this.db.findOne({ email })
        return user
    }
    async allStudents() {
        const data = await this.studentsDB.find()
        return data
    }
    async allTutors() {
        const data = await this.tutorDB.find()
        return data
    }
    async userStatus(id: string, status: string,isBlocked:boolean) {

        const update = await this.studentsDB.findByIdAndUpdate(id, { status,isBlocked}, { new: true })
        return update

    }
    async tutorStatus(id: string, status: string) {
        const update = await this.tutorDB.findByIdAndUpdate(id, { status}, { new: true })
        return update
    }

    async allApplications() {
        const applications = await this.courseDB.find({ isApproved: 'pending' }).populate('InstructorId')
        return applications
    }
    async courseApproveOrReject(id: string, action: string): Promise<course | null | any> {
        const update = await this.courseDB.findByIdAndUpdate(id, { isApproved: action }, { new: true })
        return update
    }
    async addCategory(category: string,image:string): Promise<category> {
        const update = await this.categoryDB.create({ category: category,categoryImage:image })
        return update
    }

    async findCategory(categoryName: string): Promise<category | null> {
        const category = await this.categoryDB.findOne({ category: categoryName })
        return category
    }
   async  fetchAllCategories(): Promise<any> {
          const categories = await this.categoryDB.find()
          return categories
    }

}
