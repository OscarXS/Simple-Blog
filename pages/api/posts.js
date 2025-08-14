// blog-frontend/pages/api/posts.js
import { supabase } from '../../lib/supabase';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'; // Import Supabase helper

export async function GET(req, res) {
  const supabase = createServerSupabaseClient({ req, res });

  // Get posts from Supabase
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('id', { ascending: false });  // Optional: Order by ID descending for newest posts

  if (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}


// Handle POST requests
export async function POST(req, res) {
  const supabase = createServerSupabaseClient({ req, res });

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  // Insert a new post into Supabase
  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, content }])
    .single();  // Ensures only one post is inserted

  if (error) {
    console.error('Error inserting post:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
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
