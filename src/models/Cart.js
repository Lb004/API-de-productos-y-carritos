import mongoose from "mongoose";

// Esquema para los items del carrito
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",  // Referencia al modelo Product
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
    default: 1
  }
});

// Esquema principal del carrito
const cartSchema = new mongoose.Schema({
  products: [cartItemSchema]
}, {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;