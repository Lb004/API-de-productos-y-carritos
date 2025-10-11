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
