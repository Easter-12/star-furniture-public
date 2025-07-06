import React, { useState, useEffect, useRef } from 'react';
import './ProfileDropdown.css'; // We will create this CSS file next

function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the first letter of the user's email for the avatar
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  // This effect handles closing the dropdown if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="profile-avatar">
        {userInitial}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>
              <button onClick={onLogout} className="dropdown-item">
                Sign Out
              </button>
            </li>
            {/* Future items like "Edit Profile" can be added here */}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;