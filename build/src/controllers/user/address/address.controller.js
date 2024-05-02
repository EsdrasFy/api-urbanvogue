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
exports.readAddress = exports.deleteAddress = exports.updateAddress = exports.createAddress = void 0;
const user_model_1 = require("../../../database/models/user/user.model");
const user_adress_model_1 = require("../../../database/models/user/user-address/user-adress.model");
require("dotenv").config();
function createAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, street, number, cep, city, state, type_address, references, } = req.body;
        const requiredFields = {
            user_id: {
                null: "The field user_id is required!",
                type: "number",
            },
            street: {
                null: "The field street is required!",
                type: "string",
            },
            number: {
                null: "The field number of house is required!",
                type: "number",
            },
            cep: {
                null: "The field cep is required!",
                type: "string",
            },
            city: {
                null: "The field city is required!",
                type: "string",
            },
            state: {
                null: "The field state is required!",
                type: "string",
            },
            type_address: {
                null: "The field type of address is required!",
                type: "string",
            },
        };
        for (let field in requiredFields) {
            if (!req.body[field]) {
                return res.status(401).json({ msg: requiredFields[field].null });
            }
            if (typeof req.body[field] !== requiredFields[field].type) {
                return res.status(401).json({
                    msg: `The field ${field} must be a ${requiredFields[field].type}!`,
                });
            }
        }
        const oldUser = (yield user_model_1.UserM.findOne({
            where: { user_id: user_id },
        }));
        if (!oldUser) {
            return res.json({ status: "User not exists!" });
        }
        try {
            const address = (yield user_adress_model_1.AddressM.create({
                user_id,
                street,
                number,
                cep,
                city,
                state,
                type_address,
                references,
            }));
            res.status(201).json({ status: 201, address });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
}
exports.createAddress = createAddress;
function updateAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, address_id, street, number, cep, city, state, type_address, references, } = req.body;
        const requiredFields = {
            user_id: {
                null: "The field user_id is required!",
                type: "number",
            },
            address_id: {
                null: "The field address_id is required!",
                type: "number",
            },
            street: {
                null: "The field street is required!",
                type: "string",
            },
            number: {
                null: "The field number of house is required!",
                type: "number",
            },
            cep: {
                null: "The field cep is required!",
                type: "number",
            },
            city: {
                null: "The field city is required!",
                type: "string",
            },
            state: {
                null: "The field state is required!",
                type: "string",
            },
            type_address: {
                null: "The field type of address is required!",
                type: "string",
            },
        };
        for (let field in requiredFields) {
            if (!req.body[field]) {
                return res.status(401).json({ msg: requiredFields[field].null });
            }
            if (typeof req.body[field] !== requiredFields[field].type) {
                return res.status(401).json({
                    msg: `The field ${field} must be a ${requiredFields[field].type}!`,
                });
            }
        }
        const oldUser = (yield user_model_1.UserM.findOne({
            where: { user_id: user_id },
        }));
        if (!oldUser) {
            return res.json({ status: "User not exists!" });
        }
        const oldAddress = yield user_adress_model_1.AddressM.findOne({
            where: { address_id: address_id },
        });
        if (!oldAddress) {
            return res.json({ status: "Address not exists!" });
        }
        try {
            yield user_adress_model_1.AddressM.update({
                street,
                number,
                cep,
                city,
                state,
                type_address,
                references,
            }, {
                where: {
                    user_id: user_id,
                    address_id: address_id,
                },
            });
            res.status(200).json({ msg: "Updated address!" });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
}
exports.updateAddress = updateAddress;
function deleteAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, address } = req.query;
        if (!user) {
            res.status(401).json({ msg: "The field user is required!" });
        }
        if (!address) {
            res.status(401).json({ msg: "The field address is required!" });
        }
        const oldUser = (yield user_model_1.UserM.findOne({
            where: { user_id: user },
        }));
        if (!oldUser) {
            return res.status(401).json({ msg: "User not exists!" });
        }
        const oldAddress = yield user_adress_model_1.AddressM.findOne({
            where: { address_id: address },
        });
        if (!oldAddress) {
            return res.status(401).json({ msg: "Address not exists!" });
        }
        try {
            yield user_adress_model_1.AddressM.destroy({
                where: {
                    user_id: user,
                    address_id: address,
                },
            });
            console.log("Deletado");
            res.status(204).json({ status: 204 });
        }
        catch (error) {
            res.status(500).json({ msg: error });
        }
    });
}
exports.deleteAddress = deleteAddress;
function readAddress(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({ msg: "The field id is requires!" });
        }
        const oldUser = (yield user_model_1.UserM.findOne({
            where: { user_id: id },
        }));
        if (!oldUser) {
            return res.json({ status: "User not exists!" });
        }
        try {
            const address = yield user_adress_model_1.AddressM.findAll({
                where: {
                    user_id: id,
                },
            });
            res.status(200).json({ address, status: 200 });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    });
}
exports.readAddress = readAddress;
