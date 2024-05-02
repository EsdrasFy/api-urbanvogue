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
exports.oauthMiddle = void 0;
const cookies_1 = __importDefault(require("cookies"));
const google_utils_1 = require("../utils/oauth/google/google.utils");
const github_utils_1 = require("../utils/oauth/github/github.utils");
require("dotenv").config();
function oauthMiddle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = new cookies_1.default(req, res);
        const provider = req.query.provider;
        const tokenjwt = cookies.get("jwt");
        if (tokenjwt) {
            return next();
        }
        try {
            if (provider !== "google" &&
                provider !== "facebook" &&
                provider !== "github") {
                return res.status(403).json({ msg: "Provider is not defined" });
            }
            if (provider === "google") {
                return yield (0, google_utils_1.GoogleOAuth)(req, res);
            }
            if (provider === "github") {
                return yield (0, github_utils_1.GithubOAuth)(req, res);
            }
            return res.status(200).json({ msg: "Teste" });
        }
        catch (error) {
            console.error(error.message);
        }
    });
}
exports.oauthMiddle = oauthMiddle;
