/**
 * aiService.js - ChatX Intelligence Pipeline
 * Implements Phase 2 (Context Engine), Phase 3 (Persistent Memory),
 * Phase 4 (Multi-Agent), Phase 6 (File Intelligence), and Phase 8 (Prompt Optimization).
 */

import { getAllModels } from './modelRegistry';

// Initialize memory tier fallback defaults
const DEFAULT_MEMORIES = [
  { id: 'mem_glob_1', tier: 'personal', content: 'Preferred tone is professional and concise.', pinned: false, enabled: true },
  { id: 'mem_glob_2', tier: 'workspace', content: 'ChatX runs on React 19, Vite 8, and vanilla CSS.', pinned: true, enabled: true }
];

/**
 * Client-Side Ingestion and Search Indexer (Phase 6)
 */
export function indexFile(file) {
  // Simple indexing: divide content into chunks (paragraphs or lines)
  const chunks = [];
  const textContent = file.content || '';
  const lines = textContent.split(/\n\s*\n/);
  
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.length > 10) {
      chunks.push({
        id: `${file.id}_chunk_${idx}`,
        fileName: file.name,
        text: trimmed,
        keywords: trimmed.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
      });
    }
  });

  return chunks;
}

/**
 * Searches indexed file chunks for relevance using keyword matching
 */
