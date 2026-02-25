const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    sku TEXT UNIQUE NOT NULL
  )
`);

const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, price, quantity, description, sku)
    VALUES (@name, @category, @price, @quantity, @description, @sku)
  `);
  const seed = db.transaction(() => {
    const products = [
      { name: 'iPhone 15 Pro', category: 'Electronics', price: 999.99, quantity: 25, description: 'Latest Apple smartphone with titanium design', sku: 'ELEC-001' },
      { name: 'Samsung 4K TV 55"', category: 'Electronics', price: 699.99, quantity: 12, description: '55-inch 4K QLED Smart TV', sku: 'ELEC-002' },
      { name: 'Sony WH-1000XM5', category: 'Electronics', price: 349.99, quantity: 3, description: 'Premium noise-cancelling wireless headphones', sku: 'ELEC-003' },
      { name: 'MacBook Air M2', category: 'Electronics', price: 1199.99, quantity: 8, description: 'Apple laptop with M2 chip, 8GB RAM, 256GB SSD', sku: 'ELEC-004' },
      { name: 'Levi\'s 501 Jeans', category: 'Clothing', price: 59.99, quantity: 45, description: 'Classic straight fit denim jeans', sku: 'CLTH-001' },
      { name: 'Nike Air Max 270', category: 'Clothing', price: 150.00, quantity: 30, description: 'Men\'s running shoes with Air Max cushioning', sku: 'CLTH-002' },
      { name: 'Patagonia Fleece Jacket', category: 'Clothing', price: 139.00, quantity: 18, description: 'Recycled fleece zip-up jacket', sku: 'CLTH-003' },
      { name: 'Organic Coffee Beans', category: 'Food', price: 18.99, quantity: 60, description: '1lb single-origin Ethiopian coffee beans', sku: 'FOOD-001' },
      { name: 'Extra Virgin Olive Oil', category: 'Food', price: 24.99, quantity: 40, description: '500ml cold-pressed Italian olive oil', sku: 'FOOD-002' },
      { name: 'Protein Powder', category: 'Food', price: 49.99, quantity: 2, description: 'Whey protein isolate, vanilla, 2lb', sku: 'FOOD-003' },
      { name: 'IKEA KALLAX Shelf', category: 'Furniture', price: 89.99, quantity: 15, description: '4-cube storage shelving unit in white', sku: 'FURN-001' },
      { name: 'Ergonomic Office Chair', category: 'Furniture', price: 299.99, quantity: 7, description: 'Adjustable lumbar support mesh office chair', sku: 'FURN-002' },
      { name: 'Yoga Mat', category: 'Sports', price: 34.99, quantity: 50, description: 'Non-slip 6mm thick exercise yoga mat', sku: 'SPRT-001' },
      { name: 'Resistance Bands Set', category: 'Sports', price: 22.99, quantity: 35, description: 'Set of 5 resistance bands for strength training', sku: 'SPRT-002' },
      { name: 'Stainless Water Bottle', category: 'Sports', price: 29.99, quantity: 4, description: '32oz insulated stainless steel bottle', sku: 'SPRT-003' },
      { name: 'Dyson V15 Vacuum', category: 'Home', price: 749.99, quantity: 9, description: 'Cordless vacuum with laser dust detection', sku: 'HOME-001' },
      { name: 'Air Purifier HEPA', category: 'Home', price: 129.99, quantity: 22, description: 'True HEPA air purifier for rooms up to 300 sq ft', sku: 'HOME-002' },
      { name: 'The Pragmatic Programmer', category: 'Books', price: 49.99, quantity: 16, description: 'Classic software development book, 20th anniversary edition', sku: 'BOOK-001' },
      { name: 'Atomic Habits', category: 'Books', price: 16.99, quantity: 33, description: 'Build good habits and break bad ones', sku: 'BOOK-002' },
      { name: 'Skincare Starter Kit', category: 'Beauty', price: 65.00, quantity: 1, description: 'Cleanser, toner, moisturizer & SPF set', sku: 'BEAU-001' }
    ];
    for (const p of products) insert.run(p);
  });
  seed();
}

module.exports = db;
