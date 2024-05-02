"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmailHTML = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function SendEmailHTML({ html, email }) {
    return new Promise((resolve, reject) => {
        const transport = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "contatoesdrasoficial@gmail.com",
                pass: "xcxjmpheutkwxdsi",
            },
        });
        transport.sendMail({
            from: "Urban Vogue",
            to: email,
            subject: "Send Code",
            html: html,
        })
            .then((response) => {
            resolve(true);
        })
            .catch((err) => {
            console.error("Erro ao enviar e-mail:", err);
            resolve(false);
        });
    });
}
exports.SendEmailHTML = SendEmailHTML;
