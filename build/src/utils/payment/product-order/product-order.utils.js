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
exports.createProductOrder = void 0;
const product_order_model_1 = require("../../../database/models/payment/product-order/product-order.model");
function createProductOrder(_a) {
    return __awaiter(this, arguments, void 0, function* ({ order_id, user_id, products, }) {
        try {
            if (!order_id) {
                return {
                    data: {
                        msg: "The field order_id is required",
                        status: 401,
                    },
                };
            }
            if (!user_id) {
                return {
                    data: {
                        msg: "The field user_id is required",
                        status: 401,
                    },
                };
            }
            for (const product of products) {
                yield product_order_model_1.ProductOrderM.create({
                    order_id,
                    product_id: product.id,
                    user_id,
                    color: product.color,
                    image: product.image,
                    price: product.price,
                    title: product.title,
                    size: product.size,
                    quantity: product.quantity,
                });
            }
            return {
                data: {
                    msg: "Products added to products orders",
                    status: 201,
                },
            };
        }
        catch (error) {
            return {
                data: {
                    msg: error.message || "An error occurred while creating the product order",
                    status: 500,
                },
            };
        }
    });
}
exports.createProductOrder = createProductOrder;
