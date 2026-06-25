import React, { useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { PERSONAS } from '../services/mockAi';

export default function ChatInput({
  input,
  setInput,
  onSend,
  disabled,
  personaId,
  showSuggestions,
  onSelectSuggestion
}) {
  const textareaRef = useRef(null);
  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="chat-footer">
      {/* Suggestions Chips */}
      {showSuggestions && (
        <div className="suggestions-container">
          {persona.suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-chip"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              <Sparkles size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--color-primary)' }} />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Form */}
      <div className="input-container glass-panel">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={`Message ${persona.name}...`}
          className="chat-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="input-actions">
          <button
            className="input-btn send"
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
