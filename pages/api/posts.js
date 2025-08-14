// blog-frontend/pages/api/posts.js
import { supabase } from '../../lib/supabase';

// Handle GET requests
export async function GET(req, res) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}

// Handle POST requests
export async function POST(req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, content }])
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
}

// Handle DELETE requests
export async function DELETE(req, res) {
  const { id } = req.query;

  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.status(200).json({ message: 'Post deleted' });
}
