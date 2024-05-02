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
exports.paymentMiddle = void 0;
const payment_process_controller_1 = require("../controllers/payment/process/payment-process.controller");
require("dotenv").config();
function paymentMiddle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const method = req.params.method;
        if (method === "card") {
            return yield (0, payment_process_controller_1.ControllerCard)(req, res);
        }
        if (method === "pix") {
            return yield (0, payment_process_controller_1.ControllerPix)(req, res);
        }
        res.json({ msg: "method invalid" });
    });
}
exports.paymentMiddle = paymentMiddle;
