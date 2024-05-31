// src/routes.ts

import express, { Request, Response } from "express";
require("dotenv").config();
const routes = express.Router();
import {
  deleteUser,
  updateUser,
  readUser,
} from "./controllers/user/crud/user-crud.controller";
import {
  deleteAddress,
  createAddress,
  readAddress,
  updateAddress,
} from "./controllers/user/address/address.controller";
import {
  resetPassword,
  receiveEmail,
} from "./controllers/user/password/password.controller";
import { createCard, readCard } from "./controllers/user/card/card.controller";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./controllers/product/crud/product-crud.controller";
import {
  productById,
  productByIds,
} from "./controllers/product/product-by-id/product-by-id.controller";
import {
  filterProducts,
  productSearch,
} from "./controllers/product/search-products/search-products.controller";
import { scraping } from "./controllers/product/scraping/scraping.controller";
import {
  createCoupons,
  validateCoupon,
} from "./controllers/product/coupon/coupon.controller";
import {
  comments,
  createComment,
} from "./controllers/product/comment/comment.controller";
import { credentialMiddle } from "./middlewares/credential.middleware";
import { register } from "./controllers/user/register/register.controller";
import { findPayment } from "./controllers/payment/find/payment.find.controller";
import { paymentMiddle } from "./middlewares/payment.middleware";
import { defaultRoute } from "./controllers/default/default.controller";
import {
  getOrderDetails,
  getOrders,
} from "./controllers/user/order/order.controller";
import { forgotPasswordMiddle } from "./middlewares/forgot-password.middleware";
import { UserChanges } from "./controllers/user/changes/changes.controller";
import { toChange } from "./controllers/user/changes/to-change/to-change.controller";
import { codeReceived } from "./middlewares/code-received.middeware";
import { createNotifications, getNotifications, updateNotifications } from "./controllers/user/notify/notify-controller";

// Rotas para o usuário


routes.get("/show/:id", readUser);

routes.get("/forgot-password", forgotPasswordMiddle, receiveEmail);
routes.patch("/forgot-password/reset", resetPassword);
routes.post("/address/new", createAddress);
routes.put("/address/edit", updateAddress);
routes.delete("/address/delete", deleteAddress);
routes.get("/address/:id", readAddress);

routes.get("/orders/:id", getOrders);
routes.get("/order/:user_id/:order_id", getOrderDetails);

routes.post("/user/notification/create", createNotifications )
routes.get("/user/notifications", getNotifications )
routes.post("/user/notifications/update", updateNotifications)

// cupons
routes.post("/coupon/create", createCoupons);
routes.post("/coupon/validate", validateCoupon);

// cards
routes.post("/card/create", createCard);
routes.get("/card/:id", readCard);

//payment
routes.post("/payment/:method", paymentMiddle);
routes.get("/payment/find/:method/:order_id/:payment_id", findPayment);

// Rotas para produtos
routes.post("/product/new", createProduct);
routes.put("/product/update", updateProduct);
routes.delete("/product/delete/:id", deleteProduct);
routes.get("/product/search", productSearch);
routes.get("/product/filter", filterProducts);
routes.get("/product/:id", productById);
routes.get("/products/:ids", productByIds);
routes.get("/scraping/:content", scraping);

// Rotas para comentarios

routes.post("/comment/create", createComment);
routes.get("/comments/:id", comments);

routes.get("/", defaultRoute);

export { routes };

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
    Para buscar produtos da categoria “calçados” com preço entre 100 e 200 reais: https://example.com/produtoscategoria=calçados&valor_min=100&valor_max=200
    Para buscar produtos novos com tamanho P ou M, ordenados por preço em ordem crescente: https://example.com/produtosstate=novo&tamanho=P,M&order_by=preco:asc
    Para buscar produtos com avaliação maior ou igual a 4, em promoção, pulando os primeiros 10 resultados e limitando a 5 por busca: https://example.com/produtosavaliacao_min=4&promocao=true&offset=10&limit=5
*/
