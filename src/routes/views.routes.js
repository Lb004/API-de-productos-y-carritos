import { Router } from "express";
<<<<<<< HEAD
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// 🏠 Vista principal con paginación
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query, category } = req.query;
    
    const result = await productManager.getProducts({
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      sort,
      query,
      category
    });

    res.render("home", {
      title: "Productos",
      ...result
    });
  } catch (error) {
    console.error('❌ Error en vista home:', error.message);
    res.render("home", {
      title: "Productos",
      error: error.message,
      payload: [],
      page: 1,
      totalPages: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null
    });
  }
});

// 📱 Vista de detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).render("error", {
        title: "Producto no encontrado",
        message: "El producto solicitado no existe"
      });
    }

    res.render("productDetail", {
      title: product.title,
      product: product
    });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error",
      message: error.message
    });
  }
});

// 🛒 Vista de carrito específico
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).render("error", {
        title: "Carrito no encontrado",
        message: "El carrito solicitado no existe"
      });
    }

    res.render("cart", {
      title: "Carrito de Compras",
      cart: cart
    });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error",
      message: error.message
    });
  }
});

// ⚡ Vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 50 });

    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      products: result.payload
    });
  } catch (error) {
    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      error: error.message,
      products: []
    });
  }
});

export default router;
=======
import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(
  path.join(__dirname, "../../data/products.json")
);

// 🏠 Vista principal (lista estática)
router.get("/", (req, res) => {
  const products = productManager.getProducts();
  res.render("home", {
    title: "Inicio",
    products,
  });
});

// ⚡ Vista con WebSockets en tiempo real
router.get("/realtimeproducts", (req, res) => {
  const products = productManager.getProducts();
  res.render("realTimeProducts", {
    title: "Productos en tiempo real",
    products,
  });
});

export default router;
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
