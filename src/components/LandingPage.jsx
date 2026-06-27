import React, { useEffect } from 'react';
import { Lock, History, Users, Calculator, Brain, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage({ onNavigateAuth }) {
  useEffect(() => {
    // Load typography from Google Fonts
    const linkId = 'editorial-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="editorial-landing">
      {/* Self-contained CSS */}
      <style>{`
        /* Reset and Base Styles */
        .editorial-landing {
          height: 100vh;
          width: 100vw;
          background-color: #faf7f2;
          color: #1c1a17;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .editorial-landing * {
          box-sizing: border-box;
        }

        /* Typography Helper Classes */
        .serif-text {
          font-family: 'Playfair Display', serif;
        }
        
        .serif-italic {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #b45309;
        }

        .sans-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        /* Nav Section */
        .editorial-nav {
          width: 100%;
          border-bottom: 1px solid #e8dfc8;
          background-color: #faf7f2;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          text-decoration: none;
          color: #1c1a17;
        }

        .nav-logo span {
          color: #b45309;
        }

        .nav-middle {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          color: #78716c;
          letter-spacing: 0.08em;
          display: none;
        }

        @media (min-width: 640px) {
          .nav-middle {
            display: block;
          }
        }

        .nav-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        /* Buttons */
        .btn-ghost {
          background: transparent;
          border: 1px solid #d6c89a;
          color: #78716c;
          padding: 0.5rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: border-color 0.2s ease, color 0.2s ease;
        }

        .btn-ghost:hover {
          border-color: #b45309;
          color: #b45309;
        }

        .btn-ink {
          background: #1c1a17;
          border: none;
          color: #faf7f2;
          padding: 0.5rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background-color 0.2s ease;
        }

        .btn-ink:hover {
          background-color: #292521;
        }

        /* Container Limit helper */
        .editorial-section {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Hero Section */
        .hero-section {
          padding-top: 5rem;
          padding-bottom: 3.5rem;
        }

        .hero-issue-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #a8956a;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .hero-issue-line hr {
          flex: 1;
          border: none;
          border-top: 1px solid #e8dfc8;
          margin: 0;
        }

        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: 58px;
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #1c1a17;
          margin: 0 0 3rem 0;
          max-width: 800px;
        }

        .hero-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }

        @media (min-width: 768px) {
          .hero-body {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #57534e;
          font-weight: 300;
          margin: 0;
        }

        .hero-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .btn-primary-cta {
          background: #b45309;
          border: none;
          color: #fff7ed;
          padding: 0.85rem 1.25rem;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background-color 0.2s ease;
          text-align: left;
        }

        .btn-primary-cta:hover {
          background-color: #92400e;
        }

        .btn-secondary-cta {
          background: transparent;
          border: 1px solid #d6c89a;
          color: #1c1a17;
          padding: 0.85rem 1.25rem;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.2s ease, color 0.2s ease;
          text-align: left;
        }

        .btn-secondary-cta:hover {
          border-color: #b45309;
          color: #b45309;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e8dfc8;
          border-radius: 6px;
          padding: 1.25rem;
          text-align: left;
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #b45309;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #a8956a;
          margin: 0;
          line-height: 1.4;
        }

        /* Separator Rule */
        .section-separator {
          width: 100%;
          border: none;
          border-top: 1px solid #e8dfc8;
          margin: 0;
        }

        /* Persona Section */
        .persona-section {
          padding: 5rem 1.5rem;
        }

        .section-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 640px) {
          .section-header {
            flex-direction: row;
            align-items: baseline;
            gap: 1.5rem;
          }
        }

        .section-header-label {
          color: #a8956a;
        }

        .section-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 400;
          color: #1c1a17;
          margin: 0;
        }

        .personas-grid {
          display: grid;
          grid-template-columns: 1fr;
          background-color: #e8dfc8;
          gap: 1px;
          border: 1px solid #e8dfc8;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 3rem;
        }

        @media (min-width: 768px) {
          .personas-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .persona-col {
          background-color: #faf7f2;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          transition: background-color 0.2s ease;
        }

        .persona-col:hover {
          background-color: #ffffff;
        }

        .persona-num {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          color: #d6c89a;
          margin-bottom: 1.5rem;
        }

        .persona-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 400;
          color: #1c1a17;
          margin: 0 0 0.25rem 0;
        }

        .persona-role {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #a8956a;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1.5rem;
        }

        .persona-divider {
          width: 100%;
          border: none;
          border-top: 1px solid #e8dfc8;
          margin: 0 0 1.5rem 0;
        }

        .persona-desc {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: #57534e;
          margin: 0 0 2rem 0;
          flex: 1;
        }

        .persona-link {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #b45309;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          border-bottom: 1px solid #b45309;
          padding-bottom: 2px;
        }

        /* Pull Quote */
        .pull-quote {
          background-color: #fef3c7;
          border-left: 3px solid #d97706;
          border-radius: 0 6px 6px 0;
          padding: 2rem;
          text-align: left;
        }

        .pull-quote-text {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-style: italic;
          color: #92400e;
          line-height: 1.7;
          margin: 0 0 1rem 0;
        }

        .pull-quote-attribution {
          color: #a8956a;
          margin: 0;
        }

        /* Dark Features Section */
        .features-section-dark {
          width: 100%;
          background-color: #1c1a17;
          padding: 5rem 0;
        }

        .features-section-dark .section-header-label {
          color: #78716c;
        }

        .features-section-dark .section-header-title {
          color: #faf7f2;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          background-color: #2c2520;
          gap: 1px;
          border: 1px solid #2c2520;
          border-radius: 8px;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-cell {
          background-color: #1c1a17;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
          transition: background-color 0.2s ease;
        }

        .feature-cell:hover {
          background-color: #231f1b;
        }

        .feature-cell-title {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #e7e5e4;
          margin: 0;
        }

        .feature-cell-body {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #57534e;
          line-height: 1.7;
          margin: 0;
        }

        /* Footer CTA Section */
        .footer-cta-section {
          padding: 5rem 1.5rem;
        }

        .footer-cta-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }

        @media (min-width: 768px) {
          .footer-cta-layout {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        .footer-cta-h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 400;
          line-height: 1.2;
          color: #1c1a17;
          margin: 0;
        }

        .footer-cta-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-cta-fineprint {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #a8956a;
          line-height: 1.6;
          margin: 0;
        }

        /* Footer Bar */
        .footer-bar {
          width: 100%;
          border-top: 1px solid #e8dfc8;
          background-color: #faf7f2;
        }

        .footer-bar-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #c4a96a;
          letter-spacing: 0.06em;
        }
      `}</style>

      {/* 1. NAV */}
      <nav className="editorial-nav">
        <div className="nav-content">
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); }}>
            Chat<span>X</span>
          </a>
          <div className="nav-middle">
            The AI Companion
          </div>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={onNavigateAuth}>Sign in</button>
            <button className="btn-ink" onClick={onNavigateAuth}>Get started</button>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="editorial-section hero-section">
        <div className="hero-issue-line">
          <span className="sans-label" style={{ color: '#a8956a' }}>Vol. I -- No. 1</span>
          <hr />
          <span className="sans-label" style={{ color: '#a8956a' }}>Est. 2025</span>
        </div>
        
        <h1 className="hero-h1">
          The AI that thinks the way <em className="serif-italic">you</em> do.
        </h1>

        <div className="hero-body">
          <p className="hero-subtitle">
            Three distinct companions. One secure workspace. Athena reasons, Aurora creates, Silas reflects -- each shaped for a different corner of your mind.
          </p>
          <div className="hero-sidebar">
            <button className="btn-primary-cta" onClick={onNavigateAuth}>
              <span>Begin your conversation</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary-cta" onClick={() => {
              document.getElementById('companions-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>Explore the personas</span>
              <ArrowRight size={16} />
            </button>
            <div className="stat-card">
              <div className="stat-num">3</div>
              <p className="stat-label">AI personas, 1 private workspace, unlimited threads</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-separator" />

      {/* 3. PERSONA SECTION */}
      <section className="editorial-section persona-section" id="companions-section">
        <div className="section-header">
          <span className="sans-label section-header-label">The companions</span>
          <h2 className="section-header-title">Choose who you think with</h2>
        </div>

        <div className="personas-grid">
          {/* Athena */}
          <div className="persona-col">
            <span className="persona-num">I</span>
            <h3 className="persona-name">Athena</h3>
            <span className="persona-role">engineer</span>
            <hr className="persona-divider" />
            <p className="persona-desc">
              Structured and precise framing. Athena handles logical breakdowns, technical details, and systemic reasoning with absolute clarity.
            </p>
            <a href="#" className="persona-link" onClick={(e) => { e.preventDefault(); onNavigateAuth(); }}>
              Consult Athena
            </a>
          </div>

          {/* Aurora */}
          <div className="persona-col">
            <span className="persona-num">II</span>
            <h3 className="persona-name">Aurora</h3>
            <span className="persona-role">creative writer</span>
            <hr className="persona-divider" />
            <p className="persona-desc">
              Editorial voice framing. Aurora builds narratives, explores imaginative phrasing, and brings a stylistic and evocative depth to text.
            </p>
            <a href="#" className="persona-link" onClick={(e) => { e.preventDefault(); onNavigateAuth(); }}>
              Write with Aurora
            </a>
          </div>

          {/* Silas */}
          <div className="persona-col">
            <span className="persona-num">III</span>
            <h3 className="persona-name">Silas</h3>
            <span className="persona-role">calm mentor</span>
            <hr className="persona-divider" />
            <p className="persona-desc">
              Reflective framing. Silas offers thoughtful, calm guidance, grounding your ideas with patient questions and balanced perspectives.
            </p>
            <a href="#" className="persona-link" onClick={(e) => { e.preventDefault(); onNavigateAuth(); }}>
              Reflect with Silas
            </a>
          </div>
        </div>

        {/* Pull Quote */}
        <div className="pull-quote">
          <p className="pull-quote-text">
            "We do not need another chatbot that copies human chatter. We need companions that help us find the architecture of our own thoughts."
          </p>
          <p className="sans-label pull-quote-attribution">-- Editorial Statement</p>
        </div>
      </section>

      {/* 4. FEATURES SECTION (dark) */}
      <section className="features-section-dark">
        <div className="editorial-section">
          <div className="section-header">
            <span className="sans-label section-header-label">The capabilities</span>
            <h2 className="section-header-title">Designed for focus</h2>
          </div>

          <div className="features-grid">
            {/* Lock */}
            <div className="feature-cell">
              <Lock size={16} color="#d97706" />
              <h4 className="feature-cell-title">User Isolation</h4>
              <p className="feature-cell-body">Your workspace is locally stored and fully sealed. No user can view or access another user's threads.</p>
            </div>

            {/* Clock */}
            <div className="feature-cell">
              <History size={16} color="#d97706" />
              <h4 className="feature-cell-title">Persistent Threads</h4>
              <p className="feature-cell-body">Conversations are retained on your browser partition automatically, ready for your return.</p>
            </div>

            {/* Users */}
            <div className="feature-cell">
              <Users size={16} color="#d97706" />
              <h4 className="feature-cell-title">Multi-User Security</h4>
              <p className="feature-cell-body">Seamless, isolated profile switching keeps distinct users and workloads cleanly segregated.</p>
            </div>

            {/* Calculator */}
            <div className="feature-cell">
              <Calculator size={16} color="#d97706" />
              <h4 className="feature-cell-title">Inline Mathematics</h4>
              <p className="feature-cell-body">Athena solves formula expressions, logic steps, and formatted data arrays directly in the chat.</p>
            </div>

            {/* Brain */}
            <div className="feature-cell">
              <Brain size={16} color="#d97706" />
              <h4 className="feature-cell-title">Intent-Aware Outputs</h4>
              <p className="feature-cell-body">The companions adjust their response formats dynamically based on the goals of your conversation.</p>
            </div>

            {/* Zap */}
            <div className="feature-cell">
              <Zap size={16} color="#d97706" />
              <h4 className="feature-cell-title">Zero Setup Required</h4>
              <p className="feature-cell-body">Begin conversing instantly. Your credentials and environment are hashed and handled locally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <section className="editorial-section footer-cta-section">
        <div className="footer-cta-layout">
          <h2 className="footer-cta-h2">
            A different kind of <em className="serif-italic">conversation</em> starts here.
          </h2>
          <div className="footer-cta-sidebar">
            <button className="btn-primary-cta" onClick={onNavigateAuth}>
              <span>Begin your conversation</span>
              <ArrowRight size={16} />
            </button>
            <p className="footer-cta-fineprint">
              No credit card. No trial period. Your data stays on your device.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FOOTER BAR */}
      <footer className="footer-bar">
        <div className="footer-bar-content">
          <span>&copy; 2026 ChatX. All rights reserved.</span>
          <span>MIT License, Open source</span>
        </div>
      </footer>
    </div>
  );
}