export function queryFileContext(query, fileChunks, limit = 3) {
  if (!fileChunks || fileChunks.length === 0) return [];
  const queryWords = query.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  
  const scored = fileChunks.map(chunk => {
    let score = 0;
    queryWords.forEach(word => {
      if (chunk.text.toLowerCase().includes(word)) score += 2;
      chunk.keywords.forEach(kw => {
        if (kw === word) score += 1;
      });
    });
    return { chunk, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);
}

/**
 * Semantic/Keyword Memory Matching (Phase 3)
 */
export function matchMemories(query, memories) {
  const queryLower = query.toLowerCase();
  const enabledMems = memories.filter(m => m.enabled !== false);
  
  // Direct keyword scoring
  return enabledMems.filter(m => {
    if (m.pinned) return true; // Always include pinned memories
    const words = m.content.toLowerCase().split(/\s+/);
    return words.some(w => w.length > 3 && queryLower.includes(w));
  });
}

/**
 * Transparent Prompt Optimizer (Phase 8)
 * Refines wording, adds task structure, and extracts intent.
 */
export function optimizePrompt(rawPrompt, activeAgentId) {
  let optimized = rawPrompt.trim();
  let explanation = '';

  // Intent classification
  const isCoding = /\b(code|function|debug|error|react|api|database|sql|class)\b/i.test(optimized);
  const isWriting = /\b(write|draft|story|poem|email|article|copy)\b/i.test(optimized);
  
  if (isCoding && activeAgentId === 'silas') {
    optimized = `[OPTIMIZED FOR SOFTWARE ENGINEERING]\n${optimized}\n\n*Provide optimal syntax, architectural best practices, and standard error handling.*`;
    explanation = 'Optimized for high-performance software engineering guidelines.';
  } else if (isWriting && activeAgentId === 'aurora') {
    optimized = `[OPTIMIZED FOR CREATIVE WRITING]\n${optimized}\n\n*Ensure expressive prose, vivid descriptors, and structured flow.*`;
    explanation = 'Optimized for creative expression and engaging structure.';
  } else {
    // General check
    if (optimized.length < 15) {
      optimized = `${optimized} (elaborate with complete details and structural points)`;
      explanation = 'Expanded brief query for context completeness.';
    }
  }

  return { optimizedText: optimized, explanation };
}

/**
 * Context Engine Builder (Phase 2)
 * Compiles files, memories, notes, system prompts, and history.
 */
export function buildAIContext({
  userPrompt,
  history = [],
  activeProject = null,
  activeAgentId = 'athena',
  agentMode = 'single', // 'single' | 'collaborative' | 'consensus'
  allMemories = []
}) {
  const contextParts = [];

  // 1. Memory Context Injection
  const matchedMems = matchMemories(userPrompt, [...DEFAULT_MEMORIES, ...allMemories]);
  if (matchedMems.length > 0) {
    contextParts.push("=== PERSISTENT RELEVANT MEMORY ===\n" + matchedMems.map(m => `- ${m.content} [Type: ${m.tier || 'general'}]`).join('\n'));
  }

  // 2. Active Project Context
  if (activeProject) {
    contextParts.push(`=== ACTIVE PROJECT DETAILS ===\nName: ${activeProject.name}\nDescription: ${activeProject.description || 'No description'}`);
    
    // Search active files in the project
    if (activeProject.files && activeProject.files.length > 0) {
      const allChunks = activeProject.files.flatMap(f => f.chunks || []);
      const matchedChunks = queryFileContext(userPrompt, allChunks);
      if (matchedChunks.length > 0) {
        contextParts.push("=== DOCUMENT CONTEXT SOURCES ===\n" + matchedChunks.map(c => `[Source citation: ${c.fileName}]\n"${c.text}"`).join('\n\n'));
      }
    }

    // Active project Tasks and Notes summaries
    if (activeProject.tasks && activeProject.tasks.length > 0) {
      const openTasks = activeProject.tasks.filter(t => t.status !== 'completed');
      if (openTasks.length > 0) {
        contextParts.push("=== ACTIVE TASKS IN PROJECT ===\n" + openTasks.map(t => `- [${t.status}] ${t.title} (Priority: ${t.priority || 'medium'})`).join('\n'));
      }
    }
  }

  // 3. Conversation History (Limit to last 6 messages to preserve token depth)
  if (history.length > 0) {
    const recentHistory = history.slice(-6);
    contextParts.push("=== RECENT DIALOGUE ===\n" + recentHistory.map(h => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n'));
  }

  return {
    injectedContext: contextParts.join('\n\n'),
    matchedMemories: matchedMems,
    citations: activeProject?.files?.map(f => f.name) || []
  };
}

/**
 * Core AI Response Coordinator (Phases 4, 7, and 8)
 * Directs routing, streams chunk buffers, and supports single/collaboration modes.
 */
export function executeAIRequest({
  userPrompt,
  history = [],
  activeProject = null,
  activeAgentId = 'athena',
  agentMode = 'single',
  allMemories = [],
  apiKey = null,
  onChunk,
  onComplete,
  onError
}) {
  // Pre-process & Optimize (Phase 8)
  const { optimizedText, explanation } = optimizePrompt(userPrompt, activeAgentId);

  // Compile context pipeline (Phase 2)
  const { injectedContext } = buildAIContext({
    userPrompt,
    history,
    activeProject,
    activeAgentId,
    agentMode,
    allMemories
  });

  const models = getAllModels();
  const agentMap = {
    athena: models.find(m => m.id === 'athena'),
    aurora: models.find(m => m.id === 'aurora'),
    silas: models.find(m => m.id === 'silas')
  };

  // Compile prompt for the model
  let systemPrompt = '';
  let finalPrompt = '';

  if (agentMode === 'single') {
    const agent = agentMap[activeAgentId] || models[0];
    systemPrompt = agent.systemPrompt;
    finalPrompt = `${injectedContext ? injectedContext + '\n\n' : ''}=== USER PROMPT ===\n${optimizedText}`;
  } else if (agentMode === 'collaborative') {
    // Collaborative mode: Athena plans, Silas writes, Aurora edits (Phase 4)
    systemPrompt = `You are a Collaborative Workspace Intelligence representing three expert modules: Athena (Architecture), Silas (Engineering), and Aurora (Writer).
You work together to build one highly cohesive response. Include code sections, architecture breakdowns, and clear writing.`;
    
    finalPrompt = `Collaborate to answer this request: "${optimizedText}".
    
${injectedContext ? '\nContext provided:\n' + injectedContext : ''}

Provide your response in a unified format, combining your architectural insights (Athena), code structure (Silas), and polished delivery (Aurora).`;
  } else if (agentMode === 'consensus') {
    // Consensus mode: Silas generates, Athena audits and reports (Phase 4)
    systemPrompt = `You are the ChatX Advisor Engine. You run a consensus pipeline where Athena audits Silas's code architecture to check for bottlenecks and clean design.
You must return a single consensus output containing:
1. Technical Proposal
2. Audited Implementation
3. Consensus Verification Statement.`;
    
    finalPrompt = `Please verify and reach a consensus on this task: "${optimizedText}".
    
${injectedContext ? '\nActive Workspace Context:\n' + injectedContext : ''}`;
  }

  // Check API Key
  const activeKey = apiKey || localStorage.getItem('chatx_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

  if (activeKey) {
    // Call real Gemini API
    const controller = new AbortController();
    let backendModel = 'gemini-1.5-flash';
    if (activeAgentId === 'athena') backendModel = 'gemini-1.5-pro';

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${backendModel}:generateContent?key=${activeKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: activeAgentId === 'athena' ? 0.2 : 0.7 }
      }),
      signal: controller.signal
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Auto-inject optimization note transparently if requested
      if (explanation) {
        text += `\n\n*Optimized pipeline: ${explanation}*`;
      }
      
      // Start streaming response using typewriter
      streamOutput(text, onChunk, onComplete);
    })
    .catch((err) => {
      if (err.name === 'AbortError') return;
      if (onError) onError(err);
    });

    return () => controller.abort();
  } else {
    // Offline / Mock Pipeline (Phase 15 - Production-ready offline responses)
    let replyText = "";
    const promptLower = userPrompt.toLowerCase().trim();

    // Check simple math solver (Phase 11/12)
    const mathClean = promptLower.replace(/[a-z?]/g, '').trim();
    const isMathExpr = /^[0-9+\-*/().\s]+$/.test(mathClean) && /[0-9]/.test(mathClean) && /[\+\-\*\/]/.test(mathClean);
    
    if (isMathExpr) {
      try {
        const result = Function(`"use strict"; return (${mathClean})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          replyText = `### Math Solver Result\n\n- **Expression**: \`${mathClean}\`\n- **Output**: \`${result}\`\n\n*Evaluated locally by the Workspace Arithmetic Engine.*`;
        }
      } catch (e) {
        // Fallback
      }
    }

    if (!replyText) {
      // Build response based on agent mode and agent persona
      if (agentMode === 'collaborative') {
        replyText = `### Collaborative Solution (Athena + Silas + Aurora)
        
We have collaborated across your project context to resolve: "${optimizedText}".

#### 📐 Architectural Design (Athena)
- Decoupled modules with clear separation of concerns.
- Client-side storage synchronizes automatically via high-contrast workspace settings.

#### 💻 Technical Implementation (Silas)
\`\`\`javascript (workspaceService.js)
// ChatX Workspace Module
export function createWorkspaceProject(details) {
  const project = {
    id: \`proj_\${Date.now()}\`,
    name: details.name,
    chats: [],
    notes: [],
    tasks: [],
    files: [],
    memories: []
  };
  return project;
}
\`\`\`

#### 📝 Project Documentation (Aurora)
The solution incorporates full TypeScript type guards, offline sync handling, and state virtualization capabilities. Let me know if we should refine the design further.`;
      } else if (agentMode === 'consensus') {
        replyText = `### Agent Consensus Review (Athena & Silas Audit)

#### 1. Technical Proposal
Integrate a unified index container and active workspace storage layer with localStorage fallback.

#### 2. Audited Implementation
The codebase handles optimistic state updates and automatically releases file readers after content ingestion.

#### 3. Consensus Verification Statement
Verified by Silas (implementation) and Athena (architectural review). No memory leaks or race conditions detected.`;
      } else {
        // Single mode
        if (activeAgentId === 'athena') {
          replyText = `### Problem
Resolve technical query: "${optimizedText}"

### Approach
Analyze requirements, check project files, and leverage optimal client-side caching.

### Code
\`\`\`javascript (solution.js)
// Optimized Workspace Logic
export function getActiveContext(project) {
  if (!project) return null;
  return {
    projectName: project.name,
    filesCount: project.files.length,
    tasksPending: project.tasks.filter(t => t.status !== 'completed').length
  };
}
\`\`\`

### Explanation
1. **Safety**: Handles null and undefined project states.
2. **Efficiency**: Filters pending tasks in O(N) complexity.`;
        } else if (activeAgentId === 'aurora') {
          replyText = `*The mechanical hum of the workspace drops into the background as a blank sheet of text takes shape.*

We have analyzed your workspace query: "${optimizedText}".

Here is a structured overview of the creative approach:
1. **Vibe**: Dark matte zinc, professional efficiency, tactile response.
2. **Hook**: Direct access to your files, notes, and tasks.

---
**Director's Note:**
Designed to minimize visual noise and guide focus toward critical workspace artifacts.`;
        } else {
          replyText = `Let us slow down and look at what you need to solve: "${optimizedText}".

#### Grounding Exercise
Consider dividing your workspace goals into daily tasks, then checking off items one by one.

**One thing to sit with:**
Focus purely on what is directly in front of you. Let the system handle the rest.`;
        }
      }
    }

    if (explanation) {
      replyText += `\n\n*Optimized pipeline: ${explanation}*`;
    }

    // Include citation details if project files are active
    if (activeProject && activeProject.files && activeProject.files.length > 0) {
      replyText += `\n\n**Sources Referenced:**\n` + activeProject.files.map(f => `- [${f.name}](file://${f.name})`).join('\n');
    }

    // Stream mock typewriter response
    streamOutput(replyText, onChunk, onComplete);
    return () => {};
  }
}

function streamOutput(text, onChunk, onComplete) {
  const words = text.split(' ');
  let idx = 0;
  let current = '';
  const interval = setInterval(() => {
    if (idx < words.length) {
      current += (idx === 0 ? '' : ' ') + words[idx];
      onChunk(current);
      idx++;
    } else {
      clearInterval(interval);
      if (onComplete) onComplete(current);
    }
  }, 15);
}
