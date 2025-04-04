'use client';
import { useState } from 'react';
import './styles.css'; // we'll create this next

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    setResponse(data.answer || 'No response');
    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>🎧 AI Lyric Recommender</h1>
        <p className="subtitle">Paste some lyrics and we’ll recommend similar music vibes.</p>
      </header>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Paste your favorite song lyrics..."
        className="input-area"
      />

      <button onClick={handleSubmit} disabled={loading} className="submit-btn">
        {loading ? 'Analyzing...' : 'Get Music Vibes'}
      </button>

      {response && (
        <div className="response-box">
          <h2>🎶 Suggested Vibe:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}