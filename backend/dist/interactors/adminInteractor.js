"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminInteractor = void 0;
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    async loginAdmin(input, res) {
        const user = await this.repository.login(input);
        const identity = 'Admin';
        if (user) {
            const encryptedPassword = user.password;
            if (encryptedPassword === input.password) {
                await (0, jwt_1.generateToken)(res, user._id.toString(), identity);
                await (0, jwt_1.generateRefreshToken)(res, user._id.toString(), identity);
                return { user };
            }
            else {
                throw new Error('Invalid password');
            }
        }
        else {
            throw new Error('User not found');
        }
    }
    async getStudents() {
        const students = await this.repository.allStudents();
        if (students) {
            return students;
        }
        else {
            throw new Error('No students registered !');
        }
    }
    async getTutors() {
        const tutors = await this.repository.allTutors();
        if (tutors) {
            return tutors;
        }
        else {
            throw new Error('No tutors found');
        }
    }
    async statusChange(input) {
        let block = 'Blocked';
        let unBlock = 'Active';
        const role = input.role;
        if (role === 'Student') {
            if (input.status === 'Active') {
                const status = await this.repository.userStatus(input.id, block);
                return status;
            }
            else {
                const status = await this.repository.userStatus(input.id, unBlock);
                return status;
            }
        }
        else {
            if (input.status === 'Active') {
                const status = await this.repository.tutorStatus(input.id, block);
                return status;
            }
            else {
                const status = await this.repository.tutorStatus(input.id, unBlock);
                return status;
            }
        }
    }
    async getApplications() {
        const data = await this.repository.allApplications();
        return data;
    }
    async courseApproval(id, action) {
        if (action === 'Approve') {
            const data = await this.repository.courseApproveOrReject(id, action);
        }
    }
    async addNewCategory(category, image) {
        const exist = await this.repository.findCategory(category);
        if (exist) {
            throw new Error('Category already exist');
        }
        const update = await this.repository.addCategory(category, image);
        return update;
    }
    async getAllCategories() {
        const data = await this.repository.fetchAllCategories();
        if (data.length) {
            return data;
        }
        throw new Error('No categories found');
    }
    async verifyRefreshToken(token, res) {
        const identity = 'Admin';
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
}
exports.AdminInteractor = AdminInteractor;
