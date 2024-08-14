"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const userEntity_1 = require("../entities/userEntity");
const enrollmentSchema_1 = require("../models/enrollmentSchema");
const courseSchema_1 = require("../models/courseSchema");
const studentSchema_1 = require("../models/studentSchema");
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema_1 = require("../models/categorySchema");
const chatSchema_1 = require("../models/chatSchema");
const instructorSchema_1 = require("../models/instructorSchema");
const reviewModel_1 = require("../models/reviewModel");
class userRepository {
    constructor() {
        this.db = studentSchema_1.studentSchema;
        this.coursedb = courseSchema_1.courseSchema;
        this.enrollmentdb = enrollmentSchema_1.enrollmentSchema;
        this.categorydb = categorySchema_1.categorySchema;
        this.messagedb = chatSchema_1.chatSchema;
        this.instructordb = instructorSchema_1.instructorSchema;
        this.coursereviewdb = reviewModel_1.reviewSchema;
    }
    async create({ name, email, contact, password, profileImage, googleUserId, cart, enrollments }) {
        try {
            const newUser = await this.db.create({ name, email, contact, password, profileImage, googleUserId, cart, enrollments });
            return newUser;
        }
        catch (error) {
            console.log('error happend in userRepository', error);
            throw error;
        }
    }
    async update(id, data) {
        const user = await this.db.findByIdAndUpdate(id, data, { new: true });
        return user;
    }
    async delete(id) {
        const user = await this.db.findByIdAndDelete(id, { new: true }).exec();
        return user;
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.db.findOne({ email });
        return user;
    }
    async findUser(email) {
        const user = await this.db.findOne({ email }).populate('cart.courseId');
        return user;
    }
    async userDetails(email) {
        const user = await this.db.findOne({ email });
        if (!user)
            return null;
        return new userEntity_1.userWithId(user._id, user.name, user.email, user.cart.map((item) => ({
            courseId: new mongoose_1.default.Types.ObjectId(item.courseId.toString()),
        })), user.isBlocked, user.contact, user.googleUserId, user.profileImage, user.status);
    }
    async coursesData() {
        const courses = await this.coursedb.find({ isApproved: 'Approve' }).populate({ path: 'InstructorId' });
        return courses;
    }
    async addToCart(id, studentId) {
        const updateCart = await this.db.findByIdAndUpdate(studentId, { $addToSet: { cart: { courseId: id } } }, { new: true }).populate('cart.courseId');
        return updateCart;
    }
    async findUserWithId(id) {
        try {
            const user = await this.db.findById(id).populate('cart.courseId');
            return user;
        }
        catch (error) {
            console.log(error);
        }
    }
    async enrollment(data) {
        const enroll = await this.enrollmentdb.create(data);
        return enroll;
    }
    async allEnrolledCourses(userId) {
        const courses = await this.enrollmentdb.find({ student: userId }).populate({ path: 'EnrolledCourses', populate: { path: 'courseId', populate: { path: 'InstructorId' } } }).exec();
        return courses;
    }
    async fetchEnrollments(userId) {
        const enrollments = await this.enrollmentdb.find({ student: userId }).populate({ path: 'EnrolledCourses', populate: { path: 'courseId', populate: { path: 'InstructorId' } } }).exec();
        return enrollments;
    }
    async getAllCategories() {
        const data = await this.categorydb.find();
        return data;
    }
    async updateModuleProgress(enrollmentId, courseId, moduleId, progress) {
        const updateResult = await this.enrollmentdb.findOneAndUpdate({ _id: enrollmentId, 'EnrolledCourses.courseId': courseId }, {
            $set: {
                'EnrolledCourses.$[course].modules.$[module].progress': progress
            }
        }, {
            arrayFilters: [
                { 'course.courseId': courseId },
                { 'module.moduleId': moduleId }
            ],
            new: true
        });
        const findEnrollment = await this.enrollmentdb.findOne({ _id: enrollmentId });
        const enrolledCourse = findEnrollment.EnrolledCourses.find((course) => {
            return course.courseId.toString() === courseId;
        });
        const averageProgress = enrolledCourse.modules.reduce((acc, module) => {
            return acc + module.progress;
        }, 0) / enrolledCourse.modules.length;
        const allModulesAbove90 = enrolledCourse.modules.every((module) => module.progress >= 90);
        let update;
        if (allModulesAbove90) {
            update = await this.enrollmentdb.findOneAndUpdate({ _id: enrollmentId, 'EnrolledCourses.courseId': courseId }, {
                $set: {
                    'EnrolledCourses.$[course].Progress': 100,
                    'EnrolledCourses.$[course].completed': true
                }
            }, {
                arrayFilters: [
                    { 'course.courseId': courseId },
                ],
                new: true
            });
            return update;
        }
        else {
            update = await this.enrollmentdb.findOneAndUpdate({ _id: enrollmentId, 'EnrolledCourses.courseId': courseId }, {
                $set: {
                    'EnrolledCourses.$[course].Progress': averageProgress,
                    'EnrolledCourses.$[course].completed': false,
                }
            }, {
                arrayFilters: [
                    { 'course.courseId': courseId },
                ],
                new: true
            });
            return update;
        }
    }
    async getAllMessages(InstructorId, studentId) {
        const data = await this.messagedb.find({
            $or: [
                { $and: [{ 'sender._id': studentId.toString() }, { 'recipient._id': InstructorId.toString() }] },
                { $and: [{ 'sender._id': InstructorId.toString() }, { 'recipient._id': studentId.toString() }] }
            ]
        });
        return data;
    }
    async getAllInstructors() {
        const data = await this.instructordb.find({});
        return data;
    }
    async findInstructorCourses(InstructorId) {
        const data = await this.coursedb.find({ InstructorId: InstructorId });
        return data;
    }
    async addCourseReview(data) {
        const add = await this.coursereviewdb.create(data);
        return add;
    }
    async fetchReviews(courseId) {
        const data = await this.coursereviewdb.find({ courseId: courseId }).populate('courseId').populate('reviewerId');
        return data;
    }
    async findEnrollment(enrollmentId) {
        const data = await this.enrollmentdb.findOne({ _id: enrollmentId });
        return data;
    }
    async enrollmentsUpdate(enrollmentId, data) {
        const enrollment = await this.enrollmentdb.findByIdAndUpdate(enrollmentId, data, { new: true });
        return enrollment;
    }
}
exports.userRepository = userRepository;
