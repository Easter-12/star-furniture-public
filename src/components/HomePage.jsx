import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ChatWidget from './ChatWidget';
import NotificationBell from './NotificationBell';
import WhatsAppIcon from './WhatsAppIcon';

function HomePage({ session }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
        setProducts(currentProducts => [payload.new, ...currentProducts]);
        setNotificationMessage(`New product added: ${payload.new.name}`);
        setHasNewNotification(true);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        alert('Error loading products: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleNotificationClick = () => {
    if (hasNewNotification) {
      alert(notificationMessage);
      setHasNewNotification(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="homepage-container">
        <header style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <NotificationBell hasNewNotification={hasNewNotification} onClick={handleNotificationClick} />
          </div>
          <h1>Welcome to Star Furniture</h1>
          <p>You are signed in as: <strong>{session.user.email}</strong></p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </header>

        <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '2rem 0' }} />

        <main>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Products</h2>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading products...</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} />
                  <div className="product-card-content">
                    <h3>{product.name}</h3>
                    <p className="price">₦{product.price.toLocaleString()}</p>
                    <p className="description">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <div className="floating-actions-container">
        <WhatsAppIcon />
        <ChatWidget user={session.user} />
      </div>
    </div>
  );
}

export default HomePage;