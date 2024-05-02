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
exports.readCard = exports.createCard = void 0;
const user_card_model_1 = require("../../../database/models/user/user-card/user-card.model");
const user_model_1 = require("../../../database/models/user/user.model");
function createCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const { type, user_id, card_number, name_holder, cpf_holder, card_network, expiration_date, cvv, card_nickname, } = body;
        const requiredFields = {
            type: {
                null: "The field type is required!",
                type: "string",
            },
            user_id: {
                null: "The field user_id is required!",
                type: "number",
            },
            card_number: {
                null: "The field card_number is required!",
                type: "string",
            },
            name_holder: {
                null: "The field name_holder is required!",
                type: "string",
            },
            cpf_holder: {
                null: "The field cpf_holder is required!",
                type: "string",
            },
            card_nickname: {
                null: "The field card_nickname is required!",
                type: "string",
            },
            card_network: {
                null: "The field card_network is required!",
                type: "string",
            },
            expiration_date: {
                null: "The field expiration_date is required!",
                type: "string",
            },
            cvv: {
                null: "The field cvv is required!",
                type: "string",
            }
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
        try {
            const user = yield user_model_1.UserM.findByPk(user_id);
            if (!user) {
                return res.status(404).json({ msg: "User not exists!" });
            }
            yield user_card_model_1.CardM.create({
                type,
                user_id,
                card_number,
                name_holder,
                cpf_holder,
                card_network,
                expiration_date,
                cvv,
                card_nickname,
            });
            return res.status(201).json({ msg: "Card created!" });
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.createCard = createCard;
function readCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("chamou");
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ msg: "User not exists!" });
        }
        parseInt(id);
        try {
            const cards = (yield user_card_model_1.CardM.findAll({
                where: {
                    user_id: id,
                },
                attributes: [
                    "card_id",
                    "type",
                    "card_number",
                    "card_nickname",
                    "card_network",
                ],
            }));
            for (const card of cards) {
                const newCard = card.card_number.split(" ")[3];
                card.card_number = newCard;
            }
            return res.status(200).json({ cards });
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    });
}
exports.readCard = readCard;
