import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// GET / - Listar todos los productos con filtros, paginación y ordenamiento
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

    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// GET /:pid - Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

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
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// POST / - Agregar nuevo producto
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);

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
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;
    const updatedProduct = await productManager.updateProduct(pid, updates);

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
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(pid);

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