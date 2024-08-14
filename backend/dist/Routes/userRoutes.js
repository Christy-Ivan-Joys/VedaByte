"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../Controllers/userController"));
const UserInteactor_1 = require("../interactors/UserInteactor");
const interactor = new UserInteactor_1.UserInteractor;
const controller = new userController_1.default(interactor);
const router = express_1.default.Router();
router.post('/register', controller.onCreateUser);
exports.default = router;
