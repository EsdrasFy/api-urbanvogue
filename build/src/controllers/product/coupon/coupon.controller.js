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
exports.validateCoupon = exports.createCoupons = void 0;
const coupon_model_1 = require("../../../database/models/product/product-coupon/coupon.model");
const product_model_1 = __importDefault(require("../../../database/models/product/product.model"));
function createCoupons(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, description, valid_category, valid_brand, discount_percentage, start_date, end_date, } = req.body;
        if (!code ||
            !description ||
            !discount_percentage ||
            !start_date ||
            !end_date) {
            return res.status(401).json({
                msg: "The following fields are required: code, description, discount_percentage, start_date, end_date",
            });
        }
        try {
            const createdCoupon = yield coupon_model_1.ProductCouponM.create({
                code,
                description,
                valid_category,
                valid_brand,
                discount_percentage,
                start_date,
                end_date,
            });
            return res
                .status(201)
                .json({ msg: "Coupon created successfully", coupon: createdCoupon });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    });
}
exports.createCoupons = createCoupons;
function validateCoupon(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, ids } = req.body;
        try {
            // Busca o cupom pelo código
            const coupon = (yield coupon_model_1.ProductCouponM.findOne({
                where: { code },
            }));
            if (!coupon) {
                return res.status(404).json({ msg: "Enter a valid coupon!" });
            }
            const currentDate = new Date();
            // Busca os produtos pelos IDs
            const products = (yield product_model_1.default.findAll({
                where: { id: ids },
                attributes: ["id", "category", "brand"],
            }));
            // Verifica a validade do cupom
            if (coupon.start_date && coupon.end_date) {
                const start_date = new Date(coupon.start_date); // Convertendo para Date
                const end_date = new Date(coupon.end_date); // Convertendo para Date
                if (start_date <= currentDate && end_date >= currentDate) {
                    // Verifica se os produtos são válidos para o cupom
                    if (coupon.valid_brand !== null || coupon.valid_category !== null) {
                        const valid = products.every((item) => {
                            const categoryValid = !coupon.valid_category || item.category === coupon.valid_category;
                            const brandValid = !coupon.valid_brand || item.brand === coupon.valid_brand;
                            return categoryValid && brandValid;
                        });
                        if (!valid) {
                            return res
                                .status(401)
                                .json({ msg: "Some products are not valid for this code!" });
                        }
                    }
                    // Retorna o cupom aplicado
                    return res.status(200).json({
                        status: 200,
                        msg: "Coupon applied!",
                        code: coupon.code,
                        category: coupon.valid_category,
                        brand: coupon.valid_brand,
                        description: coupon.description,
                        percentage: coupon.discount_percentage,
                    });
                }
                else if (start_date > currentDate) {
                    return res.status(401).json({ msg: "The coupon is not yet valid!" });
                }
                else if (end_date < currentDate) {
                    return res.status(401).json({ msg: "The coupon has expired!" });
                }
            }
            // Retorna se o cupom for inválido
            return res.status(401).json({ msg: "Invalid coupon!" });
        }
        catch (error) {
            // Retorna erro interno em caso de exceção
            console.error(error);
            return res.status(500).json({ msg: "Internal Error." });
        }
    });
}
exports.validateCoupon = validateCoupon;
