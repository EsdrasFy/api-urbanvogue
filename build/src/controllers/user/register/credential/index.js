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
exports.registerCredential = void 0;
require("dotenv").config();
const user_model_1 = require("../../../../database/models/user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
function registerCredential(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fullname, username, email, password_hash } = req.body;
            if (!username || username.length < 3) {
                return res
                    .status(401)
                    .json({ msg: "Incorrect user pattern!", status: 401 });
            }
            if (!fullname || fullname.length < 10) {
                return res.status(401).json({ msg: "Fullname required!", status: 401 });
            }
            if (!email) {
                return res.status(401).json({ msg: "Email required!", status: 401 });
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                return res
                    .status(401)
                    .json({ msg: "Invalid email format!", status: 401 });
            }
            if (!password_hash || password_hash.length < 6) {
                return res.status(401).json({
                    msg: "Weak password! Use a password with at least 6 characters.",
                    status: 401,
                });
            }
            const existingEmail = (yield user_model_1.UserM.findOne({
                where: { email: email },
            }));
            if (existingEmail && existingEmail.email === email) {
                return res
                    .status(401)
                    .json({ msg: "Email is already in use.", status: 401 });
            }
            const existingUsername = yield user_model_1.UserM.findOne({
                where: { username: username },
            });
            if (existingUsername) {
                return res
                    .status(401)
                    .json({ msg: "Username is already in use.", status: 401 });
            }
            const salt = yield bcrypt_1.default.genSalt(12);
            const passwordHash = yield bcrypt_1.default.hash(password_hash, salt);
            const usuario = yield user_model_1.UserM.create({
                fullname,
                username,
                email,
                password_hash: passwordHash,
            });
            res.status(201).json({ user: usuario });
        }
        catch (error) {
            console.error("Erro ao criar usuário:", error);
            res.status(500).json({ msg: "Erro ao criar usuário" });
        }
    });
}
exports.registerCredential = registerCredential;
