const { body } = require("express-validator");

exports.registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

exports.productValidator = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be positive"),
  body("category").notEmpty().withMessage("Category is required"),
];
