"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerProduct = void 0;
const express_1 = __importDefault(require("express"));
const routerProduct = express_1.default.Router();
exports.routerProduct = routerProduct;
const product_crud_controller_1 = require("../../controllers/product/crud/product-crud.controller");
const product_by_id_controller_1 = require("../../controllers/product/product-by-id/product-by-id.controller");
const search_products_controller_1 = require("../../controllers/product/search-products/search-products.controller");
const scraping_controller_1 = require("../../controllers/product/scraping/scraping.controller");
const coupon_controller_1 = require("../../controllers/product/coupon/coupon.controller");
// CRUD
routerProduct.post("/product/new", product_crud_controller_1.createProduct);
routerProduct.put("/product/update", product_crud_controller_1.updateProduct);
routerProduct.delete("/product/delete/:id", product_crud_controller_1.deleteProduct);
// SEARCH && PRODUCT BY ID
routerProduct.get("/product/:ids", product_by_id_controller_1.productById);
routerProduct.get("/product/filter", search_products_controller_1.productSearch);
// SCRAPING
routerProduct.get("/scraping/:content", scraping_controller_1.scraping);
// COUPON
routerProduct.post("/coupon/create", coupon_controller_1.createCoupons);
routerProduct.post("/coupon/validate", coupon_controller_1.validateCoupon);
