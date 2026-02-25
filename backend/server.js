const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve frontend static files
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// GET all products
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY category, name').all();
  res.json(products);
});

// POST new product
app.post('/api/products', (req, res) => {
  const { name, category, price, quantity, description, sku } = req.body;
  if (!name || !category || price == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price, sku' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO products (name, category, price, quantity, description, sku)
      VALUES (@name, @category, @price, @quantity, @description, @sku)
    `);
    const result = stmt.run({ name, category, price: Number(price), quantity: Number(quantity) || 0, description: description || '', sku });
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Deleted successfully' });
});

// PATCH quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (quantity == null || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be >= 0' });
  }
  const result = db.prepare('UPDATE products SET quantity = ? WHERE id = ?').run(Number(quantity), id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json(product);
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
