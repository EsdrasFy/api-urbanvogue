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
exports.createPaymentPixOrder = void 0;
const payment_pix_model_1 = require("../../../database/models/payment/payment-pix/payment-pix.model");
function createPaymentPixOrder(_a) {
    return __awaiter(this, arguments, void 0, function* ({ order_id, data_info_pix, }) {
        try {
            if (!order_id) {
                return {
                    data: {
                        msg: "The field order_id is required",
                        order_id: null,
                        status: 401,
                    },
                };
            }
            yield payment_pix_model_1.PaymentPixM.create(Object.assign({ order_id }, data_info_pix));
            return {
                data: {
                    msg: "Payment added to payment with pix orders",
                    order_id: order_id,
                    status: 201,
                },
            };
        }
        catch (error) {
            return {
                data: {
                    msg: error.message ||
                        "An error occurred while creating the payment with pix order",
                    order_id: order_id,
                    status: 500,
                },
            };
        }
    });
}
exports.createPaymentPixOrder = createPaymentPixOrder;
