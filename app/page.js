'use client'

// blog-frontend/pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const apiUrl = '/api/posts';  // The backend API URL (works both locally and on Vercel)

 // Fetch posts from backend API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(apiUrl);

        // If response is not ok, throw an error
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };

    fetchPosts();
  }, [apiUrl]);

  // Display loading state, error state, or posts
  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error}</div>;
  }

  // Handle form submission (creating a new post)
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!newPost.title || !newPost.content) return;

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('New post added:', data);

    // Update the state with the new post
    setPosts((prevPosts) => [...prevPosts, data]);
    setNewPost({ title: '', content: '' });
  } catch (error) {
    console.error('Error submitting post:', error);
  }
};

  // Handle delete action
  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div>
      <h1>Blog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) =>
            setNewPost({ ...newPost, content: e.target.value })
          }
        />
        <button type="submit">Create Post</button>
      </form>

      <h2>Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}