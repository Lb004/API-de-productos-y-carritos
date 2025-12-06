import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  products: [cartItemSchema]
}, {
  timestamps: true
});

export default mongoose.model("Cart", cartSchema);