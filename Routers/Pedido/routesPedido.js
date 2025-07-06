import { Router } from "express";
import PedidoController from "../../controllers/PedidoController.js";
import verifyToken from "../../helpers/verify-token.js";

const routesPedido = Router();

routesPedido.post("/", PedidoController.create);

routesPedido.get("/", verifyToken, PedidoController.getAll);

routesPedido.patch("/:id", verifyToken, PedidoController.update);

routesPedido.delete("/mesa/:tableNumber", verifyToken, PedidoController.clearTable);

routesPedido.delete("/", verifyToken, PedidoController.deleteAllOrders);

export default routesPedido;