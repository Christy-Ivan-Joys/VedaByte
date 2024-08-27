"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorRepository = void 0;
const instructorEntity_1 = require("../entities/instructorEntity");
const instructorSchema_1 = require("../models/instructorSchema");
const courseSchema_1 = require("../models/courseSchema");
const studentSchema_1 = require("../models/studentSchema");
const categorySchema_1 = require("../models/categorySchema");
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema_1 = require("../models/chatSchema");
const enrollmentSchema_1 = require("../models/enrollmentSchema");
const { ObjectId } = mongoose_1.default.Types;
class instructorRepository {
    constructor() {
        this.db = instructorSchema_1.instructorSchema;
        this.coursedb = courseSchema_1.courseSchema;
        this.studentdb = studentSchema_1.studentSchema;
        this.categorydb = categorySchema_1.categorySchema;
        this.messagedb = chatSchema_1.chatSchema;
        this.enrollmentdb = enrollmentSchema_1.enrollmentSchema;
    }
    async create({ name, email, contact, password, googleUserId, profileImage }) {
        const instructor = await this.db.create({ name, email, password, contact, googleUserId, profileImage });
        return instructor;
    }
    async findUser(email) {
        const user = await this.db.findOne({ email });
        return user;
    }
    async UserDetails(email) {
        const user = await this.db.findOne({ email });
        if (!user)
            return null;
        return new instructorEntity_1.InstructorWithId(user._id, user.name, user.email, user.contact, user.googleUserId, user.profileImage);
    }
    async addCourse({ _id, category, description, price, courseImage, Introvideo, courselevel, InstructorId, name, module }) {
        const course = await this.coursedb.create({ category, description, price, courselevel, InstructorId, courseImage, Introvideo, name, module });
        return course;
    }
    async fetchCourses(data) {
        const courses = await this.coursedb.find({ InstructorId: data });
        return courses;
    }
    async update(id, data) {
        try {
            const result = await this.db.findByIdAndUpdate(id, data, { new: true });
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
    async fetchStudents(InstructorId) {
        const courses = await this.coursedb.find({ InstructorId }).select('_id');
        const courseIds = courses.map(course => course._id);
        const students = await this.studentdb.find({ enrollments: { $in: courseIds } });
        return students;
    }
    async getCategories() {
        const data = await this.categorydb.find();
        return data;
    }
    async updateCourse(id, data) {
        const result = await this.coursedb.findOneAndUpdate({ _id: id }, data, { new: true });
        console.log(result);
        return result;
    }
    async getInstructorMessages(studentId, InstructorId) {
        const data = await this.messagedb.find({
            $or: [
                { $and: [{ 'sender._id': studentId.toString() }, { 'recipient._id': InstructorId.toString() }] },
                { $and: [{ 'sender._id': InstructorId.toString() }, { 'recipient._id': studentId.toString() }] }
            ]
        });
        return data;
    }
    async courseCounts(courseIds) {
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
        return enrollments;
    }
    async getEnrollmentDetailsByCourseIds(courseIds) {
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
        ]).exec();
        return data;
    }
}
exports.instructorRepository = instructorRepository;
