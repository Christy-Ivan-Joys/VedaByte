"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    async onCreateUser(req, res, next) {
        try {
            const data = req.body;
        }
        catch (error) {
            next(error);
        }
    }
    async onUpdateUser(req, res, next) {
    }
    async onDeleteUser(req, res, next) {
    }
}
exports.default = userController;
