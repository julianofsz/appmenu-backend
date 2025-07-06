import { Router } from "express";
import ProductController from "../../controllers/ProductController.js";
import verifyToken from "../../helpers/verify-token.js";
import imageUpload from "../../helpers/image-upload.js";

const routesProduct = Router();

routesProduct.get('/', ProductController.getAll);

routesProduct.get('/:id', ProductController.getById);

routesProduct.post('/create', verifyToken,  imageUpload.single("image"), ProductController.create);

routesProduct.delete('/:id', verifyToken,  ProductController.deleteById);

routesProduct.put('/:id', verifyToken, imageUpload.single("image"), ProductController.updateById);

routesProduct.patch('/:id', verifyToken, ProductController.updateById);

export default routesProduct;