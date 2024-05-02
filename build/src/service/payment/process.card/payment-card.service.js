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
exports.processCard = exports.tokenCreate = void 0;
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const mercadopago_1 = require("mercadopago");
const uuid_1 = require("uuid");
const access_token = process.env.ACCESS_TOKEN || " ";
if (!access_token) {
    console.log("Public token is not defined!");
}
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: access_token,
});
const pay = new mercadopago_1.Payment(client);
function tokenCreate(_a) {
    return __awaiter(this, arguments, void 0, function* ({ card, withoutDiscount, withDiscount, installments, }) {
        if (!card) {
            return {
                data: {
                    msg: "Withour data card",
                    status: 401,
                    token: null,
                },
            };
        }
        const month = card === null || card === void 0 ? void 0 : card.expiration_date.split("/")[0];
        const year = card === null || card === void 0 ? void 0 : card.expiration_date.split("/")[1];
        const number = card === null || card === void 0 ? void 0 : card.card_number.split(" ").join("");
        try {
            const cardData = {
                card_number: number,
                cardholder: {
                    name: card === null || card === void 0 ? void 0 : card.name_holder,
                    identification: {
                        type: "CPF",
                        number: card.cpf_holder,
                    },
                },
                expiration_month: month,
                expiration_year: "20" + year,
                security_code: card === null || card === void 0 ? void 0 : card.cvv,
                transaction_amount: withDiscount || withoutDiscount,
                installments: installments || 1,
            };
            const response = yield axios_1.default.post("https://api.mercadopago.com/v1/card_tokens", cardData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            });
            if (!response.data || !response.data.id) {
                return {
                    data: {
                        msg: "Error in create token",
                        status: 401,
                        token: null,
                    },
                };
            }
            return {
                data: {
                    msg: "Successfull",
                    status: 201,
                    token: response.data.id,
                },
            };
        }
        catch (error) {
            return {
                data: {
                    msg: error.message || "Error in create token",
                    status: 401,
                    token: null,
                },
            };
        }
    });
}
exports.tokenCreate = tokenCreate;
function processCard(_a) {
    return __awaiter(this, arguments, void 0, function* ({ card, installments, withDiscount, withoutDiscount, email, coupon, discount, freight_amount, freight_type, }) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const { data: { msg, status, token }, } = yield tokenCreate({
            card,
            installments,
            withDiscount,
            withoutDiscount,
        });
        try {
            if (!status) {
                return {
                    data: {
                        msg: "Failed to create payment token",
                        payment: null,
                        status: status,
                    },
                };
            }
            const response = yield pay.create({
                body: {
                    transaction_amount: Number(withDiscount || withoutDiscount),
                    token: token,
                    description: "Buy product in Urban Vogue",
                    installments: Number(installments) | 1,
                    payment_method_id: "master",
                    notification_url: "https://eoe0dc9qtr0leec.m.pipedream.net",
                    payer: {
                        email: email,
                        identification: {
                            type: "CPF",
                            number: card.cpf_holder,
                        },
                    },
                },
                requestOptions: { idempotencyKey: (0, uuid_1.v4)() },
            });
            const res = {
                payment_id: response.id,
                issuer_id: response.issuer_id,
                transaction_amount: response.transaction_amount,
                installments: response.installments,
                installment_amount: ((_b = response.transaction_details) === null || _b === void 0 ? void 0 : _b.installment_amount) ||
                    response.transaction_amount,
                cpf_holder: (_e = (_d = (_c = response.card) === null || _c === void 0 ? void 0 : _c.cardholder) === null || _d === void 0 ? void 0 : _d.identification) === null || _e === void 0 ? void 0 : _e.number,
                name_holder: (_g = (_f = response.card) === null || _f === void 0 ? void 0 : _f.cardholder) === null || _g === void 0 ? void 0 : _g.name,
                last_digits: (_h = response.card) === null || _h === void 0 ? void 0 : _h.last_four_digits,
                expiration_month: (_j = response.card) === null || _j === void 0 ? void 0 : _j.expiration_month,
                expiration_year: (_k = response.card) === null || _k === void 0 ? void 0 : _k.expiration_year,
                status: response.status,
                status_detail: response.status_detail,
                date_approved: new Date(response.date_approved),
                coupon: coupon,
                discount: discount,
                freight_type: freight_type,
                freight_amount: freight_amount,
                currency: response.currency_id,
                date_created: new Date(response.date_created),
                date_of_expiration: new Date(response.date_of_expiration),
            };
            if (response.status !== "approved") {
                return {
                    data: {
                        msg: response.status_detail || response.status || "Card is invalid!",
                        payment: null,
                        status: 401,
                    },
                };
            }
            return {
                data: {
                    msg: "Successfully",
                    status: 201,
                    payment: res,
                },
            };
        }
        catch (error) {
            console.log(error);
            return {
                data: {
                    msg: error.message || "error",
                    payment: null,
                    status: error.status || 400,
                },
            };
        }
    });
}
exports.processCard = processCard;
