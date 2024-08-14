"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class adminController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    async onAdminLogin(req, res, next) {
        try {
            const admin = req.body;
            const data = await this.interactor.loginAdmin(admin, res);
            res.status(200).json(data);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async studentsData(req, res, next) {
        try {
            const data = await this.interactor.getStudents();
            res.status(200).json(data);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async tutorsData(req, res, next) {
        try {
            const data = await this.interactor.getTutors();
            res.status(200).json(data);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async onChangeStatus(req, res, next) {
        try {
            const data = req.body;
            const status = await this.interactor.statusChange(data);
            res.status(200).json(status);
        }
        catch (error) {
            console.log(error, 'error in onchange admin Cotlrl');
        }
    }
    async applications(req, res, next) {
        try {
            const data = await this.interactor.getApplications();
            if (data !== null) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json({ message: 'No applications found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async onChangeApproval(req, res, next) {
        try {
            const id = req.body.id;
            const action = req.body.action;
            const data = await this.interactor.courseApproval(id, action);
        }
        catch (error) {
        }
    }
    async onCreateCategory(req, res, next) {
        try {
            const category = req.body.categoryName;
            const image = req.body.url;
            const data = await this.interactor.addNewCategory(category, image);
            res.status(201).json(data);
        }
        catch (error) {
            if (error.message === 'Category already exist') {
                res.status(409).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: error.message });
            }
        }
    }
    async onFetchCategories(req, res, next) {
        try {
            const data = await this.interactor.getAllCategories();
            res.status(200).json(data);
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
    async onRefreshToken(req, res, next) {
        try {
            let refreshToken = req.cookies.AdminRefreshToken;
            const result = await this.interactor.verifyRefreshToken(refreshToken, res);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = adminController;
