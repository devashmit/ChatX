export const PERSONAS = [
  {
    id: 'athena',
    name: 'Athena',
    role: 'Software Architect',
    bio: 'Pragmatic, logical, and precise code expert. Provides clean code examples and structured explanations.',
    avatar: 'A',
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
    suggestions: [
      'Write a clean React hook for fetching data.',
      'Explain JavaScript closure with a practical example.',
      'How do I optimize database queries for speed?'
    ]
  },
  {
    id: 'aurora',
    name: 'Aurora',
    role: 'Creative Writer',
    bio: 'Inspiring, imaginative, and expressive muse. Focuses on storytelling, brainstorming, and artistic ideas.',
    avatar: 'A',
    gradient: 'linear-gradient(135deg, #ec4899, #f97316)',
    suggestions: [
      'Write a short story about a time traveler who gets stuck in 1999.',
      'Brainstorm 5 unique names for a sci-fi coffee shop.',
      'Compose a poem about the beauty of absolute silence.'
    ]
  },
  {
    id: 'silas',
    name: 'Silas',
    role: 'Calm Mentor',
    bio: 'Wise, patient, and grounding guide. Specializes in structured advice, mindfulness, and philosophical clarity.',
    avatar: 'S',
    gradient: 'linear-gradient(135deg, #14b8a6, #10b981)',
    suggestions: [
      'How do I deal with burnout as a developer?',
      'Suggest a 5-minute mindfulness breathing exercise.',
      'What are some core habits of highly resilient people?'
    ]
  }
];

const RESPONSES = {
  athena: {
    greetings: [
      "Hello! Athena here. Ready to debug, design, or discuss system architecture. What are we building today?",
      "Greetings. Let's analyze your code or outline a technical solution. How can I assist you?"
    ],
    default: [
      "Here is a clean implementation that addresses your request.\n\n### Code Snippet\n```javascript\n// Optimized solution\nfunction handleAsyncOperation(data) {\n  if (!data) throw new Error('Data is required');\n  \n  return new Promise((resolve) => {\n    setTimeout(() => {\n      resolve({\n        status: 'success',\n        timestamp: Date.now(),\n        payload: { ...data, processed: true }\n      });\n    }, 800);\n  });\n}\n```\n\n### Explanation\n1. **Validation**: We fail-fast if data is missing.\n2. **Asynchrony**: Wrapping the operation in a Promise ensures clean async/await utilization.\n3. **Immutability**: Spreading the original data keeps the structure pure.",
      "To optimize this, I recommend leveraging a caching strategy (like memoization or Redis key-value storage depending on scope). This minimizes computation overhead and reduces response times.\n\n```javascript\nconst cache = new Map();\n\nfunction getCachedData(key) {\n  if (cache.has(key)) {\n    return cache.get(key); // O(1) retrieval\n  }\n  const value = computeExpensiveValue(key);\n  cache.set(key, value);\n  return value;\n}\n```"
    ],
    codeKeywords: ['code', 'hook', 'react', 'javascript', 'css', 'html', 'database', 'sql', 'api', 'function', 'class', 'bug', 'error', 'debug']
  },
  aurora: {
    greetings: [
      "Ah, a new spark of curiosity! I am Aurora. Let's paint with words, chase dreams, and create something beautiful together.",
      "Hello, traveler. The canvas is blank, and the night is young. What story or idea shall we breathe life into today?"
    ],
    default: [
      "The rain tapped against the windowpane, a rhythmic applause for the quiet hours of the night. In the corner of the room, a vintage clock ticked—not just measuring seconds, but counting down the moments until the traveler realized they were not alone in the studio. \n\n*\"Where to next?\"* a voice echoed softly from the shelf. It was the journal, bound in leather, pages glowing with a soft, amber light.\n\nEvery journey starts with a simple word. Let your imagination run wild.",
      "Here are three directions we could take for your creative project:\n\n1. **The Neon Oasis**: A cyberpunk setting where nature has reclaimed high-tech ruins, creating bioluminescent forests inside abandoned skyscrapers.\n2. **The Whisperer's Codex**: A fantasy concept where magic is not cast via spells, but spoken through secrets shared between ancient trees.\n3. **Echoes of Tomorrow**: A speculative tale exploring a world where memories can be preserved as physical glass marbles, bought and sold in marketplaces."
    ],
    creativeKeywords: ['story', 'write', 'poem', 'idea', 'creative', 'name', 'brainstorm', 'fiction', 'novel', 'characters', 'art', 'music']
  },
  silas: {
    greetings: [
      "Welcome. Find a comfortable posture, take a deep breath, and let the noise settle. I'm Silas. How is your mind feeling today?",
      "Hello. I am here to help you slow down, unpack your thoughts, and find clarity. Let's walk through whatever is on your mind."
    ],
    default: [
      "When we feel overwhelmed, it is helpful to return to the breath. Try this brief grounding exercise:\n\n1. **Stop**: Pause whatever you are doing right now.\n2. **Breathe**: Inhale deeply for 4 seconds, hold for 4, and exhale slowly for 6.\n3. **Observe**: Notice the physical weight of your body sitting on the chair. Notice the temperature of the air.\n4. **Proceed**: Continue your day with a slightly slower pace.\n\nProgress is rarely a straight line. Give yourself permission to rest.",
      "Resilience isn't about never feeling stress; it is about how we cultivate space around that stress. \n\nConsider categorizing your challenges into:\n- **Things you control**: Your focus, your breaks, your boundaries.\n- **Things you influence**: The reactions of team members, project deadlines.\n- **Things out of your control**: System outages, past decisions.\n\nFocus 90% of your energy strictly on the first category. The rest will settle."
    ],
    mindfulnessKeywords: ['burnout', 'stress', 'mindful', 'mentor', 'meditate', 'calm', 'rest', 'resilience', 'life', 'habit', 'feel', 'sad', 'angry', 'happy']
  }
};

