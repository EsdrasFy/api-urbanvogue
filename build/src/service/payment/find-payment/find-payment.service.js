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
exports.findPaymentPix = void 0;
const payment_card_model_1 = require("../../../database/models/payment/payment-card/payment-card.model");
const payment_pix_model_1 = require("../../../database/models/payment/payment-pix/payment-pix.model");
const payment_model_1 = require("../../../database/models/payment/payment.model");
function findPaymentPix(_a) {
    return __awaiter(this, arguments, void 0, function* ({ method, order_id, payment_id, }) {
        try {
            let includeList = [];
            if (method === "pix") {
                includeList.push({
                    model: payment_pix_model_1.PaymentPixM,
                    as: "payment_pix",
                    where: {
                        payment_id: payment_id,
                    },
                });
            }
            if (method === "card") {
                includeList.push({
                    model: payment_card_model_1.PaymentCardM,
                    as: "payment_card",
                    where: {
                        payment_id: payment_id,
                    },
                });
            }
            const payments = (yield payment_model_1.PaymentM.findOne({
                include: includeList,
                where: {
                    order_id: order_id,
                },
            }));
            return payments;
        }
        catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            throw error;
        }
    });
}
exports.findPaymentPix = findPaymentPix;
