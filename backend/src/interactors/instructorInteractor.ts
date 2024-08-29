import { instructorInteractorInterface } from "../interfaces/iInstructorInteractor";
import { instructorRepositoryInterface } from "../interfaces/iInstructorRepository";
import { course, instructor } from "../entities/instructorEntity";
import { SendMail } from "../utils/generateOtp";
import bcrypt from 'bcryptjs'
import { generateRefreshToken, generateToken } from "../utils/jwt";
import { Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { getTimeFromDateTime } from "../utils/Helpers/date";
import { user } from "../entities/userEntity";
const { ObjectId } = mongoose.Types;

export class instructorInteractor implements instructorInteractorInterface {
    private repository: instructorRepositoryInterface;
    constructor(repository: instructorRepositoryInterface) {
        this.repository = repository
    }

    async createInstructor(input: any) {
        const existingUser = await this.repository.findUser(input.email)
        if (existingUser) {
            throw new Error('User already exist')
        }
        const otp = await SendMail(input.email)
        const user = await this.repository.create(input)
        return { ...user, otp }
    }

    async loginInstructor(data: any, res: Response) {

        const allDetails = await this.repository.findUser(data.email)
        const identity = 'Instructor'
        if (allDetails) {
            if (allDetails.googleUserId) {
                const token = generateToken(res, allDetails._id.toString(), identity)
                const accessToken = generateRefreshToken(res, allDetails._id.toString(), identity)
                return allDetails
            } else if (data.googleUserId && !allDetails.googleUserId) {
                throw new Error('Manual user')
            } else {
                //for password user
                const encryptedPassword: any = allDetails.password
                const salt = await bcrypt.genSalt(10)
                const match = await bcrypt.compare(data.password, encryptedPassword)
                if (match) {
                    const token = generateToken(res, allDetails._id.toString(), identity)
                    const accessToken = generateRefreshToken(res, allDetails._id.toString(), identity)
                    return allDetails
                } else {

                    throw new Error('Invalid password')
                }
            }
        } else {
            throw new Error('User not found')
        }
    }
    async createCourse(input: any) {

        const course = await this.repository.addCourse(input)
        return course
    }
    async allCourses(input: string): Promise<any | Array<course>> {
        const data: any = await this.repository.fetchCourses(input)
        const sortedData = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log(sortedData)
        return sortedData
    }
    async updateProfileImage(imageURL: string, user: any) {
        const instructorId = user._id
        const update = await this.repository.update(instructorId, { profileImage: imageURL })
        return update
    }

    async updateProfileDetails(user: any, details: any) {

        const userId = user._id
        if (details.newpassword) {

            //  const salt = await bcrypt.genSalt(10)
            //  const encrypted = await bcrypt.hash(details.newPassword,user.password)
            //  const update = await this.repository.update(userId,{password:details.newpassword})
        } else {
            const update = await this.repository.update(userId,
                {
                    name: details.name,
                    email: details.email,
                    contact: details.contact,
                    profession: details.profession
                })

            return update

        }

    }
    async sendOtp(email: string) {
        const otp = await SendMail(email)
        return otp
    }
    async refreshTokenValidation(token: string, res: Response) {
        const identity = 'Instructor'

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY as string)
            let Id
            if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
                Id = decoded.userId
            }
            const accessToken = generateToken(res, Id, identity)
            generateRefreshToken(res, Id, identity)
            return accessToken

        } else {
            throw new Error('No refresh token found')
        }
    }
    async fetchEnrolledStudents(InstructorId: string) {

        const data = await this.repository.fetchStudents(InstructorId)
        return data
    }
    async fetchCategories() {
        const data = await this.repository.getCategories()
        if (data.length) {
            return data
        }
        throw new Error('No categories found')
    }
    async editCourse(id: string, data: any) {
        const updateData = {
            name: data.name,
            description: data?.description,
            category: data.category,
            courselevel: data.courselevel,
            price: data.price,
            Introvideo: data.Introvideo,
            courseImage: data.courseImage,
            module: data.module
        }
        const update = await this.repository.updateCourse(id, { $set: updateData })
        console.log(update)
        return update
    }

    async fetchInstructorMessages(studentId: string, InstructorId: string) {
        const data = await this.repository.getInstructorMessages(studentId, InstructorId)
        if (data.length) {
            const group = data.reduce((acc: any, message: any) => {
                const senderId = message?.sender?._id
                const recipientId = message?.recipient?._id
                if (!acc['Messages']) {
                    acc['Messages'] = []
                }
                acc['Messages'].push({
                    text: message.message,
                    CurrentUser: senderId === InstructorId.toString(),
                    Time: getTimeFromDateTime(message.Time),
                    type: message.type
                })
                return acc
            }, {})
            return group
        }
        throw new Error('No messages found')
    }

    async addQualification(data: any, InstructorId: string) {
        const qualification = { degree: data.degree, institution: data.institution }
        const update = await this.repository.update(InstructorId, { $push: { qualifications: qualification } })
        return update
    }

    async addCertification(data: any, InstructorId: string) {
        const certify = { certification: data }
        const update = await this.repository.update(InstructorId, { $push: { certifications: certify } })
        return update
    }

    async addNewSection(title: string, description: string, videoURL: string, courseId: string): Promise<course> {
        const newSection = { title, description, videoURL, duration: '' }
        const update = await this.repository.updateCourse(courseId, { $push: { module: newSection } })
        return update

    }

    async deleteSection(sectionId: string): Promise<course> {
        const update = await this.repository.updateCourse(sectionId, { $pull: { module: { _id: new ObjectId(sectionId) } } })
        return update
    }

    async getGraphData(instructorId: string): Promise<any> {
        
        const instructorCourses: course[] = await this.repository.fetchCourses(instructorId)
        const courseIds = instructorCourses.map(course => course._id)
        const enrollments = await this.repository.courseCounts(courseIds)
        const total = enrollments.reduce((total: number, course: any) => {
            const coursePrice = parseInt(course.course.price)
            const revenue = coursePrice * course.count
            return total + revenue
        }, 0)
        const enrollmentDetails = await this.repository.getEnrollmentDetailsByCourseIds(courseIds);
        return { enrollments, total, instructorCourses, enrollmentDetails }
    }
    async instructorMessages(instructorId: string): Promise<any> {
        const data = await this.repository.fetchStudents(instructorId)
        const students = data
        const studentIds = students.map((student:user)=> student._id.toString())
        console.log(studentIds)
        const messages = await this.repository.fetchMessageForInstructor(studentIds,instructorId)
        console.log(messages,'instructor messages')
        return messages
    }
}      

