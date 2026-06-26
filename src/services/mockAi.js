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

const IT_DATABASE = {
  closure: {
    title: "JavaScript Closures",
    desc: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned.",
    code: `function createCounter() {
  let count = 0; // Lexical state
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2`,
    points: [
      "**Lexical Scoping**: Inner functions maintain references to variables in parent scopes.",
      "**State Encapsulation**: Useful for creating private variables that cannot be modified directly from the outside.",
      "**Memory Management**: Since variables remain in memory as long as the closure exists, be mindful of potential memory leaks."
    ]
  },
  recursion: {
    title: "Recursion in Programming",
    desc: "Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller sub-problems.",
    code: `// Classic Fibonacci recursion with memoization
function fibonacci(n, memo = {}) {
  if (n <= 1) return n; // Base case
  if (memo[n]) return memo[n]; // Return cached value
  
  // Recursive case
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(10)); // 55`,
    points: [
      "**Base Case**: The stopping condition that prevents infinite recursion and stack overflow errors.",
      "**Recursive Step**: The part where the function calls itself with a modified (usually smaller) argument.",
      "**Call Stack**: Each recursive call adds a frame to the call stack. Deep recursion can trigger 'Maximum call stack size exceeded'."
    ]
  },
  hook: {
    title: "Custom React Hook for Data Fetching",
    desc: "Custom hooks let you share stateful logic between components without duplicating code. Here is a robust hook that handles loading states, data retrieval, and error catching.",
    code: `import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response error');
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; }; // Cleanup on unmount
  }, [url]);

  return { data, loading, error };
}`,
    points: [
      "**State Separation**: Keeps fetch, loading, and error states encapsulated.",
      "**Race Condition Guard**: The `isMounted` flag prevents updating state on unmounted components.",
      "**Dependency Array**: Re-runs the effect whenever the URL changes."
    ]
  },
  react_native: {
    title: "React Native",
    desc: "React Native is an open-source framework created by Meta that allows developers to build native mobile applications for iOS and Android using React and JavaScript. Unlike mobile web wrappers, React Native renders actual native UI components, delivering native performance and feel.",
    code: `import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to React Native!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090b' },
  text: { color: '#f4f4f5', fontSize: 18 }
});`,
    points: [
      "**Native Bridge**: Translates JavaScript code into native platform API calls and UI widgets.",
      "**Cross-Platform**: Write once, run on both iOS and Android with minor platform-specific adjustments.",
      "**Fast Refresh**: See code updates instantly without full compilation cycles."
    ]
  },
  react: {
    title: "React Component Lifecycle & Hooks",
    desc: "React uses functional components with Hooks to manage state, side-effects, and DOM rendering efficiently.",
    code: `import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
    points: [
      "**Virtual DOM**: React keeps a lightweight representation of the UI in memory to sync with the real DOM via reconciliation.",
      "**State vs Props**: State is private and fully controlled by the component, whereas props are read-only variables passed from parents.",
      "**Functional Rendering**: Components re-render whenever their state or props change."
    ]
  },
  typescript: {
    title: "TypeScript",
    desc: "TypeScript is a strongly typed, open-source programming language developed by Microsoft that builds on JavaScript by adding static type definitions.",
    code: `interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! (ID: \${user.id})\`;
}

const user: User = { id: 1, name: "Alice" };
console.log(greetUser(user));`,
    points: [
      "**Static Typing**: Catches type mismatches and syntax errors during compile time rather than runtime.",
      "**JavaScript Superset**: Any valid JavaScript code is also valid TypeScript code.",
      "**Rich Tooling**: Provides excellent autocomplete, inline documentation, and refactoring support in modern IDEs."
    ]
  },
  oop: {
    title: "Object-Oriented Programming (OOP)",
    desc: "Object-Oriented Programming is a programming paradigm based on the concept of 'objects', which can contain data (in the form of fields or attributes) and code (in the form of methods).",
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a sound.\`;
  }
}

class Dog extends Animal {
  speak() {
    return \`\${this.name} barks.\`;
  }
}

const myDog = new Dog("Buddy");
console.log(myDog.speak()); // Buddy barks.`,
    points: [
      "**Encapsulation**: Bundling state and behaviors together inside objects, hiding inner implementation details.",
      "**Inheritance**: The mechanism of creating new classes based on existing ones to reuse code.",
      "**Polymorphism**: The ability for different classes to implement the same method in unique ways (method overriding)."
    ]
  },
  functional_programming: {
    title: "Functional Programming (FP)",
    desc: "Functional Programming is a paradigm where programs are constructed by applying and composing pure functions, avoiding shared state, mutable data, and side effects.",
    code: `const numbers = [1, 2, 3, 4, 5];

// Pure functions used for transformation
const double = (x) => x * 2;
const isEven = (x) => x % 2 === 0;

const doubledEvens = numbers
  .filter(isEven)
  .map(double);

console.log(doubledEvens); // [4, 8]`,
    points: [
      "**Pure Functions**: Functions that always return the same output for a given input and cause no side effects.",
      "**Immutability**: Once created, data states cannot be modified. Instead, new data structures are generated.",
      "**First-Class Functions**: Functions are treated as values, meaning they can be passed as arguments or returned from other functions."
    ]
  },
  nodejs: {
    title: "Node.js JavaScript Runtime",
    desc: "Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine that executes JavaScript code outside a web browser.",
    code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "Hello from Node.js server!" }));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});`,
    points: [
      "**Event-Driven**: Relies on an asynchronous event loop to handle thousands of concurrent operations on a single thread.",
      "**NPM Ecosystem**: Grants access to the largest software registry in the world for reusable packages.",
      "**Full-Stack JavaScript**: Enables developers to write both client-side and server-side code using a single programming language."
    ]
  },
  database: {
    title: "Database Optimization & Indexes",
    desc: "Optimizing database queries is essential for application performance. Indexes speed up data retrieval at the cost of additional write overhead and storage space.",
    code: `-- Creating an index for faster search on email queries
