import React, { useState } from 'react';
import { Plus, Check, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';

export default function TasksWorkspace({ tasks = [], onUpdateTasks }) {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      status: 'todo',
      priority: newPriority,
      createdAt: Date.now()
    };

    onUpdateTasks([newTask, ...tasks]);
    setNewTitle('');
  };

  const handleMoveTask = (id, newStatus) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id) => {
    onUpdateTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="tasks-workspace-container">
      {/* Quick Add Form */}
      <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <input
          type="text"
          placeholder="Add a new task to your project..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '8px 12px', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
        />
        <select
          value={newPriority}
          onChange={e => setNewPriority(e.target.value)}
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', padding: '8px', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="new-chat-btn" style={{ margin: 0, padding: '8px 16px' }}>
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      </form>

      {/* Grid Columns */}
      <div className="tasks-grid">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="tasks-column">
              <div className="tasks-column-header">
                <span>{col.title}</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: '200px' }}>
                {colTasks.map(t => (
                  <div key={t.id} className="task-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</span>
                      <button onClick={() => handleDeleteTask(t.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span className={`task-priority-badge ${t.priority}`}>
                        {t.priority}
                      </span>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {col.id !== 'todo' && (
                          <button
                            title="Move back"
                            onClick={() => handleMoveTask(t.id, col.id === 'completed' ? 'in_progress' : 'todo')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <ArrowLeft size={12} />
                          </button>
                        )}
                        {col.id !== 'completed' && (
                          <button
                            title="Move forward"
                            onClick={() => handleMoveTask(t.id, col.id === 'todo' ? 'in_progress' : 'completed')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
