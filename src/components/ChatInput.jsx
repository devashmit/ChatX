import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, Paperclip, Sliders } from 'lucide-react';
import { getDynamicModels } from '../services/mockAi';

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
  const dynamicModels = getDynamicModels();
  const persona = dynamicModels.find(p => p.id === personaId) || dynamicModels[0];

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
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
              <Sparkles size={11} style={{ marginRight: '6px', verticalAlign: 'middle', opacity: 0.8 }} />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Main Composer Box */}
      <div className="input-container">
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
        
        {/* Composer Toolbar */}
        <div className="composer-toolbar">
          <div className="composer-left">
            <button className="composer-btn" title="Attach file" type="button">
              <Paperclip size={14} />
            </button>
            <button className="composer-btn" title="Model settings" type="button">
              <Sliders size={14} />
            </button>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {persona.displayName || persona.name}
            </span>
          </div>

          <div className="composer-right">
            {input.length > 0 && (
              <span className="char-counter">
                {input.length} chars
              </span>
            )}
            <button
              className="input-btn send"
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              title="Send message"
            >
              <span>Ask</span>
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
