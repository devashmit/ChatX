import React from 'react';
import { Plus, Search, Trash2, MessageSquareCode, Menu, X } from 'lucide-react';

export default function Sidebar({
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
            <span>AuraChat</span>
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

        <div className="sidebar-footer">
          <div className="footer-user">
            <div className="user-avatar">U</div>
            <div className="user-name">User Guest</div>
          </div>
        </div>
      </aside>
    </>
  );
}
