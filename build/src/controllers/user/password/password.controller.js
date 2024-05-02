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
exports.sendCode = exports.sendEmail = exports.resetPassword = void 0;
const user_model_1 = require("../../../database/models/user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv").config();
const user_service_1 = require("../../../service/user/user.service");
const set_code_utils_1 = require("../../../utils/cookies/set-code.utils");
const html_1 = require("../../../constants/html");
const email_utils_1 = require("../../../utils/email/email.utils");
const cookies_1 = __importDefault(require("cookies"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.SECRET;
function sendEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.params;
        const existingUser = yield (0, user_service_1.isValidEmail)({ email });
        if (!existingUser) {
            return res
                .status(404)
                .json({ msg: "User with this email does not exist." });
        }
        const code = yield (0, set_code_utils_1.SetCode)({ req, res });
        const html = (0, html_1.HtmlRecoveryPassword)(code);
        const success = yield (0, email_utils_1.SendEmailHTML)({ email, html });
        if (!success) {
            return res
                .status(500)
                .json({ msg: "Error sending the code to your email." });
        }
        return res.status(201).json({ msg: "A code has been sent to your email." });
    });
}
exports.sendEmail = sendEmail;
function sendCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, email } = req.params;
        const cookies = new cookies_1.default(req, res);
        const realCode = cookies.get("code");
        if (!realCode) {
            return res.status(401).json({ msg: "Expired code!" });
        }
        if (code !== realCode || !code) {
            return res.status(401).json({ msg: "Incorrect code!" });
        }
        const tokenRecovery = jsonwebtoken_1.default.sign({ email }, secret, {
            expiresIn: "5m",
        });
        cookies.set("tokenRecovery", tokenRecovery, {
            httpOnly: true,
            maxAge: 5 * 60 * 1000,
            path: "/",
        });
        cookies.set("code", code, {
            httpOnly: true,
            maxAge: 1,
            path: "/",
        });
        return res
            .status(200)
            .json({ msg: "Your code has been validated, go to the next step." });
    });
}
exports.sendCode = sendCode;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = new cookies_1.default(req, res);
        const tokenRecovery = cookies.get("tokenRecovery");
        const { password } = req.body;
        if (!tokenRecovery) {
            return res.status(401).json({ msg: "Expired code!" });
        }
        if (!password) {
            return res.status(401).json({ msg: "Enter a correct password!" });
        }
        jsonwebtoken_1.default.verify(tokenRecovery, secret, (err, decodedToken) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res
                    .status(403)
                    .json({ msg: "Token expired, please try again." });
            }
            const salt = yield bcrypt_1.default.genSalt(12);
            const passwordHash = yield bcrypt_1.default.hash(password, salt);
            const { email } = decodedToken;
            yield user_model_1.UserM.update({ password_hash: passwordHash }, { where: { email: email } });
            cookies.set("tokenRecovery", "a", {
                httpOnly: true,
                maxAge: 1,
                path: "/",
            });
            return res
                .status(200)
                .json({ msg: "Password changed successfully, come back and log in" });
        }));
    });
}
exports.resetPassword = resetPassword;
