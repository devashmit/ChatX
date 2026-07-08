import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Terminal, Compass, Cpu, Brain, Code, 
  MessageSquare, Zap, Shield, HelpCircle, Plus, X, 
  SlidersHorizontal, ChevronRight, Check
} from 'lucide-react';
import { 
  getAllModels, 
  saveCustomModels, 
  getCustomModels,
  BACKEND_MODELS, 
  BACKEND_PROVIDERS, 
  ICON_MAP 
} from '../services/modelRegistry';
import { getCurrentUserSession } from '../services/storageUtils';

export default function PersonaSelector({ selectedId, onSelect }) {
  const [models, setModels] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [username, setUsername] = useState('default');

  // Custom Model Form State
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('Sparkles');
  const [formBackendModel, setFormBackendModel] = useState('gemini-2.5-flash');
  const [formTemperature, setFormTemperature] = useState(0.7);
  const [formSystemPrompt, setFormSystemPrompt] = useState('');
  const [formCapabilities, setFormCapabilities] = useState([]);

  // Available capability options for custom models
  const CAPABILITY_OPTIONS = [
    'Writing', 'Vision', 'Files', 'Long Conversations', 'Reasoning',
    'Advanced Reasoning', 'Long Context', 'Research', 'Structured Responses',
    'Analysis', 'Coding', 'Debugging', 'Refactoring', 'Architecture', 'Documentation'
  ];

  // Colors for new custom models (we cycle through these gradients)
  const GRADIENT_PALETTES = [
    'linear-gradient(135deg, #ec4899, #f97316)', // Orange/pink
    'linear-gradient(135deg, #6366f1, #a855f7)', // Indigo/purple
    'linear-gradient(135deg, #14b8a6, #10b981)', // Teal/green
    'linear-gradient(135deg, #3b82f6, #06b6d4)', // Blue/cyan
    'linear-gradient(135deg, #f59e0b, #ef4444)'  // Yellow/red
  ];

  useEffect(() => {
    const session = getCurrentUserSession();
    const currentUsername = session ? session.username : 'default';
    setUsername(currentUsername);
    setModels(getAllModels(currentUsername));
  }, []);

  const handleSelectCapability = (cap) => {
    if (formCapabilities.includes(cap)) {
      setFormCapabilities(prev => prev.filter(c => c !== cap));
    } else {
      setFormCapabilities(prev => [...prev, cap]);
    }
  };

  const handleCreateCustomModel = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const selectedBackend = BACKEND_MODELS.find(m => m.id === formBackendModel);
    const backendProv = selectedBackend ? selectedBackend.provider : 'google';

    const cleanCapabilities = formCapabilities.length > 0 ? formCapabilities : ['Reasoning'];
    
    // Choose a color gradient based on length of custom models
    const existingCustom = getCustomModels(username);
    const gradient = GRADIENT_PALETTES[existingCustom.length % GRADIENT_PALETTES.length];

    const newModel = {
      id: `custom_${Date.now()}`,
      displayName: formName.trim(),
      tagline: formTagline.trim() || 'Custom tailored assistant.',
      description: formDescription.trim() || 'A user-configured custom AI companion.',
      icon: formIcon,
      color: gradient,
      backendProvider: backendProv,
      backendModelId: formBackendModel,
      fallbackProvider: 'google',
      systemPrompt: formSystemPrompt.trim() || 'You are a helpful custom assistant.',
      supportedCapabilities: cleanCapabilities,
      contextLength: '1M tokens',
      estimatedSpeed: 'Fast (~60 tokens/s)',
      estimatedPricing: 'Configured by User',
      availability: 'Custom Model',
      recommendedTasks: cleanCapabilities.join(', '),
      temperature: Number(formTemperature)
    };

    const updatedCustom = [...existingCustom, newModel];
    saveCustomModels(updatedCustom, username);
    
    // Refresh model list
    setModels(getAllModels(username));

    // Reset Form
    setFormName('');
    setFormTagline('');
    setFormDescription('');
    setFormIcon('Sparkles');
    setFormBackendModel('gemini-2.5-flash');
    setFormTemperature(0.7);
    setFormSystemPrompt('');
    setFormCapabilities([]);
    setShowCreateModal(false);
    setShowAdvanced(false);

    // Auto-select the newly created model
    onSelect(newModel.id);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Model Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
          width: '100%',
          marginTop: '12px'
        }}
      >
        {models.map((m) => {
          const isSelected = m.id === selectedId;
          const IconComponent = ICON_MAP[m.icon] || Sparkles;
          
          return (
            <div
              key={m.id}
              className={`persona-card glass-panel ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(m.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                minHeight: '260px',
                borderColor: isSelected ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
                boxShadow: isSelected ? '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)' : 'none',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Premium Glow Highlight */}
              {isSelected && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: m.color
                  }} 
                />
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div
                    className="card-avatar"
                    style={{ 
                      background: m.color,
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      marginBottom: 0
                    }}
                  >
                    <IconComponent size={20} style={{ color: '#fff' }} />
                  </div>
                  <span 
                    style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: 600, 
                      padding: '4px 8px', 
                      borderRadius: '99px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {m.availability}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {m.displayName}
                  {isSelected && <Check size={16} style={{ color: 'var(--color-success)' }} />}
                </h3>

                <div 
                  style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 500, 
                    marginBottom: '10px',
                    background: m.color,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0.9
                  }}
                >
                  {m.tagline}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {m.description}
                </p>

                {/* Capability Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {m.supportedCapabilities?.slice(0, 4).map((cap, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 500, 
                        background: 'rgba(255, 255, 255, 0.04)', 
                        border: '1px solid rgba(255, 255, 255, 0.04)', 
                        color: 'var(--text-secondary)', 
                        padding: '2px 8px', 
                        borderRadius: '4px' 
                      }}
                    >
                      {cap}
                    </span>
                  ))}
                  {m.supportedCapabilities?.length > 4 && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{m.supportedCapabilities.length - 4} more</span>
                  )}
                </div>
              </div>

              {/* Model Metadata Footer */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px', 
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Speed:</span> {m.estimatedSpeed || 'Fast'}
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Context:</span> {m.contextLength || '1M'}
                </div>
              </div>
            </div>
          );
        })}

        {/* Plus Card to Add Custom Model */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="persona-card glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            minHeight: '260px',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.01)',
            borderStyle: 'dashed',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s'
          }}
        >
          <div 
            style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.04)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <Plus size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '6px' }}>Create Custom Model</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '240px', lineHeight: '1.4' }}>
            Configure custom parameters, model rules, and backend engines.
          </p>
        </div>
      </div>

      {/* Create Custom Model Modal */}
      {showCreateModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#09090b',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#ec4899' }} /> Create Custom Model
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCustomModel} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Name */}
              <div className="input-group">
                <label>Model Name</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. My Coding Buddy" 
                    required 
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="input-group">
                <label>Tagline</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Expert in React & Next.js" 
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe your model's target use case..."
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    padding: '10px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Icon Selection & Engine Selection in one row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label>Avatar Symbol</label>
                  <select 
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    {Object.keys(ICON_MAP).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Backend Engine</label>
                  <select 
                    value={formBackendModel}
                    onChange={(e) => setFormBackendModel(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    {BACKEND_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle Advanced Options */}
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  alignSelf: 'flex-start',
                  marginTop: '4px'
                }}
              >
                <SlidersHorizontal size={13} />
                <span>{showAdvanced ? 'Hide' : 'Expose'} Advanced Parameters</span>
              </button>

              {/* Advanced Section */}
              {showAdvanced && (
                <div 
                  style={{ 
                    border: '1px solid rgba(255,255,255,0.06)', 
                    borderRadius: '8px', 
                    padding: '16px',
                    background: 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  {/* Temperature Slider */}
                  <div className="input-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ margin: 0 }}>Temperature</label>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>{formTemperature}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05"
                      value={formTemperature}
                      onChange={(e) => setFormTemperature(e.target.value)}
                      style={{ width: '100%', marginTop: '6px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* System Instruction */}
                  <div className="input-group" style={{ margin: 0 }}>
                    <label>System Instructions / Persona Rules</label>
                    <textarea 
                      value={formSystemPrompt}
                      onChange={(e) => setFormSystemPrompt(e.target.value)}
                      placeholder="e.g. You are an expert in code reviews. Answer in direct bulleted lists and point out performance issues..."
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        padding: '10px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        resize: 'vertical',
                        marginTop: '4px'
                      }}
                    />
                  </div>

                  {/* Capabilities Multi-select */}
                  <div className="input-group" style={{ margin: 0 }}>
                    <label>Preferred Capabilities</label>
                    <div 
                      style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px', 
                        marginTop: '6px',
                        maxHeight: '100px',
                        overflowY: 'auto',
                        padding: '4px'
                      }}
                    >
                      {CAPABILITY_OPTIONS.map((cap) => {
                        const isSelected = formCapabilities.includes(cap);
                        return (
                          <button
                            key={cap}
                            type="button"
                            onClick={() => handleSelectCapability(cap)}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              background: isSelected ? 'var(--text-primary)' : 'rgba(255,255,255,0.04)',
                              color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '4px',
                              padding: '3px 8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            {cap}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Create Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
