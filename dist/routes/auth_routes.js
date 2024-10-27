"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controller_1 = require("../controllers/auth_controller");
var authRouter = express_1.default.Router();
authRouter.post("/auth/register", auth_controller_1.AuthController.register);
authRouter.post("/auth/login", auth_controller_1.AuthController.login);
exports.default = authRouter;
