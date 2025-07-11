import React from 'react';
import './NotificationBell.css'; // We will create this CSS file next

function NotificationBell({ hasNewNotification, onClick }) {
  return (
    <div className="notification-bell" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      {hasNewNotification && <div className="notification-dot"></div>}
    </div>
  );
}

export default NotificationBell;