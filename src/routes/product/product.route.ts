import express from "express";
const routerProduct = express.Router();
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/product/crud/product-crud.controller";
import { productById } from "../../controllers/product/product-by-id/product-by-id.controller";
import { productSearch } from "../../controllers/product/search-products/search-products.controller";
import { scraping } from "../../controllers/product/scraping/scraping.controller";
import {
  createCoupons,
  validateCoupon,
} from "../../controllers/product/coupon/coupon.controller";

// CRUD
routerProduct.post("/product/new", createProduct);
routerProduct.put("/product/update", updateProduct);
routerProduct.delete("/product/delete/:id", deleteProduct);

// SEARCH && PRODUCT BY ID
routerProduct.get("/product/:ids", productById);
routerProduct.get("/product/filter", productSearch);

// SCRAPING
routerProduct.get("/scraping/:content", scraping);

// COUPON
routerProduct.post("/coupon/create", createCoupons);
routerProduct.post("/coupon/validate", validateCoupon);

export { routerProduct };
