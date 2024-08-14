"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = require("../utils/Helpers/errorResponse");
class userController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    async onCreateUser(req, res, next) {
        try {
            const user = req.body;
            const data = await this.interactor.createUser(user);
            return res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onUserLogin(req, res, next) {
        try {
            const user = req.body;
            const data = await this.interactor.userLogin(user, res);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onDeleteUser(req, res, next) {
    }
    async sendOtp(req, res, next) {
        try {
            const email = req.body.email;
            const otp = await this.interactor.sendOtp(email, req);
            return res.status(200).json(otp);
        }
        catch (error) {
            next(error);
        }
    }
    async getCourses(req, res, next) {
        try {
            const data = await this.interactor.allCourses();
            return res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onAddToCart(req, res, next) {
        try {
            const input = req.body;
            const user = await this.interactor.addNewCartItem(input);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async onCheckout(req, res, next) {
        try {
            const products = req.body.cart;
            const userId = req.body.userId;
            const data = await this.interactor.checkoutSession(products, userId);
            res.json({ id: data });
        }
        catch (error) {
            next(error);
        }
    }
    async onEnroll(req, res, next) {
        try {
            const userId = req.body.userId;
            const total = req.body.total;
            const data = await this.interactor.enrollCourse(userId, total);
            res.status(errorResponse_1.HttpStatusCodes.CREATED).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onChangePassword(req, res, next) {
        try {
            const newPassword = req.body.newpassword;
            const currentPassword = req.body.currentpassword;
            const userId = req.body.userId;
            const data = await this.interactor.passwordChange(newPassword, currentPassword, userId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onChangeProfileImage(req, res, next) {
        try {
            const url = req.body.imageUrl;
            const userId = req.body.userId;
            const data = await this.interactor.changeProfileImage(url, userId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onEditUserDetails(req, res, next) {
        try {
            const user = req.body.user;
            const details = req.body.data;
            const data = await this.interactor.updateProfileDetails(user, details);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onRefreshToken(req, res, next) {
        try {
            let refreshToken = req.cookies.StudentRefreshToken;
            const result = await this.interactor.verifyRefreshToken(refreshToken, res);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async onRemoveCartItem(req, res, next) {
        try {
            const userId = req.body.user._id;
            const itemId = req.body.itemId;
            const update = await this.interactor.removeCartItem(userId, itemId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(update);
        }
        catch (error) {
            next(error);
        }
    }
    async onFetchEnrolledCourses(req, res, next) {
        try {
            const userId = req.body.user._id;
            const data = await this.interactor.fetchEnrolledCourses(userId);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onFetchEnrollments(req, res, next) {
        try {
            const userId = req.body.user._id;
            const data = await this.interactor.fetchAllEnrollments(userId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            res.status(400).json(error);
        }
    }
    async onFetchCategories(req, res, next) {
        try {
            const data = await this.interactor.fetchAllCategories();
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            if (error.message === 'No categories found') {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: error.message });
            }
        }
    }
    async onUpdateModuleProgress(req, res, next) {
        try {
            const data = req.body.data;
            const userId = req.body.user._id;
            const result = await this.interactor.updateModuleProgress(data, userId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(result);
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }
    async onFetchAllMessages(req, res, next) {
        const InstructorId = req.params.id;
        const studentId = req.body.user._id;
        try {
            const data = await this.interactor.fetchAllMessages(InstructorId, studentId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: error?.message });
        }
    }
    async onGetTutors(req, res, next) {
        try {
            const data = await this.interactor.fetchAllTutors();
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onGetInstructorCourses(req, res, next) {
        try {
            const InstructorId = req.params.id;
            const data = await this.interactor.getAllCourses(InstructorId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onPostCourseReview(req, res, next) {
        try {
            const reviewerId = req.body.user._id;
            const data = { ...req.body.data, reviewerId };
            const update = await this.interactor.postCourseReview(data);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(update);
        }
        catch (error) {
            next(error);
        }
    }
    async onGetReviews(req, res, next) {
        try {
            const courseId = req.params.id;
            const data = await this.interactor.getCourseReviews(courseId);
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async onCancelEnrollment(req, res, next) {
        try {
            const userId = req.body.user._id;
            const selectedCourses = req.body.selectedCourses;
            const enrollmentId = req.body.enrollmentId;
            const data = await this.interactor.cancelEnrollment({ selectedCourses, enrollmentId, userId });
            res.status(errorResponse_1.HttpStatusCodes.OK).json(data);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = userController;
