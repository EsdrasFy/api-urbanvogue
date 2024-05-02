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
exports.productByIds = exports.productById = void 0;
const comment_model_1 = require("../../../database/models/product/product-comment/comment.model");
const product_model_1 = __importDefault(require("../../../database/models/product/product.model"));
const product_image_model_1 = require("../../../database/models/product/product-image/product-image.model");
const product_color_model_1 = require("../../../database/models/product/product-color/product-color.model");
const product_detail_model_1 = require("../../../database/models/product/product-detail/product-detail.model");
const product_size_model_1 = require("../../../database/models/product/product-size/product-size.model");
function productById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ msg: "Need id!" });
        }
        const intId = parseInt(id, 10);
        try {
            const comments = yield comment_model_1.CommentM.findAll({
                where: {
                    product_id: intId,
                },
                attributes: ["rating", "recommend", "product_id"],
            });
            const product = (yield product_model_1.default.findOne({
                where: {
                    id: intId,
                },
                include: [
                    {
                        model: product_image_model_1.ProductImageM,
                        as: "images",
                        attributes: ["url"],
                    },
                    {
                        model: product_color_model_1.ProductColorM,
                        as: "colors",
                        attributes: ["name_color"],
                    },
                    {
                        model: product_detail_model_1.ProductDetailM,
                        as: "details",
                        attributes: ["detail"],
                    },
                    {
                        model: product_size_model_1.ProductSizeM,
                        as: "sizes",
                        attributes: ["size"],
                    },
                ],
            }));
            if (!product) {
                return res.status(404).json({ msg: "Product not found" });
            }
            const productStats = comments.reduce((acc, comment) => {
                const productId = comment.product_id;
                if (!acc[productId]) {
                    acc[productId] = {
                        ratings: [],
                        recommends: [],
                    };
                }
                acc[productId].ratings.push(comment.rating);
                acc[productId].recommends.push(comment.recommend);
                return acc;
            }, {});
            const productId = product.id;
            const { ratings, recommends } = productStats[productId] || {};
            const averageRating = ratings && ratings.length > 0
                ? ratings.reduce((a, b) => a + b) / ratings.length
                : 0;
            const recommendPercentage = recommends && recommends.length > 0
                ? (recommends.filter((recommend) => recommend).length /
                    recommends.length) *
                    100
                : 0;
            const rating = parseFloat(averageRating.toFixed(2));
            const percentage = parseFloat(recommendPercentage.toFixed(2));
            const productsWithStats = Object.assign(Object.assign({}, product.toJSON()), { rating: rating !== 0 ? rating : 3, quantityRatings: ratings ? ratings.length : 0, percentage: percentage !== 0 && recommends.length !== 0 ? percentage : 100, quantityRecommends: recommends ? recommends.length : 0 });
            res
                .status(200)
                .json({ product: productsWithStats, status: 200, msg: "Successfull!" });
        }
        catch (error) {
            console.error("Erro ao obter produto:", error);
            res.status(500).json({ error: "Erro ao obter produto" });
        }
    });
}
exports.productById = productById;
function productByIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ids } = req.params;
        if (!ids) {
            res.status(404).json({ msg: "Need id!" });
        }
        console.log(ids);
        let intIds = ids.split("&").map((id) => parseInt(id, 10));
        console.log(intIds);
        try {
            const products = (yield product_model_1.default.findAll({
                where: {
                    id: intIds,
                },
                include: [
                    {
                        model: product_image_model_1.ProductImageM,
                        as: "images",
                        attributes: ["url"],
                    },
                    {
                        model: product_color_model_1.ProductColorM,
                        as: "colors",
                        attributes: ["name_color"],
                    },
                    {
                        model: product_size_model_1.ProductSizeM,
                        as: "sizes",
                        attributes: ["size"],
                    },
                ],
            }));
            res.status(200).json({ status: 200, products, msg: " Successfull!" });
        }
        catch (error) {
            console.error("Erro ao obter produtos:", error);
            res.status(500).json({ error: "Erro ao obter produtos" });
        }
    });
}
exports.productByIds = productByIds;
