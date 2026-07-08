import React, { useRef, useEffect, useState } from 'react';
import { Menu, MessageSquare, Terminal, Sparkles, Compass, Plus, WifiOff, Code, FileText, Search, BrainCircuit, ArrowRight } from 'lucide-react';
import { getDynamicModels } from '../services/mockAi';
import { ICON_MAP } from '../services/modelRegistry';
import MessageItem from './MessageItem';
import PersonaSelector from './PersonaSelector';
import ChatInput from './ChatInput';

const QUICK_ACTIONS = [
  {
    category: "Develop",
    icon: Code,
    color: "#a855f7",
    prompts: [
      { label: "React debounce hook", text: "Write an optimized custom React hook for debouncing inputs." },
      { label: "Explain closures", text: "Can you explain JavaScript closures with a practical coding example?" }
    ]
  },
  {
    category: "Write",
    icon: FileText,
    color: "#f97316",
    prompts: [
      { label: "Polite email response", text: "Help me write a professional and polite email turning down a project deadline extension." },
      { label: "Story outline", text: "Create a detailed story outline about a lighthouse keeper who discovers a gateway to another dimension." }
    ]
  },
  {
    category: "Brainstorm",
    icon: BrainCircuit,
    color: "#10b981",
    prompts: [
      { label: "UI layout feedback", text: "What are some modern UX best practices for designing a complex settings dashboard?" },
      { label: "App name ideas", text: "Brainstorm 10 catchy and sleek name ideas for a local-first markdown note-taking app." }
    ]
  }
];

export default function ChatArea({
  conversation,
  personaId,
  setPersonaId,
  messages,
  isTyping,
  input,
  setInput,
  onSendMessage,
  onSidebarToggle,
  simulateError,
  setSimulateError,
  onRetry,
  onNewChat
}) {
  const messagesEndRef = useRef(null);
  const dynamicModels = getDynamicModels();
  const activePersona = dynamicModels.find(p => p.id === personaId) || dynamicModels[0];

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
      <header className="chat-header">
        <div className="header-meta">
          <button className="menu-toggle" onClick={onSidebarToggle} title="Toggle Sidebar">
            <Menu size={20} />
          </button>
          <div className="persona-badge">
            <div
              className="persona-avatar"
              style={{ background: activePersona.gradient }}
            >
              {(() => {
                const Icon = ICON_MAP[activePersona.icon] || ICON_MAP.Sparkles;
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

        {/* Header actions */}
        <div className="header-actions">
          <button 
            className="header-new-chat-btn" 
            onClick={onNewChat} 
            title="Start a new chat"
          >
            <Plus size={15} />
            <span className="btn-text">New Chat</span>
          </button>

          <button
            onClick={() => setSimulateError(!simulateError)}
            className={`simulate-error-toggle ${simulateError ? 'active' : ''}`}
            title="Simulate connection error to test retry feature"
          >
            <WifiOff size={13} />
            <span className="btn-text">Simulate Error</span>
          </button>

          <span style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

          <div className="agent-switcher" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginRight: '4px', fontWeight: 500 }} className="agent-label">Agent:</span>
            {dynamicModels.map(p => {
              const Icon = ICON_MAP[p.icon] || ICON_MAP.Sparkles;
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
                    border: isCurrent ? '1.5px solid var(--text-primary)' : '1px solid var(--border-subtle)',
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
        </div>
      </header>

      {/* Main Conversation viewport */}
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="welcome-screen" style={{ paddingBottom: '40px' }}>
            <MessageSquare size={44} className="welcome-icon" style={{ color: 'var(--text-secondary)' }} />
            <h1>Start a new workspace chat</h1>
            <p>Select your specialized companion to begin. Ask questions, generate code, write narratives, or seek structured mentorship.</p>
            
            <PersonaSelector
              selectedId={personaId}
              onSelect={setPersonaId}
            />

            {/* Quick Actions Suggestions */}
            <div className="quick-suggestions-workspace" style={{ width: '100%', marginTop: '36px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Suggested Tasks</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="persona-selector-grid">
                {QUICK_ACTIONS.map((group, groupIdx) => {
                  const GroupIcon = group.icon;
                  return (
                    <div 
                      key={groupIdx} 
                      className="glass-panel" 
                      style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', color: group.color }}>
                          <GroupIcon size={13} />
                        </span>
                        {group.category}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {group.prompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSuggestionClick(p.text)}
                            style={{
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '8px 10px',
                              color: 'var(--text-secondary)',
                              fontSize: '0.78rem',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border-focus)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <span>{p.label}</span>
                            <ArrowRight size={10} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                personaId={personaId}
                onRetry={onRetry}
              />
            ))}
            
            {/* Simulated typing indicator */}
            {isTyping && !messages.some(m => m.sender === 'assistant' && !m.text && !m.error) && (
              <div className="message-bubble-container assistant">
                <div
                  className="message-avatar"
                  style={{ 
                    background: activePersona.gradient,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  {(() => {
                    const Icon = PERSONA_ICONS[activePersona.id] || Sparkles;
                    return <Icon size={14} />;
                  })()}
                </div>
                <div className="message-bubble" style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }}>
                  <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSendMessage}
        disabled={isTyping}
        personaId={personaId}
        showSuggestions={messages.filter(m => m.sender === 'user').length === 0}
        onSelectSuggestion={handleSuggestionClick}
      />
    </div>
  );
}
