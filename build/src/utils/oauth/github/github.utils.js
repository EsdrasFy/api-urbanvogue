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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubOAuth = void 0;
const user_service_1 = require("../../../service/user/user.service");
const set_jwt_utils_1 = require("../../cookies/set-jwt.utils");
require("dotenv").config();
function GithubOAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = req.query.code;
        const successOAuth = process.env.OAUTH_SUCCESS_URL;
        if (!code) {
            throw new Error("Dont have code");
        }
        const access_token = yield (0, user_service_1.getGithubOAuthTokens)({ code });
        const user = yield (0, user_service_1.getGithubUser)({
            code: access_token,
        });
        if (!user.email) {
            const existingUsername = yield (0, user_service_1.isValidUsername)({
                username: user.login,
            });
            if (existingUsername) {
                yield (0, set_jwt_utils_1.SetJwt)({ id: existingUsername.user_id, req, res });
                res.redirect(successOAuth);
                return;
            }
            const userNew = yield (0, user_service_1.CreateUser)({
                username: user.login,
                email: user.email,
                fullname: user.name,
                profile_img: user.avatar_url,
                github_id: String(user.id),
                verify_email: true,
            });
            yield (0, set_jwt_utils_1.SetJwt)({ id: userNew.user_id, req, res });
            res.redirect(successOAuth);
            return;
        }
        const existingEmail = (yield (0, user_service_1.isValidEmail)({ email: user.email })) || null;
        if (existingEmail) {
            yield (0, set_jwt_utils_1.SetJwt)({ id: existingEmail.user_id, req, res });
            return res.redirect(successOAuth);
        }
        const existingUsername = yield (0, user_service_1.isValidUsername)({
            username: user.login,
        });
        const num = (Math.random() * 100000).toFixed(0).padStart(5, "0");
        const userNew = yield (0, user_service_1.CreateUser)({
            username: existingUsername ? user.login + num : user.login,
            email: user.email,
            fullname: user.name,
            profile_img: user.avatar_url,
            github_id: String(user.id),
            verify_email: true,
        });
        res.redirect(successOAuth);
        yield (0, set_jwt_utils_1.SetJwt)({ id: userNew.user_id, req, res });
        return;
    });
}
exports.GithubOAuth = GithubOAuth;
