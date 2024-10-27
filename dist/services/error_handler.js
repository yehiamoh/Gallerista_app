"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = require("http-errors");
var errorHandler = function (error, req, res, next) {
    console.log(error);
    var statusCode = 500;
    var errorMessage = "An unknown error occurred";
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.statusCode;
        errorMessage = error.erroMessage;
    }
    res.status(statusCode).json({
        message: errorMessage
    });
};
exports.default = errorHandler;
