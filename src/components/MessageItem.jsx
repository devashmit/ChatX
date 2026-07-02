import React, { useState } from 'react';
import { Copy, Check, User, Terminal, Sparkles, Compass } from 'lucide-react';
import { PERSONAS } from '../services/mockAi';

const PERSONA_ICONS = {
  athena: Terminal,
  aurora: Sparkles,
  silas: Compass
};

export default function MessageItem({ message, personaId, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';
  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseInline = (text) => {
    if (!text) return '';
    
    // Parse links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a 
          key={matchIndex} 
          href={linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
        >
          {linkText}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.map((part, index) => {
      if (React.isValidElement(part)) {
        return part;
      }
      
      const codeParts = part.split(/`([^`]+)`/g);
      return codeParts.map((subPart, codeIdx) => {
        if (codeIdx % 2 === 1) {
          return <code key={`${index}-${codeIdx}`}>{subPart}</code>;
        }
        
        const boldParts = subPart.split(/\*\*([^*]+)\*\*/g);
        return boldParts.map((boldPart, boldIdx) => {
          if (boldIdx % 2 === 1) {
            return <strong key={`${index}-${codeIdx}-${boldIdx}`}>{boldPart}</strong>;
          }
          return boldPart;
        });
      });
    });
  };

  // A comprehensive markdown parser to handle blocks (headers, lists, paragraphs) and inline styles
  const renderMessageContent = (content) => {
    if (!content) return null;
    
    // Split by triple-backticks to find code blocks
    const parts = content.split(/```/);
    return parts.map((part, index) => {
      // If index is odd, it's a code block
      if (index % 2 === 1) {
        const match = part.match(/^([a-zA-Z0-9+#-]+)?\n([\s\S]*)$/);
        const language = match ? match[1] || 'code' : 'code';
        const code = match ? match[2] : part;

        return (
          <CodeBlock key={index} language={language} code={code} />
        );
      }

      // Even index: standard text blocks. Split by lines to render headers, lists, paragraphs
      const lines = part.split('\n');
      const elements = [];
      let currentList = [];

      const flushList = (key) => {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${key}`} style={{ margin: '8px 0 8px 20px', listStyleType: 'disc' }}>
              {currentList}
            </ul>
          );
          currentList = [];
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Headers (###, ##, #)
        if (trimmed.startsWith('### ')) {
          flushList(i);
          elements.push(<h3 key={i} style={{ margin: '14px 0 6px 0', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(4))}</h3>);
        } else if (trimmed.startsWith('## ')) {
          flushList(i);
          elements.push(<h2 key={i} style={{ margin: '16px 0 8px 0', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(3))}</h2>);
        } else if (trimmed.startsWith('# ')) {
          flushList(i);
          elements.push(<h1 key={i} style={{ margin: '18px 0 10px 0', fontSize: '1.30rem', fontWeight: 700, color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(2))}</h1>);
        }
        // 2. Unordered lists (- or *)
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          currentList.push(<li key={`li-${i}`} style={{ margin: '4px 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(2))}</li>);
        }
        // 3. Ordered lists (1., 2., etc.)
        else if (/^\d+\.\s/.test(trimmed)) {
          flushList(i);
          const match = trimmed.match(/^(\d+)\.\s(.*)$/);
          elements.push(
            <ol key={i} start={match[1]} style={{ margin: '8px 0 8px 24px', color: 'var(--text-primary)' }}>
              <li style={{ margin: '4px 0', fontSize: '0.9rem' }}>{parseInline(match[2])}</li>
            </ol>
          );
        }
        // 4. Blank lines
        else if (trimmed === '') {
          flushList(i);
        }
        // 5. Standard Paragraphs
        else {
          flushList(i);
          elements.push(<p key={i} style={{ margin: '8px 0', lineHeight: 1.55 }}>{parseInline(line)}</p>);
        }
      }
      flushList('end');
      return <React.Fragment key={index}>{elements}</React.Fragment>;
    });
  };

  return (
    <div className={`message-bubble-container ${isUser ? 'user' : 'assistant'}`}>
      <div
        className={`message-avatar ${isUser ? 'avatar-user' : `avatar-animated-${persona.id}`}`}
        style={{
          background: isUser
            ? '#27272a'
            : persona.gradient
        }}
      >
        {isUser ? (
          <User size={13} />
        ) : (
          (() => {
            const Icon = PERSONA_ICONS[persona.id] || Sparkles;
            return <Icon size={13} />;
          })()
        )}
      </div>
      <div className={`message-bubble ${message.error ? 'error-bubble' : ''}`}>
        {message.error ? (
          <div className="error-message-content">
            <span className="error-text">⚠️ {message.error}</span>
            <button className="retry-btn" onClick={() => onRetry(message.id)}>
              Retry
            </button>
          </div>
        ) : !message.text ? (
          <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', minHeight: '20px' }}>
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        ) : (
          renderMessageContent(message.text)
        )}
        <div className="message-meta">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {!message.error && message.text && (
            <button className="copy-msg-btn" onClick={handleCopyMessage} title="Copy message content">
              {copied ? (
                <>
                  <Check size={11} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Inner helper component for Copyable Code Blocks
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container" style={{ margin: '12px 0' }}>
      <div className="code-header">
        <span>{language}</span>
        <button className="copy-code-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
