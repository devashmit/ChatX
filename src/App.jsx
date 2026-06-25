import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { streamAiResponse } from './services/mockAi';

export default function App() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('aurachat_conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeId, setActiveId] = useState(() => {
    const saved = localStorage.getItem('aurachat_active_id');
    return saved || null;
  });

  const [personaId, setPersonaId] = useState('athena');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const cancelStreamRef = useRef(null);

  // Sync conversations to localStorage
  useEffect(() => {
    localStorage.setItem('aurachat_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Sync activeId to localStorage
  useEffect(() => {
    if (activeId) {
      localStorage.setItem('aurachat_active_id', activeId);
      // Sync persona of current conversation
      const current = conversations.find(c => c.id === activeId);
      if (current) {
        setPersonaId(current.personaId);
      }
    } else {
      localStorage.removeItem('aurachat_active_id');
    }
  }, [activeId, conversations]);

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (cancelStreamRef.current) cancelStreamRef.current();
    };
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId);
  const activeMessages = activeConversation ? activeConversation.messages : [];

  // Update current active conversation's persona
  const handleSelectPersona = (id) => {
    setPersonaId(id);
    if (activeId) {
      setConversations(prev =>
        prev.map(c => (c.id === activeId ? { ...c, personaId: id } : c))
      );
    }
  };

  const handleNewConversation = () => {
    const newId = `chat_${Date.now()}`;
    const newChat = {
      id: newId,
      title: 'New Conversation',
      personaId: personaId,
      messages: [],
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
      }
    );
  };

  return (
    <div className="app-container">
      {/* Background decoration */}
      <div className="background-glows">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>

      {/* Sidebar history panel */}
      <Sidebar
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
      />
    </div>
  );
}
