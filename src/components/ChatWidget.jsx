import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import './ChatWidget.css';

// A unique, fixed ID for the admin, same as in the admin panel
const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000001';

function ChatWidget({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Effect to scroll to the bottom of the messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Effect to fetch message history and subscribe to new messages
  useEffect(() => {
    if (!isOpen || !user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      // --- THIS IS THE CORRECTED QUERY ---
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${ADMIN_USER_ID}),` +
          `and(sender_id.eq.${ADMIN_USER_ID},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) console.error('Error fetching messages:', error);
      else setMessages(data);
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if ((msg.sender_id === user.id && msg.receiver_id === ADMIN_USER_ID) ||
            (msg.sender_id === ADMIN_USER_ID && msg.receiver_id === user.id)) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isOpen, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      content: newMessage,
      sender_id: user.id, // The logged-in user is the sender
      receiver_id: ADMIN_USER_ID,
    };

    const { error } = await supabase.from('messages').insert([messageData]);
    if (error) {
      alert('Error sending message: ' + error.message);
    } else {
      setNewMessage('');
    }
  };

  if (!user) return null; // Don't render the widget if user is not logged in

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window-public">
          <div className="chat-header">
            <h3>Chat with Support</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>
          <div className="messages-area-public">
            {messages.map(msg => (
              <div key={msg.id} className={`message-public ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="message-input-area-public" onSubmit={handleSendMessage}>
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="chat-toggle-button">
        Chat
      </button>
    </div>
  );
}

export default ChatWidget;