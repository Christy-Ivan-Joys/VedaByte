import { enrollment } from "../entities/enrollmentEntity";
import { user, userWithId } from "../entities/userEntity";
import { iUserRepository } from "../interfaces/iUserRepository";
import { enrollmentSchema } from '../models/enrollmentSchema'
import { courseSchema } from "../models/courseSchema";
import { studentSchema } from "../models/studentSchema";
import mongoose from "mongoose";
import { category } from "../entities/categoryEntity";
import { categorySchema } from "../models/categorySchema";
import { chatSchema } from "../models/chatSchema";
import { message } from "../entities/messageEntity";
import { course, instructor } from "../entities/instructorEntity";
import { instructorSchema } from "../models/instructorSchema";
import { reviewSchema } from "../models/reviewModel";
import { courseReview } from "../entities/reviewEntity";

export class userRepository implements iUserRepository {
    private db: typeof studentSchema;
    private coursedb: typeof courseSchema
    private enrollmentdb: typeof enrollmentSchema
    private categorydb: typeof categorySchema
    private messagedb: typeof chatSchema
    private instructordb: typeof instructorSchema
    private coursereviewdb: typeof reviewSchema
    constructor() {
        this.db = studentSchema
        this.coursedb = courseSchema
        this.enrollmentdb = enrollmentSchema
        this.categorydb = categorySchema
        this.messagedb = chatSchema
        this.instructordb = instructorSchema
        this.coursereviewdb = reviewSchema
    }

    async create({ name, email, contact, password, profileImage, googleUserId, cart, enrollments }: user): Promise<user | null | any> {

        try {
            const newUser = await this.db.create({ name, email, contact, password, profileImage, googleUserId, cart, enrollments })
            return newUser
        } catch (error) {
            console.log('error happend in userRepository', error)
            throw error
        }
    }

    async update(id: string, data: any): Promise<user | null | any> {
        const user = await this.db.findByIdAndUpdate(id, data, { new: true })
        return user
    }

    async delete(id: string): Promise<user | null | any> {
        const user = await this.db.findByIdAndDelete(id, { new: true }).exec()
        return user
    }
    async login(data: any): Promise<user | null | any> {

        const { email, password } = data
        const user = await this.db.findOne({ email })
        return user
    }

    async findUser(email: string): Promise<user | null | any> {

        const user = await this.db.findOne({ email }).populate('cart.courseId')
        return user
    }

    async userDetails(email: string): Promise<userWithId | null | any> {
        const user = await this.db.findOne({ email })
        if (!user) return null

        return new userWithId(
            user._id as any,
            user.name,
            user.email,
            user.cart.map((item: any) => ({
                courseId: new mongoose.Types.ObjectId(item.courseId.toString()),
            })),
            user.isBlocked,
            user.contact,
            user.googleUserId,
            user.profileImage,
            user.status
        )
    }

    async coursesData(): Promise<any> {
        const courses = await this.coursedb.find({ isApproved: 'Approve' }).populate({ path: 'InstructorId' })
        return courses
    }

    async addToCart(id: string, studentId: string): Promise<user | null | any> {

        const updateCart = await this.db.findByIdAndUpdate(studentId, { $addToSet: { cart: { courseId: id } } }, { new: true }).populate('cart.courseId')
        return updateCart
    }

    async findUserWithId(id: string): Promise<user | null | any> {
        try {

            const user = await this.db.findById(id).populate('cart.courseId')
            return user

        } catch (error) {
            console.log(error)
        }
    }

    async enrollment(data: any): Promise<null | any> {

        const enroll = await this.enrollmentdb.create(data)
        return enroll

    }

    async allEnrolledCourses(userId: string): Promise<enrollment[] | any> {
        const courses = await this.enrollmentdb.find({ student: userId }).populate({ path: 'EnrolledCourses', populate: { path: 'courseId', populate: { path: 'InstructorId' } } }).exec();
        return courses
    }
    async fetchEnrollments(userId: string): Promise<enrollment[] | any> {
        const enrollments = await this.enrollmentdb.find({ student: userId }).populate({ path: 'EnrolledCourses', populate: { path: 'courseId', populate: { path: 'InstructorId' } } }).exec()
        return enrollments
    }
    async getAllCategories(): Promise<category[]> {
        const data = await this.categorydb.find()

        return data
    }

