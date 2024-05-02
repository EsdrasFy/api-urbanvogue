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
exports.filterProducts = exports.productSearch = void 0;
const sequelize_1 = require("sequelize");
const product_model_1 = __importDefault(require("../../../database/models/product/product.model"));
const product_image_model_1 = require("../../../database/models/product/product-image/product-image.model");
const product_color_model_1 = require("../../../database/models/product/product-color/product-color.model");
const product_detail_model_1 = require("../../../database/models/product/product-detail/product-detail.model");
const product_size_model_1 = require("../../../database/models/product/product-size/product-size.model");
const product_flag_model_1 = require("../../../database/models/product/product-flag/product-flag.model");
function filterProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, search, categoria, brand, valor_min, valor_max, state, tamanho, avaliacao_min, promocao, offset, order_by, limit, } = req.query;
        try {
            let where = {};
            /////////////////////////////////////// ////////////////////////////////////////////
            if (categoria) {
                where.category = categoria;
            }
            if (brand) {
                where.brand = brand;
            }
            if (state) {
                where.state = state;
            }
            if (id) {
                where.id = id;
            }
            if (avaliacao_min) {
                where.assessment = { [sequelize_1.Op.gte]: avaliacao_min };
            }
            if (valor_min && valor_max) {
                where.price = { [sequelize_1.Op.between]: [valor_min, valor_max] };
            }
            if (promocao) {
                where.promotion = { [sequelize_1.Op.not]: null || false };
            }
            if (typeof tamanho === "string") {
                const tamanhoArray = tamanho.split(",").map((tam) => tam.trim());
                const tamanhoConditions = tamanhoArray.map((tam) => ({
                    sizes: { [sequelize_1.Op.like]: `%${tam}%` },
                }));
                where[sequelize_1.Op.and] = tamanhoConditions;
            }
            let order = [];
            if (typeof order_by === "string") {
                const [field, direction] = order_by.split(":");
                const trimmedField = field.trim();
                const trimmedDirection = direction
                    ? direction.trim().toLowerCase()
                    : "asc";
                const validDirections = ["asc", "desc"];
                if (validDirections.includes(trimmedDirection)) {
                    order.push([trimmedField, trimmedDirection]);
                }
                else {
                    return res.status(400).json({
                        error: "Direção de ordenação inválida. Use 'asc' ou 'desc'.",
                    });
                }
            }
            const options = {
                where,
                offset: typeof offset === "string" ? parseInt(offset, 10) : 0,
                limit: typeof limit === "string" ? parseInt(limit, 10) : 10,
                order: order.length > 0 ? [...order] : [],
            };
            if (typeof search === "string") {
                options.where = {
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${search}%` } },
                        { brand: { [sequelize_1.Op.like]: `%${search}%` } },
                        { category: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const products = yield product_model_1.default.findAll(Object.assign(Object.assign({}, options), { include: [
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
                ] }));
            res.status(200).json({ products });
        }
        catch (error) {
            console.error("Erro ao obter produtos:", error);
            res.status(500).json({ error: "Erro ao obter produtos" });
        }
    });
}
exports.filterProducts = filterProducts;
function productSearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { query, orderBy, limit, offset, category, brand, min, max } = req.query;
        try {
            let whereCondition = {
                [sequelize_1.Op.or]: [
                    { title: { [sequelize_1.Op.like]: `%${query}%` } },
                    { brand: { [sequelize_1.Op.like]: `%${query}%` } },
                    {
                        "$colors.name_color$": { [sequelize_1.Op.like]: `%${query}%` },
                    },
                    {
                        "$details.detail$": { [sequelize_1.Op.like]: `%${query}%` },
                    },
                    {
                        "$sizes.size$": { [sequelize_1.Op.like]: `%${query}%` },
                    },
                    {
                        "$flags.flag$": { [sequelize_1.Op.like]: `%${query}%` },
                    },
                ],
            };
            const productsId = (yield product_model_1.default.findAll({
                where: whereCondition,
                attributes: ["id", "category", "brand"],
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
                    {
                        model: product_flag_model_1.ProductFlagM,
                        as: "flags",
                        attributes: ["flag"],
                    },
                ],
            }));
            let categories = {};
            for (let i = 0; i < productsId.length; i++) {
                if (categories[productsId[i].category]) {
                    categories[productsId[i].category]++;
                }
                else {
                    categories[productsId[i].category] = 1;
                }
            }
            let brands = {};
            for (let i = 0; i < productsId.length; i++) {
                if (brands[productsId[i].brand]) {
                    brands[productsId[i].brand]++;
                }
                else {
                    brands[productsId[i].brand] = 1;
                }
            }
            let sizes = {};
            for (let i = 0; i < productsId.length; i++) {
                for (let j = 0; j < productsId[i].sizes.length; j++) {
                    const size = productsId[i].sizes[j].size;
                    if (sizes[size]) {
                        sizes[size]++;
                    }
                    else {
                        sizes[size] = 1;
                    }
                }
            }
            let colors = {};
            for (let i = 0; i < productsId.length; i++) {
                for (let j = 0; j < productsId[i].colors.length; j++) {
                    const color = productsId[i].colors[j].name_color;
                    if (colors[color]) {
                        colors[color]++;
                    }
                    else {
                        colors[color] = 1;
                    }
                }
            }
            const filters = {
                sizes,
                colors,
                categories,
                brands,
            };
            let order = [];
            if (typeof orderBy === "string") {
                const [field, direction] = orderBy.split(":");
                const trimmedField = field.trim();
                const trimmedDirection = direction
                    ? direction.trim().toLowerCase()
                    : "asc";
                const validDirections = ["asc", "desc"];
                if (validDirections.includes(trimmedDirection)) {
                    order.push([trimmedField, trimmedDirection]);
                }
                else {
                    return res.status(400).json({
                        error: "Direção de ordenação inválida. Use 'asc' ou 'desc'.",
                    });
                }
            }
            const productIdsArray = productsId.map((product) => product.id);
            let where = {};
            if (productIdsArray) {
                where.id = productIdsArray;
            }
            if (category) {
                where.category = category;
            }
            if (brand) {
                where.brand = brand;
            }
            if (min && max) {
                where.price = { [sequelize_1.Op.between]: [min, max] };
            }
            const offsetValue = typeof offset === "string" ? parseInt(offset, 10) : 0;
            const limitValue = typeof limit === "string" ? parseInt(limit, 10) : 23;
            const orderValue = order.length > 0 ? [...order] : [];
            const products = (yield product_model_1.default.findAll({
                where: where,
                offset: offsetValue,
                limit: limitValue,
                order: orderValue,
                include: [
                    {
                        model: product_image_model_1.ProductImageM,
                        as: "images",
                        attributes: ["url"],
                    },
                ],
            }));
            if (products.length > 0) {
                return res.status(200).json({ filters, products });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
}
exports.productSearch = productSearch;
