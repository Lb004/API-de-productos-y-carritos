import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer);

// Configurar Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Hacer io accesible en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Crear producto desde WebSocket
  socket.on("createProduct", async (productData) => {
    try {
      const ProductManager = (await import("./managers/ProductManager.js"))
        .default;
      const productManager = new ProductManager(
        path.join(__dirname, "../data/products.json")
      );

      const newProduct = productManager.addProduct(productData);

      // Emitir a todos los clientes
      io.emit("productCreated", newProduct);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Eliminar producto desde WebSocket
  socket.on("deleteProduct", async (productId) => {
    try {
      const ProductManager = (await import("./managers/ProductManager.js"))
        .default;
      const productManager = new ProductManager(
        path.join(__dirname, "../data/products.json")
      );

      productManager.deleteProduct(productId);

      // Emitir a todos los clientes
      io.emit("productDeleted", productId);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { io };
