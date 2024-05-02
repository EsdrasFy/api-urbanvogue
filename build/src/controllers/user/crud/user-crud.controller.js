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
exports.readUser = exports.deleteUser = exports.updateUser = void 0;
require("dotenv").config();
const user_model_1 = require("../../../database/models/user/user.model");
function readUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(404).json({ msg: "The field id is required!" });
            }
            const user = (yield user_model_1.UserM.findOne({
                where: { user_id: id },
            }));
            if (!user) {
                return res.status(404).json({ msg: "User not found!" });
            }
            res
                .status(200)
                .json({ user, status: 200, id: user.user_id, name: user.username });
        }
        catch (error) {
            res.status(500).json({ msg: "Internal Error!" });
        }
    });
}
exports.readUser = readUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, fullname, username, email, profile_img, birthdate, phone, gender, cpf, } = req.body;
        // simple validation
        if (!username || username.length < 3) {
            return res.status(401).json({ msg: "Incorrect user pattern!" });
        }
        if (!fullname || fullname.length < 8) {
            return res.status(401).json({ msg: "Full name required!" });
        }
        if (!email) {
            return res.status(401).json({ msg: "Email required!" });
        }
        if (!user_id) {
            return res.status(401).json({ msg: "User ID required!" });
        }
        try {
            // existing user
            const user = (yield user_model_1.UserM.findOne({
                where: {
                    user_id: user_id,
                },
            }));
            // existing CPF
            if (cpf) {
                const existingCPF = (yield user_model_1.UserM.findOne({
                    where: {
                        cpf: cpf,
                    },
                }));
                if (existingCPF && existingCPF.user_id !== user.user_id) {
                    return res.status(400).json({ msg: "CPF is already in use." });
                }
            }
            // existing Email
            const existingEmail = (yield user_model_1.UserM.findOne({
                where: {
                    email: email,
                },
            }));
            if (existingEmail && existingEmail.user_id !== user.user_id) {
                return res.status(400).json({ msg: "Email is already in use." });
            }
            // existing Username
            const existingUsername = (yield user_model_1.UserM.findOne({
                where: {
                    username: username,
                },
            }));
            if (existingUsername && existingUsername.user_id !== user.user_id) {
                return res.status(400).json({ msg: "Username is already in use." });
            }
            // update user
            yield user_model_1.UserM.update({
                username: username,
                fullname: fullname,
                email: email,
                profile_img: profile_img || user.profile_img,
                password_hash: user.password_hash,
                date_of_birth: birthdate,
                phone: phone,
                gender: gender,
                cpf: cpf,
            }, {
                where: { user_id: user_id },
            });
            const updatedUser = yield user_model_1.UserM.findOne({ where: { user_id: user_id } });
            // send response
            return res.status(200).json({ msg: "Successfull update!", user: updatedUser });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message || "Error updating user!", user: null });
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).json({ msg: "ID is required in the request." });
            }
            const existingUser = (yield user_model_1.UserM.findOne({
                where: {
                    user_id: id,
                },
            }));
            if (!existingUser) {
                return res.status(404).json({ msg: "User not found." });
            }
            yield user_model_1.UserM.destroy({
                where: { user_id: id },
            });
            res.status(200).json({
                msg: `User with ID ${id} has been deleted from the database.`,
                status: 200,
            });
        }
        catch (error) {
            res.status(500).json({ msg: "Error deleting user!" });
        }
    });
}
exports.deleteUser = deleteUser;
