import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Import the specific icon
import './WhatsAppIcon.css';

function WhatsAppIcon() {
  const phoneNumber = '2347045325315';
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a 
      href={whatsappLink} 
      className="whatsapp-icon" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} /> {/* Use the imported icon component */}
    </a>
  );
}

export default WhatsAppIcon;