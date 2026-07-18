import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, MessageSquareCode, X, User, LogOut, 
  Settings, Key, Eye, EyeOff, FolderOpen, FileText, Pin, 
  Monitor, Sliders, Zap, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({
  currentUser,
  onLogout,
  conversations = [],
  activeId,
  searchQuery,
  setSearchQuery,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen, // representing expanded state on desktop
  setIsOpen,
  projects = [],
  activeProjectId,
  onSwitchProject,
  workspaceFiles = [],
  onOpenSettings
}) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const [activeModel, setActiveModel] = useState('gemini-1.5-pro');

  // Pinned chats stored locally in localStorage
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chatx_pinned_chats') || '[]');
    } catch {
      return [];
    }
  });

  // Load API key and theme on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('chatx_gemini_api_key') || '';
    setApiKey(savedKey);
    const savedTheme = localStorage.getItem('chatx_theme') || 'dark';
    setThemeMode(savedTheme);
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

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('chatx_theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  };

  const togglePin = (chatId, e) => {
    e.stopPropagation();
    setPinnedIds(prev => {
      const next = prev.includes(chatId) 
        ? prev.filter(id => id !== chatId) 
        : [...prev, chatId];
      localStorage.setItem('chatx_pinned_chats', JSON.stringify(next));
      return next;
    });
  };

  // Filter & Group chats
  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGroupedChats = () => {
    const pinned = [];
    const recent = [];
    
    filtered.forEach(chat => {
      if (pinnedIds.includes(chat.id)) {
        pinned.push(chat);
      } else {
        recent.push(chat);
      }
    });

    const groups = {
      pinned,
      today: [],
      yesterday: [],
      last7Days: [],
      older: []
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = todayStart - 6 * 24 * 60 * 60 * 1000;

    recent.forEach(chat => {
      const time = chat.createdAt || Date.now();
      if (time >= todayStart) {
        groups.today.push(chat);
      } else if (time >= yesterdayStart) {
        groups.yesterday.push(chat);
      } else if (time >= sevenDaysAgo) {
        groups.last7Days.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  };

  const groups = getGroupedChats();

  const renderChatItem = (chat) => {
    const isSelected = chat.id === activeId;
    const isPinned = pinnedIds.includes(chat.id);
    const lastMsg = chat.messages && chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1].text 
      : 'Empty chat';
    
    const formattedTime = chat.createdAt 
      ? new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <div
        key={chat.id}
        className={`history-item ${isSelected ? 'active' : ''}`}
        onClick={() => onSelectConversation(chat.id)}
      >
        <div className="history-details">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="history-title" style={{ fontWeight: isSelected ? '550' : '400' }}>
              {chat.title}
            </span>
            {formattedTime && <span className="history-time">{formattedTime}</span>}
          </div>
          <span className="history-preview">{lastMsg}</span>
        </div>

        <div className="history-actions">
          <button
            className="action-btn"
            title={isPinned ? "Unpin Conversation" : "Pin Conversation"}
            onClick={(e) => togglePin(chat.id, e)}
          >
            <Pin size={12} style={{ fill: isPinned ? 'currentColor' : 'none', opacity: isPinned ? 1 : 0.6 }} />
          </button>
          <button
            className="action-btn"
            title="Delete Conversation"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConversation(chat.id);
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand">
            <MessageSquareCode className="brand-icon" size={18} />
            <span>ChatX</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={() => setIsOpen(!isOpen)} 
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* New Chat Button */}
        <button className="new-chat-btn" onClick={onNewConversation}>
          <Plus size={15} />
          <span>New Chat</span>
        </button>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-wrapper">
            <Search className="search-icon" size={13} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* History List */}
        <div className="history-list">
          {/* Pinned Chats */}
          {groups.pinned.length > 0 && (
            <>
              <div className="workspace-section-header">Pinned</div>
              {groups.pinned.map(renderChatItem)}
            </>
          )}

          {/* Today */}
          {groups.today.length > 0 && (
            <>
              <div className="workspace-section-header">Today</div>
              {groups.today.map(renderChatItem)}
            </>
          )}

          {/* Yesterday */}
          {groups.yesterday.length > 0 && (
            <>
              <div className="workspace-section-header">Yesterday</div>
              {groups.yesterday.map(renderChatItem)}
            </>
          )}

          {/* Last 7 Days */}
          {groups.last7Days.length > 0 && (
            <>
              <div className="workspace-section-header">Last 7 Days</div>
              {groups.last7Days.map(renderChatItem)}
            </>
          )}

          {/* Older */}
          {groups.older.length > 0 && (
            <>
              <div className="workspace-section-header">Older</div>
              {groups.older.map(renderChatItem)}
            </>
          )}

          {/* Fallback */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No chats found
            </div>
          )}

          {/* Projects Section */}
          <div className="workspace-section-header">Projects</div>
          {projects.map((p) => {
            const isSel = p.id === activeProjectId;
            return (
              <div 
                key={p.id} 
                className={`history-item ${isSel ? 'active' : ''}`}
                style={{ padding: '8px 12px' }}
                onClick={() => onSwitchProject(p.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <FolderOpen size={13} style={{ color: isSel ? 'var(--text-primary)' : 'var(--text-muted)', flexShrink: 0 }} />
                  <span className="history-title" style={{ fontSize: '0.82rem' }}>{p.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="footer-user">
            <div className="user-avatar"><User size={12} /></div>
            <div className="user-name" title={currentUser?.username || "Guest"}>
              {currentUser?.username || "Guest"}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              className="logout-btn" 
              title="Settings"
              onClick={() => onOpenSettings ? onOpenSettings() : setShowSettingsModal(true)}
            >
              <Settings size={14} />
            </button>
            <button className="logout-btn" title="Log Out" onClick={onLogout}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Modern settings Preferences Modal */}
      {showSettingsModal && (
        <div className="command-palette-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Sidebar */}
            <div 
              style={{
                width: '200px',
                borderRight: '1px solid var(--border-subtle)',
                background: 'var(--bg-primary)',
                padding: '20px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px 10px 8px' }}>Preferences</div>
              <button 
                onClick={() => setSettingsTab('appearance')}
                style={{
                  background: settingsTab === 'appearance' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: settingsTab === 'appearance' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Monitor size={13} />
                <span>Appearance</span>
              </button>
              <button 
                onClick={() => setSettingsTab('models')}
                style={{
                  background: settingsTab === 'models' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: settingsTab === 'models' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sliders size={13} />
                <span>Models</span>
              </button>
              <button 
                onClick={() => setSettingsTab('shortcuts')}
                style={{
                  background: settingsTab === 'shortcuts' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: settingsTab === 'shortcuts' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Zap size={13} />
                <span>Shortcuts</span>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                  {settingsTab} settings
                </h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {settingsTab === 'appearance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Interface Theme</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['dark', 'light', 'system'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleThemeChange(t)}
                            style={{
                              flex: 1,
                              background: themeMode === t ? 'var(--text-primary)' : 'var(--bg-primary)',
                              color: themeMode === t ? 'var(--color-primary-invert)' : 'var(--text-secondary)',
                              border: '1px solid var(--border-medium)',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'models' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active AI Engine</label>
                      <select 
                        value={activeModel}
                        onChange={(e) => setActiveModel(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-medium)',
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

                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Key size={12} />
                            <span>Gemini API Key</span>
                          </div>
                        </div>
                        <div className="settings-input-group" style={{ marginTop: '8px' }}>
                          <input
                            type={showKey ? 'text' : 'password'}
                            placeholder="Enter custom API Key..."
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
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '10px' }}>
                        <span>Unlock live answers. Get a free API key at </span>
                        <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                          Google AI Studio
                        </a>.
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'shortcuts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { key: 'Ctrl + N', desc: 'Create new conversation' },
                      { key: 'Ctrl + /', desc: 'Toggle sidebar' },
                      { key: 'Ctrl + ,', desc: 'Open Settings panel' },
                      { key: 'Enter', desc: 'Send message' },
                      { key: 'Shift + Enter', desc: 'Add new line to input' }
                    ].map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{s.desc}</span>
                        <kbd style={{ background: 'var(--bg-primary)', padding: '2px 6px', border: '1px solid var(--border-medium)', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{s.key}</kbd>
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
