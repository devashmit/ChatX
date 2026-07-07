import React, { useState, useEffect } from 'react';
import { Lock, History, Users, Calculator, Brain, Zap, ArrowRight, MessageSquare, Terminal, Sparkles, Compass, Check, ChevronDown, Cpu, Shield, HelpCircle, Code } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Is ChatX free to use?",
    answer: "Yes. ChatX has a robust Free tier that lets you utilize standard personas offline and connect your own API keys. We also offer a Plus tier for higher token limits and priority features."
  },
  {
    question: "How is my conversation data stored?",
    answer: "Your privacy is our core value. All conversations are stored locally in your browser cache/storage and never sent to our servers. Only the prompt is securely forwarded to the AI model."
  },
  {
    question: "Can I connect my own custom models?",
    answer: "Absolutely. In the Settings drawer, you can input your Gemini or custom API keys to power your conversations with your own dedicated endpoints."
  },
  {
    question: "What are the specialized companions?",
    answer: "We offer pre-configured personas like Athena (the Software Architect), Aurora (the Creative Writer), and Silas (the Calm Mentor) to help you get optimized responses without prompting from scratch."
  }
];

const PREVIEW_PROMPTS = {
  athena: {
    query: "Explain closures and write an optimized React debounce hook.",
    response: "A closure is a function that remembers its outer variables even after the outer function has returned.\n\nHere is a clean debounce hook:\n\n```javascript\nfunction useDebounce(value, delay) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}\n```"
  },
  aurora: {
    query: "Compose a short poem about a bioluminescent cyberpunk forest.",
    response: "Electric roots drink glowing dew,\nWhere neon moss and circuitry grew.\nThe chrome leaves whisper ancient tales,\nOn carbon-fiber wind that sails.\nA sanctuary of synthetic light,\nBlooming soft in the endless night."
  },
  silas: {
    query: "Give me some quick, practical advice to tackle developer burnout.",
    response: "1. **Strict Off-Hours**: Disconnect from Slack/workspace at 6 PM. No exceptions.\n2. **The 50/10 Rule**: Work intensely for 50 minutes, then walk away from screens for 10 minutes.\n3. **Decouple Identity**: Remember you are a person who writes code, not just a coder."
  }
};

