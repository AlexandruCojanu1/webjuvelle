import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates a foundational Reactbits component wrapper for the Astro Component Library
// It creates a template that the AI can use and understand.

const outputPath = path.join(__dirname, '..', 'reactbits-templates.json')

const templates = [
  {
    name: 'ShinyText.astro',
    content: `---
// ReactBits: ShinyText Wrapper
// Source: https://reactbits.dev/components/shiny-text
// Note: In a real project, you would install the reactbits package or place the React component in src/components/react/

interface Props {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const { text, disabled = false, speed = 3, className = '' } = Astro.props;
---

<div class={\`shiny-text \${disabled ? 'disabled' : ''} \${className}\`} style={\`--shiny-speed: \${speed}s;\`}>
  {text}
</div>

<style>
  .shiny-text {
    color: #b5b5b5a4;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 60%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shine var(--shiny-speed) linear infinite;
  }

  @keyframes shine {
    0% { background-position: 100%; }
    100% { background-position: -100%; }
  }

  .shiny-text.disabled {
    animation: none;
  }
</style>
`
  },
  {
    name: 'SplitText.astro',
    content: `---
// ReactBits: SplitText Wrapper (Simplified CSS-only version for AI generation)
// Note: For full ReactBits functionality, use the official React component.

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

const { text, className = '', delay = 50 } = Astro.props;
const words = text.split(' ');
---

<div class={\`split-text-container \${className}\`}>
  {words.map((word, wordIndex) => (
    <span class="word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {word.split('').map((char, charIndex) => {
        const globalIndex = words.slice(0, wordIndex).join('').length + charIndex;
        return (
          <span
            class="char"
            style={\`animation-delay: \${globalIndex * delay}ms;\`}
          >
            {char}
          </span>
        );
      })}
      {wordIndex !== words.length - 1 ? ' ' : ''}
    </span>
  ))}
</div>

<style>
  .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(10px);
    animation: splitFadeIn 0.5s forwards ease-out;
  }

  @keyframes splitFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
`
  }
];

fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2));
console.log(`Generated ${templates.length} Reactbits wrapper templates at ${outputPath}`);
console.log('Next step: Use the GitHub CLI or Octokit to upload these to the Component Library Repo.');
