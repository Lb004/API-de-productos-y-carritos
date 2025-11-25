import { Router } from "express";
<<<<<<< HEAD
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

// GET / - Listar todos los productos
router.get("/", (req, res) => {
  try {
    const products = productManager.getProducts();
    res.json({
      status: "success",
      payload: products,
    });
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// GET /:pid - Obtener producto por ID
<<<<<<< HEAD
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
=======
router.get("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const product = productManager.getProductById(pid);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

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
<<<<<<< HEAD
    res.status(400).json({
=======
    res.status(500).json({
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
      status: "error",
      message: error.message,
    });
  }
});

// POST / - Agregar nuevo producto
<<<<<<< HEAD
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
=======
router.post("/", (req, res) => {
  try {
    const productData = req.body;
    const newProduct = productManager.addProduct(productData);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

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
<<<<<<< HEAD
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;
    const updatedProduct = await productManager.updateProduct(pid, updates);
=======
router.put("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;
    const updatedProduct = productManager.updateProduct(pid, updates);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

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
<<<<<<< HEAD
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(pid);
=======
router.delete("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = productManager.deleteProduct(pid);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

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

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
