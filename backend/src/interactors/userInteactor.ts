import { iUserInteractor } from "../interfaces/iUserInteractor";
import { iUserRepository } from "../interfaces/iUserRepository";
import bcrypt from 'bcryptjs'
import { generateToken, generateRefreshToken } from "../utils/jwt";
import { Response, Request } from "express";
import { user } from "../entities/userEntity";
import { SendMail } from "../utils/generateOtp";
import { course, instructor } from "../entities/instructorEntity";
import { Product, cartItem, enrolledCourses, section } from "../types";
import { Stripe } from 'stripe'
import jwt from 'jsonwebtoken'
import { Types } from "mongoose";
import { getTimeFromDateTime } from "../utils/Helpers/date";
import { courseReview } from "../entities/reviewEntity";
import ErrorResponse from "../utils/Helpers/errorResponse";
import { HttpStatusCodes } from "../utils/Helpers/errorResponse";
import { Paginate } from "../utils/Helpers/Pagination";
import dotenv from 'dotenv'
dotenv.config()
const secret = process.env.STRIPE_SECRET_KEY as any
export class userInteractor implements iUserInteractor {
    private repository: iUserRepository;
    constructor(repository: iUserRepository) {
        this.repository = repository
    }

    async createUser(input: any): Promise<user | any> {

        const existingUser = await this.repository.findUser(input.email)
        if (existingUser) {
            throw new ErrorResponse('User already exist', HttpStatusCodes.BAD_REQUEST)
        }
        const otp = await SendMail(input.email)
        const user = await this.repository.create(input)
        return { user, otp }
    }

    async userLogin(data: any, res: Response) {
        const existingUser = await this.repository.findUser(data.email)
        const identity = 'Student'
        if (existingUser.isBlocked) {
            throw new Error('User is blocked')
        }
        if (existingUser) {
            if (existingUser.googleUserId) {
                const user: user = await this.repository.findUser(data.email)
                //for google user
                const accessToken = generateToken(res, user._id.toString(), identity)
                const refreshToken = generateRefreshToken(res, user._id.toString(), identity)
                return { user, accessToken }

            } else {
                //for password user
                const encryptedPassword: any = existingUser.password
                const match = await bcrypt.compare(data.password, encryptedPassword)

                if (match) {
                    const user: user = await this.repository.findUser(data.email)
                    generateToken(res, user._id.toString(), identity)
                    generateRefreshToken(res, user._id.toString(), identity)
                    return { user }
                } else {
                    throw new ErrorResponse('Invalid password', HttpStatusCodes.UNAUTHORIZED)
                }
            }
        } else {
            throw new ErrorResponse('User not found', HttpStatusCodes.NOT_FOUND);
        }
    }

    async sendOtp(email: string, req: Request): Promise<string> {
        const otp = await SendMail(email)
        req.session.otp = otp
        return otp
    }

    async allCourses(user: user, pageData: { page: number, limit: number }) {
        const data = await this.repository.coursesData();
        if (!data) {
            throw new Error('No courses to show');
        }
        const result: any = data.map((course: any) => {
            const courseObj = course.toObject();
            if (!user || (Object.keys(user).length === 0 && user.constructor === Object)) {
                courseObj.module = courseObj.module?.map((section: section) => {
                    const { videoURL, ...sectionData } = section;
                    return sectionData;
                });
            } else {
                const isEnrolled = user.enrollments.includes(courseObj._id.toString());
                if (!isEnrolled) {
                    courseObj.module = courseObj.module?.map((section: section) => {
                        const { videoURL, ...sectionData } = section;
                        return sectionData;
                    });
                }
            }
            return courseObj
        });

        if (pageData.page === 0 && pageData.limit === 0) {
            return result
        }
        const paginateData = Paginate(result, pageData.page, pageData.limit)
        return paginateData
    }

    async addNewCartItem(input: any) {
        const Id = input.id
        const studentId = input.studentId
        const user = await this.repository.findUserWithId(studentId)
        if (!user) {
            throw new Error('Student not found')
        }
        const courseId = Types.ObjectId.createFromHexString(Id)
        const AlreadyEnrolled = user.enrollments.find((course) => {
            return course?.equals(courseId)
        })

        if (AlreadyEnrolled) {
            throw new Error('Course already enrolled')
        }
        const CourseExist = user.cart?.find((course) => {
            return course.courseId.equals(Id)

        })

        if (CourseExist) {
            throw new Error('Course already added in cart')
        }
        const data = await this.repository.addToCart(Id, studentId)
        return data
    }

