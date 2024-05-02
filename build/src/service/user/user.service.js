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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = exports.getGithubUser = exports.getGithubOAuthTokens = exports.getGoogleUser = exports.getGoogleOAuthTokens = exports.compareCredential = exports.isValidUserId = exports.isValidUsername = exports.isValidEmail = exports.CreateUser = void 0;
const axios_1 = __importDefault(require("axios"));
const user_model_1 = require("../../database/models/user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv").config();
const user_adress_model_1 = require("../../database/models/user/user-address/user-adress.model");
function CreateUser(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { fullname, username } = _a, otherProps = __rest(_a, ["fullname", "username"]);
        try {
            if (!fullname || !username) {
                throw new Error("The username, fullname and fields are mandatory");
            }
            if (username.length < 3) {
                throw new Error("Incorrect user pattern! The username must have at least 3 characters.");
            }
            if (fullname.length < 3) {
                throw new Error("Fullname required! The fullname must have at least 10 characters.");
            }
            const user = (yield user_model_1.UserM.create(Object.assign({ fullname,
                username }, otherProps)));
            if (!user) {
                throw new Error("An error occurred when creating the user");
            }
            return user;
        }
        catch (error) {
            console.error(error, "An error occurred when creating the user");
            throw new Error(error.message);
        }
    });
}
exports.CreateUser = CreateUser;
function isValidEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, }) {
        try {
            const existingUser = (yield user_model_1.UserM.findOne({
                where: {
                    email: email,
                },
            }));
            if (existingUser) {
                return existingUser;
            }
            return null;
        }
        catch (error) {
            console.log(error.message);
            return null;
        }
    });
}
exports.isValidEmail = isValidEmail;
function isValidUsername(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, }) {
        try {
            const existingUser = (yield user_model_1.UserM.findOne({
                where: {
                    username: username,
                },
            }));
            if (existingUser) {
                return existingUser;
            }
            return null;
        }
        catch (error) {
            console.error(error, "Error in verify username");
            throw new Error(error.message);
        }
    });
}
exports.isValidUsername = isValidUsername;
function isValidUserId(_a) {
    return __awaiter(this, arguments, void 0, function* ({ user_id, }) {
        const existingUser = (yield user_model_1.UserM.findOne({
            where: {
                user_id: user_id,
            },
        }));
        if (existingUser) {
            return existingUser;
        }
        return null;
    });
}
exports.isValidUserId = isValidUserId;
function compareCredential(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { credential, password } = req.body;
        let user;
        try {
            if (!credential || !password) {
                throw new Error("Invalid credentials!");
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(credential)) {
                user = (yield user_model_1.UserM.findOne({
                    where: { email: credential },
                }));
            }
            else {
                user = (yield user_model_1.UserM.findOne({
                    where: { username: credential },
                }));
            }
            if (!user) {
                throw new Error("User not found!");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password_hash);
            if (!isPasswordValid) {
                throw new Error("Incorrect password!");
            }
            return user.user_id;
        }
        catch (error) {
            console.error(error, "Credentials incorrect");
            throw new Error(error.message);
        }
    });
}
exports.compareCredential = compareCredential;
function getGoogleOAuthTokens(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code, }) {
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_CLIENT_SECRET;
        const redirect_uri = `${process.env.OAUTH_REDIRECT_URL}provider=google`;
        const url = "https:oauth2.googleapis.com/token";
        const values = {
            code,
            client_id,
            client_secret,
            redirect_uri,
            grant_type: "authorization_code",
        };
        const params = new URLSearchParams(values);
        try {
            const res = yield axios_1.default.post(url, params.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return res.data;
        }
        catch (error) {
            console.log(error, "Failed to fetch Google OAuth Tokens");
            throw new Error(error.message);
        }
    });
}
exports.getGoogleOAuthTokens = getGoogleOAuthTokens;
function getGoogleUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id_token, access_token, }) {
        try {
            const res = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            });
            return res.data;
        }
        catch (error) {
            console.error(error, "Error fetching Google user");
            throw new Error(error.message);
        }
    });
}
exports.getGoogleUser = getGoogleUser;
function getGithubOAuthTokens(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code, }) {
        try {
            const res = (yield axios_1.default.post("https://github.com/login/oauth/access_token", {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }, {
                headers: {
                    Accept: "application/json",
                },
            }));
            return res.data.access_token;
        }
        catch (error) {
            console.error(error, "Failed to fetch Github OAuth Tokens");
            throw new Error(error.message);
        }
    });
}
exports.getGithubOAuthTokens = getGithubOAuthTokens;
function getGithubUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code, }) {
        const url = "https://api.github.com/user";
        try {
            const res = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `token ${code}`,
                    "User-Agent": "node.js",
                },
            });
            return res.data;
        }
        catch (error) {
            console.log(error, "Failed to fetch Google OAuth Tokens");
            throw new Error(error.message);
        }
    });
}
exports.getGithubUser = getGithubUser;
function getAddress(_a) {
    return __awaiter(this, arguments, void 0, function* ({ address_id, }) {
        if (!address_id) {
            return null;
        }
        const address = (yield user_adress_model_1.AddressM.findOne({
            where: {
                address_id: address_id,
            },
        }));
        return address;
    });
}
exports.getAddress = getAddress;
