"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        "https://urbanvogue.vercel.app",
        "http://localhost:3000",
        "https://urbanvogue.cloud",
        "http://192.168.1.12:3000"
    ],
}));
app.use(express_1.default.json());
app.use(routes_1.routes);
exports.default = app;
