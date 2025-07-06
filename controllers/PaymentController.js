// Em controllers/PaymentController.js

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import Pedido from "../models/Pedido.js";
import "dotenv/config";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default class PaymentController {
  static async createPaymentPreference(req, res) {
    const { orderId, items, payerInfo } = req.body;

    try {
      const body = {
        items: items.map((item) => ({
          id: item.productId,
          title: item.productName,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "BRL",
        })),
        payer: {
          name: payerInfo.name,
          email: payerInfo.email,
        },
        back_urls: {
          success: `${process.env.FRONTEND_PUBLIC_URL}/pedido/sucesso`,
          failure: `${process.env.FRONTEND_PUBLIC_URL}/pedido/falha`,
          pending: `${process.env.FRONTEND_PUBLIC_URL}/pedido/pendente`,
        },

        external_reference: orderId,
      };

      const preference = new Preference(client);
      const result = await preference.create({ body });

      res.status(201).json({ paymentUrl: result.init_point });
    } catch (error) {
      console.error("Erro ao criar preferência de pagamento:", error);
      res.status(500).json({ message: "Falha ao gerar link de pagamento." });
    }
  }

  static async receiveWebhook(req, res) {
    const { body } = req; // O corpo da notificação

    // Verifica se é uma notificação de pagamento
    if (body.type === "payment") {
      const paymentId = body.data.id;
      console.log(`Recebida notificação para o pagamento ID: ${paymentId}`);

      try {
        // Busca os detalhes completos do pagamento na API do Mercado Pago
        const payment = new Payment(client);
        const paymentDetails = await payment.get({ id: paymentId });

        // Verifica se o pagamento foi aprovado
        if (paymentDetails.status === "approved") {
          const orderId = paymentDetails.external_reference;
          console.log(
            `Pagamento aprovado para o pedido do nosso banco: ${orderId}`
          );

          let paymentMethodFromMP = "Outro"; // Valor padrão
          const paymentType = paymentDetails.payment_type_id;

          if (paymentType === "credit_card" || paymentType === "debit_card") {
            paymentMethodFromMP = "Cartão";
          } else if (paymentType === "pix") {
            paymentMethodFromMP = "Pix";
          } else if (paymentType === "account_money") {
            // Dinheiro na conta Mercado Pago, pode ser tratado como quiser
            paymentMethodFromMP = "Dinheiro";
          }

          console.log(
            `Método de pagamento identificado: ${paymentMethodFromMP}`
          );

          // 2. Atualiza o pedido no seu banco, agora incluindo o paymentMethod
          await Pedido.findByIdAndUpdate(orderId, {
            paymentStatus: "pago",
            paymentMethod: paymentMethodFromMP, // Adiciona o método de pagamento
          });

          console.log(
            `Pedido ${orderId} atualizado para 'pago' e 'preparando'.`
          );
        }
      } catch (error) {
        console.error("Erro ao processar webhook:", error);
      }
    }

    // Responde ao Mercado Pago com 200 OK para confirmar o recebimento
    res.status(200).send("Webhook recebido");
  }
  // 👇 NOVO MÉTODO PARA VERIFICAR O PAGAMENTO 👇
  static async getPaymentStatus(req, res) {
    const { paymentId } = req.params;

    try {
      const payment = new Payment(client);
      const paymentDetails = await payment.get({ id: paymentId });

      const orderId = paymentDetails.external_reference;
      const orderStatus = paymentDetails.status;

      // Se o pagamento foi aprovado, atualizamos nosso banco de dados
      if (orderStatus === "approved") {
        await Pedido.findByIdAndUpdate(orderId, {
          paymentStatus: "pago",
          orderStatus: "novo",
        });
      }

      // Devolve o status final para o frontend
      res.status(200).json({ status: orderStatus });
    } catch (error) {
      console.error(`Erro ao verificar pagamento ${paymentId}:`, error);
      res
        .status(500)
        .json({ message: "Falha ao verificar status do pagamento." });
    }
  }
}