export default function LandingPage({ onNavigateAuth }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [previewPersona, setPreviewPersona] = useState('athena');
  const [previewText, setPreviewText] = useState('');
  const [previewStreaming, setPreviewStreaming] = useState(false);
  const [previewHistory, setPreviewHistory] = useState([
    { sender: 'assistant', text: "Hello! Athena here. Ready to debug, design, or discuss system architecture. What are we building today?" }
  ]);

  // Run simulated streaming when preview persona changes
  const runPreviewSimulation = (personaId) => {
    setPreviewPersona(personaId);
    setPreviewStreaming(true);
    setPreviewText('');
    
    const queryData = PREVIEW_PROMPTS[personaId];
    setPreviewHistory([
      { sender: 'user', text: queryData.query },
      { sender: 'assistant', text: '' }
    ]);

    let fullText = queryData.response;
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setPreviewText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setPreviewStreaming(false);
      }
    }, 15);

    return timer;
  };

  useEffect(() => {
    // Initial run
    const timer = runPreviewSimulation('athena');
    return () => clearInterval(timer);
  }, []);

  // Update assistant message text in preview history
  useEffect(() => {
    setPreviewHistory(prev => {
      const copy = [...prev];
      if (copy.length > 1 && copy[1].sender === 'assistant') {
        copy[1].text = previewText;
      }
      return copy;
    });
  }, [previewText]);

  return (
    <div className="editorial-landing">
      {/* Self-contained style block for Landing Page specifics */}
      <style>{`
        .editorial-landing {
          min-height: 100vh;
          width: 100vw;
          background-color: #09090b;
          color: #f4f4f5;
          font-family: 'Outfit', sans-serif;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .landing-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(9, 9, 11, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .landing-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: #ffffff;
        }

        .nav-links {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .btn-sign-in {
          background: #ffffff;
          color: #09090b;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-sign-in:hover {
          opacity: 0.9;
        }

        /* Hero Section */
        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px 60px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .badge-hero {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }

        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #ffffff;
          max-width: 800px;
          margin-bottom: 20px;
        }

        .hero-title em {
          font-style: normal;
          color: #a1a1aa;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: #a1a1aa;
          line-height: 1.6;
          max-width: 600px;
          margin-bottom: 32px;
        }

        .hero-ctas {
          display: flex;
          gap: 16px;
          margin-bottom: 64px;
        }

        .btn-primary {
          background: #ffffff;
          color: #09090b;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.1s;
        }

        .btn-primary:active {
          transform: scale(0.98);
        }

        .btn-secondary {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Interactive AI Preview */
        .preview-container {
          width: 100%;
          max-width: 840px;
          background: #0c0c0e;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          text-align: left;
          margin-bottom: 80px;
        }

        .preview-header {
          background: #121215;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-dots {
          display: flex;
          gap: 6px;
        }

        .preview-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .preview-title {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: #a1a1aa;
        }

        .preview-tabs {
          display: flex;
          background: #111113;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          gap: 8px;
        }

        .preview-tab-btn {
          background: transparent;
          border: none;
          color: #a1a1aa;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .preview-tab-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
        }

        .preview-tab-btn.active {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .preview-content {
          padding: 24px;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .preview-bubble {
          display: flex;
          gap: 12px;
        }

        .preview-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #ffffff;
        }

        .preview-text {
          flex: 1;
          font-size: 0.88rem;
          line-height: 1.5;
          color: #e4e4e7;
          white-space: pre-wrap;
        }

        .preview-text pre {
          background: #060608;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 8px;
          overflow-x: auto;
        }

        .preview-text code {
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }

        /* Features Section */
        .grid-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
          width: 100%;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-tag {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #a1a1aa;
          letter-spacing: 0.1em;
          display: inline-block;
          margin-bottom: 12px;
        }

        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.25rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: #0c0c0e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          transition: border-color 0.2s;
        }

        .feature-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .feature-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: #a1a1aa;
          line-height: 1.5;
        }

        /* Models Showcase */
        .models-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 10px;
        }

        .model-card {
          background: #0c0c0e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .model-icon {
          color: #a1a1aa;
        }

        .model-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #ffffff;
        }

        /* Pricing Section */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .pricing-card {
          background: #0c0c0e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .pricing-card.premium {
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }

        .pricing-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 0.68rem;
          font-weight: 600;
          color: #ffffff;
        }

        .pricing-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .pricing-card .price {
          font-size: 2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          margin: 16px 0;
          color: #ffffff;
        }

        .pricing-card .price span {
          font-size: 0.9rem;
          font-weight: 400;
          color: #a1a1aa;
        }

        .pricing-features {
          list-style: none;
          margin: 20px 0 32px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .pricing-features li {
          font-size: 0.85rem;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pricing-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pricing-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .pricing-card.premium .pricing-btn {
          background: #ffffff;
          color: #09090b;
          border: none;
        }

        .pricing-card.premium .pricing-btn:hover {
          opacity: 0.9;
        }

        /* FAQ Accordion */
        .faq-list {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background: #0c0c0e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }

        .faq-trigger {
          width: 100%;
          background: transparent;
          border: none;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
        }

        .faq-answer {
          padding: 0 20px 20px 20px;
          font-size: 0.88rem;
          color: #a1a1aa;
          line-height: 1.5;
          border-top: 1px solid rgba(255, 255, 255, 0.02);
          animation: fadeUpIn 0.2s ease-in-out;
        }

        /* Footer */
        .landing-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: #070708;
          padding: 48px 24px;
          margin-top: 60px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-link {
          color: #52525b;
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #a1a1aa;
        }

        .footer-copyright {
          font-size: 0.8rem;
          color: #52525b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .features-grid, .pricing-grid {
            grid-template-columns: 1fr;
          }

          .models-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nav-links {
            display: none;
          }
        }
      `}</style>

      {/* Navigation */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="logo-group">
            <MessageSquare size={22} />
            <span>ChatX</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#models" className="nav-link">AI Models</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <button className="btn-sign-in" onClick={onNavigateAuth}>Sign In</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="badge-hero">Introducing ChatX Workspace</div>
        <h1 className="hero-title">
          Redefine how you <em>think</em> and <em>build</em> with AI.
        </h1>
        <p className="hero-subtitle">
          An elevated workspace that coordinates specialized AI companions for clean code, creative writing, and mental clarity. Fully private. Beautifully minimal.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={onNavigateAuth}>
            <span>Start Chatting</span>
            <ArrowRight size={16} />
          </button>
          <a href="#features" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">Explore Features</button>
          </a>
        </div>

        {/* Interactive AI Preview */}
        <div className="preview-container">
          <div className="preview-header">
            <div className="preview-dots">
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-dot" />
            </div>
            <div className="preview-title">interactive_preview.js</div>
            <div style={{ width: '30px' }} />
          </div>
          <div className="preview-tabs">
            <button 
              className={`preview-tab-btn ${previewPersona === 'athena' ? 'active' : ''}`}
              onClick={() => runPreviewSimulation('athena')}
              disabled={previewStreaming}
            >
              <Terminal size={12} />
              <span>Athena (Code)</span>
            </button>
            <button 
              className={`preview-tab-btn ${previewPersona === 'aurora' ? 'active' : ''}`}
              onClick={() => runPreviewSimulation('aurora')}
              disabled={previewStreaming}
            >
              <Sparkles size={12} />
              <span>Aurora (Creative)</span>
            </button>
            <button 
              className={`preview-tab-btn ${previewPersona === 'silas' ? 'active' : ''}`}
              onClick={() => runPreviewSimulation('silas')}
              disabled={previewStreaming}
            >
              <Compass size={12} />
              <span>Silas (Mentor)</span>
            </button>
          </div>
          <div className="preview-content">
            {previewHistory.map((item, i) => (
              <div className="preview-bubble" key={i}>
                <div 
                  className="preview-avatar"
                  style={{ 
                    background: item.sender === 'user' 
                      ? '#27272a' 
                      : previewPersona === 'athena' 
                        ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                        : previewPersona === 'aurora' 
                          ? 'linear-gradient(135deg, #ec4899, #f97316)' 
                          : 'linear-gradient(135deg, #14b8a6, #10b981)'
                  }}
                >
                  {item.sender === 'user' ? 'U' : previewPersona.charAt(0).toUpperCase()}
                </div>
                <div className="preview-text">
                  {item.text.includes('```') ? (
                    (() => {
                      const parts = item.text.split('```');
                      return (
                        <>
                          {parts[0]}
                          {parts[1] && (
                            <pre>
                              <code>{parts[1].substring(parts[1].indexOf('\n') + 1)}</code>
                            </pre>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    item.text
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid-section" id="features">
        <div className="section-header">
          <span className="section-tag">Value Proposition</span>
          <h2 className="section-title">Designed for absolute focus</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Lock size={16} /></div>
            <h3>Local Storage Isolation</h3>
            <p>Your conversations and environment settings are kept strictly on your local browser. No analytics tracking, no server history leaks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Shield size={16} /></div>
            <h3>Bring Your Own Keys</h3>
            <p>Seamlessly configure Gemini keys to query models directly. Unlock priority endpoints without paying premium monthly markup rates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><History size={16} /></div>
            <h3>Persistent Workspaces</h3>
            <p>Organize threads, switch personas dynamically, and access your previous prompts whenever you return to the editor dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Cpu size={16} /></div>
            <h3>Intent-Aware Companions</h3>
            <p>Our pre-defined specialized agents adapt text formatting, code blocks, and guidance automatically based on context cues.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Calculator size={16} /></div>
            <h3>Inline Code Sandbox</h3>
            <p>Extract, review, and copy code snippets with dedicated header actions and beautiful formatting across all devices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper"><Zap size={16} /></div>
            <h3>Zero-lag streaming</h3>
            <p>Enjoy snappy, responsive typing simulations that closely replicate professional coding tools and productivity terminals.</p>
          </div>
        </div>
      </section>

      {/* Supported Models Section */}
      <section className="grid-section" id="models">
        <div className="section-header">
          <span className="section-tag">Supported Frameworks</span>
          <h2 className="section-title">Compatible AI Models</h2>
        </div>
        <div className="models-grid">
          <div className="model-card">
            <Code size={16} className="model-icon" />
            <span className="model-name">Gemini 1.5 Pro</span>
          </div>
          <div className="model-card">
            <Cpu size={16} className="model-icon" />
            <span className="model-name">Gemini 1.5 Flash</span>
          </div>
          <div className="model-card">
            <Sparkles size={16} className="model-icon" />
            <span className="model-name">Claude 3.5 Sonnet</span>
          </div>
          <div className="model-card">
            <Terminal size={16} className="model-icon" />
            <span className="model-name">GPT-4o / Mini</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="grid-section" id="pricing">
        <div className="section-header">
          <span className="section-tag">Fair Pricing</span>
          <h2 className="section-title">Plans that scale with you</h2>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>For casual testing & learning</p>
            <div className="price">$0 <span>/ month</span></div>
            <ul className="pricing-features">
              <li><Check size={12} /> Standard offline simulation</li>
              <li><Check size={12} /> Local browser history</li>
              <li><Check size={12} /> 3 default agent companions</li>
            </ul>
            <button className="pricing-btn" onClick={onNavigateAuth}>Get Started</button>
          </div>
          <div className="pricing-card premium">
            <span className="pricing-badge">Popular</span>
            <h3>Plus</h3>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>For power users and writers</p>
            <div className="price">$10 <span>/ month</span></div>
            <ul className="pricing-features">
              <li><Check size={12} /> Priority live streaming</li>
              <li><Check size={12} /> Access to custom templates</li>
              <li><Check size={12} /> API Key configuration</li>
              <li><Check size={12} /> Saved prompt repository</li>
            </ul>
            <button className="pricing-btn" onClick={onNavigateAuth}>Upgrade Now</button>
          </div>
          <div className="pricing-card">
            <h3>Developer</h3>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>For API integration and sandbox</p>
            <div className="price">Custom <span>/ month</span></div>
            <ul className="pricing-features">
              <li><Check size={12} /> Multi-user isolation</li>
              <li><Check size={12} /> Custom model endpoints</li>
              <li><Check size={12} /> Dedicated context memory</li>
            </ul>
            <button className="pricing-btn" onClick={onNavigateAuth}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="grid-section" id="faq">
        <div className="section-header">
          <span className="section-tag">Questions</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div className="faq-item" key={idx}>
                <button 
                  className="faq-trigger" 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
                      transition: 'transform 0.2s' 
                    }} 
                  />
                </button>
                {isOpen && <div className="faq-answer">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="logo-group">
            <MessageSquare size={18} />
            <span>ChatX Workspace</span>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Security Statement</a>
          </div>
          <div className="footer-copyright">
            &copy; 2026 ChatX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
