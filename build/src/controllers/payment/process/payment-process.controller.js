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
exports.ControllerCard = exports.ControllerPix = void 0;
require("dotenv").config();
const user_model_1 = require("../../../database/models/user/user.model");
const verify_coupon_1 = require("../../../utils/verify-coupon");
const create_order_util_1 = require("../../../utils/payment/create-order/create-order.util");
const product_order_utils_1 = require("../../../utils/payment/product-order/product-order.utils");
const process_pix_service_1 = require("../../../service/payment/process-pix/process-pix.service");
const payment_pix_utils_1 = require("../../../utils/payment/payment-pix/payment-pix.utils");
const payment_card_service_1 = require("../../../service/payment/process.card/payment-card.service");
const verify_card_1 = require("../../../utils/verify-card");
const payment_card_utils_1 = require("../../../utils/payment/payment-card/payment-card.utils");
("http://localhost:3000/checkout/approve/credit_card/3/1322342309");
/*
 ** add coupon and status of order na tabela orders
 ** arrumar a parada no coupon de quantity * price
 */
function ControllerCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { user_id, card_id, coupon, products, address_id, payment_method, installments, } = req.body;
        try {
            const verify_card = yield (0, verify_card_1.VerifyCard)({ card_id, user_id });
            if (verify_card.data.status !== 200) {
                return res.status(verify_card.data.status).json(verify_card.data.msg);
            }
            const ids = (products === null || products === void 0 ? void 0 : products.map((product) => product.id)) || [];
            const verify_coupon = yield (0, verify_coupon_1.VerifyCoupon)({
                code: coupon,
                ids,
                cart_products: products,
            });
            if (verify_coupon.data.status !== 200) {
                return res.status(verify_coupon.data.status).json(verify_coupon.data.msg);
            }
            const order = yield (0, create_order_util_1.createOrder)({
                address_id,
                payment_method,
                user_id,
            });
            if (order.data.status !== 201) {
                return res.status(order.data.status).json(order.data.msg);
            }
            const product_order = yield (0, product_order_utils_1.createProductOrder)({
                order_id: order.data.order_id,
                products,
                user_id,
            });
            if (product_order.data.status !== 201) {
                return res.status(product_order.data.status).json(product_order.data.msg);
            }
            const user = (yield user_model_1.UserM.findByPk(user_id));
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            const { data: processedCard } = yield (0, payment_card_service_1.processCard)({
                card: verify_card.data.card,
                email: user.email,
                installments: installments || 1,
                withDiscount: verify_coupon.data.withDiscount || null,
                withoutDiscount: verify_coupon.data.withoutDiscount,
                coupon: verify_coupon.data.code || null,
                discount: verify_coupon.data.discount || null,
                freight_type: "SEDEX",
                freight_amount: 0.00,
            });
            if (processedCard.status !== 201) {
                return res.status(processedCard.status).json(processedCard.msg);
            }
            const createdPaymentCardOrder = yield (0, payment_card_utils_1.createPaymentCardOrder)({
                order_id: order.data.order_id,
                data_info_card: processedCard.payment,
            });
            if (createdPaymentCardOrder.data.status !== 201) {
                return res
                    .status(createdPaymentCardOrder.data.status)
                    .json({ msg: createdPaymentCardOrder.data.msg });
            }
            return res.status(201).json({
                msg: "Successfull",
                order_id: order.data.order_id,
                payment_id: (_a = processedCard.payment) === null || _a === void 0 ? void 0 : _a.payment_id,
            });
        }
        catch (err) {
            res.status(400).json({ err: err.message });
        }
    });
}
exports.ControllerCard = ControllerCard;
function ControllerPix(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { user_id, coupon, products, address_id, payment_method } = req.body;
        const ids = (products === null || products === void 0 ? void 0 : products.map((product) => product.id)) || [];
        const token = process.env.ACCESS_TOKEN;
        if (!token) {
            return res.status(500).json({ msg: "Public token is not defined!" });
        }
        try {
            const verify_data = yield (0, verify_coupon_1.VerifyCoupon)({
                code: coupon,
                ids,
                cart_products: products,
            });
            if (verify_data.data.status !== 200) {
                return res.status(verify_data.data.status).json(verify_data.data.msg);
            }
            const user = (yield user_model_1.UserM.findByPk(user_id));
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            const order = yield (0, create_order_util_1.createOrder)({
                address_id,
                payment_method,
                user_id
            });
            if (order.data.status !== 201) {
                return res.status(order.data.status).json(order.data.msg);
            }
            const product_order = yield (0, product_order_utils_1.createProductOrder)({
                order_id: order.data.order_id,
                products,
                user_id,
            });
            if (product_order.data.status !== 201) {
                return res.status(product_order.data.status).json(product_order.data.msg);
            }
            const processedPix = yield (0, process_pix_service_1.processPix)({
                cpf: user.cpf || "",
                email: user.email || "",
                fullname: user.fullname || "",
                token,
                coupon: verify_data.data.code || null,
                discount: verify_data.data.discount || null,
                freight_type: "SEDEX",
                freight_amount: 0.00,
                withDiscount: ((_a = verify_data === null || verify_data === void 0 ? void 0 : verify_data.data) === null || _a === void 0 ? void 0 : _a.withDiscount) || null,
                withoutDiscount: (_b = verify_data === null || verify_data === void 0 ? void 0 : verify_data.data) === null || _b === void 0 ? void 0 : _b.withoutDiscount,
            });
            if (processedPix.data.status !== 201) {
                return res.status(processedPix.data.status).json(processedPix.data.msg);
            }
            const data_info_pix = processedPix.data
                .response;
            const createdPaymentPixOrder = yield (0, payment_pix_utils_1.createPaymentPixOrder)({
                order_id: order.data.order_id,
                data_info_pix,
            });
            if (createdPaymentPixOrder.data.status !== 201) {
                return res
                    .status(createdPaymentPixOrder.data.status)
                    .json({ msg: createdPaymentPixOrder.data.msg });
            }
            return res.status(201).json({
                msg: "Successfull",
                order_id: order.data.order_id,
                payment_id: data_info_pix.payment_id,
            });
        }
        catch (error) {
            return res.status(500).json({ msg: "Error processing payment" });
        }
    });
}
exports.ControllerPix = ControllerPix;
