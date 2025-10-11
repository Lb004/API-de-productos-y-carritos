import fs from "fs";
import path from "path";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.initializeFile();
  }

  // Inicializar el archivo si no existe
  initializeFile() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, JSON.stringify([], null, 2));
      }
      this.loadProducts();
    } catch (error) {
      console.error("Error al inicializar archivo:", error);
    }
  }

  // Cargar productos desde el archivo
  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      this.products = [];
    }
  }

  // Guardar productos en el archivo
  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar productos:", error);
    }
  }

  // Generar ID único
  generateId() {
    if (this.products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.products.map((p) => p.id));
    return maxId + 1;
  }

  // Obtener todos los productos
  getProducts() {
    this.loadProducts();
    return this.products;
  }

  // Obtener producto por ID
  getProductById(id) {
    this.loadProducts();
    const product = this.products.find((p) => p.id === parseInt(id));
    return product || null;
  }

  // Agregar un nuevo producto
  addProduct(productData) {
    this.loadProducts();

    // Validar campos requeridos
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    // Validar que el código no esté repetido
    const codeExists = this.products.some((p) => p.code === productData.code);
    if (codeExists) {
      throw new Error("El código del producto ya existe");
    }

    // Crear el nuevo producto
    const newProduct = {
      id: this.generateId(),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: parseFloat(productData.price),
      status: productData.status !== undefined ? productData.status : true,
      stock: parseInt(productData.stock),
      category: productData.category,
      thumbnails: productData.thumbnails || [],
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Actualizar un producto
  updateProduct(id, updates) {
    this.loadProducts();
    const index = this.products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    // No permitir actualizar el ID
    if (updates.id) {
      delete updates.id;
    }

    // Actualizar el producto manteniendo el ID original
    this.products[index] = {
      ...this.products[index],
      ...updates,
    };

    this.saveProducts();
    return this.products[index];
  }

  // Eliminar un producto
  deleteProduct(id) {
    this.loadProducts();
    const index = this.products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    const deletedProduct = this.products.splice(index, 1)[0];
    this.saveProducts();
    return deletedProduct;
  }
}

export default ProductManager;
