"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.course = exports.InstructorWithId = exports.instructor = void 0;
class instructor {
    constructor(_id, name, email, contact, password, googleUserId, profileImage, qualifications, certifications, profession) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.password = password;
        this.googleUserId = googleUserId;
        this.profileImage = profileImage;
        this.qualifications = qualifications;
        this.certifications = certifications;
        this.profession = profession;
    }
}
exports.instructor = instructor;
class InstructorWithId {
    constructor(_id, name, email, contact, profileImage, googleUserId) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.profileImage = profileImage;
        this.googleUserId = googleUserId;
    }
}
exports.InstructorWithId = InstructorWithId;
class course {
    constructor(_id, name, category, description, courseImage, price, courselevel, Introvideo, isApproved, module, InstructorId) {
        this._id = _id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.courseImage = courseImage;
        this.price = price;
        this.courselevel = courselevel;
        this.Introvideo = Introvideo;
        this.isApproved = isApproved;
        this.module = module;
        this.InstructorId = InstructorId;
    }
}
exports.course = course;
