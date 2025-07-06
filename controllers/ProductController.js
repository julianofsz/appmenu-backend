import Product from "../models/Product.js";

export default class ProductController {
  static async create(req, res) {
    const { name, price, description, ingredients, category } = req.body;
    const imageUrl = req.file; // Assumindo upload de uma única imagem com Multer
    if (!name)
      return res.status(422).json({ message: "O nome é obrigatório." });
    if (!price)
      return res.status(422).json({ message: "O preço é obrigatório." });
    if (!category)
      return res.status(422).json({ message: "A categoria é obrigatória." });
    if (!imageUrl)
      return res.status(422).json({ message: "A imagem é obrigatória." });

    let ingredientsArray = [];
    if (ingredients) {
      try {
        ingredientsArray = JSON.parse(ingredients);
      } catch (error) {
        return res
          .status(422)
          .json({ message: "Formato de ingredientes inválido." });
      }
    }

    const product = new Product({
      name,
      price,
      description,
      ingredients: ingredientsArray,
      category,
      imageUrl: imageUrl.filename, // Salva apenas o nome do arquivo gerado pelo Multer
    });

    try {
      const newProduct = await product.save();
      res
        .status(201)
        .json({ message: "Produto criado com sucesso!", newProduct });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req, res) {
    const { categoria } = req.query;
    const filter = {};
    if (categoria) {
      filter.category = categoria;
    }

    try {
      const products = await Product.find(filter).sort({ createdAt: -1 });
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(422).json({ message: "ID do produto inválido." });
    }

    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    const { name, price, description, ingredients, category, isAvailable } =
      req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }

    if (ingredients) {
      try {
        updateData.ingredients = JSON.parse(ingredients);
      } catch (error) {
        return res
          .status(422)
          .json({ message: "Formato de ingredientes inválido." });
      }
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(422).json({ message: "ID do produto inválido." });
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }
      res
        .status(200)
        .json({ message: "Produto atualizado com sucesso!", updatedProduct });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(422).json({ message: "ID do produto inválido." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    try {
      await Product.findByIdAndDelete(id);
      res.status(200).json({ message: "Produto excluído com sucesso." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
