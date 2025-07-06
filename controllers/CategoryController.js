import Category from "../models/Category.js";
export default class CategoryController {
  static async create(req, res) {
    const { nome } = req.body;

    if (!nome) {
      return res
        .status(422)
        .json({ message: "O nome da categoria é obrigatório." });
    }
    const categoryExists = await Category.findOne({ nome: nome });
    if (categoryExists) {
      return res
        .status(422)
        .json({ message: "Esta categoria já está cadastrada." });
    }
    const category = new Category({
      nome,
    });
    try {
      const newCategory = await category.save();
      res.status(201).json({
        message: "Categoria criada com sucesso!",
        category: newCategory,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getAll(req, res) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async deleteById(req, res) {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(422).json({ message: "ID da categoria inválido." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    try {
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "Categoria excluída com sucesso." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateById(req, res) {
    const { id } = req.params;
    const { nome } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(422).json({ message: "ID da categoria inválido." });
    }

    if (!nome) {
      return res
        .status(422)
        .json({ message: "O nome da categoria é obrigatório." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    category.nome = nome;

    try {
      const updatedCategory = await category.save();
      res.status(200).json({
        message: "Categoria atualizada com sucesso!",
        category: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async toggleActiveStatus(req, res) {
    const { id } = req.params;
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada." });
      }
      // Inverte o valor atual
      category.isActive = !category.isActive;

      await category.save();

      res.status(200).json({
        message: `Categoria ${
          category.isActive ? "habilitada" : "desabilitada"
        } com sucesso!`,
        category,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
