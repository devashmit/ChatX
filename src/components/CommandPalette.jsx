import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Terminal, Compass, FolderPlus, FileText, Settings, X, Brain } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  projects = [],
  onCreateProject,
  onSwitchProject,
  onSelectAgent,
  onOpenSettings,
  onOpenMemory
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: 'agent_athena', category: 'Agents', title: 'Switch to Athena (Architect)', icon: Terminal, action: () => onSelectAgent('athena') },
    { id: 'agent_aurora', category: 'Agents', title: 'Switch to Aurora (Creative)', icon: Sparkles, action: () => onSelectAgent('aurora') },
    { id: 'agent_silas', category: 'Agents', title: 'Switch to Silas (Developer)', icon: Compass, action: () => onSelectAgent('silas') },
    { id: 'create_proj', category: 'Projects', title: 'Create New Workspace Project', icon: FolderPlus, action: () => {
      const name = prompt('Enter project name:');
      if (name && name.trim()) onCreateProject(name.trim());
    }},
    { id: 'open_mem', category: 'Memory', title: 'Open Memory Vault Manager', icon: Brain, action: onOpenMemory },
    { id: 'open_settings', category: 'Settings', title: 'Open Control Center Settings', icon: Settings, action: onOpenSettings }
  ];

  // Include projects in dynamic commands
  projects.forEach(p => {
    commands.push({
      id: `proj_${p.id}`,
      category: 'Projects',
      title: `Switch to project: ${p.name}`,
      icon: FileText,
      action: () => onSwitchProject(p.id)
    });
  });

  const filtered = commands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          filtered[activeIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div className="command-palette-search">
          <Search size={18} className="command-palette-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="command-palette-input"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
          <kbd className="command-palette-shortcut">ESC</kbd>
        </div>

        <div className="command-palette-list">
          {filtered.length === 0 ? (
            <div style={{ padding: '16px', textAlignment: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No commands matching search
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isActive = idx === activeIndex;
              return (
                <div
                  key={cmd.id}
                  className={`command-palette-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} />
                    <span>{cmd.title}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
