import { Router } from "express";
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
