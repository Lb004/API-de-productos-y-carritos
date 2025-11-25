import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const migrateData = async () => {
  try {
    console.log('🔄 Iniciando migración de datos...\n');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas\n');

    // Leer productos existentes
    const productsPath = path.join(__dirname, '../../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    
    console.log(`📦 Encontrados ${productsData.length} productos para migrar\n`);

    // Limpiar colección existente
    await Product.deleteMany({});
    console.log('🧹 Colección de productos limpiada\n');

    // Transformar datos para MongoDB (eliminar el id numérico)
    const productsToMigrate = productsData.map(product => {
      const { id, ...productData } = product; // Eliminar el id numérico
      return productData;
    });

    console.log('🔄 Transformando datos para MongoDB...\n');

    // Migrar productos
    const migratedProducts = await Product.insertMany(productsToMigrate);
    console.log(`✅ ${migratedProducts.length} productos migrados exitosamente\n`);

    // Mostrar productos migrados
    console.log('📋 Productos en la base de datos:');
    migratedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price} (Stock: ${product.stock})`);
      console.log(`      ID MongoDB: ${product._id}`);
      console.log(`      Código: ${product.code}\n`);
    });

    console.log('🎉 ¡Migración completada!');
    
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 Error de duplicado: Hay productos con el mismo código');
    }
    
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
};

migrateData();