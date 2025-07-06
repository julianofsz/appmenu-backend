import { Router } from "express";
import RestaurantConfigController from "../../controllers/RestaurantConfigController.js";
import verifyToken from "../../helpers/verify-token.js";
import imageUpload from "../../helpers/image-upload.js";

const routesRestaurantConfig = Router();

routesRestaurantConfig.get("/", RestaurantConfigController.getConfig);

// Usamos .fields() do Multer para aceitar duas imagens com nomes de campo diferentes
routesRestaurantConfig.put("/", verifyToken, imageUpload.fields([
    { name: 'storeLogo', maxCount: 1 },
    { name: 'storeHouse', maxCount: 1 }
]), RestaurantConfigController.updateConfig);

export default routesRestaurantConfig;