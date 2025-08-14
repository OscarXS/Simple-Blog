import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://ymqckvsyjmifclzgybth.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcWNrdnN5am1pZmNsemd5YnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzM4NTMsImV4cCI6MjA3MDc0OTg1M30.lN1QSGqSjP-wIGg-kiNt4-txzEiFbgYqEPwvPtY2JOc');

// Handle GET requests
export default async function handler(req, res) {
  // GET request - fetch posts
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(data);
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST request - create a new post
  else if (req.method === 'POST') {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
      const { data, error } = await supabase.from('posts').insert([{ title, content }]);
      if (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json(data[0]); // Return the newly inserted post
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE request - delete a post by ID
  else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed for any other HTTP method
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}