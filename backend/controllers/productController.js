const Product = require("../models/Product");

exports.getProducts = (req, res, next) => {
  Product.getAll((err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

exports.searchProducts = (req, res, next) => {
  const { query, category } = req.query;
  Product.search(query || "", category || null, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};

exports.getCategories = (req, res, next) => {
  Product.getCategories((err, results) => {
    if (err) return next(err);
    res.json(results.map((r) => r.category));
  });
};

exports.createProduct = (req, res, next) => {
  const { name, description, price, image, category } = req.body;
  Product.create({ name, description, price, image, category }, (err, result) => {
    if (err) return next(err);
    res.status(201).json({ message: "Product created", productId: result.insertId });
  });
};