    async updateModuleProgress(enrollmentId: string, courseId: string, moduleId: string, progress: number): Promise<enrollment | null | any> {
        const updateResult = await this.enrollmentdb.findOneAndUpdate(
            { _id: enrollmentId, 'EnrolledCourses.courseId': courseId },
            {
                $set: {
                    'EnrolledCourses.$[course].modules.$[module].progress': progress
                }
            },
            {
                arrayFilters: [
                    { 'course.courseId': courseId },
                    { 'module.moduleId': moduleId }
                ],
                new: true
            }
        );

        const findEnrollment: any = await this.enrollmentdb.findOne({ _id: enrollmentId })
        const enrolledCourse = findEnrollment.EnrolledCourses.find((course: any) => {
            return course.courseId.toString() === courseId
        })
        const averageProgress = enrolledCourse.modules.reduce((acc: Number, module: any,) => {
            return acc + module.progress
        }, 0) / enrolledCourse.modules.length

        const allModulesAbove90 = enrolledCourse.modules.every((module: any) => module.progress >= 90);
        let update
        if (allModulesAbove90) {
            update = await this.enrollmentdb.findOneAndUpdate(
                { _id: enrollmentId, 'EnrolledCourses.courseId': courseId },
                {
                    $set: {
                        'EnrolledCourses.$[course].Progress': 100,
                        'EnrolledCourses.$[course].completed': true
                    }
                },
                {
                    arrayFilters: [
                        { 'course.courseId': courseId },
                    ],
                    new: true
                }
            )
            return update
        } else {

            update = await this.enrollmentdb.findOneAndUpdate(
                { _id: enrollmentId, 'EnrolledCourses.courseId': courseId },
                {
                    $set: {
                        'EnrolledCourses.$[course].Progress': averageProgress,
                        'EnrolledCourses.$[course].completed': false,
                    }
                },
                {
                    arrayFilters: [
                        { 'course.courseId': courseId },
                    ],
                    new: true
                }
            )
            return update
        }
    }

    async getAllMessages(InstructorId: string, studentId: string): Promise<message[]> {

        const data = await this.messagedb.find({
            $or: [
                { $and: [{ 'sender._id': studentId.toString() }, { 'recipient._id': InstructorId.toString() }] },
                { $and: [{ 'sender._id': InstructorId.toString() }, { 'recipient._id': studentId.toString() }] }
            ]
        })

        return data
    }
    async getAllInstructors(): Promise<instructor[]> {
        const data = await this.instructordb.find({})
        return data
    }

    async findInstructorCourses(InstructorId: string): Promise<course[] | any> {
        const data = await this.coursedb.find({ InstructorId: InstructorId })
        return data
    }

    async addCourseReview(data: any): Promise<courseReview | any> {
        const add = await this.coursereviewdb.create(data)
        return add
    }
    async fetchReviews(courseId: string): Promise<courseReview[] | any> {
        const data = await this.coursereviewdb.find({ courseId: courseId }).populate('courseId').populate('reviewerId')
        return data
    }
    async findEnrollment(enrollmentId: string): Promise<enrollment | any> {
        const data = await this.enrollmentdb.findOne({ _id: enrollmentId }).populate({ path: 'EnrolledCourses', populate: { path: 'courseId', populate: { path: 'InstructorId' } } }).exec()
        return data
    }
    async enrollmentsUpdate(enrollmentId: string, data: any, options: any = {}): Promise<enrollment | null | any> {
        const enrollment = await this.enrollmentdb.findByIdAndUpdate(enrollmentId, data, { new: true, ...options })
        return enrollment
    }

    // async updateEnrollmentCancel(): Promise<any> {
    //      const cancel = await this.enrollment.findby
    // }
    async fetchMessagesForStudent(studentId: string, instructorIds: []): Promise<any> {
        console.log(studentId,instructorIds)
        const data = await this.messagedb.find({
            $or: [
                { $and: [{ 'sender._id': studentId.toString() }, { 'recipient._id': { $in: instructorIds }}] },
                { $and: [{ 'sender._id': { $in: instructorIds } }, { 'recipient._id': studentId.toString()}] }
            ]
        });
        return data

    }
}                                  