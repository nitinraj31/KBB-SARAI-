const db = require('../database');

class Product {
  // Get all products
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get product by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get products by category
  static getByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ?
        ORDER BY p.created_at DESC
      `, [categoryId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Search products
  static search(query) {
    return new Promise((resolve, reject) => {
      const searchTerm = `%${query}%`;
      db.all(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR p.description LIKE ?
        ORDER BY p.created_at DESC
      `, [searchTerm, searchTerm], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Create new product
  static create(productData) {
    return new Promise((resolve, reject) => {
      const { name, description, price, original_price, discount, rating, reviews, image, category_id } = productData;

      db.run(`
        INSERT INTO products (name, description, price, original_price, discount, rating, reviews, image, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name, description, price, original_price, discount, rating, reviews, image, category_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...productData });
        }
      });
    });
  }

  // Update product
  static update(id, productData) {
    return new Promise((resolve, reject) => {
      const { name, description, price, original_price, discount, rating, reviews, image, category_id } = productData;

      db.run(`
        UPDATE products
        SET name = ?, description = ?, price = ?, original_price = ?, discount = ?, rating = ?, reviews = ?, image = ?, category_id = ?
        WHERE id = ?
      `, [name, description, price, original_price, discount, rating, reviews, image, category_id, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...productData });
        }
      });
    });
  }

  // Delete product
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
}

module.exports = Product;
