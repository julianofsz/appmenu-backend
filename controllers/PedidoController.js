import mongoose from "mongoose";
import Pedido from "../models/Pedido.js";
import Product from "../models/Product.js";
import { customAlphabet } from "nanoid";

export default class PedidoController {
  static async create(req, res) {
    const {
      customerName,
      customerTelefone,
      products,
      consumitionMethod,
      tableNumber,
    } = req.body;
    if (
      !customerName ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res
        .status(422)
        .json({ message: "Nome do cliente e produtos são obrigatórios." });
    }
    try {
      const itemsCompletos = await Promise.all(
        products.map(async (item) => {
          console.log(`LOG 2: Processando item do carrinho com id: ${item.id}`);
          // Verificando se o ID é um formato válido do MongoDB
          if (!mongoose.Types.ObjectId.isValid(item.id)) {
            throw new Error(`ID de produto inválido: ${item.id}`);
          }
          const produtoDoBanco = await Product.findById(item.id);

          if (!produtoDoBanco) {
            throw new Error(
              `Produto com ID ${item.id} não foi encontrado no banco de dados.`
            );
          }

          return {
            productId: produtoDoBanco._id,
            productName: produtoDoBanco.name,
            price: produtoDoBanco.price,
            quantity: item.quantity,
          };
        })
      );

      const total = itemsCompletos.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      //Gera um código de pedido amigável
      const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);
      const orderCode = nanoid();
      const novoPedido = new Pedido({
        customerName,
        customerTelefone,
        products: itemsCompletos,
        consumitionMethod,
        tableNumber,
        total,
        orderCode,
      });

      const pedidoSalvo = await novoPedido.save();
      res
        .status(201)
        .json({ message: "Pedido criado com sucesso!", pedido: pedidoSalvo });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Erro ao criar pedido." });
    }
  }
  static async getAll(req, res) {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    try {
      const pedidos = await Pedido.find(filter).sort("-createdAt");
      res.status(200).json({ pedidos });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { orderStatus, paymentMethod, paymentStatus } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (Object.keys(updateData).length === 0) {
      return res
        .status(422)
        .json({ message: "Nenhum dado para atualizar foi fornecido." });
    }
    try {
      // { new: true } faz com que retorne o documento já com a atualização.
      const pedidoAtualizado = await Pedido.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!pedidoAtualizado) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      res.status(200).json({
        message: "Pedido atualizado com sucesso!",
        pedido: pedidoAtualizado,
      });
    } catch (error) {
      console.error("ERRO DETALHADO NO CATCH DO CONTROLLER:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async clearTable(req, res) {
    const { tableNumber } = req.params;

    try {
      const filter = {
        tableNumber: tableNumber,
        orderStatus: "finalizado",
      };
      const updateResult = await Pedido.updateMany(filter, {
        $set: { tableNumber: null },
      });
      if (updateResult.matchedCount === 0) {
        return res
          .status(404)
          .json({
            message: "Nenhum pedido finalizado encontrado para esta mesa.",
          });
      }
      res
        .status(200)
        .json({ message: `Mesa ${tableNumber} finalizada com sucesso.` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteAllOrders(req, res) {
    try {
      const { deletedCount } = await Pedido.deleteMany({});

      if (deletedCount === 0) {
        return res.status(200).json({ message: "Nenhum pedido para limpar." });
      }

      res
        .status(200)
        .json({
          message: `${deletedCount} pedido(s) foram removidos com sucesso. O caixa está limpo.`,
        });
    } catch (error) {
      console.error("Erro ao limpar os pedidos:", error);
      res.status(500).json({ message: "Falha ao limpar o caixa." });
    }
  }
}
