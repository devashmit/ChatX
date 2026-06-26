import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PERSONAS } from '../services/mockAi';

export default function MessageItem({ message, personaId }) {
  const isUser = message.sender === 'user';
  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];

  // A very basic markdown parser to handle code blocks and inline code
  const renderMessageContent = (content) => {
    if (!content) return null;
    
    // Split by triple-backticks to find code blocks
    const parts = content.split(/```/);
    return parts.map((part, index) => {
      // If index is odd, it's a code block
      if (index % 2 === 1) {
        // Find language if specified (e.g. "javascript\ncode...")
        const match = part.match(/^([a-zA-Z0-9+#-]+)?\n([\s\S]*)$/);
        const language = match ? match[1] || 'code' : 'code';
        const code = match ? match[2] : part;

        return (
          <CodeBlock key={index} language={language} code={code} />
        );
      }

      // If even, it is standard text. Parse inline code: `code`
      const inlineParts = part.split(/`([^`]+)`/g);
      return (
        <p key={index}>
          {inlineParts.map((subPart, subIndex) => {
            if (subIndex % 2 === 1) {
              return <code key={subIndex}>{subPart}</code>;
            }
            // Parse bold: **text**
            const boldParts = subPart.split(/\*\*([^*]+)\*\*/g);
            return boldParts.map((boldPart, boldIndex) => {
              if (boldIndex % 2 === 1) {
                return <strong key={boldIndex}>{boldPart}</strong>;
              }
              return boldPart;
            });
          })}
        </p>
      );
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
        {isUser ? 'U' : persona.avatar}
      </div>
      <div className="message-bubble">
        {renderMessageContent(message.text)}
        <div className="message-meta">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
