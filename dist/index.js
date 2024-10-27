"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var auth_routes_1 = __importDefault(require("./routes/auth_routes"));
var error_handler_1 = __importDefault(require("./services/error_handler"));
var api_key_1 = require("./util/api_key");
dotenv_1.default.config();
var port = process.env.PORT || 8080;
function start() {
    try {
        var app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use("/api/V0", api_key_1.apiKeyAuth, auth_routes_1.default);
        app.get('/api/V0/dummy', function (req, res) {
            res.json({
                message: "for fady"
            });
        });
        app.use(error_handler_1.default);
        app.listen(port, function () {
            console.log("server is running on port : ".concat(port));
        });
    }
    catch (error) {
        console.log("error in running server \n ".concat(error.toString()));
    }
}
start();
