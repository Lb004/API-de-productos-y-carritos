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

// GET / - Listar todos los productos
router.get("/", (req, res) => {
  try {
    const products = productManager.getProducts();
    res.json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// GET /:pid - Obtener producto por ID
router.get("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const product = productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// POST / - Agregar nuevo producto
router.post("/", (req, res) => {
  try {
    const productData = req.body;
    const newProduct = productManager.addProduct(productData);

    res.status(201).json({
      status: "success",
      message: "Producto creado exitosamente",
      payload: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// PUT /:pid - Actualizar producto
router.put("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;
    const updatedProduct = productManager.updateProduct(pid, updates);

    res.json({
      status: "success",
      message: "Producto actualizado exitosamente",
      payload: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// DELETE /:pid - Eliminar producto
router.delete("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = productManager.deleteProduct(pid);

    res.json({
      status: "success",
      message: "Producto eliminado exitosamente",
      payload: deletedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
