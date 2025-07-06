import { Router } from "express";
import PaymentController from "../../controllers/PaymentController.js";

const routesPayment = Router();
routesPayment.post("/create-preference", PaymentController.createPaymentPreference);

routesPayment.post("/webhook", PaymentController.receiveWebhook);

routesPayment.get("/status/:paymentId", PaymentController.getPaymentStatus);
export default routesPayment;