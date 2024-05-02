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
exports.getOrderDetails = exports.getOrders = void 0;
const payment_model_1 = require("../../../database/models/payment/payment.model");
const user_service_1 = require("../../../service/user/user.service");
const product_order_model_1 = require("../../../database/models/payment/product-order/product-order.model");
const payment_pix_model_1 = require("../../../database/models/payment/payment-pix/payment-pix.model");
const payment_card_model_1 = require("../../../database/models/payment/payment-card/payment-card.model");
function getOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (id) {
            const existingUser = yield (0, user_service_1.isValidUserId)({ user_id: +id });
            if (existingUser) {
                const data = yield payment_model_1.PaymentM.findAll({
                    where: {
                        user_id: id,
                    },
                });
                return res.status(200).json({ orders: data });
            }
            else {
                return res.status(404).json({ msg: "User not found" });
            }
        }
        else {
            return res.status(401).json({ mdg: "Parameter ID is required!" });
        }
    });
}
exports.getOrders = getOrders;
function getOrderDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, order_id } = req.params;
        const data = yield payment_model_1.PaymentM.findOne({
            where: {
                user_id: user_id,
                order_id: order_id,
            },
            include: [
                {
                    model: product_order_model_1.ProductOrderM,
                    as: "product_orders",
                },
                {
                    model: payment_pix_model_1.PaymentPixM,
                    as: "payment_pix",
                },
                {
                    model: payment_card_model_1.PaymentCardM,
                    as: "payment_card",
                },
            ],
        });
        res.status(200).json({ order: data });
    });
}
exports.getOrderDetails = getOrderDetails;
