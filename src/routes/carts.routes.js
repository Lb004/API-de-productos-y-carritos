import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// POST / - Crear nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
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

// GET /:cid - Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

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
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);

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

// DELETE /:cid/products/:pid - Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// PUT /:cid - Actualizar TODO el array de productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    // Validar que se envió un array de productos
    if (!products) {
      return res.status(400).json({
        status: "error",
        message: "Debe enviar un array de productos en el body con la propiedad 'products'"
      });
    }

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        message: "El campo 'products' debe ser un array"
      });
    }

    // Validar formato de cada producto en el array
    const isValid = products.every(item => {
      return item.product && 
             item.quantity && 
             typeof item.quantity === 'number' && 
             item.quantity > 0;
    });

    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Formato inválido. Cada producto debe tener: { product: 'id', quantity: number }"
      });
    }

    // Actualizar el carrito
    const updatedCart = await cartManager.updateCart(cid, products);

    res.json({
      status: "success",
      message: "Carrito actualizado completamente",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// PUT /:cid/products/:pid - Actualizar cantidad de producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser un número mayor a 0",
      });
    }

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);

    res.json({
      status: "success",
      message: "Cantidad actualizada",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// DELETE /:cid - Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.clearCart(cid);

    res.json({
      status: "success",
      message: "Carrito vaciado",
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