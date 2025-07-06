import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import HomePage from './components/HomePage'; // Import the new HomePage component
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for an existing session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes in authentication state (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-container">
      {/* 
        If there is no session, show the Auth component.
        If there IS a session, show the HomePage component.
      */}
      {!session ? (
        <Auth />
      ) : (
        <HomePage key={session.user.id} session={session} />
      )}
    </div>
  );
}

export default App;