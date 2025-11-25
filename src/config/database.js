import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ ¡CONEXIÓN EXITOSA A MONGODB ATLAS!');
  } catch (error) {
    console.error('❌ ERROR conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Eventos de la conexión
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado');
});

export default connectDB;