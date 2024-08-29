import { course, instructor, InstructorWithId } from "../entities/instructorEntity";
import { instructorRepositoryInterface } from "../interfaces/iInstructorRepository";
import { instructorSchema } from "../models/instructorSchema";
import { courseSchema } from '../models/courseSchema'
import { user } from "../entities/userEntity"
import { studentSchema } from "../models/studentSchema";
import { categorySchema } from "../models/categorySchema";
import mongoose from "mongoose";
import { chatSchema } from "../models/chatSchema";
import { enrollment } from "../entities/enrollmentEntity";
import { enrollmentSchema } from "../models/enrollmentSchema";
const { ObjectId } = mongoose.Types;



export class instructorRepository implements instructorRepositoryInterface {

    private db: typeof instructorSchema
    private coursedb: typeof courseSchema
    private studentdb: typeof studentSchema
    private categorydb: typeof categorySchema
    private messagedb: typeof chatSchema
    private enrollmentdb: typeof enrollmentSchema
    constructor() {
        this.db = instructorSchema
        this.coursedb = courseSchema
        this.studentdb = studentSchema
        this.categorydb = categorySchema
        this.messagedb = chatSchema
        this.enrollmentdb = enrollmentSchema
    }

    async create({ name, email, contact, password, googleUserId, profileImage }: instructor): Promise<instructor | null | any> {

        const instructor = await this.db.create({ name, email, password, contact, googleUserId, profileImage })
        return instructor
    }

    async findUser(email: string): Promise<instructor | null | any> {
        const user = await this.db.findOne({ email })
        return user
    }
    async UserDetails(email: string): Promise<InstructorWithId | null | any> {
        const user = await this.db.findOne({ email })
        if (!user) return null
        return new InstructorWithId(
            user._id as any,
            user.name,
            user.email,
            user.contact,
            user.googleUserId,
            user.profileImage
        )
    }

    async addCourse({ _id, category, description, price, courseImage, Introvideo, courselevel, InstructorId, name, module }: course): Promise<any> {
        const course = await this.coursedb.create({ category, description, price, courselevel, InstructorId, courseImage, Introvideo, name, module })
        return course
    }

    async fetchCourses(data: string): Promise<course[] | any> {
        const courses = await this.coursedb.find({ InstructorId: data })
        return courses
    }

    async update(id: string, data: any): Promise<instructor | any | null> {
        try {
            const result = await this.db.findByIdAndUpdate(id, data, { new: true })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async fetchStudents(InstructorId: string): Promise<any> {
        const courses = await this.coursedb.find({ InstructorId }).select('_id')
        const courseIds = courses.map(course => course._id)
        const students = await this.studentdb.find({ enrollments: { $in: courseIds } })
        return students
    }

    async getCategories(): Promise<any> {
        const data = await this.categorydb.find()
        return data
    }

    async updateCourse(id: string, data: any) {
        const result = await this.coursedb.findOneAndUpdate({ _id: id }, data, { new: true })
        return result
    }

    async getInstructorMessages(studentId: string, InstructorId: string) {

        const data = await this.messagedb.find({
            $or: [
                { $and: [{ 'sender._id': studentId.toString() }, { 'recipient._id': InstructorId.toString() }] },
                { $and: [{ 'sender._id': InstructorId.toString() }, { 'recipient._id': studentId.toString() }] }
            ]
        })

        return data
    }
    async courseCounts(courseIds: any): Promise<any> {

        const enrollments = await this.studentdb.aggregate([
            { $match: { enrollments: { $in: courseIds } } },
            { $unwind: "$enrollments" },
            { $group: { _id: "$enrollments", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: "$course" },
            {
                $project: {
                    count: 1,
                    course: 1
                }
            }
        ]);
        console.log(enrollments,'enrollment')
        return enrollments;
    }
    async getEnrollmentDetailsByCourseIds(courseIds: any): Promise<any> {
        const data = await this.enrollmentdb.aggregate([
            {
                $match: { 'EnrolledCourses.courseId': { $in: courseIds } }
            },
            {
                $unwind: "$EnrolledCourses"
            },
            {
                $match: { 'EnrolledCourses.courseId': { $in: courseIds } }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'EnrolledCourses.courseId',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentDetails'
                }
            },
            {
                $unwind: "$studentDetails"

            },
            {
                $project: {
                    _id: 0,
                    studentId: "$studentDetails._id",
                    studentName: "$studentDetails.name",
                    enrollmentDate: "$EnrolledCourses.EnrolledAt",
                    courseId: "$courseDetails._id",
                    title: "$courseDetails.name",
                    courseImage: "$courseDetails.courseImage",
                    price: "$courseDetails.price",
                    progress: "$EnrolledCourses.Progress",
                    completed: "$EnrolledCourses.completed",
                    status: "$EnrolledCourses.status"
                }
            }
        ]).exec()
        console.log(data,'data')
        return data
    }
    async fetchMessageForInstructor(studentIds: [], instructorId: string): Promise<any> {
        const data = await this.messagedb.find({
            $or: [
                { $and: [{ 'sender._id': instructorId.toString() }, { 'recipient._id': { $in: studentIds } }] },
                { $and: [{ 'sender._id': { $in:studentIds } }, { 'recipient._id': instructorId.toString() }] }
            ]
        });
        return data
    }
}    