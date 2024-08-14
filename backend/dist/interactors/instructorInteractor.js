"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorInteractor = void 0;
const generateOtp_1 = require("../utils/generateOtp");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const date_1 = require("../utils/Helpers/date");
const { ObjectId } = mongoose_1.default.Types;
class instructorInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    async createInstructor(input) {
        const existingUser = await this.repository.findUser(input.email);
        if (existingUser) {
            throw new Error('User already exist');
        }
        const otp = await (0, generateOtp_1.SendMail)(input.email);
        const user = await this.repository.create(input);
        return { ...user, otp };
    }
    async loginInstructor(data, res) {
        const allDetails = await this.repository.findUser(data.email);
        const identity = 'Instructor';
        if (allDetails) {
            if (allDetails.googleUserId) {
                const token = (0, jwt_1.generateToken)(res, allDetails._id.toString(), identity);
                const accessToken = (0, jwt_1.generateRefreshToken)(res, allDetails._id.toString(), identity);
                return allDetails;
            }
            else if (data.googleUserId && !allDetails.googleUserId) {
                throw new Error('Manual user');
            }
            else {
                //for password user
                const encryptedPassword = allDetails.password;
                const salt = await bcryptjs_1.default.genSalt(10);
                const match = await bcryptjs_1.default.compare(data.password, encryptedPassword);
                if (match) {
                    const token = (0, jwt_1.generateToken)(res, allDetails._id.toString(), identity);
                    const accessToken = (0, jwt_1.generateRefreshToken)(res, allDetails._id.toString(), identity);
                    return allDetails;
                }
                else {
                    throw new Error('Invalid password');
                }
            }
        }
        else {
            throw new Error('User not found');
        }
    }
    async createCourse(input) {
        const course = await this.repository.addCourse(input);
        return course;
    }
    async allCourses(input) {
        const data = await this.repository.fetchCourses(input);
        return data;
    }
    async updateProfileImage(imageURL, user) {
        const instructorId = user._id;
        const update = await this.repository.update(instructorId, { profileImage: imageURL });
        return update;
    }
    async updateProfileDetails(user, details) {
        const userId = user._id;
        if (details.newpassword) {
            //  const salt = await bcrypt.genSalt(10)
            //  const encrypted = await bcrypt.hash(details.newPassword,user.password)
            //  const update = await this.repository.update(userId,{password:details.newpassword})
        }
        else {
            const update = await this.repository.update(userId, {
                name: details.name,
                email: details.email,
                contact: details.contact,
                profession: details.profession
            });
            return update;
        }
    }
    async sendOtp(email) {
        const otp = await (0, generateOtp_1.SendMail)(email);
        return otp;
    }
    async refreshTokenValidation(token, res) {
        const identity = 'Instructor';
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_KEY);
            let Id;
            if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
                Id = decoded.userId;
            }
            const accessToken = (0, jwt_1.generateToken)(res, Id, identity);
            (0, jwt_1.generateRefreshToken)(res, Id, identity);
            return accessToken;
        }
        else {
            throw new Error('No refresh token found');
        }
    }
    async fetchEnrolledStudents(InstructorId) {
        const data = await this.repository.fetchStudents(InstructorId);
        return data;
    }
    async fetchCategories() {
        const data = await this.repository.getCategories();
        if (data.length) {
            return data;
        }
        throw new Error('No categories found');
    }
    async editCourse(id, data) {
        const updateData = {
            name: data.name,
            description: data?.description,
            category: data.category,
            courselevel: data.courselevel,
            price: data.price,
            Introvideo: data.Introvideo,
            courseImage: data.courseImage,
            module: data.module
        };
        const update = await this.repository.updateCourse(id, { $set: updateData });
        return update;
    }
    async fetchInstructorMessages(studentId, InstructorId) {
        const data = await this.repository.getInstructorMessages(studentId, InstructorId);
        if (data.length) {
            const group = data.reduce((acc, message) => {
                const senderId = message?.sender?._id;
                const recipientId = message?.recipient?._id;
                if (!acc['Messages']) {
                    acc['Messages'] = [];
                }
                acc['Messages'].push({
                    text: message.message,
                    CurrentUser: senderId === InstructorId.toString(),
                    Time: (0, date_1.getTimeFromDateTime)(message.Time),
                    type: message.type
                });
                return acc;
            }, {});
            return group;
        }
        throw new Error('No messages found');
    }
    async addQualification(data, InstructorId) {
        const qualification = { degree: data.degree, institution: data.institution };
        const update = await this.repository.update(InstructorId, { $push: { qualifications: qualification } });
        return update;
    }
    async addCertification(data, InstructorId) {
        const certify = { certification: data };
        const update = await this.repository.update(InstructorId, { $push: { certifications: certify } });
        return update;
    }
    async addNewSection(title, description, videoURL, courseId) {
        const newSection = { title, description, videoURL, duration: '' };
        const update = await this.repository.updateCourse(courseId, { $push: { module: newSection } });
        return update;
    }
    async deleteSection(sectionId) {
        const update = await this.repository.updateCourse(sectionId, { $pull: { module: { _id: new ObjectId(sectionId) } } });
        return update;
    }
    async getGraphData(instructorId) {
        const instructorCourses = await this.repository.fetchCourses(instructorId);
        const courseIds = instructorCourses.map(course => course._id);
        const enrollments = await this.repository.courseCounts(courseIds);
        const total = enrollments.reduce((total, course) => {
            const coursePrice = parseInt(course.course.price);
            const revenue = coursePrice * course.count;
            return total + revenue;
        }, 0);
        return { enrollments, total, instructorCourses };
        // const courseEnrollments = await this.repository.         
    }
}
exports.instructorInteractor = instructorInteractor;
