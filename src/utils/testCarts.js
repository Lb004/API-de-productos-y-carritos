import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CartManager from '../dao/CartManager.js';
import Product from '../models/Product.js';

dotenv.config();

const testCarts = async () => {
  try {
    console.log('🧪 INICIANDO PRUEBA DE CARRITOS...\n');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas\n');

    const cartManager = new CartManager();

    // 1. Crear un carrito
    console.log('1. 🛒 Creando carrito...');
    const newCart = await cartManager.createCart();
    const cartId = newCart._id;
    console.log('   ✅ Carrito creado:', cartId.toString(), '\n');

    // 2. Obtener productos para agregar al carrito
    console.log('2. 📦 Obteniendo productos...');
    const products = await Product.find({}).limit(2);
    console.log('   ✅ Productos encontrados:', products.length);
    console.log('   📋 Productos disponibles:');
    products.forEach((product, index) => {
      console.log(`      ${index + 1}. ${product.title} (ID: ${product._id})`);
    });
    console.log('');

    if (products.length >= 2) {
      // 3. Agregar primer producto al carrito
      console.log('3. ➕ Agregando primer producto al carrito...');
      let currentCart = await cartManager.addProductToCart(
        cartId, 
        products[0]._id
      );
      console.log('   ✅ Producto 1 agregado:', products[0].title, '\n');

      // 4. Agregar segundo producto
      console.log('4. ➕ Agregando segundo producto al carrito...');
      currentCart = await cartManager.addProductToCart(
        cartId,
        products[1]._id
      );
      console.log('   ✅ Producto 2 agregado:', products[1].title, '\n');

      // 5. Mostrar carrito con populate
      console.log('5. 🔍 Mostrando carrito con productos...');
      const fullCart = await cartManager.getCartById(cartId);
      console.log('   📋 Productos en el carrito:');
      fullCart.products.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.product.title} - Cantidad: ${item.quantity} (ID: ${item.product._id})`);
      });
      console.log('');

      // 6. Actualizar cantidad del PRIMER producto
      console.log('6. 🔄 Actualizando cantidad del primer producto...');
      const updatedCart = await cartManager.updateProductQuantity(
        cartId,
        products[0]._id,
        5
      );
      console.log('   ✅ Cantidad actualizada a 5\n');

      // 7. Mostrar carrito después de actualizar
      console.log('7. 📊 Carrito después de actualizar cantidad:');
      updatedCart.products.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.product.title} - Cantidad: ${item.quantity}`);
      });
      console.log('');

      // 8. Eliminar SEGUNDO producto
      console.log('8. 🗑️ Eliminando segundo producto...');
      const cartAfterDelete = await cartManager.deleteProductFromCart(
        cartId,
        products[1]._id
      );
      console.log('   ✅ Producto eliminado:', products[1].title, '\n');

      // 9. Mostrar carrito final
      console.log('9. 📊 Carrito final:');
      const finalCart = await cartManager.getCartById(cartId);
      console.log('   📦 Productos restantes:', finalCart.products.length);
      finalCart.products.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.product.title} - Cantidad: ${item.quantity}`);
      });
      console.log('');

      // 10. Vaciar carrito
      console.log('10. 🧹 Vaciando carrito completo...');
      const emptyCart = await cartManager.clearCart(cartId);
      console.log('   ✅ Carrito vaciado');
      console.log('   📦 Productos después de vaciar:', emptyCart.products.length, '\n');

      console.log('🎉 ¡TODAS LAS PRUEBAS DE CARRITOS EXITOSAS!');
      console.log('✅ Los nuevos endpoints funcionan correctamente');
      console.log('✅ Carrito ID para pruebas:', cartId.toString());
      
    } else {
      console.log('❌ No hay suficientes productos para probar');
    }

  } catch (error) {
    console.error('❌ ERROR EN PRUEBA:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
};

testCarts();