import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { streamAiResponse, getPersonaGreeting } from './services/mockAi';
import { 
  getCurrentUserSession, 
  setCurrentUserSession, 
  clearCurrentUserSession,
  safeSetItem
} from './services/storageUtils';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [personaId, setPersonaId] = useState('athena');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [simulateError, setSimulateError] = useState(false);
  
  const cancelStreamRef = useRef(null);

  // Check active session on mount
  useEffect(() => {
    const session = getCurrentUserSession();
    if (session) {
      const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - session.loginTime < SESSION_TIMEOUT) {
        setCurrentUser(session);
        setCurrentView('chat');
      } else {
        handleLogout();
      }
    }
  }, []);

  // Load user-specific conversations and activeId when user changes
  useEffect(() => {
    if (currentUser) {
      try {
        const saved = localStorage.getItem(`chatx_conversations_${currentUser.username}`);
        const parsed = saved ? JSON.parse(saved) : [];
        setConversations(parsed);

        const savedActiveId = localStorage.getItem(`chatx_active_id_${currentUser.username}`);
        setActiveId(savedActiveId || null);
      } catch (e) {
        console.error("Failed to load user chats", e);
        setConversations([]);
        setActiveId(null);
      }
    } else {
      setConversations([]);
      setActiveId(null);
    }
  }, [currentUser]);

  // Sync conversations to user-prefixed localStorage
  useEffect(() => {
    if (currentUser && conversations.length > 0) {
      safeSetItem(`chatx_conversations_${currentUser.username}`, conversations);
    } else if (currentUser && conversations.length === 0) {
      localStorage.removeItem(`chatx_conversations_${currentUser.username}`);
    }
  }, [conversations, currentUser]);

  // Sync activeId to user-prefixed localStorage
  useEffect(() => {
    if (currentUser) {
      if (activeId) {
        safeSetItem(`chatx_active_id_${currentUser.username}`, activeId);
        // Sync persona of current conversation
        const current = conversations.find(c => c.id === activeId);
        if (current) {
          setPersonaId(current.personaId);
        }
      } else {
        localStorage.removeItem(`chatx_active_id_${currentUser.username}`);
      }
    }
  }, [activeId, conversations, currentUser]);

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (cancelStreamRef.current) cancelStreamRef.current();
    };
  }, []);

  const handleLoginSuccess = (username) => {
    const session = { username, loginTime: Date.now() };
    setCurrentUserSession(session);
    setCurrentUser(session);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    if (cancelStreamRef.current) {
      cancelStreamRef.current();
    }
    clearCurrentUserSession();
    setCurrentUser(null);
    setConversations([]);
    setActiveId(null);
    setInput('');
    setIsTyping(false);
    setSearchQuery('');
    setSidebarOpen(false);
    setCurrentView('landing');
  };

  const activeConversation = conversations.find(c => c.id === activeId);
  const activeMessages = activeConversation ? activeConversation.messages : [];

  // Update current active conversation's persona or switch to existing agent thread
  const handleSelectPersona = (id) => {
    setPersonaId(id);
    const existing = conversations.find(c => c.personaId === id);
    if (existing) {
      setActiveId(existing.id);
    } else {
      const newId = `chat_${Date.now()}`;
      const greeting = getPersonaGreeting(id);
      const welcomeMsg = {
        id: `msg_${Date.now()}_assistant`,
        sender: 'assistant',
        text: greeting,
        timestamp: Date.now()
      };
      const newChat = {
        id: newId,
        title: `${id.charAt(0).toUpperCase() + id.slice(1)} Chat`,
        personaId: id,
        messages: [welcomeMsg],
        createdAt: Date.now()
      };
      setConversations(prev => [newChat, ...prev]);
      setActiveId(newId);
    }
  };

  const handleNewConversation = () => {
    const newId = `chat_${Date.now()}`;
    const greeting = getPersonaGreeting(personaId);
    const welcomeMsg = {
      id: `msg_${Date.now()}_assistant`,
      sender: 'assistant',
      text: greeting,
      timestamp: Date.now()
    };
    const newChat = {
      id: newId,
      title: 'New Conversation',
      personaId: personaId,
      messages: [welcomeMsg],
      createdAt: Date.now()
    };
    setConversations(prev => [newChat, ...prev]);
    setActiveId(newId);
  };

  const handleDeleteConversation = (id) => {
    const nextConversations = conversations.filter(c => c.id !== id);
    setConversations(nextConversations);
    
    if (activeId === id) {
      setActiveId(nextConversations.length > 0 ? nextConversations[0].id : null);
    }
  };

  const handleRetry = (failedMsgId) => {
    const currentActiveId = activeId;
    const current = conversations.find(c => c.id === currentActiveId);
    if (!current) return;
    
    const failedMsgIndex = current.messages.findIndex(m => m.id === failedMsgId);
    if (failedMsgIndex === -1) return;
    
    const userMsg = current.messages[failedMsgIndex - 1];
    const textToRetry = userMsg ? userMsg.text : "";
    
    // Remove the failed message from active conversations
    setConversations(prev =>
      prev.map(c => {
        if (c.id === currentActiveId) {
          return {
            ...c,
            messages: c.messages.slice(0, failedMsgIndex)
          };
        }
        return c;
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

    setConversations(prev =>
      prev.map(c =>
        c.id === currentActiveId
          ? { ...c, messages: [...c.messages, assistantMsgPlaceholder] }
          : c
      )
    );

    cancelStreamRef.current = streamAiResponse(
      personaId,
      textToRetry,
      (chunkText) => {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === currentActiveId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId ? { ...m, text: chunkText } : m
                )
              };
            }
            return c;
          })
        );
      },
      () => {
        setIsTyping(false);
      },
      (err) => {
        setIsTyping(false);
        setConversations(prev =>
          prev.map(c => {
            if (c.id === currentActiveId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId ? { ...m, error: err.message } : m
                )
              };
            }
            return c;
          })
        );
      },
      simulateError
    );
  };

  const handleSendMessage = (text) => {
    let currentActiveId = activeId;
    let currentConversations = [...conversations];

    // Auto-create conversation if none is active
    if (!currentActiveId) {
      currentActiveId = `chat_${Date.now()}`;
      const newChat = {
        id: currentActiveId,
        title: text.length > 25 ? text.substring(0, 25) + '...' : text,
        personaId: personaId,
        messages: [],
        createdAt: Date.now()
      };
      currentConversations = [newChat, ...currentConversations];
      setConversations(currentConversations);
      setActiveId(currentActiveId);
    }

    // 1. Add User Message
    const userMsg = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    // Update conversation state with user message
    const updatedConversations = currentConversations.map(c => {
      if (c.id === currentActiveId) {
        // Update title if it was the first message
        const title = c.messages.length === 0 
          ? (text.length > 25 ? text.substring(0, 25) + '...' : text)
          : c.title;

        return {
          ...c,
          title,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setIsTyping(true);

    // 2. Prepare Assistant Message container
    const assistantMsgId = `msg_${Date.now()}_assistant`;
    const assistantMsgPlaceholder = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '',
      timestamp: Date.now()
    };

    // Append empty assistant message for streaming
    setConversations(prev =>
      prev.map(c =>
        c.id === currentActiveId
          ? { ...c, messages: [...c.messages, assistantMsgPlaceholder] }
          : c
      )
    );

    // 3. Trigger Mock Streaming Response
    cancelStreamRef.current = streamAiResponse(
      personaId,
      text,
      // Chunk Callback (updates text in real-time)
      (chunkText) => {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === currentActiveId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId ? { ...m, text: chunkText } : m
                )
              };
            }
            return c;
          })
        );
      },
      // Completion Callback
      () => {
        setIsTyping(false);
      },
      // Error Callback
      (err) => {
        setIsTyping(false);
        setConversations(prev =>
          prev.map(c => {
            if (c.id === currentActiveId) {
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId ? { ...m, error: err.message } : m
                )
              };
            }
            return c;
          })
        );
      },
      simulateError
    );
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
      {/* Background decoration */}
      <div className="background-glows">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>

      {/* Sidebar history panel */}
      <Sidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        conversations={conversations}
        activeId={activeId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectConversation={setActiveId}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main chat interface */}
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
        onNewChat={handleNewConversation}
      />
    </div>
  );
}
