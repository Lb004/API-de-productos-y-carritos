import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

class CartManager {
  
  // 🆕 CREAR NUEVO CARRITO
  async createCart() {
    try {
      const cart = new Cart({ products: [] });
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  // 🔍 OBTENER CARRITO POR ID CON POPULATE
  async getCartById(id) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("ID de carrito inválido");
      }

      const cart = await Cart.findById(id)
        .populate('products.product')
        .lean(); // ← .lean() para objeto plano
      
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

  // ➕ AGREGAR PRODUCTO AL CARRITO
  async addProductToCart(cartId, productId) {
    try {
      if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(productId)) {
        throw new Error("ID de carrito o producto inválido");
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Verificar que el producto existe
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Buscar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        // Si existe, incrementar cantidad
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Si no existe, agregar nuevo item
        cart.products.push({ 
          product: productId, 
          quantity: 1 
        });
      }

      await cart.save();
      
      // Retornar carrito actualizado con populate
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  // 🔢 ACTUALIZAR CANTIDAD DE PRODUCTO
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(productId)) {
        throw new Error("ID de carrito o producto inválido");
      }

      if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Buscar el índice del producto en el array
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      // Actualizar la cantidad
      cart.products[productIndex].quantity = quantity;
      
      // Guardar el carrito
      await cart.save();
      
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  // 🗑️ ELIMINAR PRODUCTO DEL CARRITO
  async deleteProductFromCart(cartId, productId) {
    try {
      if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(productId)) {
        throw new Error("ID de carrito o producto inválido");
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Filtrar el producto a eliminar
      cart.products = cart.products.filter(
        item => item.product.toString() !== productId.toString()
      );

      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

  // 🧹 VACIAR CARRITO
  async clearCart(cartId) {
    try {
      if (!mongoose.isValidObjectId(cartId)) {
        throw new Error("ID de carrito inválido");
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = [];
      await cart.save();
      
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al vaciar carrito: ${error.message}`);
    }
  }
}

export default CartManager;