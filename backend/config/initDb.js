const bcrypt = require('bcryptjs');
const db = require('./db');

async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      image TEXT NOT NULL DEFAULT '',
      category VARCHAR(255) NOT NULL DEFAULT 'General',
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      products JSONB NOT NULL,
      total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
      address TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await seedOwner();
  await seedProducts();
}

async function seedOwner() {
  const ownerEmail = process.env.OWNER_EMAIL;
  const ownerPassword = process.env.OWNER_PASSWORD;
  const ownerName = process.env.OWNER_NAME || 'Store Owner';

  if (!ownerEmail || !ownerPassword) return;

  const existing = await db.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [ownerEmail]);
  if (existing.rows.length > 0) return;

  const hash = await bcrypt.hash(ownerPassword, 10);
  await db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [ownerName, ownerEmail, hash, 'owner']
  );
  console.log(`Seeded owner account: ${ownerEmail}`);
}

async function seedProducts() {
  const countResult = await db.query('SELECT COUNT(*)::int AS count FROM products');
  if (countResult.rows[0].count > 0) return;

  const items = [
    {
      name: 'Minimal Desk Lamp',
      description: 'Warm ambient lamp with a clean aluminum body and adjustable arm.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      category: 'Home',
      stock: 12,
    },
    {
      name: 'Everyday Leather Bag',
      description: 'Structured daily bag with premium finish and roomy interior.',
      price: 119.0,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      category: 'Accessories',
      stock: 8,
    },
    {
      name: 'Wireless Headphones',
      description: 'Comfortable over-ear headphones with clear sound and long battery life.',
      price: 159.5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      category: 'Tech',
      stock: 15,
    },
    {
      name: 'Ceramic Mug Set',
      description: 'Modern matte ceramic mugs designed for daily use and gifting.',
      price: 29.9,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
      category: 'Kitchen',
      stock: 20,
    }
  ];

  for (const item of items) {
    await db.query(
      `INSERT INTO products (name, description, price, image, category, stock)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [item.name, item.description, item.price, item.image, item.category, item.stock]
    );
  }
  console.log('Seeded demo products.');
}

module.exports = initDb;
