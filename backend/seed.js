// seed.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  category: String,
  stock: Number,
  rating: {
    rate: Number,
    count: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

const productos = [
  {
    name: "Laptop Gaming Asus",
    price: 1299.99,
    description: "Laptop gaming con RTX 3080",
    imageUrl: "https://via.placeholder.com/300",
    category: "Electrónicos",
    stock: 10,
    rating: { rate: 4.5, count: 123 }
  },
  {
    name: "Teclado Mecánico",
    price: 149.99,
    description: "Teclado gaming RGB",
    imageUrl: "https://via.placeholder.com/300",
    category: "Accesorios",
    stock: 50,
    rating: { rate: 4.8, count: 89 }
  },
  {
    name: "Mouse Gaming",
    price: 79.99,
    description: "Mouse inalámbrico gaming",
    imageUrl: "https://via.placeholder.com/300",
    category: "Accesorios",
    stock: 30,
    rating: { rate: 4.6, count: 67 }
  }
];

async function seedDatabase() {
  try {
    // Limpia la colección existente
    await Product.deleteMany({});
    
    // Inserta los nuevos productos
    const result = await Product.insertMany(productos);
    console.log('Base de datos poblada con éxito:', result);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();