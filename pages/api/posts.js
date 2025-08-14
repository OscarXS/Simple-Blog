// blog-backend/pages/api/posts.js

import sqlite3 from 'sqlite3';

// Connect to SQLite database (will be stored as a file)
const db = new sqlite3.Database('./blog.db');

// Handle GET requests
export async function GET(req, res) {
  db.all('SELECT * FROM posts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
}

// Handle POST requests
export async function POST(req, res) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, content });
  });
}

// Handle DELETE requests
export async function DELETE(req, res) {
  const { id } = req.query;

  db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted' });
  });
}