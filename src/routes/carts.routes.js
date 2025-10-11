import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const cartManager = new CartManager(
  path.join(__dirname, "../../data/carts.json")
);

// POST / - Crear nuevo carrito
router.post("/", (req, res) => {
  try {
    const newCart = cartManager.createCart();

    res.status(201).json({
      status: "success",
      message: "Carrito creado exitosamente",
      payload: newCart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// GET /:cid - Obtener productos del carrito
router.get("/:cid", (req, res) => {
  try {
    const { cid } = req.params;
    const cart = cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = cartManager.addProductToCart(cid, pid);

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
