const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { query = '', category = '' } = req.query;
    const products = await Product.search(query, category);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const created = await Product.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      stock: Number(stock || 0),
    });
    res.status(201).json({ message: 'Product created', product: created });
  } catch (err) {
    next(err);
  }
};
