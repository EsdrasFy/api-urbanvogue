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
exports.processPix = void 0;
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
function processPix(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, cpf, fullname, token, withDiscount, withoutDiscount, coupon, discount, freight_amount, freight_type, }) {
        try {
            const body = {
                transaction_amount: withDiscount || withoutDiscount,
                token: token,
                description: "",
                payment_method_id: "pix",
                payer: {
                    email: email || " ",
                    first_name: fullname || " ",
                    last_name: " ",
                    identification: {
                        type: "CPF",
                        number: cpf,
                    },
                },
                notification_url: "https://eoe0dc9qtr0leec.m.pipedream.net",
                date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            };
            const response = (yield axios_1.default.post("https://api.mercadopago.com/v1/payments", body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Idempotency-Key": (0, uuid_1.v4)(),
                },
            }));
            const res = {
                payment_id: response.data.id,
                issuer_id: response.data.issuer_id,
                notification_url: response.data.notification_url,
                qr_code: response.data.point_of_interaction.transaction_data.qr_code,
                ticket_url: response.data.point_of_interaction.transaction_data.ticket_url,
                transaction_amount: response.data.transaction_amount,
                status: response.data.status,
                status_detail: response.data.status_detail,
                date_approved: response.data.date_approved,
                currency: response.data.currency_id,
                date_created: response.data.date_created,
                date_of_expiration: response.data.date_of_expiration,
                coupon: coupon,
                discount: discount,
                freight_type: freight_type,
                freight_amount: freight_amount,
            };
            return {
                data: {
                    msg: "Payment with pix created",
                    status: 201,
                    response: res,
                },
            };
        }
        catch (error) {
            console.error(error);
            let errorMessage = "Error processing payment";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            else if (error.message) {
                errorMessage = error.message;
            }
            return {
                data: {
                    msg: errorMessage,
                    status: 400,
                },
            };
        }
    });
}
exports.processPix = processPix;
