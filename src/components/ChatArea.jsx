import React, { useRef, useEffect, useState } from 'react';
import { 
  Menu, MessageSquare, Plus, WifiOff, Code, FileText, 
  BrainCircuit, ArrowRight, Share2, MoreHorizontal, Sparkles
} from 'lucide-react';
import { getDynamicModels } from '../services/mockAi';
import { ICON_MAP } from '../services/modelRegistry';
import MessageItem from './MessageItem';
import PersonaSelector from './PersonaSelector';
import ChatInput from './ChatInput';

const QUICK_ACTIONS = [
  {
    category: "Develop",
    icon: Code,
    color: "#3b82f6",
    prompts: [
      { label: "React debounce hook", text: "Write an optimized custom React hook for debouncing inputs." },
      { label: "Explain closures", text: "Can you explain JavaScript closures with a practical coding example?" }
    ]
  },
  {
    category: "Write",
    icon: FileText,
    color: "#a1a1aa",
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
  onNewChat,
  agentMode = 'single',
  setAgentMode,
  onForkMessage
}) {
  const messagesEndRef = useRef(null);
  const dynamicModels = getDynamicModels();
  const activePersona = dynamicModels.find(p => p.id === personaId) || dynamicModels[0];

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
      {/* Minimal Top Bar Navigation */}
      <header className="chat-header">
        <div className="header-meta">
          <button className="menu-toggle" onClick={onSidebarToggle} title="Toggle Sidebar">
            <Menu size={16} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span className="persona-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {conversation ? conversation.title : 'New Chat'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Using {activePersona.name} • {activePersona.role}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button className="header-new-chat-btn" onClick={onNewChat} title="Start new conversation">
            <Plus size={14} />
            <span className="btn-text">New Chat</span>
          </button>

          <button
            onClick={() => setSimulateError(!simulateError)}
            className={`simulate-error-toggle ${simulateError ? 'active' : ''}`}
            title="Simulate connection error"
          >
            <WifiOff size={13} />
            <span className="btn-text">Simulate Error</span>
          </button>

          <span style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

          {/* Share & More actions */}
          <button className="composer-btn" title="Share Conversation" style={{ padding: '6px' }}>
            <Share2 size={14} />
          </button>
          <button className="composer-btn" title="More Actions" style={{ padding: '6px' }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            {/* Elegant CSS/SVG welcome illustration */}
            <div className="welcome-logo-container">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="welcome-illustration">
                <rect x="12" y="12" width="40" height="40" rx="10" fill="url(#grad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <path d="M26 26L38 38M38 26L26 38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="32" cy="32" r="16" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="grad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#18181b" />
                    <stop offset="1" stopColor="#09090b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1>How can ChatX assist you today?</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '8px auto 28px auto' }}>
              Select a specialized assistant below to start coding, researching, or structuring your project workflow.
            </p>

            <PersonaSelector
              selectedId={personaId}
              onSelect={setPersonaId}
            />

            {/* Quick Suggestions grid */}
            <div className="quick-suggestions-workspace" style={{ width: '100%', marginTop: '36px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Suggested templates
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {QUICK_ACTIONS.map((group, groupIdx) => {
                  const GroupIcon = group.icon;
                  return (
                    <div 
                      key={groupIdx} 
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-subtle)', 
                        borderRadius: '10px', 
                        padding: '16px',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.03)', color: group.color }}>
                          <GroupIcon size={12} />
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
                            <ArrowRight size={10} style={{ opacity: 0.6 }} />
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
                onFork={onForkMessage}
              />
            ))}
            
            {isTyping && !messages.some(m => m.sender === 'assistant' && !m.text && !m.error) && (
              <div className="message-bubble-container assistant">
                <div
                  className="message-avatar"
                  style={{ 
                    background: activePersona.gradient
                  }}
                >
                  {(() => {
                    const Icon = ICON_MAP[activePersona.icon] || Sparkles;
                    return <Icon size={13} />;
                  })()}
                </div>
                <div className="message-bubble" style={{ display: 'flex', justifyContent: 'center', minHeight: '36px' }}>
                  <div className="typing-indicator">
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

      {/* Composer Input Area */}
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
