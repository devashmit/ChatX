import React, { useState } from 'react';
import { X, Play, Code, FileText, Download, Copy, Check } from 'lucide-react';

export default function ArtifactPanel({ artifact, onClose, onUpdateArtifact }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(artifact.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (e) => {
    onUpdateArtifact({ ...artifact, code: e.target.value });
  };

  // Mock UI Preview renderer to make mockups interactable
  const renderPreview = () => {
    if (artifact.type === 'ui') {
      return (
        <div className="interactive-mockup-frame">
          <div className="interactive-mockup-header">
            <div className="mockup-dot red" />
            <div className="mockup-dot yellow" />
            <div className="mockup-dot green" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>
              Preview: {artifact.title}
            </span>
          </div>
          <div className="interactive-mockup-body">
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>Interactive Dashboard Workspace</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Modify components inside the Editor tab to update this container.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 500 }}>
                Submit Action
              </button>
              <button style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.78rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (artifact.type === 'diagram') {
      return (
        <div style={{ background: '#0f0f11', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
          <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Architecture Flow
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1', borderRadius: '4px', fontSize: '0.8rem', color: '#6366f1', fontWeight: 600 }}>
              Client UI Portal
            </div>
            <div style={{ height: '20px', width: '1px', background: 'var(--border-focus)' }} />
            <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '4px', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              AI Context Engine Routing
            </div>
            <div style={{ height: '20px', width: '1px', background: 'var(--border-focus)' }} />
            <div style={{ padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '4px', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
              Gemini Pro Core Database
            </div>
          </div>
        </div>
      );
    }

    // Default to plain markdown styled content
    return (
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>{artifact.title}</h3>
        <p>{artifact.description}</p>
        <pre style={{ background: '#09090b', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.78rem', marginTop: '12px', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
          <code>{artifact.code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="workspace-right-panel">
      {/* Header */}
      <div className="artifact-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Workspace Artifact</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{artifact.title}</span>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 12px' }}>
        <button
          onClick={() => setActiveTab('preview')}
          className={`workspace-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          style={{ borderRadius: 0, padding: '10px 14px', borderBottom: activeTab === 'preview' ? '2px solid var(--text-primary)' : 'none' }}
        >
          <Play size={13} />
          <span>Live Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`workspace-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          style={{ borderRadius: 0, padding: '10px 14px', borderBottom: activeTab === 'code' ? '2px solid var(--text-primary)' : 'none' }}
        >
          <Code size={13} />
          <span>Editor</span>
        </button>
      </div>

      {/* Body Area */}
      <div className="artifact-body">
        {activeTab === 'preview' ? (
          renderPreview()
        ) : (
          <textarea
            className="artifact-code-editor"
            value={artifact.code}
            onChange={handleCodeChange}
          />
        )}
      </div>

      {/* Footer controls */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
        <button
          onClick={handleCopyCode}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <button
          onClick={() => {
            const blob = new Blob([artifact.code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = artifact.filename || 'artifact.txt';
            a.click();
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          <Download size={14} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
