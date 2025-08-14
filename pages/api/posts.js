// blog-backend/pages/api/posts.js

import sqlite3 from 'sqlite3';

// Connect to SQLite database (will be stored as a file)
const db = new sqlite3.Database('./blog.db');

// Promisify the SQLite methods to work with async/await
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Handle GET requests (fetch all posts)
export async function GET(req, res) {
  try {
    const rows = await getQuery('SELECT * FROM posts');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Handle POST requests (create a new post)
export async function POST(req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await runQuery('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
    res.status(201).json({ id: result.lastID, title, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Handle DELETE requests (delete a post)
export async function DELETE(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  try {
    const result = await runQuery('DELETE FROM posts WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}