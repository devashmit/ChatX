import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, MessageSquareCode, X, User, LogOut, Settings, Key, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

export default function Sidebar({
  currentUser,
  onLogout,
  conversations,
  activeId,
  searchQuery,
  setSearchQuery,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  setIsOpen
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('chatx_gemini_api_key') || '';
    setApiKey(savedKey);
  }, []);

  const handleApiKeyChange = (e) => {
    const val = e.target.value;
    setApiKey(val);
    if (val.trim()) {
      localStorage.setItem('chatx_gemini_api_key', val.trim());
    } else {
      localStorage.removeItem('chatx_gemini_api_key');
    }
  };

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <MessageSquareCode className="brand-icon" size={24} />
            <span>ChatX</span>
          </div>
          <button className="menu-toggle" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={onNewConversation}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        <div className="sidebar-search">
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search chat history..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="history-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No conversations found
            </div>
          ) : (
            filtered.map((chat) => (
              <div
                key={chat.id}
                className={`history-item ${chat.id === activeId ? 'active' : ''}`}
                onClick={() => {
                  onSelectConversation(chat.id);
                  setIsOpen(false); // Close sidebar on mobile select
                }}
              >
                <div className="history-details">
                  <div className="history-title">{chat.title}</div>
                </div>
                <div className="history-actions">
                  <button
                    className="action-btn delete"
                    title="Delete Conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(chat.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gemini API Key Settings Panel */}
        <div className="sidebar-settings">
          <button 
            className="settings-toggle-btn" 
            onClick={() => setShowSettings(!showSettings)}
            title="Toggle API Settings"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={14} />
              <span>Gemini Settings</span>
            </div>
            {showSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showSettings && (
            <div className="settings-panel">
              <label className="settings-label">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Key size={12} />
                    <span>Gemini API Key</span>
                  </div>
                  {import.meta.env.VITE_GEMINI_API_KEY && !apiKey && (
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.65rem', fontWeight: 600 }}>
                      ✓ Active (Env)
                    </span>
                  )}
                </div>
                <div className="settings-input-group">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder={import.meta.env.VITE_GEMINI_API_KEY ? "Loaded from environment..." : "Enter API Key..."}
                    className="settings-input"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                  />
                  <button 
                    type="button"
                    className="settings-key-btn" 
                    onClick={() => setShowKey(!showKey)}
                    title={showKey ? "Hide Key" : "Show Key"}
                  >
                    {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </label>
              <div className="settings-info">
                <span>Unlock live answers for Athena. Get a free key at </span>
                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">
                  Google AI Studio
                </a>.
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="footer-user">
            <div className="user-avatar"><User size={14} /></div>
            <div className="user-name" title={currentUser?.username || "Guest"}>
              {currentUser?.username || "Guest"}
            </div>
          </div>
          <button className="logout-btn" id="logout-btn" title="Log Out" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

