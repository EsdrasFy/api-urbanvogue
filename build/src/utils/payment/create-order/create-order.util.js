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
exports.createOrder = void 0;
const payment_model_1 = require("../../../database/models/payment/payment.model");
const user_service_1 = require("../../../service/user/user.service");
function createOrder(_a) {
    return __awaiter(this, arguments, void 0, function* ({ user_id, payment_method, address_id, }) {
        if (!user_id) {
            return {
                data: {
                    msg: "The field user_id is required",
                    status: 401,
                    order_id: null,
                },
            };
        }
        if (!address_id) {
            return {
                data: {
                    msg: "The field address_id is required",
                    status: 401,
                    order_id: null,
                },
            };
        }
        const address = yield (0, user_service_1.getAddress)({ address_id });
        if (!address) {
            return {
                data: {
                    msg: "Dont exists address with ID",
                    status: 401,
                    order_id: null,
                },
            };
        }
        const createdUserOrder = (yield payment_model_1.PaymentM.create({
            user_id: user_id,
            payment_method,
            street: address === null || address === void 0 ? void 0 : address.street,
            number: address === null || address === void 0 ? void 0 : address.number,
            cep: address === null || address === void 0 ? void 0 : address.cep,
            status: "pending",
            city: address === null || address === void 0 ? void 0 : address.city,
            state: address === null || address === void 0 ? void 0 : address.state,
        }));
        if (createdUserOrder) {
            return {
                data: {
                    msg: "User order created",
                    status: 201,
                    order_id: createdUserOrder.order_id,
                },
            };
        }
        else {
            return {
                data: {
                    msg: "An error occurred when creating the order",
                    status: 500,
                    order_id: null,
                },
            };
        }
    });
}
exports.createOrder = createOrder;
