<<<<<<< HEAD
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
        .populate('products.product') // ✅ POPULATE
        .lean(); // ✅ LEAN para objetos planos
      
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      
      // ✅ VALIDAR que todos los productos existan
      cart.products = cart.products.filter(item => {
        if (!item.product) {
          console.warn(`⚠️ Producto eliminado o inválido en carrito ${id}`);
          return false;
        }
        return true;
      });
      
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

  // 🔄 ACTUALIZAR TODO EL CARRITO CON NUEVO ARRAY DE PRODUCTOS
  async updateCart(cartId, products) {
    try {
      if (!mongoose.isValidObjectId(cartId)) {
        throw new Error("ID de carrito inválido");
      }

      // Verificar que el carrito existe
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Validar que todos los productos existan en la BD
      for (const item of products) {
        if (!mongoose.isValidObjectId(item.product)) {
          throw new Error(`ID de producto inválido: ${item.product}`);
        }

        const productExists = await Product.findById(item.product);
        if (!productExists) {
          throw new Error(`Producto no encontrado: ${item.product}`);
        }

        if (item.quantity <= 0) {
          throw new Error("La cantidad debe ser mayor a 0");
        }
      }

      // Reemplazar completamente el array de productos
      cart.products = products;
      await cart.save();
      
      // Retornar el carrito actualizado con populate
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }
}

export default CartManager;
=======
import fs from "fs";

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.initializeFile();
  }

  // Inicializar el archivo si no existe
  initializeFile() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, JSON.stringify([], null, 2));
      }
      this.loadCarts();
    } catch (error) {
      console.error("Error al inicializar archivo:", error);
    }
  }

  // Cargar carritos desde el archivo
  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar carritos:", error);
      this.carts = [];
    }
  }

  // Guardar carritos en el archivo
  saveCarts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error("Error al guardar carritos:", error);
    }
  }

  // Generar ID único
  generateId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.carts.map((c) => c.id));
    return maxId + 1;
  }

  // Crear un nuevo carrito
  createCart() {
    this.loadCarts();

    const newCart = {
      id: this.generateId(),
      products: [],
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  // Obtener carrito por ID
  getCartById(id) {
    this.loadCarts();
    const cart = this.carts.find((c) => c.id === parseInt(id));
    return cart || null;
  }

  // Agregar producto al carrito
  addProductToCart(cartId, productId) {
    this.loadCarts();
    const cartIndex = this.carts.findIndex((c) => c.id === parseInt(cartId));

    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado");
    }

    const cart = this.carts[cartIndex];
    const productIndex = cart.products.findIndex(
      (p) => p.product === parseInt(productId)
    );

    if (productIndex !== -1) {
      // Si el producto ya existe, incrementar cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si el producto no existe, agregarlo
      cart.products.push({
        product: parseInt(productId),
        quantity: 1,
      });
    }

    this.carts[cartIndex] = cart;
    this.saveCarts();
    return cart;
  }
}

export default CartManager;
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
