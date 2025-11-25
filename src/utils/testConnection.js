import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🧪 INICIANDO PRUEBA DE CONEXIÓN...\n');
    console.log('🔗 String de conexión:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Oculta la contraseña
    
    // 1. Conectar
    console.log('1. 🔗 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Conexión exitosa\n');
    
    console.log('🎉 ¡PRUEBA EXITOSA!');
    console.log('✅ MongoDB Atlas está funcionando perfectamente');
    
  } catch (error) {
    console.error('❌ ERROR EN LA PRUEBA:');
    console.error('   Mensaje:', error.message);
    console.error('   💡 Verifica:');
    console.error('   - Usuario y contraseña en .env');
    console.error('   - Que el usuario tenga permisos');
    
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
};

testConnection();