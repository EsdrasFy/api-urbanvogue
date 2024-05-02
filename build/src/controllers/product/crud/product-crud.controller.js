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
exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../../../database/models/product/product.model"));
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, summary, quantidy, sold, price, state, category, sizes, brand, guarantee, variation, assessment, parcelable, max_installments, interest_rate, cor_id, promotion, classe, images, } = req.body;
        const requiredFields = {
            title: {
                null: "The field title is required!",
                type: "string",
            },
            summary: {
                null: "The field summary is required!",
                type: "string",
            },
            quantidy: {
                null: "The field quantidy is required!",
                type: "number",
            },
            price: {
                null: "The field price is required!",
                type: "number",
            },
            category: {
                null: "The field category is required!",
                type: "string",
            },
        };
        for (let field in requiredFields) {
            if (!req.body[field]) {
                return res.status(401).json({ msg: requiredFields[field].null });
            }
            if (typeof req.body[field] !== requiredFields[field].type) {
                return res.status(401).json({
                    msg: `The field ${field} must be a ${requiredFields[field].type}!`,
                });
            }
        }
        try {
            const produto = yield product_model_1.default.create({
                title,
                summary,
                quantidy,
                sold,
                price,
                state,
                category,
                sizes,
                brand,
                guarantee,
                variation,
                assessment,
                parcelable,
                max_installments,
                interest_rate,
                cor_id,
                promotion,
                classe,
            });
            return res.status(201).json({ product: produto, status: 201 });
        }
        catch (error) {
            return res.status(500).json({ error: "Error creating product!" });
        }
    });
}
exports.createProduct = createProduct;
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, title, summary, quantidy, sold, price, state, category, sizes, brand, guarantee, variation, assessment, parcelable, max_installments, interest_rate, cor_id, promotion, } = req.body;
        try {
            if (!id) {
                return res.status(400).json({ msg: "Product ID not provided." });
            }
            const existingProduct = yield product_model_1.default.findOne({
                where: { id: id },
            });
            if (!existingProduct) {
                return res.status(404).json({ msg: "Product not found!" });
            }
            const [updatedRows] = yield product_model_1.default.update({
                title,
                summary,
                quantidy,
                sold,
                price,
                state,
                category,
                sizes,
                brand,
                guarantee,
                variation,
                assessment,
                parcelable,
                max_installments,
                interest_rate,
                cor_id,
                promotion,
            }, {
                where: { id: id },
            });
            if (updatedRows > 0) {
                return res
                    .status(200)
                    .json({ msg: "Product updated successfully." });
            }
            else {
                return res.status(500).json({ msg: "Failed to update the product." });
            }
        }
        catch (error) {
            return res
                .status(500)
                .json({ msg: "A server error has occurred." });
        }
    });
}
exports.updateProduct = updateProduct;
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).json({ msg: "ID is required for deletion." });
            }
            const existingProduct = yield product_model_1.default.findOne({
                where: {
                    id: id,
                },
            });
            if (!existingProduct) {
                return res.status(404).json({ msg: "Product not found." });
            }
            yield product_model_1.default.destroy({
                where: { id: id },
            });
            return res.status(200).json({
                msg: `Product with ID ${id} has been deleted from the database.`,
                status: 200,
            });
        }
        catch (error) {
            return res.status(500).json({ msg: "Error when deleting product" });
        }
    });
}
exports.deleteProduct = deleteProduct;