CREATE INDEX idx_users_email ON users(email);

-- Query using index
SELECT id, username, email 
FROM users 
WHERE email = 'developer@chatx.ai';`,
    points: [
      "**B-Tree Indexes**: Default indexes useful for equality and range queries (e.g. `<`, `>`, `=`).",
      "**Write Overhead**: Every insert, update, or delete query requires updating the index, which can slow down write operations.",
      "**Execution Plan**: Use `EXPLAIN` or `EXPLAIN ANALYZE` to check if your queries are scanning tables or utilizing indexes properly."
    ]
  },
  nosql: {
    title: "NoSQL Databases",
    desc: "NoSQL databases provide a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in relational databases.",
    code: `// MongoDB node driver insert and query example
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

async function run() {
  await client.connect();
  const db = client.db('chatx');
  const users = db.collection('users');
  
  await users.insertOne({ name: "Alice", role: "Developer" });
  const user = await users.findOne({ name: "Alice" });
  console.log(user);
}`,
    points: [
      "**Flexible Schemas**: Supports unstructured data such as key-value, document, column-family, or graph formats.",
      "**Horizontal Scaling**: Designed to scale out across commodity servers rather than scaling up a single server.",
      "**No Joins**: Relies on nested/embedded documents or denormalization instead of complex SQL joins."
    ]
  },
  sql: {
    title: "SQL Joins & Data Retrieval",
    desc: "SQL joins combine rows from two or more tables based on a related column between them.",
    code: `-- Join users and orders to get customer order details
