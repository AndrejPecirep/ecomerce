const Order = require('../models/Order');
const Product = require('../models/Product');
const db = require('../config/db');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { products, address, note = '' } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }
    if (!address?.trim()) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    const ids = products.map((item) => Number(item.id)).filter(Boolean);
    const dbProducts = await Product.findByIds(ids);
    const byId = new Map(dbProducts.map((product) => [product.id, product]));

    let expectedTotal = 0;
    const normalizedProducts = [];

    for (const item of products) {
      const dbProduct = byId.get(Number(item.id));
      if (!dbProduct) {
        return res.status(400).json({ message: `Product ${item.id} not found` });
      }

      const quantity = Math.max(1, Number(item.quantity || 1));
      if (dbProduct.stock < quantity) {
        return res.status(400).json({ message: `${dbProduct.name} is out of stock for the requested quantity` });
      }

      expectedTotal += Number(dbProduct.price) * quantity;
      normalizedProducts.push({
        id: dbProduct.id,
        name: dbProduct.name,
        quantity,
        price: Number(dbProduct.price),
        image: dbProduct.image,
      });
    }

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of normalizedProducts) {
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
          [item.quantity, item.id]
        );
      }

      const created = await client.query(
        `INSERT INTO orders (user_id, products, total, address, note)
         VALUES ($1, $2::jsonb, $3, $4, $5)
         RETURNING id`,
        [userId, JSON.stringify(normalizedProducts), expectedTotal.toFixed(2), address.trim(), note.trim()]
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'Order created successfully', orderId: created.rows[0].id });
    } catch (transactionErr) {
      await client.query('ROLLBACK');
      throw transactionErr;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
