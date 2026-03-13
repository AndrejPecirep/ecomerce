const express = require("express");
const router = express.Router();
const { registerValidator } = require("../utils/validators");
const validate = require("../middleware/validationMiddleware");
const authController = require("../controllers/authController");

router.post("/register", validate(registerValidator), authController.register);
router.post("/login", authController.login);

module.exports = router;