SELECT users.id, users.username, orders.order_date, orders.total_amount
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed'
ORDER BY orders.total_amount DESC;`,
    points: [
      "**Inner Join**: Returns records that have matching values in both tables.",
      "**Left (Outer) Join**: Returns all records from the left table, and matching records from the right table.",
      "**Performance Tip**: Ensure join columns are indexed to optimize speed on large datasets."
    ]
  },
  docker: {
    title: "Docker Containerization",
    desc: "Docker packages an application and its dependencies into a lightweight, portable container that can run consistently across different environments.",
    code: `# Multi-stage Build Dockerfile for Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "run", "start"]`,
    points: [
      "**Image Layers**: Each directive (e.g. `RUN`, `COPY`) creates a cached layer. Place rarely changing layers higher.",
      "**Multi-stage Builds**: Used to separate building tools from runner requirements, keeping final image sizes minimal.",
      "**State Isolation**: Containers should be stateless. Store persistent files using volumes."
    ]
  },
  git: {
    title: "Git Version Control Workflow",
    desc: "Git is a distributed version control system that enables team collaboration, branch management, and release tracking.",
    code: `# Create and switch to a new branch
git checkout -b feature/user-auth

# Stage, commit changes
git add .
git commit -m "feat: implement JWT token authentication"

# Push to origin
git push origin feature/user-auth`,
    points: [
      "**Commit Guidelines**: Write clear, imperative commit messages (e.g. 'feat: add button' instead of 'changed code').",
      "**Rebase vs Merge**: Rebasing rewrites history for a cleaner line, while merging preserves the chronological record.",
      "**Conflicts**: Occur when changes clash on the same lines. Resolve manually, stage, and complete the merge."
    ]
  },
  api: {
    title: "REST APIs & Fetching Data",
    desc: "REST APIs organize endpoints around resources using standard HTTP methods like GET, POST, PUT, and DELETE.",
    code: `// Making a POST request using the Fetch API
async function createPost(title, body) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, userId: 1 })
  });
  
  if (!response.ok) throw new Error('API Error');
  return await response.json();
}

createPost('Hello ChatX', 'Content details here...').then(console.log);`,
    points: [
      "**HTTP Status Codes**: 2xx (Success), 3xx (Redirection), 4xx (Client Error), 5xx (Server Error).",
      "**JSON Format**: The standard payload format for modern REST communication.",
      "**CORS**: Cross-Origin Resource Sharing must be configured on the server to allow frontend client requests."
    ]
  },
  ci_cd: {
    title: "CI/CD & DevOps Pipelines",
    desc: "Continuous Integration (CI) and Continuous Delivery/Deployment (CD) automate building, testing, and deploying code updates to production environments.",
    code: `# Sample GitHub Actions Workflow (.github/workflows/ci.yml)
name: Node CI
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test`,
    points: [
      "**Automation**: Eliminates manual steps in the deployment process, reducing human error.",
      "**Fast Feedback**: Quickly alerts developers if their commits break tests or fail compilation.",
      "**Infrastructure as Code (IaC)**: Configuration files define environment builds alongside code repositories."
    ]
  },
  unit_testing: {
    title: "Unit Testing & QA",
    desc: "Unit testing involves testing individual units or components of software in isolation from the rest of the application to verify correctness.",
    code: `// Simple Jest unit test suite
const add = (a, b) => a + b;

describe('add function', () => {
  test('adds two positive numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  test('handles zero arguments', () => {
    expect(add(5, 0)).toBe(5);
  });
});`,
    points: [
      "**Isolation**: Tests should mock database calls, API endpoints, or filesystem states to run fast and predictably.",
      "**Test-Driven Development (TDD)**: Writing failing unit tests before writing the actual feature code.",
      "**Coverage Metrics**: Measures the percentage of code lines executed during testing."
    ]
  },
  data_structures: {
    title: "Data Structures",
    desc: "A data structure is a specialized format for organizing, processing, retrieving, and storing data in computer memory.",
    code: `// Simple Stack implementation (LIFO) in JavaScript
class Stack {
  constructor() {
    this.items = [];
  }
  push(element) { this.items.push(element); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

const stack = new Stack();
stack.push("App1");
console.log(stack.pop()); // "App1"`,
    points: [
      "**Efficiency**: Choosing the correct structure (e.g. Arrays, HashMaps, Trees, Graphs) affects Big O runtimes.",
      "**LIFO vs FIFO**: Stacks utilize Last-In-First-Out, whereas Queues utilize First-In-First-Out.",
      "**Hash Collisions**: Occur when two distinct keys yield the same index in a HashTable; resolved by chaining or probing."
    ]
  },
  agile: {
    title: "Agile Software Development",
    desc: "Agile is an iterative, team-centric approach to software development emphasizing continuous delivery, incremental updates, and active stakeholder feedback.",
    code: `/* Typical Scrum Agile Lifecycle
1. Product Backlog Refinement
2. Sprint Planning (defining 2-week targets)
3. Daily Standups (updating blocks, tasks)
4. Sprint Review & Retrospective (reflecting on cycles) */`,
    points: [
      "**Sprint Cycles**: Timeboxed intervals (usually 2-4 weeks) focused on delivering working increments.",
      "**MVP (Minimum Viable Product)**: Shipping the smallest set of features necessary to gather user feedback.",
      "**Retrospective**: Team reviews after each cycle to identify workflow improvements."
    ]
  },
  python: {
    title: "Python Programming Language",
    desc: "Python is a high-level, interpreted programming language known for its emphasis on code readability, dynamic typing, and clear whitespace formatting.",
    code: `# List comprehension in Python
numbers = [1, 2, 3, 4, 5]
squared_evens = [x**2 for x in numbers if x % 2 == 0]

print(squared_evens) # Output: [4, 16]`,
    points: [
      "**Indentation**: Python uses block indentation (spaces) instead of curly braces to define code scopes.",
      "**Batteries Included**: Shipped with a massive standard library containing pre-packaged tools for many tasks.",
      "**Multi-Paradigm**: Supports structured, object-oriented, and functional programming patterns."
    ]
  },
  html: {
    title: "HTML (HyperText Markup Language)",
    desc: "HTML is the standard markup language used to create the structural layout and elements of documents displayed in web browsers.",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Minimal HTML Page</title>
</head>
<body>
  <main>
    <h1>Welcome to ChatX</h1>
    <p>Modern Premium Chat Interface.</p>
  </main>
</body>
</html>`,
    points: [
      "**DOM Tree**: The browser parses HTML nodes into a Document Object Model tree structure.",
      "**Semantic Tags**: Using tags like `<main>`, `<article>`, or `<section>` improves SEO and accessibility.",
      "**Hyperlinks**: Connects documents across the World Wide Web using anchor (`<a>`) tags."
    ]
  },
  css: {
    title: "CSS (Cascading Style Sheets)",
    desc: "CSS is a style sheet language used to describe the presentation, layouts, colors, and formatting of documents written in HTML.",
    code: `/* Flexbox layout alignment style */
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #09090b;
  color: #f4f4f5;
}`,
    points: [
      "**Cascade & Specificity**: Rules apply based on selector specificity and document order.",
      "**Box Model**: Every element is a box containing margin, border, padding, and content layers.",
      "**Media Queries**: Used to build responsive layouts that adjust smoothly to different screen resolutions."
    ]
  }
};

export function getPersonaGreeting(personaId) {
  const pData = RESPONSES[personaId] || RESPONSES.silas;
  return pData.greetings[0];
}

/**
 * Simulates streaming AI response chunk-by-chunk.
 */
export function streamAiResponse(personaId, userPrompt, onChunk, onComplete) {
  const pData = RESPONSES[personaId] || RESPONSES.silas;
  const promptLower = userPrompt.toLowerCase().trim();
  
  let responseText = "";
  
  // 1. Math solving capability (supporting complex mathematical formulas)
  const mathClean = promptLower.replace(/[a-z?]/g, '').trim();
  const isMathExpr = /^[0-9+\-*/().\s]+$/.test(mathClean) && /[0-9]/.test(mathClean) && /[\+\-\*\/]/.test(mathClean);
  
  if (isMathExpr) {
    try {
      // Safe math evaluation
      const result = Function(`"use strict"; return (${mathClean})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        responseText = `I've solved the math problem for you:\n\n**Expression**: \`${mathClean}\`\n**Result**: \`${result}\``;
      }
    } catch (e) {
      // ignore and fall through to standard responder
    }
  }

  if (!responseText) {
    // 2. Identity and Capabilities
    if (promptLower.includes('who are you') || promptLower.includes('your name') || promptLower.includes('role')) {
      const persona = PERSONAS.find(p => p.id === personaId);
      responseText = `I am ${persona.name}, your ${persona.role}. ${persona.bio}`;
    } 
    else if (promptLower.includes('can you') || promptLower.includes('capable of') || promptLower.includes('what can you do') || promptLower.includes('help me with')) {
      if (personaId === 'athena') {
        responseText = "Yes, I am fully capable of helping you! I specialize in software engineering, systems architecture, and programming. I can write clean code, explain complex concepts (like closures, async operations), debug errors, and optimize database queries.";
      } else if (personaId === 'aurora') {
        responseText = "Yes! I can help you with a wide range of creative tasks. I specialize in storytelling, poetry, brainstorming creative names, designing concepts, and generating artistic ideas.";
      } else {
        responseText = "Yes, I am here to help you. I specialize in mentorship, mindfulness, and calm guidance. I can walk you through burnout management, suggest breathing exercises, and discuss habits for resilience.";
      }
    }
    // 3. IT & Programming Database Lookup
    else {
      const sortedKeys = Object.keys(IT_DATABASE).sort((a, b) => b.length - a.length);
      const itKey = sortedKeys.find(key => promptLower.includes(key.replace('_', ' ')));
      
      if (itKey) {
        const item = IT_DATABASE[itKey];
        const isDefinitionQuery = promptLower.includes('what is') || 
                                  promptLower.includes('what are') || 
                                  promptLower.includes('define') || 
                                  promptLower.includes('explain') || 
                                  promptLower.includes('meaning of');
        
        if (isDefinitionQuery && personaId !== 'athena') {
          // Omit code blocks for pure definitions on Aurora/Silas
          responseText = `### ${item.title}\n\n${item.desc}\n\nKey Concepts:\n${item.points.map(p => `- ${p}`).join('\n')}`;
        } else {
          // Standard response with code snippet
          responseText = `### ${item.title}\n\n${item.desc}\n\n### Code Snippet\n\`\`\`javascript\n${item.code}\n\`\`\`\n\n### Key Concepts:\n${item.points.map(p => `- ${p}`).join('\n')}`;
        }
      }
      // 4. Common Programming bug/error response
      else if (promptLower.includes('bug') || promptLower.includes('error') || promptLower.includes('debug') || promptLower.includes('broken')) {
        responseText = `When dealing with bugs and execution errors, follow these basic steps to isolate the issue:\n\n1. **Inspect the stack trace**: Find the exact file and line number where the runtime failed.\n2. **Check states**: Ensure arguments are not \`null\`, \`undefined\`, or mismatching types.\n3. **Use logging**: Print states using \`console.log\` or utilize browser debugger breakpoints.\n\nIf you provide your specific code snippet or error message, I can help you fix it!`;
      }
      // 5. Dynamic Concept Explainer
      else {
        const conceptMatch = promptLower.match(/(?:what is|what are|explain|how does|how to)\s+(?:a|an|the)?\s*([a-z0-9\s]{3,})/);
        if (conceptMatch) {
          const subject = conceptMatch[1].trim();
          if (personaId === 'athena') {
            responseText = `Let's break down **${subject}** from an engineering perspective:\n\n1. **Core Concept**: ${subject} acts as a key component in modern system architecture.\n2. **System Role**: It manages resource handling, data flow, and processing limits.\n3. **Best Practice**: In production, always ensure safety, error boundaries, and clear abstraction when implementing ${subject}.\n\nLet me know if you would like me to write a sample integration or API mock for ${subject}!`;
          } else if (personaId === 'aurora') {
            responseText = `Ah, exploring the essence of **${subject}**! Think of ${subject} as a canvas waiting for a story. It represents a focal point where structure meets raw creativity. In a wider narrative, ${subject} could symbolize discovery, transition, or the mystery of how complex systems interact.\n\nWould you like me to write a short story, creative metaphor, or poem centered around ${subject}?`;
          } else {
            responseText = `Let's look at **${subject}** with patience and clear focus. Often, understanding ${subject} is about simplifying the noise and finding the core principle. Approach ${subject} without rushing, noting how each piece fits into the larger picture.\n\nWe can explore the concepts step-by-step. Let me know what specific questions you have about ${subject}.`;
          }
        }
        // 6. Generic IT/Programming term matches
        else {
          const techTerms = ['python', 'java', 'c++', 'rust', 'html', 'css', 'http', 'server', 'network', 'port', 'web', 'compil', 'framework', 'variable', 'interface', 'inheritance', 'polymorphism', 'binary', 'tree', 'linked list', 'complexity', 'big o'];
          const matchedTerm = techTerms.find(t => promptLower.includes(t));
          
          if (matchedTerm) {
            responseText = `Let's discuss **${matchedTerm}** in software development:\n\n1. **Purpose**: ${matchedTerm} plays a vital role in organizing logic, managing computational flow, and establishing clean structures.\n2. **Common Patterns**: Using modular abstraction, separating concerns, and validating boundaries are key patterns associated with ${matchedTerm}.\n3. **Implementation**: Ensure correct environment setup and standard formatting rules when writing solutions involving ${matchedTerm}.\n\nLet me know if you would like me to write a sample script or explain a specific configuration for ${matchedTerm}!`;
          }
          // 7. Greetings
          else if (promptLower.includes('hello') || promptLower.includes('hi ') || promptLower.includes('hey') || promptLower.includes('greetings')) {
            responseText = pData.greetings[Math.floor(Math.random() * pData.greetings.length)];
          } 
          // 8. Keyword matches for standard defaults
          else if (personaId === 'athena' && RESPONSES.athena.codeKeywords.some(kw => promptLower.includes(kw))) {
            responseText = RESPONSES.athena.default[Math.floor(Math.random() * RESPONSES.athena.default.length)];
          } 
          else if (personaId === 'aurora' && RESPONSES.aurora.creativeKeywords.some(kw => promptLower.includes(kw))) {
            responseText = RESPONSES.aurora.default[Math.floor(Math.random() * RESPONSES.aurora.default.length)];
          } 
          else if (personaId === 'silas' && RESPONSES.silas.mindfulnessKeywords.some(kw => promptLower.includes(kw))) {
            responseText = RESPONSES.silas.default[Math.floor(Math.random() * RESPONSES.silas.default.length)];
          }
          // 9. Multi-template intelligent fallbacks to avoid repeating
          else {
            const cleanPrompt = userPrompt.length > 50 ? userPrompt.substring(0, 47) + '...' : userPrompt;
            const index = Math.floor(Math.random() * 3);
            
            if (personaId === 'athena') {
              const templates = [
                `I've analyzed your query regarding "${cleanPrompt}". From a software design perspective, we would tackle this by isolating the core requirements, selecting the appropriate data structure, and ensuring optimized algorithms.\n\nDo you want me to write code to demonstrate this?`,
                `Regarding "${cleanPrompt}", this looks like a classic implementation scenario. We'll want to review the inputs, minimize complexity overhead, and establish robust handling.\n\nLet me know if you would like me to design a system flow diagram or trace an example execution.`,
                `Interesting. The challenge with "${cleanPrompt}" lies in scale and concurrency. We must ensure thread safety, state isolation, and clean APIs.\n\nI can write a code sample or test outline for this if you'd like.`
              ];
              responseText = templates[index];
            } else if (personaId === 'aurora') {
              const templates = [
                `A fascinating prompt! The idea of "${cleanPrompt}" opens up a wide landscape of creative possibilities. We could look at this as a metaphor for change or a spark for a larger narrative journey.\n\nWould you like me to brainstorm concepts or draft a character profile for this?`,
                `Thinking about "${cleanPrompt}" brings to mind a picture of light and shadow—a story of discovery. If we were to build a creative project around it, we could highlight the contrast between expectation and reality.\n\nLet's brainstorm some title options or write a brief introduction scene!`,
                `"${cleanPrompt}" has a poetic quality to it. It makes me think of paths crossing and worlds aligning. Let let me know if you want a short prose piece, an elegant poem, or a list of creative concepts!`
              ];
              responseText = templates[index];
            } else {
              const templates = [
                `Thank you for sharing your thoughts on "${cleanPrompt}". When navigating these ideas, it's beneficial to take a step back, observe the situation calmly, and recognize what is within your sphere of influence.\n\nLet's unpack this slowly together.`,
                `Reflecting on "${cleanPrompt}", I encourage you to pause and take a slow, deep breath. Clarity comes when we quiet the noise around us and focus on the immediate next step.\n\nHow does this situation make you feel? Let's talk about it.`,
                `The topic of "${cleanPrompt}" is worth reflecting upon. Often, simple daily habits and conscious pauses can help us build the resilience needed to face these challenges.\n\nI am here to listen. Let me know how you would like to proceed.`
              ];
              responseText = templates[index];
            }
          }
        }
      }
    }
  }

  // 10. Format according to specific Persona System Instructions
  const cleanPrompt = userPrompt.length > 50 ? userPrompt.substring(0, 47) + '...' : userPrompt;
  const isDefinitionQuery = promptLower.includes('what is') || 
                            promptLower.includes('what are') || 
                            promptLower.includes('define') || 
                            promptLower.includes('explain') || 
                            promptLower.includes('meaning of');

  const isSimpleQuery = 
    isMathExpr ||
    promptLower.includes('who are you') || 
    promptLower.includes('your name') || 
    promptLower.includes('role') ||
    promptLower.includes('can you') || 
    promptLower.includes('capable of') || 
    promptLower.includes('what can you do') || 
    promptLower.includes('help me with') ||
    promptLower.includes('hello') || 
    promptLower.includes('hi ') || 
    promptLower.includes('hey') || 
    promptLower.includes('greetings');

  if (!isSimpleQuery) {
    if (personaId === 'athena') {
      if (isDefinitionQuery) {
        // Conceptual response format (omitting rigid codeblock template)
        const cleanText = responseText.replace(/### Code Snippet\n```[\s\S]*?```/g, '').trim();
        responseText = `### Technical Concept: "${cleanPrompt}"

${cleanText}

### Key Architectures & Trade-offs
- **Core Principle**: Decoupling components and maintaining a clean division of concerns.
- **Trade-offs**: Conceptual definitions are fast to communicate, but production environments require concrete constraints.
- **Best Practice**: Always model system states and interface protocols before starting line-by-line coding.

Next Steps:
1. Verify system scaling and latency requirements.
2. Ask for code blocks specifically if you are ready to implement this concept.
3. Review associated architectural patterns.`;
      } else {
        // Extract code block if present
        let codeBlock = '';
        let textContent = responseText;
        const match = responseText.match(/```(?:javascript|css|sql|json)?\n([\s\S]*?)```/);
        if (match) {
          codeBlock = match[1];
          textContent = responseText.replace(/```(?:javascript|css|sql|json)?\n[\s\S]*?```/g, '').trim();
        } else {
          codeBlock = `// Solution for ${cleanPrompt}\nfunction resolveRequest() {\n  // Implement logic safely\n  try {\n    return true;\n  } catch (error) {\n    console.error("Architect Exception:", error);\n    throw error;\n  }\n}`;
        }
        
        responseText = `### Problem
Need to resolve technical requirement: "${cleanPrompt}".

### Approach
Analyze requirements, handle edge cases, and design a simple, maintainable structure using standard patterns.

### Code
\`\`\`javascript (solution.js)
${codeBlock}
\`\`\`

### Explanation
- **Robust Logic**: Code isolation handles operations within standard bounds.
- **Safety**: Built-in error handling guards execution scopes.
- **Modularity**: Components remain reusable and easy to test.

Next Steps:
1. Integrate the script into your project.
2. Run standard suite of unit tests.
3. Validate API boundary limits in staging environment.`;
      }
    }
    else if (personaId === 'aurora') {
      const evocativeOpenings = [
        "*A sudden light parts the grey clouds, revealing paths we have yet to travel.*",
        "*In the quiet spaces between heartbeats, a story begins to write itself.*",
        "*The smell of damp ink and ancient paper fills the air, urging us to create.*"
      ];
      const opening = evocativeOpenings[Math.floor(Math.random() * evocativeOpenings.length)];
      
      responseText = `${opening}\n\n${responseText}\n\n---\n**Director's Note:**\nThis piece utilizes character motivation, sensory detail, and contrast to evoke a feeling of connection and discovery. It preserves your voice while extending the narrative arc. Let me know if you would like to adapt it to a different mood or structure.`;
    }
    else if (personaId === 'silas') {
      responseText = `Let us pause, clear the workspace, and look at this moment with quiet clarity.\n\nIt sounds like you are navigating a situation involving "${cleanPrompt}".\n\n${responseText}\n\n**What outcome matters most to you here?**\n\nWhen we feel overwhelmed, it is helpful to return to the breath. Observe what you can control — your immediate action and your focus. Let go of the noise outside.\n\n---\n**One thing to sit with:**\nIf you were to take the smallest possible action right now, what would it be? Let that action guide your steps.`;
    }
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
