import React, { useState, useEffect } from 'react';
// The slider CSS imports have been removed from here

import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-container">
      {!session ? (
        <Auth />
      ) : (
        <HomePage key={session.user.id} session={session} />
      )}
    </div>
  );
}

export default App;