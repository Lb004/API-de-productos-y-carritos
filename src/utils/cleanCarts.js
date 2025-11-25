import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

dotenv.config();

const cleanCarts = async () => {
  try {
    console.log('🧹 Limpiando carritos...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los carritos
    const carts = await Cart.find({});
    console.log(`📦 Encontrados ${carts.length} carritos\n`);

    let totalCleaned = 0;

    for (const cart of carts) {
      const originalLength = cart.products.length;
      
      // Filtrar productos válidos
      const validProducts = [];
      
      for (const item of cart.products) {
        const productExists = await Product.findById(item.product);
        
        if (productExists) {
          validProducts.push(item);
        } else {
          console.log(`⚠️ Producto ${item.product} no existe, eliminando del carrito ${cart._id}`);
          totalCleaned++;
        }
      }
      
      if (validProducts.length !== originalLength) {
        cart.products = validProducts;
        await cart.save();
        console.log(`✅ Carrito ${cart._id} limpiado: ${originalLength} → ${validProducts.length} productos\n`);
      }
    }

    console.log(`\n✅ Limpieza completada: ${totalCleaned} referencias eliminadas`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
};

cleanCarts();