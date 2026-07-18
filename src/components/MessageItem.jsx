import React, { useState } from 'react';
import { 
  Copy, Check, User, RotateCw, Edit2, Bookmark, 
  Share2, Trash2, ChevronDown, ChevronUp, Download 
} from 'lucide-react';
import { getDynamicModels } from '../services/mockAi';
import { ICON_MAP } from '../services/modelRegistry';

export default function MessageItem({ message, personaId, onRetry, onFork }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');
  const isUser = message.sender === 'user';
  
  const dynamicModels = getDynamicModels();
  const persona = dynamicModels.find(p => p.id === personaId) || dynamicModels[0];

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    showToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    showToast(!bookmarked ? 'Added to Bookmarks' : 'Removed Bookmark');
  };

  const handleShare = () => {
    showToast('Share link copied');
  };

  const showToast = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 2000);
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
          style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}
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
            return <strong key={`${index}-${codeIdx}-${boldIdx}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{boldPart}</strong>;
          }
          return boldPart;
        });
      });
    });
  };

  const renderMessageContent = (content) => {
    if (!content) return null;
    
    const parts = content.split(/```/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const match = part.match(/^([a-zA-Z0-9+#-]+)?\n([\s\S]*)$/);
        const language = match ? match[1] || 'code' : 'code';
        const code = match ? match[2] : part;

        return (
          <CodeBlock key={index} language={language} code={code} />
        );
      }

      const lines = part.split('\n');
      const elements = [];
      let currentList = [];
      let tableRows = [];

      const flushList = (key) => {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${key}`} style={{ margin: '12px 0 12px 20px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                      {headers.map((h, idx) => (
                        <th key={idx} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '600', color: 'var(--text-primary)' }}>
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

        if (trimmed.startsWith('|')) {
          flushList(i);
          tableRows.push(trimmed);
          continue;
        } else {
          flushTable(i);
        }

        if (trimmed.startsWith('>')) {
          flushList(i);
          const quoteText = trimmed.substring(1).trim();
          elements.push(
            <blockquote key={i}>
              {parseInline(quoteText)}
            </blockquote>
          );
          continue;
        }

        if (trimmed.startsWith('### ')) {
          flushList(i);
          elements.push(<h3 key={i}>{parseInline(trimmed.substring(4))}</h3>);
        } else if (trimmed.startsWith('## ')) {
          flushList(i);
          elements.push(<h2 key={i}>{parseInline(trimmed.substring(3))}</h2>);
        } else if (trimmed.startsWith('# ')) {
          flushList(i);
          elements.push(<h1 key={i}>{parseInline(trimmed.substring(2))}</h1>);
        }
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          currentList.push(<li key={`li-${i}`} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{parseInline(trimmed.substring(2))}</li>);
        }
        else if (/^\d+\.\s/.test(trimmed)) {
          flushList(i);
          const match = trimmed.match(/^(\d+)\.\s(.*)$/);
          elements.push(
            <ol key={i} start={match[1]} style={{ margin: '12px 0 12px 24px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ fontSize: '0.88rem' }}>{parseInline(match[2])}</li>
            </ol>
          );
        }
        else if (trimmed === '') {
          flushList(i);
        }
        else {
          flushList(i);
          elements.push(<p key={i}>{parseInline(line)}</p>);
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
            const Icon = ICON_MAP[persona.icon] || ICON_MAP.Sparkles;
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
          <div className="typing-indicator" style={{ minHeight: '20px' }}>
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        ) : (
          renderMessageContent(message.text)
        )}

        {/* Beautiful Hover Action Bar for Assistant Messages */}
        {!isUser && !message.error && message.text && (
          <div className="message-actions-bar">
            <button className="msg-action-btn" title="Copy response" onClick={handleCopyMessage}>
              <Copy size={13} />
            </button>
            <button className="msg-action-btn" title="Regenerate response" onClick={() => onRetry && onRetry(message.id)}>
              <RotateCw size={13} />
            </button>
            <button className="msg-action-btn" title="Edit prompt" onClick={handleCopyMessage}>
              <Edit2 size={13} />
            </button>
            <button className="msg-action-btn" title="Bookmark message" onClick={handleBookmark}>
              <Bookmark size={13} style={{ fill: bookmarked ? 'currentColor' : 'none' }} />
            </button>
            <button className="msg-action-btn" title="Share response" onClick={handleShare}>
              <Share2 size={13} />
            </button>
            <button className="msg-action-btn" title="Delete message" onClick={() => showToast('Message hidden')}>
              <Trash2 size={13} />
            </button>
          </div>
        )}

        <div className="message-meta">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isUser && onFork && (
            <button 
              className="copy-msg-btn" 
              onClick={() => onFork(message.id)} 
              title="Fork/Branch conversation from this point"
              style={{ marginLeft: '8px' }}
            >
              Fork
            </button>
          )}
        </div>

        {/* Local Toast Alert for actions */}
        {actionFeedback && (
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            left: '0',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: 'var(--text-primary)',
            zIndex: 100
          }}>
            {actionFeedback}
          </div>
        )}
      </div>
    </div>
  );
}

// Redesigned CodeBlock with line numbers, copy, download, collapse
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code.trim()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code_snippet.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (lang) => {
    const mapping = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      python: 'py',
      json: 'json',
      markdown: 'md',
      rust: 'rs'
    };
    return mapping[lang?.toLowerCase()] || 'txt';
  };

  const lines = code.trim().split('\n');

  return (
    <div className="code-block-container">
      <div className="code-header">
        <span style={{ textTransform: 'lowercase' }}>{language || 'code'}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="action-code-btn" onClick={handleDownload} title="Download file">
            <Download size={12} />
          </button>
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
          <button className="action-code-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <pre style={{ display: 'flex', overflowX: 'auto', padding: '16px 0' }}>
          {/* Line Numbers */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            textAlign: 'right', 
            paddingRight: '12px', 
            paddingLeft: '14px',
            borderRight: '1px solid rgba(255,255,255,0.06)', 
            userSelect: 'none', 
            color: 'var(--text-muted)', 
            fontSize: '0.78rem', 
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.5
          }}>
            {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
          </div>
          {/* Code */}
          <code style={{ 
            flex: 1, 
            paddingLeft: '14px', 
            paddingRight: '16px',
            color: '#e4e4e7', 
            fontSize: '0.8rem', 
            fontFamily: 'var(--font-mono)', 
            whiteSpace: 'pre',
            lineHeight: 1.5
          }}>
            {lines.join('\n')}
          </code>
        </pre>
      )}
    </div>
  );
}
