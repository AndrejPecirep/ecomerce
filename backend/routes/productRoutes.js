const express = require("express");
const router = express.Router();
const { productValidator } = require("../utils/validators");
const validate = require("../middleware/validationMiddleware");
const productController = require("../controllers/productController");

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/categories", productController.getCategories);
router.post("/", validate(productValidator), productController.createProduct);

module.exports = router;
