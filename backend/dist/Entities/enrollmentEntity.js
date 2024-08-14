"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollment = void 0;
class enrollment {
    constructor(_id, student, EnrolledCourses, Total) {
        this._id = _id;
        this.student = student;
        this.EnrolledCourses = EnrolledCourses;
        this.Total = Total;
    }
}
exports.enrollment = enrollment;
