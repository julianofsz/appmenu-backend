import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const { Schema, model } = mongoose;
const itemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const pedidoSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerTelefone: {
      type: String,
    },
    products: [itemSchema],
    consumitionMethod: {
      type: String,
      required: true,
      enum: ["comer", "levar"],
    },
    tableNumber: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Pendente", "Cartão", "Pix", "Dinheiro"],
      default: "Pendente",
    },
    orderStatus: {
      type: String,
      enum: ["novo", "preparando", "finalizado", "cancelado"],
      default: "novo",
    },
    paymentStatus: {
      type: String,
      enum: ["pendente", "pago"],
      default: "pendente",
    },
  },
  {
    timestamps: true,
  }
);

const Pedido = model("Pedido", pedidoSchema);

export default Pedido;
