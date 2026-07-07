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
          style={{ color: 'var(--text-primary)', textDecoration: 'underline', fontWeight: 500 }}
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

  // A comprehensive markdown parser to handle blocks (headers, lists, paragraphs, tables, blockquotes)
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

      // Even index: standard text blocks.
      const lines = part.split('\n');
      const elements = [];
      let currentList = [];
      let tableRows = [];

      const flushList = (key) => {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${key}`} style={{ margin: '8px 0 12px 20px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentList}
            </ul>
          );
          currentList = [];
        }
      };

      const flushTable = (key) => {
        if (tableRows.length > 0) {
          const rows = tableRows.map(r => r.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));
          const hasSeparator = rows.length > 1 && rows[1].every(cell => /^:-*-*:?$/.test(cell) || /^-+$/.test(cell));
          const headers = hasSeparator ? rows[0] : null;
          const bodyRows = hasSeparator ? rows.slice(2) : rows;

          elements.push(
            <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '16px 0', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {headers && (
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                      {headers.map((h, idx) => (
                        <th key={idx} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                          {parseInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {bodyRows.map((r, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: rIdx === bodyRows.length - 1 ? 'none' : '1px solid var(--border-subtle)', background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)' }}>
                      {r.map((c, cIdx) => (
                        <td key={cIdx} style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                          {parseInline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Tables (starts with |)
        if (trimmed.startsWith('|')) {
          flushList(i);
          tableRows.push(trimmed);
          continue;
        } else {
          flushTable(i);
        }

        // 2. Blockquotes (starts with >)
        if (trimmed.startsWith('>')) {
          flushList(i);
          const quoteText = trimmed.substring(1).trim();
          elements.push(
            <blockquote 
              key={i} 
              style={{ 
                borderLeft: '3px solid var(--text-secondary)', 
                paddingLeft: '16px', 
                margin: '12px 0', 
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}
            >
              {parseInline(quoteText)}
            </blockquote>
          );
          continue;
        }

        // 3. Headers (###, ##, #)
        if (trimmed.startsWith('### ')) {
          flushList(i);
          elements.push(<h3 key={i} style={{ margin: '20px 0 8px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(4))}</h3>);
        } else if (trimmed.startsWith('## ')) {
          flushList(i);
          elements.push(<h2 key={i} style={{ margin: '24px 0 12px 0', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(3))}</h2>);
        } else if (trimmed.startsWith('# ')) {
          flushList(i);
          elements.push(<h1 key={i} style={{ margin: '28px 0 16px 0', fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)' }}>{parseInline(trimmed.substring(2))}</h1>);
        }
        // 4. Unordered lists (- or *)
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          currentList.push(<li key={`li-${i}`} style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{parseInline(trimmed.substring(2))}</li>);
        }
        // 5. Ordered lists (1., 2., etc.)
        else if (/^\d+\.\s/.test(trimmed)) {
          flushList(i);
          const match = trimmed.match(/^(\d+)\.\s(.*)$/);
          elements.push(
            <ol key={i} start={match[1]} style={{ margin: '8px 0 12px 24px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li style={{ fontSize: '0.92rem' }}>{parseInline(match[2])}</li>
            </ol>
          );
        }
        // 6. Blank lines
        else if (trimmed === '') {
          flushList(i);
        }
        // 7. Standard Paragraphs
        else {
          flushList(i);
          elements.push(<p key={i} style={{ margin: '8px 0 12px 0', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{parseInline(line)}</p>);
        }
      }
      flushList('end');
      flushTable('end');
      return <React.Fragment key={index}>{elements}</React.Fragment>;
    });
  };

  return (
    <div className={`message-bubble-container ${isUser ? 'user' : 'assistant'}`}>
      <div
        className={`message-avatar ${isUser ? 'avatar-user' : ''}`}
        style={{
          background: isUser ? '#18181b' : persona.gradient
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
    <div className="code-block-container" style={{ margin: '16px 0' }}>
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
