// Create posts table if it doesn't exist
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./blog.db');

db.serialize(() => {
  // Create the table if it doesn't exist
  db.run('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)');
  console.log('Posts table created or already exists');
});

db.close();
