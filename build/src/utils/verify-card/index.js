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
exports.VerifyCard = void 0;
const user_card_model_1 = require("../../database/models/user/user-card/user-card.model");
function VerifyCard(_a) {
    return __awaiter(this, arguments, void 0, function* ({ user_id, card_id, }) {
        if (!card_id || !user_id) {
            return {
                data: {
                    status: 401,
                    msg: "The field card_id and user_id is requires!",
                    card: null,
                },
            };
        }
        const card = (yield user_card_model_1.CardM.findOne({
            where: {
                user_id: user_id,
                card_id: card_id,
            },
        }));
        if (!card) {
            return {
                data: {
                    status: 404,
                    msg: "Card invalid!",
                    card: null,
                },
            };
        }
        const date = new Date();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = parseInt("0" + month.toString());
        }
        const year = date.getFullYear();
        const expiration_year = Number("20" + card.expiration_date.split("/")[1]);
        const expiration_month = +card.expiration_date.split("/")[0];
        if (expiration_month < month || expiration_year < year) {
            return {
                data: {
                    status: 401,
                    msg: "Expired card!",
                    card: null,
                },
            };
        }
        return {
            data: {
                card,
                msg: "Card is valid!",
                status: 200,
            },
        };
    });
}
exports.VerifyCard = VerifyCard;
