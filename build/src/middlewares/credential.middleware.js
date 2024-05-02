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
exports.credentialMiddle = void 0;
const cookies_1 = __importDefault(require("cookies"));
const user_service_1 = require("../service/user/user.service");
const set_jwt_utils_1 = require("../utils/cookies/set-jwt.utils");
require("dotenv").config();
function credentialMiddle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = new cookies_1.default(req, res);
        const tokenjwt = cookies.get("jwt");
        if (tokenjwt) {
            return next();
        }
        try {
            const id = yield (0, user_service_1.compareCredential)(req, res);
            yield (0, set_jwt_utils_1.SetJwt)({ id, req, res });
            next();
        }
        catch (error) {
            return res
                .status(401)
                .json({ msg: error.message || "Credentials Invalid" });
        }
    });
}
exports.credentialMiddle = credentialMiddle;
