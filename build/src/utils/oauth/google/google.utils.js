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
exports.GoogleOAuth = void 0;
const user_service_1 = require("../../../service/user/user.service");
const set_jwt_utils_1 = require("../../cookies/set-jwt.utils");
require("dotenv").config();
function GoogleOAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = req.query.code;
        const successOAuth = process.env.OAUTH_SUCCESS_URL;
        if (!code) {
            throw new Error("Dont have code");
        }
        const { id_token, access_token } = yield (0, user_service_1.getGoogleOAuthTokens)({ code });
        const { email, given_name: username, id, name: fullname, picture: profile_img, } = (yield (0, user_service_1.getGoogleUser)({
            id_token,
            access_token,
        }));
        const existingEmail = (yield (0, user_service_1.isValidEmail)({ email })) || null;
        if (existingEmail) {
            yield (0, set_jwt_utils_1.SetJwt)({ id: existingEmail.user_id, req, res });
            return res.redirect(successOAuth);
        }
        const existingUsername = yield (0, user_service_1.isValidUsername)({ username });
        const num = (Math.random() * 100000).toFixed(0).padStart(5, "0");
        const user = yield (0, user_service_1.CreateUser)({
            username: existingUsername ? username + num : username,
            email: email,
            fullname,
            profile_img,
            google_id: id,
            verify_email: true,
        });
        res.redirect(successOAuth);
        yield (0, set_jwt_utils_1.SetJwt)({ id: user.user_id, req, res });
        return;
    });
}
exports.GoogleOAuth = GoogleOAuth;
