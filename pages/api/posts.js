import { createClient } from '@supabase/supabase-js';

// Create the Supabase client (you can add these to environment variables in Vercel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req, res) {
  try {
    // Fetch posts from Supabase
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: error.message });
    }

    // Return the posts
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function POST(req, res) {
  try {
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

    // Return the inserted post
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
