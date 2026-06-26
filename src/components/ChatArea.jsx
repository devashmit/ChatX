import React, { useRef, useEffect } from 'react';
import { Menu, MessageSquare, Terminal, Sparkles, Compass } from 'lucide-react';
import { PERSONAS } from '../services/mockAi';
import MessageItem from './MessageItem';
import PersonaSelector from './PersonaSelector';
import ChatInput from './ChatInput';

const PERSONA_ICONS = {
  athena: Terminal,
  aurora: Sparkles,
  silas: Compass
};

export default function ChatArea({
  conversation,
  personaId,
  setPersonaId,
  messages,
  isTyping,
  input,
  setInput,
  onSendMessage,
  onSidebarToggle
}) {
  const messagesEndRef = useRef(null);
  const activePersona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header glass-panel">
        <div className="header-meta">
          <button className="menu-toggle" onClick={onSidebarToggle} title="Toggle Sidebar">
            <Menu size={22} />
          </button>
          <div className="persona-badge">
            <div
              className={`persona-avatar avatar-animated-${activePersona.id}`}
              style={{ background: activePersona.gradient }}
            >
              {(() => {
                const Icon = PERSONA_ICONS[activePersona.id] || Sparkles;
                return <Icon size={14} />;
              })()}
            </div>
            <div className="persona-info">
              <span className="persona-name">{activePersona.name}</span>
              <span className="persona-status">
                <span className="status-dot" />
                {activePersona.role}
              </span>
            </div>
          </div>
        </div>

        {/* Switcher aligned to the right */}
        <div className="agent-switcher" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginRight: '4px', fontWeight: 500 }}>Agent:</span>
          {PERSONAS.map(p => {
            const Icon = PERSONA_ICONS[p.id] || Sparkles;
            const isCurrent = p.id === personaId;
            return (
              <button
                key={p.id}
                onClick={() => setPersonaId(p.id)}
                title={`Switch to ${p.name}`}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: p.gradient,
                  border: isCurrent ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isCurrent ? '0 0 8px rgba(255, 255, 255, 0.15)' : 'none'
                }}
              >
                <Icon size={11} />
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Conversation viewport */}
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <MessageSquare size={48} className="welcome-icon" />
            <h1>Choose Your Companion</h1>
            <p>Select a specialized persona to start your conversation. You can change companions at any time.</p>
            
            <PersonaSelector
              selectedId={personaId}
              onSelect={setPersonaId}
            />
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                personaId={personaId}
              />
            ))}
            
            {/* Simulated typing indicator */}
            {isTyping && (
              <div className="message-bubble-container assistant">
                <div
                  className={`message-avatar avatar-animated-${activePersona.id}`}
                  style={{ background: activePersona.gradient }}
                >
                  {(() => {
                    const Icon = PERSONA_ICONS[activePersona.id] || Sparkles;
                    return <Icon size={14} />;
                  })()}
                </div>
                <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSendMessage}
        disabled={isTyping}
        personaId={personaId}
        showSuggestions={messages.length === 0}
        onSelectSuggestion={handleSuggestionClick}
      />
    </div>
  );
}
