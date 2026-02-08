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
        { name: 'Yogurt 1L', price: 5, original_price: 7, discount: 29, rating: 4.1, reviews: 130, image: 'https://via.placeholder.com/200?text=Yogurt', category_id: 6 }
      ];

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
