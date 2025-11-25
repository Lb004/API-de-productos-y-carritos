import Product from '../models/Product.js';
import mongoose from 'mongoose';

class ProductManager {
  
  // 🔍 OBTENER PRODUCTOS CON PAGINACIÓN
  async getProducts({ limit = 10, page = 1, sort, query, category } = {}) {
    try {
      // Configurar filtros
      const filter = { status: true };
      
      if (category) {
        filter.category = { $regex: category, $options: 'i' };
      }
      
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }

      // Configurar ordenamiento
      let sortOptions = {};
      if (sort === 'asc') sortOptions = { price: 1 };
      if (sort === 'desc') sortOptions = { price: -1 };

      // Calcular paginación manual
      const skip = (page - 1) * limit;
      
      // Obtener productos CON .lean() para objetos planos
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(); // ← IMPORTANTE: objetos planos

      // Contar total para paginación
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      // Construir links
      const baseUrl = '/?';
      const buildQuery = (pageNum) => {
        const params = new URLSearchParams();
        if (limit && limit !== 10) params.append('limit', limit);
        if (sort) params.append('sort', sort);
        if (query) params.append('query', query);
        if (category) params.append('category', category);
        params.append('page', pageNum);
        return params.toString();
      };

      return {
        status: 'success',
        payload: products,
        totalPages: totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `${baseUrl}${buildQuery(page - 1)}` : null,
        nextLink: page < totalPages ? `${baseUrl}${buildQuery(page + 1)}` : null,
        limit: parseInt(limit),
        sort,
        query,
        category
      };

    } catch (error) {
      console.error('❌ Error en getProducts:', error.message);
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // 🔍 OBTENER PRODUCTO POR ID
  async getProductById(id) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("ID de producto inválido");
      }

      const product = await Product.findById(id).lean(); // ← .lean() para objeto plano
      
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  // ➕ AGREGAR NUEVO PRODUCTO
  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
      }
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // ✏️ ACTUALIZAR PRODUCTO
  async updateProduct(id, updates) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("ID de producto inválido");
      }

      // No permitir actualizar el _id
      delete updates._id;
      
      const product = await Product.findByIdAndUpdate(
        id,
        updates,
        { 
          new: true,
          runValidators: true
        }
      );
      
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
      }
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // 🗑️ ELIMINAR PRODUCTO
  async deleteProduct(id) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error("ID de producto inválido");
      }

      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      
      return product;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default ProductManager;