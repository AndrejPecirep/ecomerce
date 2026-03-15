const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidator } = require('../utils/validators');
const validate = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const ownerMiddleware = require('../middleware/ownerMiddleware');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.post('/', authMiddleware, ownerMiddleware, validate(productValidator), productController.createProduct);

module.exports = router;
