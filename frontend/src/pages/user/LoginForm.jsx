import React, { useState } from 'react';
import axios from '../../axios';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/user/login', {
        email,
        password
      });

      // Panggil onLogin dengan data user yang berhasil login
      onLogin(response.data);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {error && (
        <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '8px',
          margin: '5px 0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '8px',
          margin: '5px 0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      />
      <button 
        type="submit" 
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          background: loading ? '#cccccc' : '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
