"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInteractor = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const generateOtp_1 = require("../utils/generateOtp");
const stripe_1 = require("stripe");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const date_1 = require("../utils/Helpers/date");
const errorResponse_1 = __importDefault(require("../utils/Helpers/errorResponse"));
const errorResponse_2 = require("../utils/Helpers/errorResponse");
const secret = process.env.STRIPE_SECRET_KEY;
class userInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    async createUser(input) {
        const existingUser = await this.repository.findUser(input.email);
        if (existingUser) {
            throw new errorResponse_1.default('User already exist', errorResponse_2.HttpStatusCodes.BAD_REQUEST);
        }
        const otp = await (0, generateOtp_1.SendMail)(input.email);
        const user = await this.repository.create(input);
        return { user, otp };
    }
    async userLogin(data, res) {
        const existingUser = await this.repository.findUser(data.email);
        const identity = 'Student';
        if (existingUser) {
            if (existingUser.googleUserId) {
                const user = await this.repository.findUser(data.email);
                //for google user
                const accessToken = (0, jwt_1.generateToken)(res, user._id.toString(), identity);
                const refreshToken = (0, jwt_1.generateRefreshToken)(res, user._id.toString(), identity);
                return { user, accessToken };
            }
            else {
                //for password user
                const encryptedPassword = existingUser.password;
                const match = await bcryptjs_1.default.compare(data.password, encryptedPassword);
                if (match) {
                    const user = await this.repository.findUser(data.email);
                    console.log(user, 'in user match ');
                    (0, jwt_1.generateToken)(res, user._id.toString(), identity);
                    (0, jwt_1.generateRefreshToken)(res, user._id.toString(), identity);
                    return { user };
                }
                else {
                    throw new errorResponse_1.default('Invalid password', errorResponse_2.HttpStatusCodes.UNAUTHORIZED);
                }
            }
        }
        else {
            throw new errorResponse_1.default('User not found', errorResponse_2.HttpStatusCodes.NOT_FOUND);
        }
    }
    async sendOtp(email, req) {
        const otp = await (0, generateOtp_1.SendMail)(email);
        req.session.otp = otp;
        return otp;
    }
    async allCourses() {
        const data = await this.repository.coursesData();
        if (data !== null) {
            return data;
        }
        else {
            throw Error('No courses to show');
        }
    }
    async addNewCartItem(input) {
        const Id = input.id;
        const studentId = input.studentId;
        const user = await this.repository.findUserWithId(studentId);
        if (!user) {
            throw new Error('Student not found');
        }
        const courseId = mongoose_1.Types.ObjectId.createFromHexString(Id);
        const AlreadyEnrolled = user.enrollments.find((course) => {
            return course?.equals(courseId);
        });
        if (AlreadyEnrolled) {
            throw new Error('Course already enrolled');
        }
        const CourseExist = user.cart?.find((course) => {
            return course.courseId.equals(Id);
        });
        if (CourseExist) {
            throw new Error('Course already added in cart');
        }
        const data = await this.repository.addToCart(Id, studentId);
        return data;
    }
    async checkoutSession(products, userId) {
        const user = await this.repository.findUserWithId(userId);
        if (!user?.cart.length) {
            throw new Error('Cart is Empty');
        }
        const items = products.map((item) => {
            return item.courseId;
        });
        const product = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                    images: [item.courseImage],
                },
                unit_amount: Math.round(parseInt(item.price)) * 100,
            },
            quantity: 1
        }));
        const stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: product,
            mode: "payment",
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/success"
        });
        console.log('session idddd');
        return session.id;
    }
    async enrollCourse(id, total) {
        try {
            const user = await this.repository.findUserWithId(id);
            const cart = user?.cart;
            if (user?.cart.length) {
                const enrolledCourses = cart?.map(course => {
                    const modules = course.courseId;
                    return {
                        courseId: course.courseId,
                        progress: 0,
                        completed: false,
                        EnrolledAt: new Date(),
                        modules: modules.module.map((section) => {
                            return {
                                moduleId: section._id,
                                progress: 0,
                                IsCompleted: false
                            };
                        })
                    };
                });
                const CoruseIDs = enrolledCourses?.map((course) => {
                    return course.courseId._id;
                });
                const update = await this.repository.update(id, { $push: { enrollments: CoruseIDs } });
                const Total = parseInt(total);
                if (enrolledCourses) {
                    const data = { student: id, EnrolledCourses: enrolledCourses, Total: Total };
                    const enroll = await this.repository.enrollment(data); //add to the enrollments collection
                }
                const data = await this.repository.update(id, { cart: [] });
                return data;
            }
        }
        catch (error) {
            console.log(error, 'error in enrll inter');
        }
    }
    async passwordChange(newPassword, currentPassword, userId) {
        const user = await this.repository.findUserWithId(userId);
        if (user) {
            const encryptedPassword = user.password;
            const salt = await bcryptjs_1.default.genSalt(10);
            const match = await bcryptjs_1.default.compare(currentPassword, encryptedPassword);
            if (match) {
                const encrypted = await bcryptjs_1.default.hash(newPassword, salt);
                const changePassword = await this.repository.update(userId, { password: encrypted });
                return user;
            }
            else {
                throw new Error('Current password is wrong');
            }
        }
        else {
            throw new Error('User not found');
        }
    }
    async changeProfileImage(url, userId) {
        const updateImage = await this.repository.update(userId, { profileImage: url });
        return updateImage;
    }
    async updateProfileDetails(user, details) {
        const updateDetails = await this.repository.update(user._id, { name: details.name, email: details.email, contact: details.contact });
        return updateDetails;
    }
    async verifyRefreshToken(token, res) {
        const identity = 'Student';
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_KEY);
            let Id;
            if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
                Id = decoded.userId;
                console.log(Id);
            }
            const accessToken = (0, jwt_1.generateToken)(res, Id, identity);
            (0, jwt_1.generateRefreshToken)(res, Id, identity);
            return accessToken;
        }
        else {
            throw new Error('No refresh token found');
        }
    }
    async removeCartItem(userId, ItemId) {
        const update = await this.repository.update(userId, { $pull: { cart: { courseId: ItemId } } });
        return update;
    }
    async fetchEnrolledCourses(userId) {
        const data = await this.repository.allEnrolledCourses(userId);
        if (data?.length) {
            let enrolledCourses = [];
            const courses = data.map((course) => {
                const coursesPurchased = course.EnrolledCourses.map((course) => {
                    enrolledCourses.push(course);
                });
            });
            enrolledCourses.sort((a, b) => {
                return new Date(b.EnrolledAt).getTime() - new Date(a.EnrolledAt).getTime();
            });
            return enrolledCourses;
        }
        throw new Error('No enrollments for the student');
    }
    async fetchAllEnrollments(userId) {
        const data = await this.repository.fetchEnrollments(userId);
        return data;
    }
    async fetchAllCategories() {
        const data = await this.repository.getAllCategories();
        if (data.length) {
            return data;
        }
        throw new Error('No categories found');
    }
    async updateModuleProgress(data, userId) {
        const moduleId = data.moduleId;
        const progress = data.progress;
        const courseId = data.courseId;
        let Enrollment;
        const enrollments = await this.repository.allEnrolledCourses(userId);
        const update = enrollments?.map((enrollment) => {
            enrollment.EnrolledCourses.map((course) => {
                if (course.courseId._id.toString() === courseId) {
                    Enrollment = enrollment;
                }
            });
        });
        if (Enrollment) {
            const update = await this.repository.updateModuleProgress(Enrollment._id, courseId, moduleId, progress);
            return update;
        }
    }
    async fetchAllMessages(InstructorId, studentId) {
        const data = await this.repository.getAllMessages(InstructorId, studentId);
        if (data.length) {
            // const sortedData = data.sort((a: any, b: any) => new Date(b.Time).getTime() - new Date(a.Time).getTime())
            // console.log(sortedData,'sorteddataaaaaa')
            const group = data.reduce((acc, message) => {
                const senderId = message?.sender?._id;
                const recipientId = message?.recipient?._id;
                if (!acc['Messages']) {
                    acc['Messages'] = [];
                }
                acc['Messages'].push({
                    text: message.message,
                    CurrentUser: senderId === studentId.toString(),
                    Time: (0, date_1.getTimeFromDateTime)(message.Time),
                    type: message.type
                });
                return acc;
            }, {});
            return group;
        }
        throw new Error('No messages found');
    }
    async fetchAllTutors() {
        const data = await this.repository.getAllInstructors();
        return data;
    }
    async getAllCourses(InstructorId) {
        const data = await this.repository.findInstructorCourses(InstructorId);
        return data;
    }
    async postCourseReview(data) {
        const response = await this.repository.addCourseReview(data);
        const updateUser = await this.repository.update(data.reviewerId, { $push: { reviews: data.courseId } });
        return updateUser;
    }
    async getCourseReviews(courseId) {
        const data = await this.repository.fetchReviews(courseId);
        return data;
    }
    async updateUser(id, data) {
        return this.repository.update(id, data);
    }
    async deleteUser(id) {
        return this.repository.delete(id);
    }
    async getUser(id) {
        return this.repository.findUser(id);
    }
    async cancelEnrollment(data) {
        const enrollment = await this.repository.findEnrollment(data.enrollmentId);
        console.log(enrollment, 'enrollment');
        const courseWithHighProgress = enrollment?.EnrolledCourses?.filter((course) => {
            return data?.selectedCourses?.includes(course?.courseId) && course?.Progress > 20;
        });
        if (courseWithHighProgress?.length > 0) {
            throw new Error('Cannot cancel courses progressed above 20%');
        }
        //  const change = await this.repository.updateMany(
        //     { _id: data.enrollmentId, "EnrolledCourses.courseId": { $in: data.selectedCourses } },
        //     { $set: { "EnrolledCourses.$[elem].status": false } },
        //     { arrayFilters: [{ "elem.courseId": { $in: data.selectedCourses } }] }
        // );        console.log(change,'change')
        const userUpdate = await this.repository.update(data.userId, { $pull: { $in: data.selectedCourses } });
        console.log(userUpdate, 'userUpdateteeeeeee');
        return userUpdate;
    }
}
exports.userInteractor = userInteractor;
