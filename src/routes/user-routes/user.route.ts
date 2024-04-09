import express from "express";
const routerUser = express.Router();

import { deleteUser, updateUser, readUser } from "../../controllers/user/crud/user-crud.controller";
import {  login } from "../../controllers/user/login/login.controller";
import { deleteAddress, createAddress, readAddress, updateAddress } from "../../controllers/user/address/address.controller";
import { resetPassword } from "../../controllers/user/password/password.controller";
import { createCard, readCard } from "../../controllers/user/card/card.controller";

// CRUD
routerUser.delete("/user/read/:id", readUser);
routerUser.put("/user/update", deleteUser);
routerUser.delete("/user/delete/:id", updateUser);

// LOGIN && REGISTER
routerUser.post("/req/login", login);

// FORGOT PASSWORD
routerUser.get("/reset-password/:id/:code", resetPassword);

// ADDRESS
routerUser.post("/address/new", createAddress);
routerUser.put("/address/edit", updateAddress);
routerUser.delete("/address/delete", deleteAddress);
routerUser.get("/address/:id", readAddress);

// CARD
routerUser.post("/card/create", createCard);
routerUser.get("/card/:id", readCard);

export { routerUser };
