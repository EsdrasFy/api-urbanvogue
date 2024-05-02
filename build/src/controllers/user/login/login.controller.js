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
exports.login = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookies_1 = __importDefault(require("cookies"));
const user_model_1 = require("../../../database/models/user/user.model");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = new cookies_1.default(req, res);
        const secret = process.env.SECRET;
        const token = cookies.get("jwt");
        const token2 = req.body.jwt;
        try {
            if (!token && !token2) {
                return res.status(401).json({ msg: "Token JWT ausente" });
            }
            if (!secret) {
                return res.status(401).json({ msg: "secret ausente" });
            }
            jsonwebtoken_1.default.verify(token || token2, secret, (err, decodedToken) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(403).json({ error: "Token JWT inválido" });
                }
                const { id } = decodedToken;
                const user = yield user_model_1.UserM.findOne({
                    where: {
                        user_id: id,
                    },
                });
                return res
                    .status(200)
                    .json({ msg: "Login Successfull!", status: 200, user: user });
            }));
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal error!", error });
        }
    });
}
exports.login = login;