/**
 * Simulates streaming AI response chunk-by-chunk.
 */
export function streamAiResponse(personaId, userPrompt, onChunk, onComplete) {
  const pData = RESPONSES[personaId] || RESPONSES.silas;
  const promptLower = userPrompt.toLowerCase();
  
  let responseText = "";
  
  // Basic Keyword Routing
  if (promptLower.includes('hello') || promptLower.includes('hi ') || promptLower.includes('hey')) {
    responseText = pData.greetings[Math.floor(Math.random() * pData.greetings.length)];
  } else {
    // Check keyword lists
    if (personaId === 'athena') {
      const match = RESPONSES.athena.codeKeywords.some(kw => promptLower.includes(kw));
      responseText = match ? RESPONSES.athena.default[0] : RESPONSES.athena.default[1];
    } else if (personaId === 'aurora') {
      const match = RESPONSES.aurora.creativeKeywords.some(kw => promptLower.includes(kw));
      responseText = match ? RESPONSES.aurora.default[0] : RESPONSES.aurora.default[1];
    } else {
      const match = RESPONSES.silas.mindfulnessKeywords.some(kw => promptLower.includes(kw));
      responseText = match ? RESPONSES.silas.default[0] : RESPONSES.silas.default[1];
    }
  }

  // Fallback for custom persona questions
  if (promptLower.includes('who are you') || promptLower.includes('your name') || promptLower.includes('role')) {
    const persona = PERSONAS.find(p => p.id === personaId);
    responseText = `I am ${persona.name}, your ${persona.role}. ${persona.bio}`;
  }

  // Simulate typing by splitting text into words and feeding them gradually
  const words = responseText.split(' ');
  let currentIndex = 0;
  let currentResponse = '';

  const intervalId = setInterval(() => {
    if (currentIndex < words.length) {
      currentResponse += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
      onChunk(currentResponse);
      currentIndex++;
    } else {
      clearInterval(intervalId);
      if (onComplete) onComplete(currentResponse);
    }
  }, 45); // Typing speed: 45ms per word

  return () => clearInterval(intervalId); // Return cancel function
}
