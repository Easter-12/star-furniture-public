import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ChatWidget from './ChatWidget';
import NotificationBell from './NotificationBell';
import WhatsAppIcon from './WhatsAppIcon';
import ProfileDropdown from './ProfileDropdown';
import BillboardSlider from './BillboardSlider';

function HomePage({ session }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showAbout, setShowAbout] = useState(false);

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
    <div style={{ position: 'relative', width: '100%' }}>
      <header className="app-header">
        <div className="logo-container">
          <h3 className="logo-text">Star Furniture</h3>
          <p className="tagline">Affordable. Durable. Classy.</p>
        </div>
        {/* --- THIS SECTION HAS BEEN REORDERED --- */}
        <div className="header-actions">
          <NotificationBell 
            hasNewNotification={hasNewNotification}
            onClick={handleNotificationClick}
          />
          <ProfileDropdown user={session.user} onLogout={handleLogout} />
          <button onClick={() => setShowAbout(true)} className="header-button">About Us</button>
        </div>
      </header>

      {showAbout && (
        <div className="about-overlay">
          <div className="about-content">
            <h2>About Star Furniture</h2>
            <p>
              At Star Furniture, we believe that a well-furnished space can transform lives. Founded on the principles of quality, durability, and style, we are committed to providing our customers with furniture that is not only beautiful but also built to last. Our pieces are crafted with care, blending modern design with timeless elegance to create spaces that are both comfortable and productive.
            </p>
            <p>
              From ergonomic office chairs to classy home decor, every item in our collection is selected to meet our high standards. We are dedicated to making premium furniture accessible, ensuring that you can create your dream space without compromise.
            </p>
            <button onClick={() => setShowAbout(false)} className="close-about-btn">Close</button>
          </div>
        </div>
      )}

      <BillboardSlider />

      <div className="homepage-container">
        <main>
          <h2 style={{ textAlign: 'center', margin: '0 0 2rem 0' }}>Our Products</h2>
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