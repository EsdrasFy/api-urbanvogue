"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetCode = void 0;
const cookies_1 = __importDefault(require("cookies"));
require("dotenv").config();
function SetCode(_a) {
    return __awaiter(this, arguments, void 0, function* ({ req, res, }) {
        let number = Math.floor(Math.random() * 1000000);
        let code = number.toString().padStart(6, "0");
        const cookies = new cookies_1.default(req, res);
        cookies.set("code", code, {
            httpOnly: true,
            maxAge: 5 * 60 * 1000,
            path: "/",
        });
        return code;
    });
}
exports.SetCode = SetCode;
