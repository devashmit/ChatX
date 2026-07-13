import React, { useState } from 'react';
import { Upload, FileText, Search, Database, Trash2 } from 'lucide-react';
import { indexFile } from '../services/aiService';

export default function FilesWorkspace({ files = [], onUpdateFiles }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (fileObj) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const newFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: fileObj.name,
        size: `${Math.round(fileObj.size / 1024)} KB`,
        content: text,
        type: fileObj.name.split('.').pop() || 'txt',
        createdAt: Date.now()
      };
      
      // Index file chunks immediately for Phase 6 Context Pipeline
      newFile.chunks = indexFile(newFile);
      
      onUpdateFiles([newFile, ...files]);
    };
    reader.readAsText(fileObj);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  const handleDeleteFile = (id) => {
    onUpdateFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="files-workspace-container">
      {/* File Dropzone */}
      <div
        className={`file-dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('workspace-file-upload').click()}
      >
        <Upload size={32} style={{ color: 'var(--text-secondary)' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          Drag & drop files or click to upload
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Supports PDF, DOCX, TXT, Markdown, code files, and Excel
        </span>
        <input
          id="workspace-file-upload"
          type="file"
          multiple
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {/* Files Index Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
        <Database size={16} style={{ color: 'var(--color-success)' }} />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Workspace Ingested Sources ({files.length})
        </h3>
      </div>

      {/* File Table List */}
      {files.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
          No project files uploaded yet. Add files to inject document references into agent reasoning pipelines.
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table className="files-list-table">
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>File Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Size</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Chunks Indexed</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map(f => (
                <tr key={f.id} className="file-row">
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{f.name}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{f.size}</td>
                  <td style={{ padding: '12px 16px' }}>{f.chunks?.length || 0}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteFile(f.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
