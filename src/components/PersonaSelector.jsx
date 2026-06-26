import React from 'react';
import { Terminal, Sparkles, Compass } from 'lucide-react';
import { PERSONAS } from '../services/mockAi';

const PERSONA_ICONS = {
  athena: Terminal,
  aurora: Sparkles,
  silas: Compass
};

export default function PersonaSelector({ selectedId, onSelect }) {
  return (
    <div className="persona-selector-grid">
      {PERSONAS.map((p) => {
        const isSelected = p.id === selectedId;
        const Icon = PERSONA_ICONS[p.id] || Sparkles;
        return (
          <div
            key={p.id}
            className={`persona-card glass-panel ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(p.id)}
            style={{
              borderColor: isSelected ? undefined : 'var(--glass-border)',
            }}
          >
            <div
              className={`card-avatar avatar-animated-${p.id}`}
              style={{ background: p.gradient }}
            >
              <Icon size={18} />
            </div>
            <h3>{p.name}</h3>
            <div className="role" style={{
              background: p.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {p.role}
            </div>
            <p>{p.bio}</p>
          </div>
        );
      })}
    </div>
  );
}
