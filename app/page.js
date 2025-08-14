'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })

  // Get the base API URL dynamically based on the environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/posts'; // Default to Next.js API

  // Fetch posts from the backend API
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, [apiUrl]);

  // Handle form submissions
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
    const res = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };
  
  return (
    <div>
      <h1>Simple Blog</h1>

      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Title'
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder='Content'
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        <button type='submit'>Create Post</button>
      </form>

      <h2>All Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}