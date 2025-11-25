import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const activateProducts = async () => {
  try {
    console.log('🔄 Activando productos...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Activar todos los productos
    const result = await Product.updateMany(
      { status: { $ne: true } }, // Donde status no es true
      { $set: { status: true } } // Establecer status a true
    );

    console.log(`✅ ${result.modifiedCount} productos activados\n`);

    // Mostrar productos actualizados
    const products = await Product.find({});
    console.log('📦 Productos en la base de datos:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - Status: ${product.status} - Stock: ${product.stock}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
};

activateProducts();