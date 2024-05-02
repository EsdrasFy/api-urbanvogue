"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerUser = void 0;
const express_1 = __importDefault(require("express"));
const routerUser = express_1.default.Router();
exports.routerUser = routerUser;
const user_crud_controller_1 = require("../../controllers/user/crud/user-crud.controller");
const login_controller_1 = require("../../controllers/user/login/login.controller");
const address_controller_1 = require("../../controllers/user/address/address.controller");
const password_controller_1 = require("../../controllers/user/password/password.controller");
const card_controller_1 = require("../../controllers/user/card/card.controller");
// CRUD
routerUser.delete("/user/read/:id", user_crud_controller_1.readUser);
routerUser.put("/user/update", user_crud_controller_1.deleteUser);
routerUser.delete("/user/delete/:id", user_crud_controller_1.updateUser);
// LOGIN && REGISTER
routerUser.post("/req/login", login_controller_1.login);
// FORGOT PASSWORD
routerUser.get("/reset-password/:id/:code", password_controller_1.resetPassword);
// ADDRESS
routerUser.post("/address/new", address_controller_1.createAddress);
routerUser.put("/address/edit", address_controller_1.updateAddress);
routerUser.delete("/address/delete", address_controller_1.deleteAddress);
routerUser.get("/address/:id", address_controller_1.readAddress);
// CARD
routerUser.post("/card/create", card_controller_1.createCard);
routerUser.get("/card/:id", card_controller_1.readCard);
