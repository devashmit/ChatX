# ChatX — The Multi-Persona Workspace

ChatX is a premium, professional AI companion workspace featuring three specialized personas: Athena (Software Architect), Aurora (Creative Writer), and Silas (Calm Mentor). It delivers a sleek, minimalist zinc-themed user interface, fluid micro-animations, and a highly responsive, custom-engineered client-side interaction engine.

![ChatX Screenshot](https://raw.githubusercontent.com/devashmit/ChatX/main/public/screenshot-placeholder.png) *(Note: Add your application screenshot here)*

## Key Features

### 1. 🎨 Premium Visual Design (Zinc Theme)
- Overhauled visual styling to use a refined zinc-based dark theme (`#09090b` matte black and `#121214` panels) inspired by high-end products like Vercel and Linear.
- Thin, subtle borders (`rgba(255, 255, 255, 0.065)`) and micro-interactive translation states.
- Clean typography and polished chat message bubbles with clear card-style containers for both user and companion replies.
- Modern command-style input area and high-contrast monochrome buttons.

### 2. 🌀 Dynamic Animated Logos (Avatars)
Each companion persona has a distinct, dynamic micro-animation applied to their avatar:
- **Athena (Software Architect)**: Rotating dashed orbital ring and precise scaling tech pulse.
- **Aurora (Creative Writer)**: Smooth, organic shape morphing and ambient sunset glow shifts.
- **Silas (Calm Mentor)**: Steady, meditative breathing scaling and fading concentric ripple waves.

### 3. 🧠 Tailored Companion Personas
Companions strictly adhere to specialized system prompts:
- **Athena**: Follows the `Problem → Approach → Code → Explanation` output format, provides copyable code blocks labeled with filenames, and includes debugging guidelines.
- **Aurora**: Leads with evocative lines, structures creative output, and ends with a brief `Director's Note` describing stylistic choices.
- **Silas**: Reframes queries with active listening, asks deep clarifying questions (*"What outcome matters most to you here?"*), and ends with a single reflection (*"One thing to sit with..."*).

### 4. 🎛️ Intelligent Client-Side Interaction Engine
- **Math Solver**: Parses and evaluates complex multi-operator formulas (e.g. `2+6*3-10`) in real time, returning computed results.
- **Intent Detection (Definition vs. Code)**: Intelligently detects whether the user is asking for a definition (*"what is..."*) or a code implementation. For definition queries, non-architect personas automatically hide code blocks to focus purely on conceptual explanations.
- **Broad IT & Programming Base**: Features comprehensive, structured guides with syntax-highlighted code blocks for topics including:
  - JavaScript Closures & Recursion
  - React Components, Hooks, & React Native mobile architectures
  - SQL Queries, Joins, and Index optimization
  - Docker containerization and multi-stage Dockerfiles
  - Git version control commands and workflows
  - REST APIs, DevOps CI/CD pipelines, QA unit testing, and Agile frameworks
- **Conversational Variety**: Implements template rotation to ensure dialogue replies feel organic and never repeat the exact same text.

---

## Technical Stack & Configuration
- **Core**: React 19, JavaScript (ES Modules), Vite 8
- **Styling**: Vanilla CSS (custom variables, layout grid)
- **Port**: Configured to run on local port `5000` via [vite.config.js](vite.config.js).
- **Persistence**: Synced state using `localStorage` (with automatic migration from legacy `aurachat_` keys to the new `chatx_` schema).

---

## Getting Started

### Prerequisites
- Node.js (version 18 or above recommended)
- npm (package manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/devashmit/ChatX.git
   cd ChatX
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5000`.

### Build & Preview
To compile the production-ready bundle:
```bash
npm run build
npm run preview
```

---

## License
This project is open-source and available under the MIT License.