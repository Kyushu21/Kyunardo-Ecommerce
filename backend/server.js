// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

// Get all products with filtering and sorting
app.get('/products', async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let productsQuery = Product.find(query);

    if (sort) {
      const [field, order] = sort.split(':');
      productsQuery = productsQuery.sort({ [field]: order === 'desc' ? -1 : 1 });
    }

    const products = await productsQuery.exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create seed data script
const seedProducts = [
  {
    name: "Gaming Laptop",
    price: 1299.99,
    description: "High-performance gaming laptop with RTX 3080",
    imageUrl: "https://example.com/gaming-laptop.jpg",
    category: "Electronics",
    stock: 10,
    rating: { rate: 4.5, count: 123 }
  },
  {
    name: "Mechanical Keyboard",
    price: 149.99,
    description: "RGB mechanical gaming keyboard with Cherry MX switches",
    imageUrl: "https://example.com/keyboard.jpg",
    category: "Accessories",
    stock: 50,
    rating: { rate: 4.8, count: 89 }
  },
  {
    name: "Gaming Mouse",
    price: 79.99,
    description: "Wireless gaming mouse with 20K DPI sensor",
    imageUrl: "https://example.com/mouse.jpg",
    category: "Accessories",
    stock: 30,
    rating: { rate: 4.6, count: 67 }
  }
];

// Seed database route (for development)
app.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({}); // Clear existing products
    const products = await Product.insertMany(seedProducts);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});