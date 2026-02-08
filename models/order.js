const db = require('../database');

class Order {
  // Get all orders for a user
  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT o.*, p.name as product_name, p.image as product_image
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get order by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT o.*, p.name as product_name, p.image as product_image, u.email as user_email
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Create new order
  static create(orderData) {
    return new Promise((resolve, reject) => {
      const { user_id, product_id, quantity, total_price, status = 'pending' } = orderData;

      db.run(`
        INSERT INTO orders (user_id, product_id, quantity, total_price, status)
        VALUES (?, ?, ?, ?, ?)
      `, [user_id, product_id, quantity, total_price, status], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...orderData });
        }
      });
    });
  }

  // Update order status
  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, status });
        }
      });
    });
  }

  // Delete order
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }

  // Get all orders (admin)
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT o.*, p.name as product_name, p.image as product_image, u.email as user_email
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Order;
