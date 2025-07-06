import mongoose from "mongoose";
const { Schema, model } = mongoose;
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do produto é obrigatório."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "O preço do produto é obrigatório."],
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
      required: [true, "A URL da imagem é obrigatória."],
    },
    category: {
      type: Schema.Types.ObjectId, //O tipo correto para um ID de outro documento
      ref: "Category",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);
export default Product;
