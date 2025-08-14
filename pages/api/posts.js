import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient('https://ymqckvsyjmifclzgybth.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcWNrdnN5am1pZmNsemd5YnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzM4NTMsImV4cCI6MjA3MDc0OTg1M30.lN1QSGqSjP-wIGg-kiNt4-txzEiFbgYqEPwvPtY2JOc');

// Handle GET requests
export async function GET(req, res) {
  console.log('GET request received');
  try {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log('Fetched posts:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Handle POST requests
export async function POST(req, res) {
  const { title, content } = req.body;
  console.log('POST request received with body:', req.body);

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content }]);

    if (error) {
      console.error('Error inserting post:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Inserted post:', data);
    res.status(201).json(data[0]); // Send the newly created post back
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
