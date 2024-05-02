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
exports.VerifyCoupon = void 0;
const coupon_model_1 = require("../../database/models/product/product-coupon/coupon.model");
const product_model_1 = __importDefault(require("../../database/models/product/product.model"));
function VerifyCoupon(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code, ids, cart_products, }) {
        if (ids.length === 0) {
            return {
                data: {
                    msg: "Empty cart",
                    status: 401,
                },
            };
        }
        const products = (yield product_model_1.default.findAll({
            where: { id: ids },
            attributes: ["id", "category", "brand", "price"],
        }));
        const { totalPrice, totalQuantity } = cart_products.reduce((acc, { id, quantity }) => {
            const product = products.find((p) => p.id === id);
            if (product) {
                return {
                    totalPrice: product.price * quantity + acc.totalPrice,
                    totalQuantity: quantity + acc.totalQuantity,
                };
            }
            return acc;
        }, { totalPrice: 0, totalQuantity: 0 });
        if (!code) {
            return {
                data: {
                    msg: "Without coupon",
                    status: 200,
                    withoutDiscount: totalPrice,
                },
            };
        }
        const coupon = (yield coupon_model_1.ProductCouponM.findOne({
            where: { code },
        }));
        if (!coupon) {
            return {
                data: {
                    msg: "Enter a valid coupon!",
                    status: 401,
                },
            };
        }
        const currentDate = new Date();
        if (coupon.start_date && coupon.end_date) {
            const start_date = new Date(coupon.start_date);
            const end_date = new Date(coupon.end_date);
            if (start_date <= currentDate && end_date >= currentDate) {
                if (coupon.valid_brand !== null || coupon.valid_category !== null) {
                    const valid = products.every((item) => {
                        const categoryValid = !coupon.valid_category || item.category === coupon.valid_category;
                        const brandValid = !coupon.valid_brand || item.brand === coupon.valid_brand;
                        return categoryValid && brandValid;
                    });
                    if (!valid) {
                        return {
                            data: {
                                msg: "Some products are not valid for this code!",
                                status: 401,
                            },
                        };
                    }
                }
                const disc = (totalPrice * coupon.discount_percentage) / 100;
                const value = totalPrice - disc;
                return {
                    data: {
                        msg: "Coupon applied!",
                        status: 200,
                        discount_percentage: coupon.discount_percentage,
                        code: coupon.code,
                        category: coupon.valid_category,
                        brand: coupon.valid_brand,
                        description: coupon.description,
                        discount: +disc.toFixed(2),
                        withoutDiscount: +totalPrice.toFixed(2),
                        withDiscount: +value.toFixed(2),
                    },
                };
            }
            else if (start_date > currentDate) {
                return {
                    data: {
                        msg: "The coupon is not yet valid!",
                        status: 401,
                    },
                };
            }
            else if (end_date < currentDate) {
                return {
                    data: {
                        msg: "The coupon has expired!",
                        status: 401,
                    },
                };
            }
        }
        return {
            data: {
                msg: "Invalid coupon!",
                status: 401,
            },
        };
    });
}
exports.VerifyCoupon = VerifyCoupon;
