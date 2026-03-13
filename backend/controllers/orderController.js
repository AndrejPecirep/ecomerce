const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * createOrder expects:
 * req.body = {
 *   products: [{ id, name, quantity, price }],
 *   total: decimal (units, e.g. 25.99),
 *   address,
 *   paymentIntentId
 * }
 *
 * It will validate totals against DB prices before inserting order.
 */
exports.createOrder = (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { products, total, address, paymentIntentId } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const ids = products.map((p) => Number(p.id));
    Product.findByIds(ids, (err, dbProducts) => {
      if (err) return next(err);

      const byId = {};
      dbProducts.forEach((p) => byId[p.id] = p);

      let expectedTotal = 0;
      for (let item of products) {
        const dbp = byId[item.id];
        if (!dbp) return res.status(400).json({ message: `Product id ${item.id} not found in DB` });
        const qty = Number(item.quantity || 1);
        expectedTotal += parseFloat(dbp.price) * qty;
      }

      // Allow small rounding tolerance (e.g. 0.01)
      if (Math.abs(expectedTotal - Number(total)) > 0.01) {
        return res.status(400).json({ message: "Total mismatch. Order total does not match server prices." });
      }

      // all good — create order in DB (store server-verified products and total)
      Order.create({
        userId,
        products,
        total: expectedTotal,
        address,
        paymentIntentId: paymentIntentId || null,
      }, (err2, result) => {
        if (err2) return next(err2);
        res.status(201).json({ message: "Order created", orderId: result.insertId });
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = (req, res, next) => {
  const userId = req.user.id;
  Order.findByUser(userId, (err, results) => {
    if (err) return next(err);
    res.json(results);
  });
};