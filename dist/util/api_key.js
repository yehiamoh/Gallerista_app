"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var apiKeyAuth = function (req, res, next) {
    var apiKey = req.header("x-api-key");
    if (!apiKey || apiKey !== process.env.API_Key) {
        return res.status(403).json({ message: 'Forbidden: Invalid API key' });
    }
    next();
};
exports.apiKeyAuth = apiKeyAuth;
