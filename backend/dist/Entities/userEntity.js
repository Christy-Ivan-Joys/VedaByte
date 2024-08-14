"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWithId = exports.user = void 0;
class user {
    constructor(_id, name, email, cart, enrollments, reviews, isBlocked, contact, password, googleUserId, profileImage, status) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.cart = cart;
        this.enrollments = enrollments;
        this.reviews = reviews;
        this.isBlocked = isBlocked;
        this.contact = contact;
        this.password = password;
        this.googleUserId = googleUserId;
        this.profileImage = profileImage;
        this.status = status;
    }
}
exports.user = user;
class userWithId {
    constructor(_id, name, email, cart, isBlocked, contact, profileImage, googleUserId, status) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.cart = cart;
        this.isBlocked = isBlocked;
        this.contact = contact;
        this.profileImage = profileImage;
        this.googleUserId = googleUserId;
        this.status = status;
    }
}
exports.userWithId = userWithId;
