"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class instructorController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    async onCreateInstructor(req, res, next) {
        try {
            const user = req.body;
            const data = await this.interactor.createInstructor(user);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error, 'error in instrutor contrl');
            return res.status(400).json({ status: false, message: error.message });
        }
    }
    async onInstructorLogin(req, res, next) {
        try {
            const user = req.body;
            const data = await this.interactor.loginInstructor(user, res);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error, 'error in login inst');
            return res.status(400).json({ status: false, message: error.message });
        }
    }
    async onAddCourse(req, res, next) {
        try {
            const course = req.body;
            const data = await this.interactor.createCourse(course);
            res.status(201).json({ status: true });
        }
        catch (error) {
            res.status(500).json({ status: false, message: 'Internal server error' });
            console.log(error, 'error in course addition contrl');
        }
    }
    async onGetCourses(req, res, next) {
        try {
            const instructorId = req.body.user._id;
            const data = await this.interactor.allCourses(instructorId);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
            console.log('error happend in instructor contrl in onCourses', error);
        }
    }
    async onUpdateProfileImage(req, res, next) {
        try {
            const user = req.body.user;
            const image = req.body.imageURL;
            const data = await this.interactor.updateProfileImage(image, user);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(400).json(error.message);
        }
    }
    async onVerifyRefreshToken(req, res, next) {
        try {
            console.log('this is refresh tokennnnn');
            const refreshToken = req.cookies.InstructorRefreshToken;
            console.log(refreshToken, 'this is teokn');
            const refresh = await this.interactor.refreshTokenValidation(refreshToken, res);
            res.status(200).json(refresh);
        }
        catch (error) {
            if (error.message === 'No refresh token found') {
                res.status(401).json({ message: 'No refresh token found' });
            }
            else {
                res.status(400).json({ message: 'token validation failed !' });
            }
        }
    }
    async onProfileUpdate(req, res, next) {
        try {
            const user = req.body.user;
            const details = req.body.data;
            const update = await this.interactor.updateProfileDetails(user, details);
            res.status(200).json(update);
        }
        catch (error) {
            console.log(error);
        }
    }
    async onSendMail(req, res, next) {
        try {
            const email = req.body.user.email;
            const data = await this.interactor.sendOtp(email);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onFetchEnrolledStudents(req, res, next) {
        try {
            const InstructorId = req.body.user._id;
            const data = await this.interactor.fetchEnrolledStudents(InstructorId);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onFetchAllCategories(req, res, next) {
        try {
            const data = await this.interactor.fetchCategories();
            res.status(200).json(data);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async onEditCourse(req, res, next) {
        try {
            const Data = req.body.formData;
            const courseId = req.body.formData._id;
            const data = await this.interactor.editCourse(courseId, Data);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onFetchInstructorMessages(req, res, next) {
        try {
            const studentId = req.params.id;
            const InstructorId = req.body.user._id;
            const data = await this.interactor.fetchInstructorMessages(studentId, InstructorId);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onAddQualification(req, res, next) {
        try {
            const data = { degree: req.body.degree, institution: req.body.institution };
            const InstructorId = req.body.user._id;
            const result = await this.interactor.addQualification(data, InstructorId);
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
        }
    }
    async onAddCertification(req, res, next) {
        try {
            const data = req.body.certification;
            const InstructorId = req.body.user._id;
            const result = await this.interactor.addCertification(data, InstructorId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async onAddSection(req, res, next) {
        try {
            const title = req.body.title;
            const description = req.body.description;
            const videoURL = req.body.videoURL;
            const courseId = req.body.courseId;
            const data = await this.interactor.addNewSection(title, description, videoURL, courseId);
            res.status(200).json(data);
        }
        catch (error) {
            res.status(400).json({ message: error.messgae });
            console.log(error);
        }
    }
    async onDeleteSection(req, res, next) {
        try {
            const sectionId = req.body.sectionId;
            const data = await this.interactor.deleteSection(sectionId);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
        }
    }
    async onFetchDashboardData(req, res, next) {
        try {
            // const data = await this.interactor.getDashboardData()
        }
        catch (error) {
        }
    }
    async onGraphData(req, res, next) {
        try {
            const instructorId = req.body.user._id;
            const data = await this.interactor.getGraphData(instructorId);
            res.status(200).json(data);
        }
        catch (error) {
        }
    }
}
exports.default = instructorController;
