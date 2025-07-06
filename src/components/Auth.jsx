import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Auth() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      // We will handle successful login (like redirecting) in a later step.
      // For now, we just know it worked if no error is thrown.
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER LOGIC ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Generate username from email
      const username = email.split('@')[0];

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Add the username to the user's metadata
          data: {
            username: username,
          }
        }
      });
      if (error) throw error;

      // As per requirements, show a success message
      alert('Registration successful. Please sign in now.');
      setIsLoginView(true); // Switch to the login view

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={isLoginView ? handleLogin : handleRegister}>
        <h2>{isLoginView ? 'Sign In' : 'Create Account'}</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Register')}
        </button>

        <p onClick={() => setIsLoginView(!isLoginView)} className="auth-toggle">
          {isLoginView ? "Don't have an account? Register" : "Already have an account? Sign In"}
        </p>
      </form>
    </div>
  );
}

export default Auth;