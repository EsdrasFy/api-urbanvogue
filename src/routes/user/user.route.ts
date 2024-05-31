import { Router } from "express";
import {
  deleteUser,
  updateUser,
} from "../../controllers/user/crud/user-crud.controller";
import { UserChanges } from "../../controllers/user/changes/changes.controller";
import { codeReceived } from "../../middlewares/code-received.middeware";
import { toChange } from "../../controllers/user/changes/to-change/to-change.controller";
import { register } from "../../controllers/user/register/register.controller";

const UserRoutes = Router();
UserRoutes.put("/user/update", updateUser);
UserRoutes.delete("/user/delete/:id", deleteUser);
UserRoutes.post("/user/changes", UserChanges);
UserRoutes.get("/user/changes", codeReceived, toChange);
UserRoutes.post("/register/:type", register);

export default UserRoutes;
