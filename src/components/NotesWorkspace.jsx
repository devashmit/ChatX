import React, { useState } from 'react';
import { Plus, Trash2, FileText, Save } from 'lucide-react';

export default function NotesWorkspace({ notes = [], onUpdateNotes }) {
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote = {
      id: `note_${Date.now()}`,
      title: 'Untitled Note',
      content: '# Untitled Note\n\nWrite your thoughts here...',
      updatedAt: Date.now()
    };
    const updated = [newNote, ...notes];
    onUpdateNotes(updated);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    onUpdateNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id || null);
    }
  };

  const handleTitleChange = (val) => {
    if (!activeNote) return;
    const updated = notes.map(n =>
      n.id === activeNote.id ? { ...n, title: val, updatedAt: Date.now() } : n
    );
    onUpdateNotes(updated);
  };

  const handleContentChange = (val) => {
    if (!activeNote) return;
    const updated = notes.map(n =>
      n.id === activeNote.id ? { ...n, content: val, updatedAt: Date.now() } : n
    );
    onUpdateNotes(updated);
  };

  return (
    <div className="notes-workspace-container">
      {/* Sidebar List */}
      <div className="notes-list">
        <button className="new-chat-btn" style={{ margin: '0 0 12px 0', width: '100%', gap: '6px', padding: '8px' }} onClick={handleCreateNote}>
          <Plus size={14} />
          <span>New Note</span>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
          {notes.map(n => (
            <button
              key={n.id}
              className={`note-item-btn ${n.id === activeNote?.id ? 'active' : ''}`}
              onClick={() => setActiveNoteId(n.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <FileText size={13} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</span>
              </div>
              <Trash2
                size={12}
                style={{ flexShrink: 0, opacity: 0.6 }}
                onClick={(e) => handleDeleteNote(n.id, e)}
                className="delete-note-icon"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      {activeNote ? (
        <div className="note-editor-main">
          <input
            type="text"
            className="note-editor-title"
            value={activeNote.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Note Title"
          />
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Save size={12} />
            <span>Auto-saved locally</span>
          </div>
          <textarea
            className="note-editor-textarea"
            value={activeNote.content}
            onChange={e => handleContentChange(e.target.value)}
            placeholder="Use Markdown to write down product specifications, guides, or snippets..."
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Create a note to start writing.
        </div>
      )}
    </div>
  );
}
