"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.genertaeToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var secretKey = process.env.JWT_SECRET;
var genertaeToken = function (userId, role) {
    var payLoad = {
        userId: userId,
        role: role,
    };
    return jsonwebtoken_1.default.sign({ payLoad: payLoad }, secretKey, { expiresIn: '1h' });
};
exports.genertaeToken = genertaeToken;
var verifyToken = function (token) {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyToken = verifyToken;
