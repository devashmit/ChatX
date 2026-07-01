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
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="editorial-landing">
      <div className="background-glows">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>
      {/* Self-contained CSS */}
      <style>{`
        /* Reset and Base Styles */
        .editorial-landing {
          height: 100vh;
          width: 100vw;
          background-color: #000000;
          color: #F8F8FF;
          font-family: 'Outfit', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .editorial-landing * {
          box-sizing: border-box;
        }

        /* Ambient Background Glows */
        .background-glows {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .glow-1 {
          position: absolute;
          top: -10%;
          left: 10%;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, rgba(0,0,0,0) 80%);
          filter: blur(120px);
          animation: slowGlowPulse 18s infinite ease-in-out;
        }

        .glow-2 {
          position: absolute;
          bottom: 10%;
          right: 5%;
          width: 800px;
          height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(176, 196, 222, 0.05) 0%, rgba(0,0,0,0) 80%);
          filter: blur(140px);
          animation: slowGlowPulse 24s infinite ease-in-out alternate;
        }

        @keyframes slowGlowPulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.7; }
          50% { transform: scale(1.18) translate(30px, -20px); opacity: 1; }
        }

        /* Entry Transitions */
        @keyframes fadeUpIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Typography Helper Classes */
        .serif-text {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
        }
        
        .serif-italic {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-style: italic;
          color: #39FF14;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.35);
        }

        .sans-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        /* Nav Section */
        .editorial-nav {
          width: 100%;
          border-bottom: 1px solid rgba(176, 196, 222, 0.15);
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
          animation: fadeUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
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
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          text-decoration: none;
          color: #F8F8FF;
          letter-spacing: -0.03em;
        }

        .nav-logo span {
          color: #39FF14;
          text-shadow: 0 0 8px rgba(57, 255, 20, 0.6);
        }

        .nav-middle {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          color: #B0C4DE;
          letter-spacing: 0.12em;
          font-weight: 500;
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
          border: 1px solid rgba(176, 196, 222, 0.3);
          color: #B0C4DE;
          padding: 0.5rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-ghost:hover {
          border-color: #39FF14;
          color: #39FF14;
          box-shadow: 0 0 12px rgba(57, 255, 20, 0.3);
          transform: translateY(-1px);
        }

        .btn-ink {
          background: #39FF14;
          border: none;
          color: #000000;
          padding: 0.5rem 1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-transform: uppercase;
        }

        .btn-ink:hover {
          background-color: #32e010;
          box-shadow: 0 0 15px rgba(57, 255, 20, 0.6);
          transform: translateY(-1px);
        }

        /* Container Limit helper */
        .editorial-section {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        /* Hero Section */
        .hero-section {
          padding-top: 5rem;
          padding-bottom: 3.5rem;
          animation: fadeUpIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }

        .hero-issue-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #B0C4DE;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .hero-issue-line hr {
          flex: 1;
          border: none;
          border-top: 1px solid rgba(176, 196, 222, 0.15);
          margin: 0;
        }

        .hero-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 58px;
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #F8F8FF;
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
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: #B0C4DE;
          font-weight: 300;
          margin: 0;
        }

        .hero-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .btn-primary-cta {
          background: #39FF14;
          border: none;
          color: #000000;
          padding: 0.85rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-primary-cta:hover {
          background-color: #32e010;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.7);
          transform: translateY(-2px);
        }

        .btn-primary-cta svg {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-primary-cta:hover svg {
          transform: translateX(5px);
        }

        .btn-secondary-cta {
          background: transparent;
          border: 1px solid rgba(176, 196, 222, 0.3);
          color: #F8F8FF;
          padding: 0.85rem 1.25rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-secondary-cta:hover {
          border-color: #39FF14;
          color: #39FF14;
          box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
          transform: translateY(-2px);
        }

        .btn-secondary-cta svg {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-secondary-cta:hover svg {
          transform: translateX(5px);
        }

        .stat-card {
          background: rgba(8, 8, 10, 0.85);
          border: 1px solid rgba(176, 196, 222, 0.15);
          border-radius: 8px;
          padding: 1.25rem;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(57, 255, 20, 0.3);
          box-shadow: 0 8px 25px -8px rgba(57, 255, 20, 0.2);
        }

        .stat-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #39FF14;
          line-height: 1;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 8px rgba(57, 255, 20, 0.3);
        }

        .stat-label {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          color: #B0C4DE;
          margin: 0;
          line-height: 1.4;
        }

        /* Separator Rule */
        .section-separator {
          width: 100%;
          border: none;
          border-top: 1px solid rgba(176, 196, 222, 0.15);
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* Persona Section */
        .persona-section {
          padding: 5rem 1.5rem;
          animation: fadeUpIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
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
          color: #39FF14;
          text-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
        }

        .section-header-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #F8F8FF;
          margin: 0;
        }

        .personas-grid {
          display: grid;
          grid-template-columns: 1fr;
          background-color: rgba(176, 196, 222, 0.15);
          gap: 1px;
          border: 1px solid rgba(176, 196, 222, 0.15);
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
          background-color: #08080a;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .persona-col:hover {
          background-color: #0f0f13;
          transform: translateY(-4px);
          box-shadow: inset 0 0 25px rgba(57, 255, 20, 0.06), 0 12px 30px -10px rgba(57, 255, 20, 0.15);
        }

        .persona-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #627284;
          margin-bottom: 1.5rem;
        }

        .persona-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #F8F8FF;
          margin: 0 0 0.25rem 0;
        }

        .persona-role {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #39FF14;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1.5rem;
        }

        .persona-divider {
          width: 100%;
          border: none;
          border-top: 1px solid rgba(176, 196, 222, 0.15);
          margin: 0 0 1.5rem 0;
        }

        .persona-desc {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #B0C4DE;
          margin: 0 0 2rem 0;
          flex: 1;
        }

        .persona-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #39FF14;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          border-bottom: 1px solid #39FF14;
          padding-bottom: 2px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .persona-link:hover {
          opacity: 0.85;
          letter-spacing: 0.16em;
          padding-left: 6px;
        }

        /* Pull Quote */
        .pull-quote {
          background-color: rgba(57, 255, 20, 0.04);
          border-left: 3px solid #39FF14;
          border-radius: 0 8px 8px 0;
          padding: 2rem;
          text-align: left;
          transition: all 0.3s ease;
        }

        .pull-quote:hover {
          background-color: rgba(57, 255, 20, 0.06);
          box-shadow: 0 5px 15px rgba(57, 255, 20, 0.05);
        }

        .pull-quote-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 500;
          font-style: italic;
          color: #F8F8FF;
          line-height: 1.7;
          margin: 0 0 1rem 0;
        }

        .pull-quote-attribution {
          color: #B0C4DE;
          margin: 0;
        }

        /* Dark Features Section */
        .features-section-dark {
          width: 100%;
          background-color: #000000;
          padding: 5rem 0;
          position: relative;
          z-index: 1;
        }

        .features-section-dark .section-header-label {
          color: #39FF14;
        }

        .features-section-dark .section-header-title {
          color: #F8F8FF;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          background-color: rgba(176, 196, 222, 0.15);
          gap: 1px;
          border: 1px solid rgba(176, 196, 222, 0.15);
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
          background-color: #08080a;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-cell:hover {
          background-color: #101014;
          transform: translateY(-4px);
          box-shadow: inset 0 0 20px rgba(57, 255, 20, 0.03), 0 10px 25px -10px rgba(57, 255, 20, 0.15);
        }

        .feature-cell-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #F8F8FF;
          margin: 0;
        }

        .feature-cell-body {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: #B0C4DE;
          line-height: 1.7;
          margin: 0;
        }

        /* Footer CTA Section */
        .footer-cta-section {
          padding: 5rem 1.5rem;
          position: relative;
          z-index: 1;
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
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38px;
          font-weight: 700;
          line-height: 1.2;
          color: #F8F8FF;
          margin: 0;
        }

        .footer-cta-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-cta-fineprint {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          color: #627284;
          line-height: 1.6;
          margin: 0;
        }

        /* Footer Bar */
        .footer-bar {
          width: 100%;
          border-top: 1px solid rgba(176, 196, 222, 0.15);
          background-color: #000000;
          position: relative;
          z-index: 1;
        }

        .footer-bar-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          color: #627284;
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
          <span className="sans-label" style={{ color: 'var(--text-secondary)' }}>Vol. I -- No. 1</span>
          <hr />
          <span className="sans-label" style={{ color: 'var(--text-secondary)' }}>Est. 2025</span>
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
              <Lock size={16} color="#39FF14" />
              <h4 className="feature-cell-title">User Isolation</h4>
              <p className="feature-cell-body">Your workspace is locally stored and fully sealed. No user can view or access another user's threads.</p>
            </div>

            {/* Clock */}
            <div className="feature-cell">
              <History size={16} color="#39FF14" />
              <h4 className="feature-cell-title">Persistent Threads</h4>
              <p className="feature-cell-body">Conversations are retained on your browser partition automatically, ready for your return.</p>
            </div>

            {/* Users */}
            <div className="feature-cell">
              <Users size={16} color="#39FF14" />
              <h4 className="feature-cell-title">Multi-User Security</h4>
              <p className="feature-cell-body">Seamless, isolated profile switching keeps distinct users and workloads cleanly segregated.</p>
            </div>

            {/* Calculator */}
            <div className="feature-cell">
              <Calculator size={16} color="#39FF14" />
              <h4 className="feature-cell-title">Inline Mathematics</h4>
              <p className="feature-cell-body">Athena solves formula expressions, logic steps, and formatted data arrays directly in the chat.</p>
            </div>

            {/* Brain */}
            <div className="feature-cell">
              <Brain size={16} color="#39FF14" />
              <h4 className="feature-cell-title">Intent-Aware Outputs</h4>
              <p className="feature-cell-body">The companions adjust their response formats dynamically based on the goals of your conversation.</p>
            </div>

            {/* Zap */}
            <div className="feature-cell">
              <Zap size={16} color="#39FF14" />
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
