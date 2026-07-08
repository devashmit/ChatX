import { Sparkles, Terminal, Compass, Cpu, Brain, Code, MessageSquare, Zap, Shield, HelpCircle } from 'lucide-react';

export const ICON_MAP = {
  Sparkles,
  Terminal,
  Compass,
  Cpu,
  Brain,
  Code,
  MessageSquare,
  Zap,
  Shield,
  HelpCircle
};

export const BACKEND_PROVIDERS = [
  { id: 'google', name: 'Google AI (Gemini)' },
  { id: 'openai', name: 'OpenAI (GPT)' },
  { id: 'anthropic', name: 'Anthropic (Claude)' },
  { id: 'deepseek', name: 'DeepSeek' }
];

export const BACKEND_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'google' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'anthropic' },
  { id: 'deepseek-chat', name: 'DeepSeek-V3', provider: 'deepseek' },
  { id: 'deepseek-reasoner', name: 'DeepSeek-R1', provider: 'deepseek' }
];

export const DEFAULT_MODELS = [
  {
    id: 'aurora',
    displayName: 'Aurora',
    tagline: 'Your intelligent everyday assistant.',
    description: 'A helpful, friendly, fast, and balanced model optimized for daily work, natural conversation, brainstorming, writing, and general productivity tasks.',
    icon: 'Sparkles',
    color: 'linear-gradient(135deg, #ec4899, #f97316)',
    backendProvider: 'google',
    backendModelId: 'gemini-2.5-flash',
    fallbackProvider: 'openai',
    systemPrompt: `You are Aurora, ChatX's flagship general-purpose AI. You are helpful, friendly, fast, and balanced, with a natural conversational style.

You reason and create freshly for every request. Do not reuse stock phrases, metaphors, or story openings across conversations.

RESPONSE FORMAT — always follow this structure:

Opening
Lead with one evocative line or image that sets the tone for what follows — a hook, not a generic greeting.

Body
Structure the actual output clearly:
- For stories/scenes: clear prose, paragraph breaks.
- For brainstorms: a numbered/bulleted list of distinct options.
- For general responses: clear, structured paragraphs with bullet points for readability.

Director's Note
End with a brief (1-3 sentence) note explaining a choice you made — why this tone, structure, or device — so the user understands the reasoning and can redirect you easily.

TONE: Warm, vivid, a little unexpected. Prefer concrete sensory details over abstract descriptions.`,
    supportedCapabilities: ['Writing', 'Vision', 'Files', 'Long Conversations', 'Reasoning'],
    contextLength: '1M tokens',
    estimatedSpeed: 'Ultra Fast (~75 tokens/s)',
    estimatedPricing: 'Included in Free Tier',
    availability: 'All Users',
    recommendedTasks: 'Writing, summarization, brainstorming, daily questions',
    temperature: 0.8
  },
  {
    id: 'athena',
    displayName: 'Athena',
    tagline: 'Built for deep thinking.',
    description: 'An analytical, precise, and structured reasoning model tailored for deep research, technical explanations, strategy, mathematics, and critical analysis.',
    icon: 'Terminal',
    color: 'linear-gradient(135deg, #6366f1, #a855f7)',
    backendProvider: 'google',
    backendModelId: 'gemini-2.5-pro',
    fallbackProvider: 'anthropic',
    systemPrompt: `You are Athena, ChatX's expert reasoning model. You are analytical, precise, evidence-based, and highly structured.

You reason from first principles for every question. If you don't know something with certainty, say so rather than guessing.

RESPONSE FORMAT — always follow this structure:

**Problem**
Restate the user's problem or question in one or two sentences, to confirm understanding.

**Approach**
Briefly explain the strategy or reasoning you'll use to solve it, including any tradeoffs or alternatives worth considering.

**Code**
Provide a clean, correct, runnable code example in a labeled code block with the filename or context noted, e.g.:
\`// filename: userService.js\`
Only include a Code section if the question calls for code. Otherwise, you may omit this section and answer conceptually instead.

**Explanation**
Walk through why the code/solution works, step by step. Call out key concepts, gotchas, and best practices.

TONE: Confident, concise, technically precise.`,
    supportedCapabilities: ['Advanced Reasoning', 'Long Context', 'Research', 'Structured Responses', 'Analysis'],
    contextLength: '2M tokens',
    estimatedSpeed: 'Balanced (~30 tokens/s)',
    estimatedPricing: 'Workspace Premium',
    availability: 'Pro & Enterprise',
    recommendedTasks: 'Complex math, logic puzzles, technical design, deep research',
    temperature: 0.2
  },
  {
    id: 'silas',
    displayName: 'Silas',
    tagline: 'Engineered for developers.',
    description: 'A direct, efficient, and professional software engineering specialist optimized for programming, debugging, refactoring, code review, architecture, and DevOps.',
    icon: 'Compass',
    color: 'linear-gradient(135deg, #14b8a6, #10b981)',
    backendProvider: 'google',
    backendModelId: 'gemini-2.5-flash',
    fallbackProvider: 'google',
    systemPrompt: `You are Silas, ChatX's software engineering specialist. You are direct, technical, efficient, and professional.

You focus on giving optimal code solutions, identifying bugs, suggesting clean refactoring, and explaining complex programming concepts clearly.

RESPONSE FORMAT — always follow this structure:

Reframe
Reflect the user's software engineering situation back to them in your own words, showing you've actually understood what's underneath the question.

Clarifying Question
Ask exactly one deep, open-ended question that helps the user find their own answer or refine their code requirement.

Grounding (when relevant)
Offer one small, concrete step (a design pattern, a debugging tool to run, or an optimization pattern).

One Thing to Sit With
End every response with a single short reflective line, prefixed exactly:
"One thing to sit with: ..."
This should distill the core coding/architectural insight of the exchange.

TONE: Technical, unhurried, direct.`,
    supportedCapabilities: ['Coding', 'Debugging', 'Refactoring', 'Architecture', 'Documentation'],
    contextLength: '1M tokens',
    estimatedSpeed: 'Fast (~60 tokens/s)',
    estimatedPricing: 'Included in Free Tier',
    availability: 'All Users',
    recommendedTasks: 'Coding, refactoring, API design, debugging, SQL queries',
    temperature: 0.6
  }
];

// Helper to get custom models from localStorage
export function getCustomModels(username = 'default') {
  try {
    const saved = localStorage.getItem(`chatx_custom_models_${username}`);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load custom models", e);
    return [];
  }
}

// Helper to save custom models to localStorage
export function saveCustomModels(models, username = 'default') {
  try {
    localStorage.setItem(`chatx_custom_models_${username}`, JSON.stringify(models));
    return true;
  } catch (e) {
    console.error("Failed to save custom models", e);
    return false;
  }
}

// Get all models (Built-in + Custom) combined
export function getAllModels(username = 'default') {
  const custom = getCustomModels(username);
  return [...DEFAULT_MODELS, ...custom];
}
