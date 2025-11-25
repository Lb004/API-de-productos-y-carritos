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

  // Validar datos del producto
  validateProductData(productData, isUpdate = false) {
    const errors = [];

    // Validar title
    if (!isUpdate || productData.title !== undefined) {
      if (!productData.title || typeof productData.title !== "string") {
        errors.push("El campo 'title' es obligatorio y debe ser un string");
      } else if (productData.title.trim().length === 0) {
        errors.push("El campo 'title' no puede estar vacío");
      }
    }

    // Validar description
    if (!isUpdate || productData.description !== undefined) {
      if (
        !productData.description ||
        typeof productData.description !== "string"
      ) {
        errors.push(
          "El campo 'description' es obligatorio y debe ser un string"
        );
      } else if (productData.description.trim().length === 0) {
        errors.push("El campo 'description' no puede estar vacío");
      }
    }

    // Validar code
    if (!isUpdate || productData.code !== undefined) {
      if (!productData.code || typeof productData.code !== "string") {
        errors.push("El campo 'code' es obligatorio y debe ser un string");
      } else if (productData.code.trim().length === 0) {
        errors.push("El campo 'code' no puede estar vacío");
      }
    }

    // Validar price
    if (!isUpdate || productData.price !== undefined) {
      if (productData.price === undefined || productData.price === null) {
        errors.push("El campo 'price' es obligatorio");
      } else if (
        typeof productData.price !== "number" ||
        isNaN(productData.price)
      ) {
        errors.push("El campo 'price' debe ser un número válido");
      } else if (productData.price < 0) {
        errors.push("El campo 'price' no puede ser negativo");
      }
    }

    // Validar stock
    if (!isUpdate || productData.stock !== undefined) {
      if (productData.stock === undefined || productData.stock === null) {
        errors.push("El campo 'stock' es obligatorio");
      } else if (
        typeof productData.stock !== "number" ||
        isNaN(productData.stock)
      ) {
        errors.push("El campo 'stock' debe ser un número válido");
      } else if (productData.stock < 0) {
        errors.push("El campo 'stock' no puede ser negativo");
      } else if (!Number.isInteger(productData.stock)) {
        errors.push("El campo 'stock' debe ser un número entero");
      }
    }

    // Validar category
    if (!isUpdate || productData.category !== undefined) {
      if (!productData.category || typeof productData.category !== "string") {
        errors.push("El campo 'category' es obligatorio y debe ser un string");
      } else if (productData.category.trim().length === 0) {
        errors.push("El campo 'category' no puede estar vacío");
      }
    }

    // Validar status (opcional, por defecto true)
    if (productData.status !== undefined) {
      if (typeof productData.status !== "boolean") {
        errors.push("El campo 'status' debe ser un booleano (true o false)");
      }
    }

    // Validar thumbnails (opcional)
    if (productData.thumbnails !== undefined) {
      if (!Array.isArray(productData.thumbnails)) {
        errors.push("El campo 'thumbnails' debe ser un array");
      } else if (
        !productData.thumbnails.every((item) => typeof item === "string")
      ) {
        errors.push("Todos los elementos de 'thumbnails' deben ser strings");
      }
    }

    return errors;
  }

  // Obtener todos los productos
  getProducts() {
    this.loadProducts();
    return this.products;
  }

  // Obtener producto por ID
  getProductById(id) {
    this.loadProducts();

    // Validar que el ID sea un número válido
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error("El ID debe ser un número válido");
    }

    const product = this.products.find((p) => p.id === numId);
    return product || null;
  }

  // Agregar un nuevo producto
  addProduct(productData) {
    this.loadProducts();

    // Validar datos del producto
    const errors = this.validateProductData(productData);
    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(", ")}`);
    }

    // Validar que el código no esté repetido
    const codeExists = this.products.some((p) => p.code === productData.code);
    if (codeExists) {
      throw new Error("El código del producto ya existe");
    }

    // Crear el nuevo producto
    const newProduct = {
      id: this.generateId(),
      title: productData.title.trim(),
      description: productData.description.trim(),
      code: productData.code.trim(),
      price: parseFloat(productData.price),
      status: productData.status !== undefined ? productData.status : true,
      stock: parseInt(productData.stock),
      category: productData.category.trim(),
      thumbnails: productData.thumbnails || [],
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Actualizar un producto
  updateProduct(id, updates) {
    this.loadProducts();

    // Validar que el ID sea un número válido
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error("El ID debe ser un número válido");
    }

    const index = this.products.findIndex((p) => p.id === numId);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    // No permitir actualizar el ID
    if (updates.id) {
      delete updates.id;
    }

    // Validar datos a actualizar
    const errors = this.validateProductData(updates, true);
    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(", ")}`);
    }

    // Validar que el código no esté repetido (si se está actualizando)
    if (updates.code) {
      const codeExists = this.products.some(
        (p) => p.code === updates.code && p.id !== numId
      );
      if (codeExists) {
        throw new Error("El código del producto ya existe");
      }
    }

    // Limpiar strings si existen
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.code) updates.code = updates.code.trim();
    if (updates.category) updates.category = updates.category.trim();

    // Convertir tipos si es necesario
    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock);

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

    // Validar que el ID sea un número válido
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error("El ID debe ser un número válido");
    }

    const index = this.products.findIndex((p) => p.id === numId);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    const deletedProduct = this.products.splice(index, 1)[0];
    this.saveProducts();
    return deletedProduct;
  }
}

export default ProductManager;
