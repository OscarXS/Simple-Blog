'use client'

// blog-frontend/pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const apiUrl = '/api/posts';  // The backend API URL (works both locally and on Vercel)

  // Fetch posts from backend API
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  // Handle form submission (creating a new post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    const data = await res.json();
    setPosts([...posts, data]);
    setNewPost({ title: '', content: '' });
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
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}