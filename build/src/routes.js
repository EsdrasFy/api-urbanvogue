"use strict";
// src/routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const routes = express_1.default.Router();
exports.routes = routes;
const user_crud_controller_1 = require("./controllers/user/crud/user-crud.controller");
const login_controller_1 = require("./controllers/user/login/login.controller");
const address_controller_1 = require("./controllers/user/address/address.controller");
const password_controller_1 = require("./controllers/user/password/password.controller");
const card_controller_1 = require("./controllers/user/card/card.controller");
const product_crud_controller_1 = require("./controllers/product/crud/product-crud.controller");
const product_by_id_controller_1 = require("./controllers/product/product-by-id/product-by-id.controller");
const search_products_controller_1 = require("./controllers/product/search-products/search-products.controller");
const scraping_controller_1 = require("./controllers/product/scraping/scraping.controller");
const coupon_controller_1 = require("./controllers/product/coupon/coupon.controller");
const comment_controller_1 = require("./controllers/product/comment/comment.controller");
const credential_middleware_1 = require("./middlewares/credential.middleware");
const oauth_middleware_1 = require("./middlewares/oauth.middleware");
const register_controller_1 = require("./controllers/user/register/register.controller");
const payment_find_controller_1 = require("./controllers/payment/find/payment.find.controller");
const payment_middleware_1 = require("./middlewares/payment.middleware");
const default_controller_1 = require("./controllers/default/default.controller");
const order_controller_1 = require("./controllers/user/order/order.controller");
// Rotas para o usuário
routes.put("/user/update", user_crud_controller_1.updateUser);
routes.delete("/user/delete/:id", user_crud_controller_1.deleteUser);
routes.post("/login/credentials", credential_middleware_1.credentialMiddle, login_controller_1.login);
routes.get("/login/oauth", oauth_middleware_1.oauthMiddle);
routes.post("/register/:type", register_controller_1.register);
routes.get("/show/:id", user_crud_controller_1.readUser);
routes.get("/forgot-password/:email", password_controller_1.sendEmail);
routes.get("/forgot-password/verify/:code/:email", password_controller_1.sendCode);
routes.patch("/forgot-password/reset", password_controller_1.resetPassword);
routes.post("/address/new", address_controller_1.createAddress);
routes.put("/address/edit", address_controller_1.updateAddress);
routes.delete("/address/delete", address_controller_1.deleteAddress);
routes.get("/address/:id", address_controller_1.readAddress);
routes.get("/orders/:id", order_controller_1.getOrders);
routes.get("/order/:user_id/:order_id", order_controller_1.getOrderDetails);
// cupons
routes.post("/coupon/create", coupon_controller_1.createCoupons);
routes.post("/coupon/validate", coupon_controller_1.validateCoupon);
// cards
routes.post("/card/create", card_controller_1.createCard);
routes.get("/card/:id", card_controller_1.readCard);
//payment
routes.post("/payment/:method", payment_middleware_1.paymentMiddle);
routes.get("/payment/find/:method/:order_id/:payment_id", payment_find_controller_1.findPayment);
// Rotas para produtos
routes.post("/product/new", product_crud_controller_1.createProduct);
routes.put("/product/update", product_crud_controller_1.updateProduct);
routes.delete("/product/delete/:id", product_crud_controller_1.deleteProduct);
routes.get("/product/search", search_products_controller_1.productSearch);
routes.get("/product/filter", search_products_controller_1.filterProducts);
routes.get("/product/:id", product_by_id_controller_1.productById);
routes.get("/products/:ids", product_by_id_controller_1.productByIds);
routes.get("/scraping/:content", scraping_controller_1.scraping);
// Rotas para comentarios
routes.post("/comment/create", comment_controller_1.createComment);
routes.get("/comments/:id", comment_controller_1.comments);
routes.get("/", default_controller_1.defaultRoute);
/*arâmetros da query:

    categoria: O nome da categoria do produto (opcional)
    valor_min: O valor mínimo do produto em reais (opcional)
    valor_max: O valor máximo do produto em reais (opcional)
    state: O estado do produto (novo ou usado) (opcional)
    tamanho: O tamanho do produto, separado por vírgulas (opcional)
    avaliacao_min: A avaliação mínima do produto (de 1 a 5) (opcional)
    promocao: Um valor booleano que indica se o produto está em promoção (opcional)
    offset: O número de produtos a serem pulados na busca (opcional, padrão 0)
    order_by: O campo e a direção de ordenação dos produtos, separados por dois pontos (opcional, padrão sem ordenação)
    limit: O número máximo de produtos a serem retornados na busca (opcional, padrão 10)
    search: Pesquisa por palavra em categoria, brand, title(tentar fazer procurar tbm em outras tabelas relacionadas)
 Exemplos de rotas:

    Para buscar todos os produtos: https://example.com/produtos
    Para buscar produtos da categoria “calçados” com preço entre 100 e 200 reais: https://example.com/produtos?categoria=calçados&valor_min=100&valor_max=200
    Para buscar produtos novos com tamanho P ou M, ordenados por preço em ordem crescente: https://example.com/produtos?state=novo&tamanho=P,M&order_by=preco:asc
    Para buscar produtos com avaliação maior ou igual a 4, em promoção, pulando os primeiros 10 resultados e limitando a 5 por busca: https://example.com/produtos?avaliacao_min=4&promocao=true&offset=10&limit=5
*/
