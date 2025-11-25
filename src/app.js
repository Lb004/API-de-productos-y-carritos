import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
<<<<<<< HEAD
import dotenv from "dotenv";

// Importar configuración de la base de datos
import connectDB from "./config/database.js";

// Importar rutas
=======

>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";

<<<<<<< HEAD
// Configuración inicial
dotenv.config();
=======
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
<<<<<<< HEAD
const PORT = process.env.PORT || 8080;

// 🔗 CONECTAR A LA BASE DE DATOS
connectDB();
=======
const PORT = 8080;
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer);

<<<<<<< HEAD
// Configurar Handlebars CON HELPERS Y SEGURIDAD CORREGIDA
// Configurar Handlebars CON HELPERS Y SEGURIDAD CORREGIDA
app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    // Multiplicar dos números
    multiply: (a, b) => {
      if (!a || !b) return 0;
      return a * b;
    },
    
    // Calcular total del carrito CON VALIDACIONES
    calculateTotal: (products) => {
      if (!products || !Array.isArray(products)) {
        console.warn('⚠️ calculateTotal: products no es un array válido');
        return 0;
      }
      
      return products.reduce((total, item) => {
        // Validar que exista item, product y price
        if (!item || !item.product || typeof item.product.price === 'undefined') {
          console.warn('⚠️ Producto inválido en carrito:', item);
          return total;
        }
        
        const price = parseFloat(item.product.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        
        return total + (price * quantity);
      }, 0);
    },
    
    // Convertir objeto a JSON (útil para debugging)
    json: (context) => {
      return JSON.stringify(context, null, 2);
    },
    
    // Comparar si dos valores son iguales
    eq: (a, b) => a === b
  }
}));
=======
// Configurar Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
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

<<<<<<< HEAD
// WebSocket connection ACTUALIZADO PARA MONGODB
=======
// WebSocket connection
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Crear producto desde WebSocket
  socket.on("createProduct", async (productData) => {
    try {
<<<<<<< HEAD
      const ProductManager = (await import("./dao/ProductManager.js")).default;
      const productManager = new ProductManager();

      const newProduct = await productManager.addProduct(productData);
=======
      const ProductManager = (await import("./managers/ProductManager.js"))
        .default;
      const productManager = new ProductManager(
        path.join(__dirname, "../data/products.json")
      );

      const newProduct = productManager.addProduct(productData);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

      // Emitir a todos los clientes
      io.emit("productCreated", newProduct);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Eliminar producto desde WebSocket
  socket.on("deleteProduct", async (productId) => {
    try {
<<<<<<< HEAD
      const ProductManager = (await import("./dao/ProductManager.js")).default;
      const productManager = new ProductManager();

      await productManager.deleteProduct(productId);
=======
      const ProductManager = (await import("./managers/ProductManager.js"))
        .default;
      const productManager = new ProductManager(
        path.join(__dirname, "../data/products.json")
      );

      productManager.deleteProduct(productId);
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0

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
<<<<<<< HEAD
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export { io };
=======
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { io };
>>>>>>> 3eacb13561b5071d6898f1e6b7f48fd6979764d0
