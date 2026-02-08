const db = require('../database');

class Category {
  // Get all categories
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get category by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Create new category
  static create(categoryData) {
    return new Promise((resolve, reject) => {
      const { name, image } = categoryData;

      db.run('INSERT INTO categories (name, image) VALUES (?, ?)', [name, image], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...categoryData });
        }
      });
    });
  }

  // Update category
  static update(id, categoryData) {
    return new Promise((resolve, reject) => {
      const { name, image } = categoryData;

      db.run('UPDATE categories SET name = ?, image = ? WHERE id = ?', [name, image, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...categoryData });
        }
      });
    });
  }

  // Delete category
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
}

module.exports = Category;
