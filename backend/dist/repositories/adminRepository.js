"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const adminSchema_1 = require("../models/adminSchema");
const categorySchema_1 = require("../models/categorySchema");
const courseSchema_1 = require("../models/courseSchema");
const instructorSchema_1 = require("../models/instructorSchema");
const studentSchema_1 = require("../models/studentSchema");
class AdminRepository {
    constructor() {
        this.db = adminSchema_1.adminSchema;
        this.studentsDB = studentSchema_1.studentSchema;
        this.tutorDB = instructorSchema_1.instructorSchema;
        this.courseDB = courseSchema_1.courseSchema;
        this.categoryDB = categorySchema_1.categorySchema;
    }
    async login({ email, password }) {
        const user = await this.db.findOne({ email });
        return user;
    }
    async allStudents() {
        const data = await this.studentsDB.find();
        return data;
    }
    async allTutors() {
        const data = await this.tutorDB.find();
        return data;
    }
    async userStatus(id, status) {
        const update = await this.studentsDB.findByIdAndUpdate(id, { status }, { new: true });
        return update;
    }
    async tutorStatus(id, status) {
        const update = await this.tutorDB.findByIdAndUpdate(id, { status }, { new: true });
        return update;
    }
    async allApplications() {
        const applications = await this.courseDB.find({ isApproved: 'pending' }).populate('InstructorId');
        return applications;
    }
    async courseApproveOrReject(id, action) {
        const update = await this.courseDB.findByIdAndUpdate(id, { isApproved: action }, { new: true });
        return update;
    }
    async addCategory(category, image) {
        const update = await this.categoryDB.create({ category: category, categoryImage: image });
        return update;
    }
    async findCategory(categoryName) {
        const category = await this.categoryDB.findOne({ category: categoryName });
        return category;
    }
    async fetchAllCategories() {
        const categories = await this.categoryDB.find();
        return categories;
    }
}
exports.AdminRepository = AdminRepository;
