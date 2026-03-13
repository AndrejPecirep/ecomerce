const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getUserOrders);

module.exports = router;
