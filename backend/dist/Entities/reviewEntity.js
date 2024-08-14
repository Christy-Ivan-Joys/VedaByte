"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseReview = void 0;
class courseReview {
    constructor(courseId, reviewerId, comment, rating, date) {
        this.courseId = courseId;
        this.reviewerId = reviewerId;
        this.comment = comment;
        this.rating = rating;
        this.date = date;
    }
}
exports.courseReview = courseReview;
