import mongoose from "mongoose";
const { Schema, model } = mongoose;
const categorySchema = new Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome da categoria é obrigatório."],
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

export default Category;
