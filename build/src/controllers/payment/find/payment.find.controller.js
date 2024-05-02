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
exports.findPayment = void 0;
const find_payment_service_1 = require("../../../service/payment/find-payment/find-payment.service");
function findPayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { order_id, payment_id, method } = req.params;
        if (method !== "pix" &&
            method !== "card" &&
            method !== "bank") {
            return res.status(401).json({ msg: "Method invalid" });
        }
        if (!order_id || !payment_id) {
            return res.status(401).json({ msg: "The field order_id and payment_id is required!" });
        }
        const response = yield (0, find_payment_service_1.findPaymentPix)({
            method,
            order_id: +order_id,
            payment_id: +payment_id,
        });
        if (!response) {
            return res.status(404).json({ msg: "Parameters invalid!" });
        }
        return res.status(200).json({ response });
    });
}
exports.findPayment = findPayment;
