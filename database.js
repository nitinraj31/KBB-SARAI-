const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, 'agrimarket.db');

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      discount INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      image TEXT,
      category_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  // Create orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Seed initial data
  seedDatabase();
}

// Seed database with initial data
function seedDatabase() {
  // Check if categories exist
  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) {
      console.error('Error checking categories:', err.message);
      return;
    }

    if (row.count === 0) {
      // Insert categories
      const categories = [
        { name: 'Seeds', image: 'https://via.placeholder.com/150?text=Seeds' },
        { name: 'Fertilizers', image: 'https://via.placeholder.com/150?text=Fertilizers' },
        { name: 'Tools', image: 'https://via.placeholder.com/150?text=Tools' },
        { name: 'Machinery', image: 'https://via.placeholder.com/150?text=Machinery' },
        { name: 'Produce', image: 'https://via.placeholder.com/150?text=Produce' },
        { name: 'Livestock', image: 'https://via.placeholder.com/150?text=Livestock' }
      ];

      categories.forEach(category => {
        db.run('INSERT INTO categories (name, image) VALUES (?, ?)', [category.name, category.image]);
      });

      console.log('Seeded categories.');
    }
  });

  // Check if products exist
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products:', err.message);
      return;
    }

    if (row.count === 0) {
      // Insert products
      const products = [
        { name: 'John Deere Tractor', price: 25000, original_price: 28000, discount: 11, rating: 4.8, reviews: 450, image: 'https://via.placeholder.com/200?text=Tractor', category_id: 4 },
        { name: 'Organic Seed Pack', price: 25, original_price: 35, discount: 29, rating: 4.6, reviews: 320, image: 'https://via.placeholder.com/200?text=Seeds', category_id: 1 },
        { name: 'NPK Fertilizer 50kg', price: 45, original_price: 55, discount: 18, rating: 4.4, reviews: 280, image: 'https://via.placeholder.com/200?text=Fertilizer', category_id: 2 },
        { name: 'Farm Tools Set', price: 120, original_price: 150, discount: 20, rating: 4.5, reviews: 190, image: 'https://via.placeholder.com/200?text=Tools', category_id: 3 },
        { name: 'Irrigation System', price: 299, original_price: 399, discount: 25, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Irrigation', category_id: 3 },
        { name: 'Pesticide Spray', price: 35, original_price: 50, discount: 30, rating: 4.1, reviews: 220, image: 'https://via.placeholder.com/200?text=Spray', category_id: 3 },
        { name: 'Harvesting Tools', price: 85, original_price: 110, discount: 23, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Harvest', category_id: 3 },
        { name: 'Greenhouse Kit', price: 450, original_price: 600, discount: 25, rating: 4.6, reviews: 90, image: 'https://via.placeholder.com/200?text=Greenhouse', category_id: 3 },
        { name: 'Corn Seeds 10kg', price: 40, original_price: 50, discount: 20, rating: 4.5, reviews: 200, image: 'https://via.placeholder.com/200?text=Corn+Seeds', category_id: 1 },
        { name: 'Wheat Seeds 5kg', price: 30, original_price: 40, discount: 25, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Wheat+Seeds', category_id: 1 },
        { name: 'Rice Seeds 2kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Rice+Seeds', category_id: 1 },
        { name: 'Soybean Seeds 3kg', price: 35, original_price: 45, discount: 22, rating: 4.6, reviews: 120, image: 'https://via.placeholder.com/200?text=Soybean+Seeds', category_id: 1 },
        { name: 'Potato Seeds 1kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 100, image: 'https://via.placeholder.com/200?text=Potato+Seeds', category_id: 1 },
        { name: 'Tomato Seeds 500g', price: 10, original_price: 15, discount: 33, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Tomato+Seeds', category_id: 1 },
        { name: 'Carrot Seeds 200g', price: 8, original_price: 12, discount: 33, rating: 4.0, reviews: 80, image: 'https://via.placeholder.com/200?text=Carrot+Seeds', category_id: 1 },
        { name: 'Lettuce Seeds 100g', price: 5, original_price: 8, discount: 38, rating: 3.9, reviews: 70, image: 'https://via.placeholder.com/200?text=Lettuce+Seeds', category_id: 1 },
        { name: 'Urea Fertilizer 25kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 250, image: 'https://via.placeholder.com/200?text=Urea', category_id: 2 },
        { name: 'Phosphate Fertilizer 20kg', price: 30, original_price: 40, discount: 25, rating: 4.5, reviews: 220, image: 'https://via.placeholder.com/200?text=Phosphate', category_id: 2 },
        { name: 'Potash Fertilizer 15kg', price: 35, original_price: 45, discount: 22, rating: 4.4, reviews: 200, image: 'https://via.placeholder.com/200?text=Potash', category_id: 2 },
        { name: 'Organic Compost 50kg', price: 20, original_price: 25, discount: 20, rating: 4.6, reviews: 180, image: 'https://via.placeholder.com/200?text=Compost', category_id: 2 },
        { name: 'Lime Fertilizer 10kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 160, image: 'https://via.placeholder.com/200?text=Lime', category_id: 2 },
        { name: 'Micronutrient Mix 5kg', price: 50, original_price: 65, discount: 23, rating: 4.7, reviews: 140, image: 'https://via.placeholder.com/200?text=Micronutrient', category_id: 2 },
        { name: 'Garden Hose 50ft', price: 25, original_price: 35, discount: 29, rating: 4.3, reviews: 300, image: 'https://via.placeholder.com/200?text=Hose', category_id: 3 },
        { name: 'Shovel Set', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 280, image: 'https://via.placeholder.com/200?text=Shovel', category_id: 3 },
        { name: 'Pruning Shears', price: 15, original_price: 20, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Shears', category_id: 3 },
        { name: 'Wheelbarrow', price: 80, original_price: 100, discount: 20, rating: 4.5, reviews: 240, image: 'https://via.placeholder.com/200?text=Wheelbarrow', category_id: 3 },
        { name: 'Garden Gloves', price: 10, original_price: 15, discount: 33, rating: 4.0, reviews: 220, image: 'https://via.placeholder.com/200?text=Gloves', category_id: 3 },
        { name: 'Soil Tester Kit', price: 30, original_price: 40, discount: 25, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Soil+Tester', category_id: 3 },
        { name: 'Seed Drill Machine', price: 500, original_price: 650, discount: 23, rating: 4.6, reviews: 100, image: 'https://via.placeholder.com/200?text=Seed+Drill', category_id: 4 },
        { name: 'Plow Attachment', price: 200, original_price: 250, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Plow', category_id: 4 },
        { name: 'Harvester Combine', price: 15000, original_price: 18000, discount: 17, rating: 4.8, reviews: 50, image: 'https://via.placeholder.com/200?text=Harvester', category_id: 4 },
        { name: 'Irrigation Pump', price: 300, original_price: 400, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Pump', category_id: 4 },
        { name: 'Sprinkler System', price: 150, original_price: 200, discount: 25, rating: 4.5, reviews: 140, image: 'https://via.placeholder.com/200?text=Sprinkler', category_id: 4 },
        { name: 'Drip Irrigation Kit', price: 100, original_price: 130, discount: 23, rating: 4.4, reviews: 160, image: 'https://via.placeholder.com/200?text=Drip', category_id: 4 },
        { name: 'Fresh Apples 5kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 300, image: 'https://via.placeholder.com/200?text=Apples', category_id: 5 },
        { name: 'Organic Bananas 2kg', price: 8, original_price: 10, discount: 20, rating: 4.3, reviews: 280, image: 'https://via.placeholder.com/200?text=Bananas', category_id: 5 },
        { name: 'Carrots 3kg', price: 6, original_price: 8, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Carrots', category_id: 5 },
        { name: 'Potatoes 10kg', price: 12, original_price: 15, discount: 20, rating: 4.0, reviews: 240, image: 'https://via.placeholder.com/200?text=Potatoes', category_id: 5 },
        { name: 'Tomatoes 2kg', price: 5, original_price: 7, discount: 29, rating: 3.9, reviews: 220, image: 'https://via.placeholder.com/200?text=Tomatoes', category_id: 5 },
        { name: 'Lettuce Bundle', price: 4, original_price: 6, discount: 33, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Lettuce', category_id: 5 },
        { name: 'Broccoli Heads', price: 7, original_price: 9, discount: 22, rating: 4.4, reviews: 180, image: 'https://via.placeholder.com/200?text=Broccoli', category_id: 5 },
        { name: 'Strawberries 500g', price: 10, original_price: 13, discount: 23, rating: 4.5, reviews: 160, image: 'https://via.placeholder.com/200?text=Strawberries', category_id: 5 },
        { name: 'Milk Cow', price: 1500, original_price: 1800, discount: 17, rating: 4.6, reviews: 50, image: 'https://via.placeholder.com/200?text=Cow', category_id: 6 },
        { name: 'Chicken Feed 20kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 100, image: 'https://via.placeholder.com/200?text=Chicken+Feed', category_id: 6 },
        { name: 'Pig Fattening Feed 50kg', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Pig+Feed', category_id: 6 },
        { name: 'Sheep Wool', price: 50, original_price: 65, discount: 23, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Wool', category_id: 6 },
        { name: 'Goat Milk 5L', price: 20, original_price: 25, discount: 20, rating: 4.2, reviews: 90, image: 'https://via.placeholder.com/200?text=Goat+Milk', category_id: 6 },
        { name: 'Beef Meat 2kg', price: 30, original_price: 40, discount: 25, rating: 4.1, reviews: 70, image: 'https://via.placeholder.com/200?text=Beef', category_id: 6 },
        { name: 'Eggs 12 Pack', price: 6, original_price: 8, discount: 25, rating: 4.0, reviews: 150, image: 'https://via.placeholder.com/200?text=Eggs', category_id: 6 },
        { name: 'Honey 1kg', price: 15, original_price: 20, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Honey', category_id: 6 },
        { name: 'Cheese Wheel 2kg', price: 25, original_price: 35, discount: 29, rating: 4.4, reviews: 100, image: 'https://via.placeholder.com/200?text=Cheese', category_id: 6 },
        { name: 'Butter 500g', price: 8, original_price: 10, discount: 20, rating: 4.2, reviews: 110, image: 'https://via.placeholder.com/200?text=Butter', category_id: 6 },
        { name: 'Yogurt 1L', price: 5, original_price: 7, discount: 29, rating: 4.1, reviews: 130, image: 'https://via.placeholder.com/200?text=Yogurt', category_id: 6 },
        { name: 'Corn Seeds 10kg', price: 40, original_price: 50, discount: 20, rating: 4.5, reviews: 200, image: 'https://via.placeholder.com/200?text=Corn+Seeds', category_id: 1 },
        { name: 'Wheat Seeds 5kg', price: 30, original_price: 40, discount: 25, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Wheat+Seeds', category_id: 1 },
        { name: 'Rice Seeds 2kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Rice+Seeds', category_id: 1 },
        { name: 'Soybean Seeds 3kg', price: 35, original_price: 45, discount: 22, rating: 4.6, reviews: 120, image: 'https://via.placeholder.com/200?text=Soybean+Seeds', category_id: 1 },
        { name: 'Potato Seeds 1kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 100, image: 'https://via.placeholder.com/200?text=Potato+Seeds', category_id: 1 },
        { name: 'Tomato Seeds 500g', price: 10, original_price: 15, discount: 33, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Tomato+Seeds', category_id: 1 },
        { name: 'Carrot Seeds 200g', price: 8, original_price: 12, discount: 33, rating: 4.0, reviews: 80, image: 'https://via.placeholder.com/200?text=Carrot+Seeds', category_id: 1 },
        { name: 'Lettuce Seeds 100g', price: 5, original_price: 8, discount: 38, rating: 3.9, reviews: 70, image: 'https://via.placeholder.com/200?text=Lettuce+Seeds', category_id: 1 },
        { name: 'Urea Fertilizer 25kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 250, image: 'https://via.placeholder.com/200?text=Urea', category_id: 2 },
        { name: 'Phosphate Fertilizer 20kg', price: 30, original_price: 40, discount: 25, rating: 4.5, reviews: 220, image: 'https://via.placeholder.com/200?text=Phosphate', category_id: 2 },
        { name: 'Potash Fertilizer 15kg', price: 35, original_price: 45, discount: 22, rating: 4.4, reviews: 200, image: 'https://via.placeholder.com/200?text=Potash', category_id: 2 },
        { name: 'Organic Compost 50kg', price: 20, original_price: 25, discount: 20, rating: 4.6, reviews: 180, image: 'https://via.placeholder.com/200?text=Compost', category_id: 2 },
        { name: 'Lime Fertilizer 10kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 160, image: 'https://via.placeholder.com/200?text=Lime', category_id: 2 },
        { name: 'Micronutrient Mix 5kg', price: 50, original_price: 65, discount: 23, rating: 4.7, reviews: 140, image: 'https://via.placeholder.com/200?text=Micronutrient', category_id: 2 },
        { name: 'Garden Hose 50ft', price: 25, original_price: 35, discount: 29, rating: 4.3, reviews: 300, image: 'https://via.placeholder.com/200?text=Hose', category_id: 3 },
        { name: 'Shovel Set', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 280, image: 'https://via.placeholder.com/200?text=Shovel', category_id: 3 },
        { name: 'Pruning Shears', price: 15, original_price: 20, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Shears', category_id: 3 },
        { name: 'Wheelbarrow', price: 80, original_price: 100, discount: 20, rating: 4.5, reviews: 240, image: 'https://via.placeholder.com/200?text=Wheelbarrow', category_id: 3 },
        { name: 'Garden Gloves', price: 10, original_price: 15, discount: 33, rating: 4.0, reviews: 220, image: 'https://via.placeholder.com/200?text=Gloves', category_id: 3 },
        { name: 'Soil Tester Kit', price: 30, original_price: 40, discount: 25, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Soil+Tester', category_id: 3 },
        { name: 'Seed Drill Machine', price: 500, original_price: 650, discount: 23, rating: 4.6, reviews: 100, image: 'https://via.placeholder.com/200?text=Seed+Drill', category_id: 4 },
        { name: 'Plow Attachment', price: 200, original_price: 250, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Plow', category_id: 4 },
        { name: 'Harvester Combine', price: 15000, original_price: 18000, discount: 17, rating: 4.8, reviews: 50, image: 'https://via.placeholder.com/200?text=Harvester', category_id: 4 },
        { name: 'Irrigation Pump', price: 300, original_price: 400, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Pump', category_id: 4 },
        { name: 'Sprinkler System', price: 150, original_price: 200, discount: 25, rating: 4.5, reviews: 140, image: 'https://via.placeholder.com/200?text=Sprinkler', category_id: 4 },
        { name: 'Drip Irrigation Kit', price: 100, original_price: 130, discount: 23, rating: 4.4, reviews: 160, image: 'https://via.placeholder.com/200?text=Drip', category_id: 4 },
        { name: 'Fresh Apples 5kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 300, image: 'https://via.placeholder.com/200?text=Apples', category_id: 5 },
        { name: 'Organic Bananas 2kg', price: 8, original_price: 10, discount: 20, rating: 4.3, reviews: 280, image: 'https://via.placeholder.com/200?text=Bananas', category_id: 5 },
        { name: 'Carrots 3kg', price: 6, original_price: 8, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Carrots', category_id: 5 },
        { name: 'Potatoes 10kg', price: 12, original_price: 15, discount: 20, rating: 4.0, reviews: 240, image: 'https://via.placeholder.com/200?text=Potatoes', category_id: 5 },
        { name: 'Tomatoes 2kg', price: 5, original_price: 7, discount: 29, rating: 3.9, reviews: 220, image: 'https://via.placeholder.com/200?text=Tomatoes', category_id: 5 },
        { name: 'Lettuce Bundle', price: 4, original_price: 6, discount: 33, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Lettuce', category_id: 5 },
        { name: 'Broccoli Heads', price: 7, original_price: 9, discount: 22, rating: 4.4, reviews: 180, image: 'https://via.placeholder.com/200?text=Broccoli', category_id: 5 },
        { name: 'Strawberries 500g', price: 10, original_price: 13, discount: 23, rating: 4.5, reviews: 160, image: 'https://via.placeholder.com/200?text=Strawberries', category_id: 5 },
        { name: 'Milk Cow', price: 1500, original_price: 1800, discount: 17, rating: 4.6, reviews: 50, image: 'https://via.placeholder.com/200?text=Cow', category_id: 6 },
        { name: 'Chicken Feed 20kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 100, image: 'https://via.placeholder.com/200?text=Chicken+Feed', category_id: 6 },
        { name: 'Pig Fattening Feed 50kg', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Pig+Feed', category_id: 6 },
        { name: 'Sheep Wool', price: 50, original_price: 65, discount: 23, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Wool', category_id: 6 },
        { name: 'Goat Milk 5L', price: 20, original_price: 25, discount: 20, rating: 4.2, reviews: 90, image: 'https://via.placeholder.com/200?text=Goat+Milk', category_id: 6 },
        { name: 'Beef Meat 2kg', price: 30, original_price: 40, discount: 25, rating: 4.1, reviews: 70, image: 'https://via.placeholder.com/200?text=Beef', category_id: 6 },
        { name: 'Eggs 12 Pack', price: 6, original_price: 8, discount: 25, rating: 4.0, reviews: 150, image: 'https://via.placeholder.com/200?text=Eggs', category_id: 6 },
        { name: 'Honey 1kg', price: 15, original_price: 20, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Honey', category_id: 6 },
        { name: 'Cheese Wheel 2kg', price: 25, original_price: 35, discount: 29, rating: 4.4, reviews: 100, image: 'https://via.placeholder.com/200?text=Cheese', category_id: 6 },
        { name: 'Butter 500g', price: 8, original_price: 10, discount: 20, rating: 4.2, reviews: 110, image: 'https://via.placeholder.com/200?text=Butter', category_id: 6 },
        { name: 'Yogurt 1L', price: 5, original_price: 7, discount: 29, rating: 4.1, reviews: 130, image: 'https://via.placeholder.com/200?text=Yogurt', category_id: 6 },
        { name: 'Organic Pesticide 1L', price: 25, original_price: 35, discount: 29, rating: 4.2, reviews: 140, image: 'https://via.placeholder.com/200?text=Pesticide', category_id: 3 },
        { name: 'Herbicide Spray 500ml', price: 15, original_price: 20, discount: 25, rating: 4.0, reviews: 120, image: 'https://via.placeholder.com/200?text=Herbicide', category_id: 3 },
        { name: 'Fungicide Powder 1kg', price: 30, original_price: 40, discount: 25, rating: 4.3, reviews: 100, image: 'https://via.placeholder.com/200?text=Fungicide', category_id: 2 },
        { name: 'Insecticide Liquid 250ml', price: 20, original_price: 25, discount: 20, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Insecticide', category_id: 3 },
        { name: 'Weed Killer 1L', price: 18, original_price: 22, discount: 18, rating: 3.9, reviews: 80, image: 'https://via.placeholder.com/200?text=Weed+Killer', category_id: 3 },
        { name: 'Plant Growth Regulator 100ml', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 70, image: 'https://via.placeholder.com/200?text=Growth+Regulator', category_id: 2 },
        { name: 'Biofertilizer 5kg', price: 35, original_price: 45, discount: 22, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Biofertilizer', category_id: 2 },
        { name: 'Vermicompost 10kg', price: 25, original_price: 30, discount: 17, rating: 4.6, reviews: 50, image: 'https://via.placeholder.com/200?text=Vermicompost', category_id: 2 },
        { name: 'Seaweed Extract 1L', price: 45, original_price: 55, discount: 18, rating: 4.7, reviews: 40, image: 'https://via.placeholder.com/200?text=Seaweed', category_id: 2 },
        { name: 'Bone Meal 2kg', price: 20, original_price: 25, discount: 20, rating: 4.3, reviews: 30, image: 'https://via.placeholder.com/200?text=Bone+Meal', category_id: 2 },
        { name: 'Blood Meal 1kg', price: 15, original_price: 18, discount: 17, rating: 4.2, reviews: 25, image: 'https://via.placeholder.com/200?text=Blood+Meal', category_id: 2 },
        { name: 'Fish Emulsion 500ml', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 20, image: 'https://via.placeholder.com/200?text=Fish+Emulsion', category_id: 2 },
        { name: 'Epsom Salt 1kg', price: 8, original_price: 10, discount: 20, rating: 4.0, reviews: 15, image: 'https://via.placeholder.com/200?text=Epsom+Salt', category_id: 2 },
        { name: 'Gypsum Powder 5kg', price: 18, original_price: 22, discount: 18, rating: 4.4, reviews: 10, image: 'https://via.placeholder.com/200?text=Gypsum', category_id: 2 },
        { name: 'Dolomite Lime 10kg', price: 22, original_price: 28, discount: 21, rating: 4.5, reviews: 5, image: 'https://via.placeholder.com/200?text=Dolomite', category_id: 2 },
        { name: 'Sulfur Powder 2kg', price: 14, original_price: 17, discount: 18, rating: 4.3, reviews: 8, image: 'https://via.placeholder.com/200?text=Sulfur', category_id: 2 },
        { name: 'Potassium Nitrate 1kg', price: 25, original_price: 30, discount: 17, rating: 4.6, reviews: 12, image: 'https://via.placeholder.com/200?text=Potassium+Nitrate', category_id: 2 },
        { name: 'Ammonium Sulfate 5kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 15, image: 'https://via.placeholder.com/200?text=Ammonium+Sulfate', category_id: 2 },
        { name: 'Triple Superphosphate 10kg', price: 35, original_price: 45, discount: 22, rating: 4.7, reviews: 20, image: 'https://via.placeholder.com/200?text=Triple+Superphosphate', category_id: 2 },
        { name: 'Monoammonium Phosphate 5kg', price: 30, original_price: 38, discount: 21, rating: 4.5, reviews: 18, image: 'https://via.placeholder.com/200?text=Monoammonium+Phosphate', category_id: 2 },
        { name: 'Diammonium Phosphate 10kg', price: 40, original_price: 50, discount: 20, rating: 4.6, reviews: 25, image: 'https://via.placeholder.com/200?text=Diammonium+Phosphate', category_id: 2 },
        { name: 'Muriate of Potash 5kg', price: 28, original_price: 35, discount: 20, rating: 4.4, reviews: 22, image: 'https://via.placeholder.com/200?text=Muriate+of+Potash', category_id: 2 },
        { name: 'Sulfate of Potash 2kg', price: 32, original_price: 40, discount: 20, rating: 4.5, reviews: 20, image: 'https://via.placeholder.com/200?text=Sulfate+of+Potash', category_id: 2 },
        { name: 'Calcium Nitrate 5kg', price: 26, original_price: 32, discount: 19, rating: 4.3, reviews: 17, image: 'https://via.placeholder.com/200?text=Calcium+Nitrate', category_id: 2 },
        { name: 'Magnesium Sulfate 1kg', price: 10, original_price: 12, discount: 17, rating: 4.2, reviews: 14, image: 'https://via.placeholder.com/200?text=Magnesium+Sulfate', category_id: 2 },
        { name: 'Iron Chelate 500g', price: 18, original_price: 22, discount: 18, rating: 4.4, reviews: 11, image: 'https://via.placeholder.com/200?text=Iron+Chelate', category_id: 2 },
        { name: 'Zinc Sulfate 1kg', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 9, image: 'https://via.placeholder.com/200?text=Zinc+Sulfate', category_id: 2 },
        { name: 'Copper Sulfate 500g', price: 16, original_price: 20, discount: 20, rating: 4.3, reviews: 7, image: 'https://via.placeholder.com/200?text=Copper+Sulfate', category_id: 2 },
        { name: 'Boron 100g', price: 8, original_price: 10, discount: 20, rating: 4.0, reviews: 6, image: 'https://via.placeholder.com/200?text=Boron', category_id: 2 },
        { name: 'Manganese Sulfate 500g', price: 14, original_price: 17, discount: 18, rating: 4.2, reviews: 5, image: 'https://via.placeholder.com/200?text=Manganese+Sulfate', category_id: 2 },
        { name: 'Molybdenum 50g', price: 20, original_price: 25, discount: 20, rating: 4.5, reviews: 4, image: 'https://via.placeholder.com/200?text=Molybdenum', category_id: 2 },
        { name: 'Cobalt Sulfate 100g', price: 22, original_price: 28, discount: 21, rating: 4.6, reviews: 3, image: 'https://via.placeholder.com/200?text=Cobalt+Sulfate', category_id: 2 },
        { name: 'Nickel Sulfate 50g', price: 25, original_price: 30, discount: 17, rating: 4.7, reviews: 2, image: 'https://via.placeholder.com/200?text=Nickel+Sulfate', category_id: 2 },
        { name: 'Chlorine 1kg', price: 15, original_price: 18, discount: 17, rating: 4.3, reviews: 1, image: 'https://via.placeholder.com/200?text=Chlorine', category_id: 2 },
        { name: 'Sodium Molybdate 100g', price: 30, original_price: 35, discount: 14, rating: 4.8, reviews: 1, image: 'https://via.placeholder.com/200?text=Sodium+Molybdate', category_id: 2 },
        { name: 'Vanadium 50g', price: 35, original_price: 40, discount: 13, rating: 4.9, reviews: 1, image: 'https://via.placeholder.com/200?text=Vanadium', category_id: 2 },
        { name: 'Silicon 1kg', price: 18, original_price: 22, discount: 18, rating: 4.4, reviews: 2, image: 'https://via.placeholder.com/200?text=Silicon', category_id: 2 },
        { name: 'Selenium 100g', price: 40, original_price: 45, discount: 11, rating: 4.9, reviews: 1, image: 'https://via.placeholder.com/200?text=Selenium', category_id: 2 },
        { name: 'Iodine 50g', price: 45, original_price: 50, discount: 10, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Iodine', category_id: 2 },
        { name: 'Chromium 100g', price: 50, original_price: 55, discount: 9, rating: 4.8, reviews: 1, image: 'https://via.placeholder.com/200?text=Chromium', category_id: 2 },
        { name: 'Tungsten 50g', price: 55, original_price: 60, discount: 8, rating: 4.7, reviews: 1, image: 'https://via.placeholder.com/200?text=Tungsten', category_id: 2 },
        { name: 'Titanium 100g', price: 60, original_price: 65, discount: 8, rating: 4.6, reviews: 1, image: 'https://via.placeholder.com/200?text=Titanium', category_id: 2 },
        { name: 'Aluminum Sulfate 5kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 3, image: 'https://via.placeholder.com/200?text=Aluminum+Sulfate', category_id: 2 },
        { name: 'Sodium Chloride 10kg', price: 15, original_price: 18, discount: 17, rating: 4.2, reviews: 4, image: 'https://via.placeholder.com/200?text=Sodium+Chloride', category_id: 2 },
        { name: 'Potassium Chloride 5kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 5, image: 'https://via.placeholder.com/200?text=Potassium+Chloride', category_id: 2 },
        { name: 'Magnesium Chloride 2kg', price: 18, original_price: 22, discount: 18, rating: 4.3, reviews: 6, image: 'https://via.placeholder.com/200?text=Magnesium+Chloride', category_id: 2 },
        { name: 'Calcium Chloride 5kg', price: 22, original_price: 28, discount: 21, rating: 4.5, reviews: 7, image: 'https://via.placeholder.com/200?text=Calcium+Chloride', category_id: 2 },
        { name: 'Sodium Bicarbonate 1kg', price: 10, original_price: 12, discount: 17, rating: 4.1, reviews: 8, image: 'https://via.placeholder.com/200?text=Sodium+Bicarbonate', category_id: 2 },
        { name: 'Potassium Bicarbonate 500g', price: 12, original_price: 15, discount: 20, rating: 4.2, reviews: 9, image: 'https://via.placeholder.com/200?text=Potassium+Bicarbonate', category_id: 2 },
        { name: 'Ammonium Bicarbonate 1kg', price: 14, original_price: 17, discount: 18, rating: 4.3, reviews: 10, image: 'https://via.placeholder.com/200?text=Ammonium+Bicarbonate', category_id: 2 },
        { name: 'Sodium Hydroxide 500g', price: 8, original_price: 10, discount: 20, rating: 4.0, reviews: 11, image: 'https://via.placeholder.com/200?text=Sodium+Hydroxide', category_id: 2 },
        { name: 'Potassium Hydroxide 500g', price: 9, original_price: 11, discount: 18, rating: 4.1, reviews: 12, image: 'https://via.placeholder.com/200?text=Potassium+Hydroxide', category_id: 2 },
        { name: 'Calcium Hydroxide 2kg', price: 16, original_price: 20, discount: 20, rating: 4.4, reviews: 13, image: 'https://via.placeholder.com/200?text=Calcium+Hydroxide', category_id: 2 },
        { name: 'Magnesium Hydroxide 1kg', price: 14, original_price: 17, discount: 18, rating: 4.3, reviews: 14, image: 'https://via.placeholder.com/200?text=Magnesium+Hydroxide', category_id: 2 },
        { name: 'Barium Hydroxide 500g', price: 20, original_price: 25, discount: 20, rating: 4.5, reviews: 15, image: 'https://via.placeholder.com/200?text=Barium+Hydroxide', category_id: 2 },
        { name: 'Strontium Hydroxide 500g', price: 25, original_price: 30, discount: 17, rating: 4.6, reviews: 16, image: 'https://via.placeholder.com/200?text=Strontium+Hydroxide', category_id: 2 },
        { name: 'Lithium Hydroxide 100g', price: 30, original_price: 35, discount: 14, rating: 4.7, reviews: 17, image: 'https://via.placeholder.com/200?text=Lithium+Hydroxide', category_id: 2 },
        { name: 'Rubidium Hydroxide 50g', price: 35, original_price: 40, discount: 13, rating: 4.8, reviews: 18, image: 'https://via.placeholder.com/200?text=Rubidium+Hydroxide', category_id: 2 },
        { name: 'Cesium Hydroxide 50g', price: 40, original_price: 45, discount: 11, rating: 4.9, reviews: 19, image: 'https://via.placeholder.com/200?text=Cesium+Hydroxide', category_id: 2 },
        { name: 'Francium Hydroxide 10g', price: 100, original_price: 110, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Francium+Hydroxide', category_id: 2 },
        { name: 'Radium Hydroxide 5g', price: 200, original_price: 220, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Radium+Hydroxide', category_id: 2 },
        { name: 'Actinium Hydroxide 1g', price: 500, original_price: 550, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Actinium+Hydroxide', category_id: 2 },
        { name: 'Thorium Hydroxide 1g', price: 600, original_price: 660, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Thorium+Hydroxide', category_id: 2 },
        { name: 'Protactinium Hydroxide 1g', price: 700, original_price: 770, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Protactinium+Hydroxide', category_id: 2 },
        { name: 'Uranium Hydroxide 1g', price: 800, original_price: 880, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Uranium+Hydroxide', category_id: 2 },
        { name: 'Neptunium Hydroxide 1g', price: 900, original_price: 990, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Neptunium+Hydroxide', category_id: 2 },
        { name: 'Plutonium Hydroxide 1g', price: 1000, original_price: 1100, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Plutonium+Hydroxide', category_id: 2 },
        { name: 'Americium Hydroxide 1g', price: 1100, original_price: 1210, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Americium+Hydroxide', category_id: 2 },
        { name: 'Curium Hydroxide 1g', price: 1200, original_price: 1320, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Curium+Hydroxide', category_id: 2 },
        { name: 'Berkelium Hydroxide 1g', price: 1300, original_price: 1430, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Berkelium+Hydroxide', category_id: 2 },
        { name: 'Californium Hydroxide 1g', price: 1400, original_price: 1540, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Californium+Hydroxide', category_id: 2 },
        { name: 'Einsteinium Hydroxide 1g', price: 1500, original_price: 1650, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Einsteinium+Hydroxide', category_id: 2 },
        { name: 'Fermium Hydroxide 1g', price: 1600, original_price: 1760, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Fermium+Hydroxide', category_id: 2 },
        { name: 'Mendelevium Hydroxide 1g', price: 1700, original_price: 1870, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Mendelevium+Hydroxide', category_id: 2 },
        { name: 'Nobelium Hydroxide 1g', price: 1800, original_price: 1980, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Nobelium+Hydroxide', category_id: 2 },
        { name: 'Lawrencium Hydroxide 1g', price: 1900, original_price: 2090, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Lawrencium+Hydroxide', category_id: 2 },
        { name: 'Rutherfordium Hydroxide 1g', price: 2000, original_price: 2200, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Rutherfordium+Hydroxide', category_id: 2 },
        { name: 'Dubnium Hydroxide 1g', price: 2100, original_price: 2310, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Dubnium+Hydroxide', category_id: 2 },
        { name: 'Seaborgium Hydroxide 1g', price: 2200, original_price: 2420, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Seaborgium+Hydroxide', category_id: 2 },
        { name: 'Bohrium Hydroxide 1g', price: 2300, original_price: 2530, discount: 9, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Bohrium+Hydroxide', category_id: 2 },

      products.forEach(product => {
        db.run(`
          INSERT INTO products (name, price, original_price, discount, rating, reviews, image, category_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [product.name, product.price, product.original_price, product.discount, product.rating, product.reviews, product.image, product.category_id]);
      });

      console.log('Seeded products.');
    }
  });

  // Create default admin user
  db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin"', (err, row) => {
    if (err) {
      console.error('Error checking admin user:', err.message);
      return;
    }

    if (row.count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);

      db.run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', ['admin@agrimarket.com', hashedPassword, 'admin'], function(err) {
        if (err) {
          console.error('Error creating admin user:', err.message);
        } else {
          console.log('Created default admin user: admin@agrimarket.com / admin123');
        }
      });
    }
  });
}

module.exports = db;
