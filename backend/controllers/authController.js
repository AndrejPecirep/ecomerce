const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return next(err);
    if (results.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ name, email, password: hashedPassword }, (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return next(err);
    if (results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
};
