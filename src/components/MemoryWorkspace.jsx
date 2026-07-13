import React, { useState } from 'react';
import { Brain, Pin, Plus, Search, Trash2, ShieldAlert } from 'lucide-react';

export default function MemoryWorkspace({ memories = [], onUpdateMemories }) {
  const [query, setQuery] = useState('');
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newTier, setNewTier] = useState('project');

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    const newMem = {
      id: `mem_${Date.now()}`,
      content: newMemoryText.trim(),
      tier: newTier,
      pinned: false,
      enabled: true,
      createdAt: Date.now()
    };

    onUpdateMemories([newMem, ...memories]);
    setNewMemoryText('');
  };

  const handleTogglePin = (id) => {
    onUpdateMemories(memories.map(m =>
      m.id === id ? { ...m, pinned: !m.pinned } : m
    ));
  };

  const handleToggleEnable = (id) => {
    onUpdateMemories(memories.map(m =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const handleDeleteMemory = (id) => {
    onUpdateMemories(memories.filter(m => m.id !== id));
  };

  const filtered = memories.filter(m =>
    m.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="memory-workspace-container">
      {/* Quick Add Form */}
      <form onSubmit={handleAddMemory} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <input
          type="text"
          placeholder="Add a new custom memory for your AI context..."
          value={newMemoryText}
          onChange={e => setNewMemoryText(e.target.value)}
          style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '8px 12px', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
        />
        <select
          value={newTier}
          onChange={e => setNewTier(e.target.value)}
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', padding: '8px', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
        >
          <option value="personal">Personal Memory</option>
          <option value="project">Project Memory</option>
          <option value="workspace">Workspace Memory</option>
        </select>
        <button type="submit" className="new-chat-btn" style={{ margin: 0, padding: '8px 16px' }}>
          <Plus size={14} />
          <span>Add Memory</span>
        </button>
      </form>

      {/* Search and Vault Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={16} style={{ color: 'var(--text-primary)' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Memory Vault ({memories.length})</h3>
        </div>
        <div style={{ position: 'relative', width: '200px' }}>
          <Search size={12} style={{ position: 'absolute', left: '8px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search memories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '6px 10px 6px 26px', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Memories list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(mem => (
          <div key={mem.id} className="memory-row" style={{ opacity: mem.enabled ? 1 : 0.5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <span className="memory-content-text">{mem.content}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Scope: {mem.tier}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handleTogglePin(mem.id)}
                title={mem.pinned ? "Unpin Memory" : "Pin Memory"}
                style={{ background: 'transparent', border: 'none', color: mem.pinned ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Pin size={13} fill={mem.pinned ? '#f59e0b' : 'transparent'} />
              </button>
              
              <button
                onClick={() => handleToggleEnable(mem.id)}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  background: mem.enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                  color: mem.enabled ? 'var(--color-success)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {mem.enabled ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={() => handleDeleteMemory(mem.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
