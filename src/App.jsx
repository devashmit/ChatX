import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import CommandPalette from './components/CommandPalette';
import NotesWorkspace from './components/NotesWorkspace';
import TasksWorkspace from './components/TasksWorkspace';
import FilesWorkspace from './components/FilesWorkspace';
import MemoryWorkspace from './components/MemoryWorkspace';
import ArtifactPanel from './components/ArtifactPanel';
import { executeAIRequest } from './services/aiService';
import { getCurrentUserSession, clearCurrentUserSession } from './services/storageUtils';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('chat'); // 'chat' | 'notes' | 'tasks' | 'files' | 'memory'

  // Settings states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [themeMode, setThemeMode] = useState('dark');

  // Interactive side-by-side Artifact state (Phase 7)
  const [activeArtifact, setActiveArtifact] = useState(null);

  // Command Palette state (Phase 10)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global styling configurations
  const [personaId, setPersonaId] = useState('athena');
  const [agentMode, setAgentMode] = useState('single'); // 'single' | 'collaborative' | 'consensus'
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  const cancelStreamRef = useRef(null);

  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeConversation = activeProject?.chats?.find(c => c.id === activeChatId);
  const activeMessages = activeConversation ? activeConversation.messages : [];

  // Check active session and load projects on mount
  useEffect(() => {
    const session = getCurrentUserSession();
    if (session) {
      setCurrentUser(session);
      setCurrentView('chat');
    }
  }, []);

  // Load user-specific projects from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedProjects = localStorage.getItem(`chatx_projects_${currentUser.username}`);
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          setProjects(parsed);
          if (parsed.length > 0) {
            setActiveProjectId(parsed[0].id);
            if (parsed[0].chats?.length > 0) {
              setActiveChatId(parsed[0].chats[0].id);
            }
          }
        } catch (e) {
          console.error("Failed to parse projects", e);
          initializeDefaultProject();
        }
      } else {
        initializeDefaultProject();
      }
    } else {
      setProjects([]);
      setActiveProjectId(null);
      setActiveChatId(null);
    }
  }, [currentUser]);

  // Sync projects to localStorage
  useEffect(() => {
    if (currentUser && projects.length > 0) {
      localStorage.setItem(`chatx_projects_${currentUser.username}`, JSON.stringify(projects));
    }
  }, [projects, currentUser]);

  // Global Keyboard Shortcuts (Phase 10 & 13)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      // Ctrl + / -> Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      // Ctrl + , -> Settings Control Center
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettingsModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const initializeDefaultProject = () => {
    const defaultProj = {
      id: 'proj_default',
      name: 'ChatX Core Sandbox',
      description: 'Default project workspace for file context, task checklists, and code generation.',
      chats: [
        {
          id: 'chat_welcome',
          title: 'Workspace Welcome Chat',
          personaId: 'athena',
          messages: [
            {
              id: 'msg_welcome_assistant',
              sender: 'assistant',
              text: 'Hello! Welcome to your premium AI Productivity Workspace. Organize notes, files, tasks, and chats all inside target Projects. Try pressing Ctrl + K to launch the command center.',
              timestamp: Date.now()
            }
          ],
          createdAt: Date.now()
        }
      ],
      notes: [
        {
          id: 'note_guide',
          title: 'Workspace Quickstart',
          content: '# Workspace Quickstart\n\n- **Chat**: Converse with specialized agents (Silas, Athena, Aurora).\n- **Notes**: Compose markdown documents side-by-side.\n- **Tasks**: Check off engineering objectives.\n- **Files**: Upload docs to feed context directly to the models.',
          updatedAt: Date.now()
        }
      ],
      tasks: [
        { id: 't1', title: 'Complete ChatX architecture refactoring', status: 'in_progress', priority: 'high', createdAt: Date.now() },
        { id: 't2', title: 'Test collaborative multi-agent execution pipeline', status: 'todo', priority: 'medium', createdAt: Date.now() }
      ],
      files: [],
      memories: [],
      artifacts: []
    };
    setProjects([defaultProj]);
    setActiveProjectId(defaultProj.id);
    setActiveChatId(defaultProj.chats[0].id);
  };

  const handleLoginSuccess = (username) => {
    const session = { username, loginTime: Date.now() };
    localStorage.setItem('chatx_current_user', JSON.stringify(session));
    setCurrentUser(session);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    if (cancelStreamRef.current) cancelStreamRef.current();
    clearCurrentUserSession();
    setCurrentUser(null);
    setProjects([]);
    setActiveProjectId(null);
    setActiveChatId(null);
    setCurrentView('landing');
  };

  const handleCreateProject = (name) => {
    const newProj = {
      id: `proj_${Date.now()}`,
      name,
      description: 'Workspace project repository.',
      chats: [],
      notes: [],
      tasks: [],
      files: [],
      memories: [],
      artifacts: []
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setActiveChatId(null);
  };

  const handleSelectConversation = (chatId) => {
    setActiveChatId(chatId);
    setActiveWorkspaceTab('chat');
    // Set active persona based on selected chat
    const chat = activeProject?.chats?.find(c => c.id === chatId);
    if (chat) {
      setPersonaId(chat.personaId);
    }
  };

  const handleSelectPersona = (id) => {
    setPersonaId(id);
    if (!activeProject) return;

    const existing = activeProject.chats.find(c => c.personaId === id);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      handleNewConversation(id);
    }
  };

  const handleNewConversation = (targetPersonaId = personaId) => {
    if (!activeProjectId) return;
    const newId = `chat_${Date.now()}`;
    const newChat = {
      id: newId,
      title: 'New Conversation',
      personaId: targetPersonaId,
      messages: [
        {
          id: `msg_${Date.now()}_assistant`,
          sender: 'assistant',
          text: `Hello! I am here to help you in this project workspace. What are we designing today?`,
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now()
    };

    setProjects(prev =>
      prev.map(p =>
        p.id === activeProjectId
          ? { ...p, chats: [newChat, ...p.chats] }
          : p
      )
    );
    setActiveChatId(newId);
  };

  const handleDeleteConversation = (chatId) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === activeProjectId) {
          const nextChats = p.chats.filter(c => c.id !== chatId);
          return { ...p, chats: nextChats };
        }
        return p;
      })
    );
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  // Branching / Forking logic (Phase 9)
  const handleForkMessage = (msgId) => {
    if (!activeConversation || !activeProject) return;
    const index = activeMessages.findIndex(m => m.id === msgId);
    if (index === -1) return;

    const forkedMessages = activeMessages.slice(0, index + 1);
    const newChatId = `chat_${Date.now()}`;
    const forkedChat = {
      id: newChatId,
      title: `Forked: ${activeConversation.title}`,
      personaId: activeConversation.personaId,
      messages: forkedMessages,
      createdAt: Date.now()
    };

    setProjects(prev =>
      prev.map(p =>
        p.id === activeProjectId
          ? { ...p, chats: [forkedChat, ...p.chats] }
          : p
      )
    );
    setActiveChatId(newChatId);
  };

  const handleSendMessage = (text) => {
    if (!activeProjectId) return;
    let currentChatId = activeChatId;

    // Create a new conversation if none exists in the current project
    if (!currentChatId) {
      currentChatId = `chat_${Date.now()}`;
      const newChat = {
        id: currentChatId,
        title: text.length > 25 ? text.substring(0, 25) + '...' : text,
        personaId: personaId,
        messages: [],
        createdAt: Date.now()
      };
      
      setProjects(prev =>
        prev.map(p =>
          p.id === activeProjectId
            ? { ...p, chats: [newChat, ...p.chats] }
            : p
        )
      );
      setActiveChatId(currentChatId);
    }

    const userMsg = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    // Update conversation with user message
    setProjects(prev =>
      prev.map(p => {
        if (p.id === activeProjectId) {
          const updatedChats = p.chats.map(c => {
            if (c.id === currentChatId) {
              const title = c.messages.length === 0
                ? (text.length > 25 ? text.substring(0, 25) + '...' : text)
                : c.title;
              return { ...c, title, messages: [...c.messages, userMsg] };
            }
            return c;
          });
          return { ...p, chats: updatedChats };
        }
        return p;
      })
    );

    setIsTyping(true);

    const assistantMsgId = `msg_${Date.now()}_assistant`;
    const assistantMsgPlaceholder = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '',
      timestamp: Date.now()
    };

    setProjects(prev =>
      prev.map(p => {
        if (p.id === activeProjectId) {
          const updatedChats = p.chats.map(c =>
            c.id === currentChatId
              ? { ...c, messages: [...c.messages, assistantMsgPlaceholder] }
              : c
          );
          return { ...p, chats: updatedChats };
        }
        return p;
      })
    );

    // Call Integrated context-aware AI service (Phases 2, 3, 4, 6, 8)
    cancelStreamRef.current = executeAIRequest({
      userPrompt: text,
      history: activeMessages,
      activeProject,
      activeAgentId: personaId,
      agentMode,
      allMemories: activeProject?.memories || [],
      apiKey,
      onChunk: (chunkText) => {
        setProjects(prev =>
          prev.map(p => {
            if (p.id === activeProjectId) {
              return {
                ...p,
                chats: p.chats.map(c => {
                  if (c.id === currentChatId) {
                    return {
                      ...c,
                      messages: c.messages.map(m =>
                        m.id === assistantMsgId ? { ...m, text: chunkText } : m
                      )
                    };
                  }
                  return c;
                })
              };
            }
            return p;
          })
        );
      },
      onComplete: (fullText) => {
        setIsTyping(false);

        // Auto-extract Interactive Artifacts if generated (Phase 7)
        const uiMatch = fullText.match(/```(?:javascript|xml|html)?\s*(?:\(([^)]+)\))?\n([\s\S]*?)```/);
        if (uiMatch) {
          const filename = uiMatch[1] || 'dashboard_view.js';
          const code = uiMatch[2];
          const isUi = filename.includes('js') || filename.includes('html') || filename.includes('xml');
          
          const newArtifact = {
            id: `art_${Date.now()}`,
            title: filename.split('.')[0].replace(/_/g, ' ').toUpperCase(),
            filename,
            code: code.trim(),
            type: isUi ? 'ui' : 'diagram',
            createdAt: Date.now()
          };

          setActiveArtifact(newArtifact);
        }
      },
      onError: (err) => {
        setIsTyping(false);
        setProjects(prev =>
          prev.map(p => {
            if (p.id === activeProjectId) {
              return {
                ...p,
                chats: p.chats.map(c => {
                  if (c.id === currentChatId) {
                    return {
                      ...c,
                      messages: c.messages.map(m =>
                        m.id === assistantMsgId ? { ...m, error: err.message } : m
                      )
                    };
                  }
                  return c;
                })
              };
            }
            return p;
          })
        );
      }
    });
  };

  const handleRetry = (failedMsgId) => {
    if (!activeConversation) return;
    const idx = activeMessages.findIndex(m => m.id === failedMsgId);
    if (idx === -1) return;

    const userMsg = activeMessages[idx - 1];
    if (!userMsg) return;

    // Prune failing branch
    setProjects(prev =>
      prev.map(p => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            chats: p.chats.map(c => {
              if (c.id === activeChatId) {
                return { ...c, messages: c.messages.slice(0, idx) };
              }
              return c;
            })
          };
        }
        return p;
      })
    );

    handleSendMessage(userMsg.text);
  };

  if (currentView === 'landing') {
    return <LandingPage onNavigateAuth={() => setCurrentView('auth')} />;
  }

  if (currentView === 'auth') {
    return (
      <AuthPage 
        onLoginSuccess={handleLoginSuccess} 
        onBackToLanding={() => setCurrentView('landing')} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Background matte glows */}
      <div className="background-glows">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>

      {/* Global Command Center Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        projects={projects}
        onCreateProject={handleCreateProject}
        onSwitchProject={(id) => {
          setActiveProjectId(id);
          const proj = projects.find(p => p.id === id);
          if (proj && proj.chats?.length > 0) {
            setActiveChatId(proj.chats[0].id);
          } else {
            setActiveChatId(null);
          }
        }}
        onSelectAgent={(id) => {
          setPersonaId(id);
          setActiveWorkspaceTab('chat');
        }}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenMemory={() => setActiveWorkspaceTab('memory')}
      />

      {/* Navigation History Sidebar */}
      <Sidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        conversations={activeProject?.chats || []}
        activeId={activeChatId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectConversation={handleSelectConversation}
        onNewConversation={() => handleNewConversation()}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        projects={projects}
        activeProjectId={activeProjectId}
        onSwitchProject={(id) => {
          setActiveProjectId(id);
          const proj = projects.find(p => p.id === id);
          if (proj && proj.chats?.length > 0) {
            setActiveChatId(proj.chats[0].id);
          } else {
            setActiveChatId(null);
          }
        }}
        workspaceFiles={activeProject?.files || []}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Primary Workspace Area */}
      <div className="workspace-main-layout">
        <div className="workspace-center-panel" style={{ padding: '16px 24px 0 24px' }}>
          {/* Project Header and Workspace Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Project</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeProject?.name || 'Loading Project...'}
              </h2>
            </div>

            {/* Workspace tabs navigator */}
            <div className="workspace-tabs">
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('chat')}
              >
                Chat
              </button>
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('notes')}
              >
                Notes
              </button>
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('tasks')}
              >
                Tasks
              </button>
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('files')}
              >
                Files Context
              </button>
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'memory' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('memory')}
              >
                Memory Bank
              </button>
            </div>
          </div>

          {/* Active Tab Viewport */}
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            {activeWorkspaceTab === 'chat' && (
              <ChatArea
                conversation={activeConversation}
                personaId={personaId}
                setPersonaId={handleSelectPersona}
                messages={activeMessages}
                isTyping={isTyping}
                input={input}
                setInput={setInput}
                onSendMessage={handleSendMessage}
                onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                simulateError={simulateError}
                setSimulateError={setSimulateError}
                onRetry={handleRetry}
                onNewChat={() => handleNewConversation()}
                agentMode={agentMode}
                setAgentMode={setAgentMode}
                onForkMessage={handleForkMessage}
              />
            )}

            {activeWorkspaceTab === 'notes' && (
              <NotesWorkspace
                notes={activeProject?.notes || []}
                onUpdateNotes={(updatedNotes) => {
                  setProjects(prev =>
                    prev.map(p =>
                      p.id === activeProjectId ? { ...p, notes: updatedNotes } : p
                    )
                  );
                }}
              />
            )}

            {activeWorkspaceTab === 'tasks' && (
              <TasksWorkspace
                tasks={activeProject?.tasks || []}
                onUpdateTasks={(updatedTasks) => {
                  setProjects(prev =>
                    prev.map(p =>
                      p.id === activeProjectId ? { ...p, tasks: updatedTasks } : p
                    )
                  );
                }}
              />
            )}

            {activeWorkspaceTab === 'files' && (
              <FilesWorkspace
                files={activeProject?.files || []}
                onUpdateFiles={(updatedFiles) => {
                  setProjects(prev =>
                    prev.map(p =>
                      p.id === activeProjectId ? { ...p, files: updatedFiles } : p
                    )
                  );
                }}
              />
            )}

            {activeWorkspaceTab === 'memory' && (
              <MemoryWorkspace
                memories={activeProject?.memories || []}
                onUpdateMemories={(updatedMemories) => {
                  setProjects(prev =>
                    prev.map(p =>
                      p.id === activeProjectId ? { ...p, memories: updatedMemories } : p
                    )
                  );
                }}
              />
            )}
          </div>
        </div>

        {/* Side-by-Side Artifact Presentation Panel (Phase 7) */}
        {activeArtifact && (
          <ArtifactPanel
            artifact={activeArtifact}
            onClose={() => setActiveArtifact(null)}
            onUpdateArtifact={(updatedArt) => setActiveArtifact(updatedArt)}
          />
        )}
      </div>
    </div>
  );
}
