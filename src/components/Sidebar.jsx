import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, MessageSquareCode, X, User, LogOut, Settings, Key, Eye, EyeOff, ChevronDown, ChevronUp, FolderOpen, FileText, Bookmark, Sliders, Info, Monitor, Shield, Zap } from 'lucide-react';

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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const [activeModel, setActiveModel] = useState('gemini-1.5-pro');

  // Workspace mock lists
  const projects = [
    { id: 'p1', name: 'ChatX Redesign' },
    { id: 'p2', name: 'Frontend Refactoring' }
  ];

  const workspaceFiles = [
    { id: 'f1', name: 'mockAi.js' },
    { id: 'f2', name: 'index.css' }
  ];

  // Load API key on mount
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
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand">
            <MessageSquareCode className="brand-icon" size={20} />
            <span>ChatX Workspace</span>
          </div>
          <button className="menu-toggle" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <button className="new-chat-btn" onClick={onNewConversation}>
          <Plus size={16} />
          <span>New Conversation</span>
        </button>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-wrapper">
            <Search className="search-icon" size={14} />
            <input
              type="text"
              placeholder="Search history..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main List */}
        <div className="history-list">
          {/* Recent Conversations */}
          <div className="workspace-section-header">Conversations</div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No chats found
            </div>
          ) : (
            filtered.map((chat) => (
              <div
                key={chat.id}
                className={`history-item ${chat.id === activeId ? 'active' : ''}`}
                onClick={() => {
                  onSelectConversation(chat.id);
                  setIsOpen(false); // Close sidebar on mobile
                }}
              >
                <div className="history-details">
                  <div className="history-title">{chat.title}</div>
                </div>
                <div className="history-actions">
                  <button
                    className="action-btn"
                    title="Delete Conversation"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(chat.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Projects */}
          <div className="workspace-section-header">Projects</div>
          {projects.map((p) => (
            <div 
              key={p.id} 
              className="history-item"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              onClick={() => alert(`Project workspace features are locally active for: ${p.name}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderOpen size={13} style={{ color: 'var(--text-muted)' }} />
                <span>{p.name}</span>
              </div>
            </div>
          ))}

          {/* Assets */}
          <div className="workspace-section-header">Recent Files</div>
          {workspaceFiles.map((f) => (
            <div 
              key={f.id} 
              className="history-item"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              onClick={() => alert(`File context applied: ${f.name}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={13} style={{ color: 'var(--text-muted)' }} />
                <span>{f.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="footer-user">
            <div className="user-avatar"><User size={13} /></div>
            <div className="user-name" title={currentUser?.username || "Guest"}>
              {currentUser?.username || "Guest"}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              className="logout-btn" 
              title="Settings Control Center"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings size={15} />
            </button>
            <button className="logout-btn" title="Log Out" onClick={onLogout}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Premium Settings Control Center Overlay */}
      {showSettingsModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="glass-panel"
            style={{
              width: '640px',
              maxWidth: '90%',
              height: '420px',
              display: 'flex',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-premium)',
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sidebar */}
            <div 
              style={{
                width: '180px',
                borderRight: '1px solid var(--border-subtle)',
                background: 'var(--bg-primary)',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px 8px 8px' }}>Control Center</div>
              <button 
                onClick={() => setSettingsTab('appearance')}
                style={{
                  background: settingsTab === 'appearance' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: settingsTab === 'appearance' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Monitor size={14} />
                <span>Appearance</span>
              </button>
              <button 
                onClick={() => setSettingsTab('models')}
                style={{
                  background: settingsTab === 'models' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: settingsTab === 'models' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sliders size={14} />
                <span>AI Models</span>
              </button>
              <button 
                onClick={() => setSettingsTab('shortcuts')}
                style={{
                  background: settingsTab === 'shortcuts' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: settingsTab === 'shortcuts' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Zap size={14} />
                <span>Shortcuts</span>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'capitalize' }}>{settingsTab} settings</h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* Tab: Appearance */}
                {settingsTab === 'appearance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Interface Theme</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['dark', 'light', 'system'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setThemeMode(t)}
                            style={{
                              flex: 1,
                              background: themeMode === t ? 'var(--text-primary)' : 'var(--bg-primary)',
                              color: themeMode === t ? 'var(--bg-primary)' : 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)',
                              padding: '8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              textTransform: 'capitalize'
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: AI Models */}
                {settingsTab === 'models' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active AI Engine</label>
                      <select 
                        value={activeModel}
                        onChange={(e) => setActiveModel(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '10px',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      >
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Workspace Default)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                        <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                      </select>
                    </div>

                    <div className="settings-panel" style={{ margin: 0, padding: '12px' }}>
                      <label className="settings-label">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Key size={12} />
                            <span>Gemini API Key</span>
                          </div>
                          {import.meta.env.VITE_GEMINI_API_KEY && !apiKey && (
                            <span style={{ color: 'var(--color-success)', fontSize: '0.65rem', fontWeight: 600 }}>
                              ✓ Env Active
                            </span>
                          )}
                        </div>
                        <div className="settings-input-group">
                          <input
                            type={showKey ? 'text' : 'password'}
                            placeholder={import.meta.env.VITE_GEMINI_API_KEY ? "Loaded from environment..." : "Enter custom API Key..."}
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
                      <div className="settings-info" style={{ marginTop: '8px' }}>
                        <span>Unlock live answers. Get a free API key at </span>
                        <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">
                          Google AI Studio
                        </a>.
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Shortcuts */}
                {settingsTab === 'shortcuts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { key: 'Ctrl + N', desc: 'Create new conversation' },
                      { key: 'Ctrl + /', desc: 'Toggle sidebar drawer' },
                      { key: 'Ctrl + ,', desc: 'Open Settings control panel' },
                      { key: 'Enter', desc: 'Send message' },
                      { key: 'Shift + Enter', desc: 'Add new line to input' }
                    ].map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{s.desc}</span>
                        <kbd style={{ background: 'var(--bg-primary)', padding: '2px 6px', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{s.key}</kbd>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
