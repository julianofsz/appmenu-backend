import RestaurantConfig from "../models/RestaurantConfig.js";

export default class RestaurantConfigController {
  static async getConfig(req, res) {
    try {
      let config = await RestaurantConfig.findOne();
      if (!config) {
        config = await new RestaurantConfig().save();
      }
      res.status(200).json(config);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateConfig(req, res) {
    const { storeName } = req.body;
    const updateData = { storeName };
    if (req.files) {
      if (req.files.storeLogo) {
        updateData.storeLogoUrl = req.files.storeLogo[0].filename;
      }
      if (req.files.storeHouse) {
        updateData.storeHouseUrl = req.files.storeHouse[0].filename;
      }
    }

    try {
      const updatedConfig = await RestaurantConfig.findOneAndUpdate(
        {},
        updateData,
        { new: true, upsert: true }
      );
      res
        .status(200)
        .json({
          message: "Configurações atualizadas com sucesso!",
          config: updatedConfig,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