    async checkoutSession(products: cartItem[], userId: string) {

        const user = await this.repository.findUserWithId(userId)
        if (!user?.cart.length) {
            throw new Error('Cart is Empty')
        }

        const items = products.map((item: Product) => {
            return item.courseId
        })
        const product = items.map((item: course) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                    images: [item.courseImage],
                },
                unit_amount: Math.round(parseInt(item.price)) * 100,
            },
            quantity: 1
        }))
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-04-10' })
        console.log(process.env.NODE_ENV, process.env.STRIPE_SECRET_KEY)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: product,
            mode: "payment",
            success_url: process.env.NODE_ENV === 'production'
                ? 'https://vedabyte.christyivanjoys.live/success?session_id={CHECKOUT_SESSION_ID}'
                : 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: process.env.NODE_ENV === 'production'
                ? 'https://vedabyte.christyivanjoys.live/cart'
                : 'http://localhost:3000/cart',

        })
        return session.id
    }

    async enrollCourse(id: string, total: string) {
        try {
            const user = await this.repository.findUserWithId(id)
            const cart = user?.cart
            if (user?.cart.length) {
                const enrolledCourses = cart?.map(course => {
                    const modules = course.courseId as any
                    return {
                        courseId: course.courseId,
                        progress: 0,
                        completed: false,
                        EnrolledAt: new Date(),
                        modules: modules.module.map((section: any) => {
                            return {
                                moduleId: section._id,
                                progress: 0,
                                IsCompleted: false
                            }
                        })
                    }
                })
                const CoruseIDs = enrolledCourses?.map((course) => {
                    return course.courseId._id

                })
                const update = await this.repository.update(id, { $push: { enrollments: CoruseIDs } })
                const Total = parseInt(total)
                if (enrolledCourses) {
                    const data = { student: id, EnrolledCourses: enrolledCourses, Total: Total }
                    const enroll: any = await this.repository.enrollment(data) //add to the enrollments collection
                }
                const data = await this.repository.update(id, { cart: [] })
                return data
            }
        } catch (error) {
            console.log(error, 'error in enrll inter')
        }
    }
    async passwordChange(newPassword: string, currentPassword: string, userId: string): Promise<user> {
        const user = await this.repository.findUserWithId(userId)
        if (user) {
            const encryptedPassword: any = user.password
            const salt = await bcrypt.genSalt(10)
            const match = await bcrypt.compare(currentPassword, encryptedPassword)
            if (match) {
                const encrypted = await bcrypt.hash(newPassword, salt)
                const changePassword = await this.repository.update(userId, { password: encrypted })
                return user
            } else {
                throw new Error('Current password is wrong')
            }
        } else {
            throw new Error('User not found')
        }
    }

    async changeProfileImage(url: string, userId: string): Promise<user | null> {

        const updateImage = await this.repository.update(userId, { profileImage: url })
        return updateImage

    }

    async updateProfileDetails(user: any, details: any): Promise<user | null> {
        const updateDetails = await this.repository.update(user._id, { name: details.name, email: details.email, contact: details.contact })
        return updateDetails
    }

    async verifyRefreshToken(token: string, res: Response) {
        const identity = 'Student'
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY as string)
            let Id
            if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
                Id = decoded.userId
                console.log(Id)
            }
            const accessToken = generateToken(res, Id, identity)
            generateRefreshToken(res, Id, identity)
            return accessToken

        } else {
            throw new Error('No refresh token found')
        }
    }

    async removeCartItem(userId: string, ItemId: string): Promise<user | null> {

        const update = await this.repository.update(userId, { $pull: { cart: { courseId: ItemId } } })
        return update

    }

    async fetchEnrolledCourses(userId: string) {

        const data = await this.repository.allEnrolledCourses(userId)
        if (data?.length) {
            let enrolledCourses: enrolledCourses[] = []
            const courses = data.map((course) => {
                const coursesPurchased = course.EnrolledCourses.map((course) => {
                    if (course.status === true) {
                        enrolledCourses.push(course)
                    }
                })
            })

            enrolledCourses.sort((a, b) => {
                return new Date(b.EnrolledAt).getTime() - new Date(a.EnrolledAt).getTime();
            });

            return enrolledCourses
        }
        throw new Error('No enrollments for the student')
    }

    async fetchAllEnrollments(userId: string) {
        const data = await this.repository.fetchEnrollments(userId)
        return data
    }

    async fetchAllCategories() {
        const data = await this.repository.getAllCategories()
        if (data.length) {
            return data
        }
        throw new Error('No categories found')
    }

    async updateModuleProgress(data: any, userId: string) {
        const moduleId = data.moduleId
        const progress = data.progress
        const courseId = data.courseId
        let realProgress: any
        let Enrollment: any
        const enrollments = await this.repository.allEnrolledCourses(userId)
        const update = enrollments?.map((enrollment) => {
            enrollment.EnrolledCourses.map((course: any) => {
                if (course.courseId._id.toString() === courseId) {
                    Enrollment = enrollment
                    course.modules.map((section: any) => {
                        console.log(section, moduleId)
                        if (section.moduleId.toString() === moduleId) {
                            realProgress = section.progress
                        }
                    })
                }
            })
        })
        if (Enrollment && progress > realProgress) {
            console.log('inside')
            const update = await this.repository.updateModuleProgress(Enrollment._id, courseId, moduleId, progress)
            return update
        }
    }

    async fetchAllMessages(InstructorId: string, studentId: string) {
        const data = await this.repository.getAllMessages(InstructorId, studentId)

        if (data.length) {
            const group = data.reduce((acc: any, message: any) => {
                const senderId = message?.sender?._id
                const recipientId = message?.recipient?._id
                if (!acc['Messages']) {
                    acc['Messages'] = []
                }
                acc['Messages'].push({
                    text: message.message,
                    CurrentUser: senderId === studentId.toString(),
                    Time: getTimeFromDateTime(message.Time),
                    type: message.type,
                    sender: message.sender,
                    recipient: message.recipient
                })
                return acc
            }, {})
            const sortedData = data.sort((a: any, b: any) => new Date(b.Time).getTime() - new Date(a.Time).getTime())
            console.log(group, 'this is group')
            return { group, sortedData }
        }
        throw new Error('No messages found')
    }

    async fetchAllTutors(): Promise<instructor[]> {
        const data = await this.repository.getAllInstructors()
        return data
    }
    async getAllCourses(InstructorId: string): Promise<course[]> {
        const data = await this.repository.findInstructorCourses(InstructorId)
        return data
    }

    async postCourseReview(data: any): Promise<user | null> {
        const response = await this.repository.addCourseReview(data)
        const updateUser = await this.repository.update(data.reviewerId, { $push: { reviews: data.courseId } })
        return updateUser

    }
    async getCourseReviews(courseId: string): Promise<courseReview[]> {
        const data = await this.repository.fetchReviews(courseId)
        return data
    }
    async updateUser(id: string, data: any) {
        return this.repository.update(id, data)
    }

    async deleteUser(id: string) {
        return this.repository.delete(id)
    }
    async getUser(id: string) {
        return this.repository.findUser(id)
    }

    async cancelEnrollment(data: any): Promise<any> {
        const enrollment = await this.repository.findEnrollment(data.enrollmentId)
        let coursesToCancel: any = []
        enrollment?.EnrolledCourses.filter((course) => {
            if (data.selectedCourses.includes(course.courseId._id.toString())) {
                coursesToCancel.push(course.courseId)
            }
        })
        const totalReturnFund = coursesToCancel?.reduce((total: number, course: course) => {
            return parseInt(course.price)
        }, 0)
        const change = await this.repository.enrollmentsUpdate(data.enrollmentId,
            { $set: { "EnrolledCourses.$[elem].status": false } },
            { arrayFilters: [{ "elem.courseId": { $in: data.selectedCourses } }] }
        )
        const userUpdate = await this.repository.update(data.userId,
            {
                $pull: { enrollments: { $in: data.selectedCourses } },
                $inc: { wallet: totalReturnFund }
            })
        return userUpdate
    }
    async makeWalletIntent(amount: number): Promise<any> {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-04-10' })
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            payment_method_types: ['card'],
            description: 'Wallet Addition',
        })
        return paymentIntent
    }

    async addMoneyToWallet(amount: number, userId: string): Promise<user | null | any> {
        const data = await this.repository.update(userId, { $inc: { wallet: amount } })
        return data
    }

    async allWalletTransactions(): Promise<any> {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-04-10' })
        const paymentIntents = await stripe.paymentIntents.list({

        })
        const walletPayments = paymentIntents.data.filter(intent => {
            return intent.description === 'Wallet Addition'
        })
        return { transactions: paymentIntents.data, wallet: walletPayments }
    }
    async getStudentMessages(studentId: string, instructorIds: []): Promise<any> {
        const data = await this.repository.fetchMessagesForStudent(studentId, instructorIds)
        return data
    }
}


