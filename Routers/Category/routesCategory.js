import { Router } from "express";
import CategoryController from "../../controllers/CategoryController.js";
import verifyToken from "../../helpers/verify-token.js";

const routesCategory = Router();
routesCategory.get("/", CategoryController.getAll);

routesCategory.post("/", verifyToken, CategoryController.create);

routesCategory.put("/:id", verifyToken, CategoryController.updateById);

routesCategory.delete("/:id", verifyToken, CategoryController.deleteById);

routesCategory.patch("/:id/toggle", verifyToken, CategoryController.toggleActiveStatus);

export default routesCategory;
