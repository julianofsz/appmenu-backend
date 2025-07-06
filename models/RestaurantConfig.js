import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const restaurantConfigSchema = new Schema(
  {
    storeName: {
      type: String,
      required: [true, 'O nome do restaurante é obrigatório.'],
      default: 'Snack King',
    },
    storeLogoUrl: {
      type: String,
      default: '/logosnack.png', 
    },
    storeHouseUrl: { 
      type: String,
      default: '/snackhause.png', 
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantConfig = model('RestaurantConfig', restaurantConfigSchema);

export default RestaurantConfig;