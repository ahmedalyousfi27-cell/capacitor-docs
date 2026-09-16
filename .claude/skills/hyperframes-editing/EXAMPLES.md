# HyperFrames Video Examples for Capacitor Docs

This document provides practical examples for creating video content for Capacitor documentation.

## Example 1: Feature Introduction Video

**Use Case**: Introduce a new Capacitor feature  
**Duration**: 15-30 seconds  
**Format**: Feature overview with call-to-action

### Structure
```
0-2s   | Logo and title fade in
2-8s   | Feature description with icons
8-14s  | Key benefits highlight (staggered)
14-30s | Call-to-action button animation
```

### Key Animation Concepts
- Staggered text reveals
- Icon entrance animations
- Button hover effects (interactive)
- Smooth transitions between sections

### Code Sample
```javascript
const tl = gsap.timeline();

// Logo entrance
tl.fromTo('.logo',
  { scale: 0, rotation: -180 },
  { scale: 1, rotation: 0, duration: 1, ease: "back.out" },
  0
);

// Title fade
tl.fromTo('.title',
  { opacity: 0, y: -30 },
  { opacity: 1, y: 0, duration: 0.8 },
  0.3
);

// Feature points staggered
tl.fromTo('.feature-point',
  { opacity: 0, x: -50 },
  { opacity: 1, x: 0, duration: 0.6, stagger: 0.3 },
  1.2
);

// CTA button
tl.fromTo('.cta-button',
  { opacity: 0, scale: 0 },
  { opacity: 1, scale: 1, duration: 0.5, ease: "elastic.out" },
  3
);
```

---

## Example 2: Installation Guide Video

**Use Case**: Step-by-step installation walkthrough  
**Duration**: 45-60 seconds  
**Format**: Tutorial with code snippets

### Structure
```
0-5s   | Introduction and requirements
5-15s  | Step 1: npm install command
15-25s | Step 2: Configuration setup
25-35s | Step 3: Usage example
35-45s | Tips and next steps
45-60s | Resources and links
```

### Key Animation Concepts
- Code snippet highlighting
- Terminal-like text typing effect
- Step counter progression
- Check mark animations for completed steps

### Code Sample
```javascript
const tl = gsap.timeline();

// Code snippet entrance
tl.fromTo('.code-block',
  { opacity: 0, backdropFilter: 'blur(20px)' },
  { opacity: 1, backdropFilter: 'blur(0px)', duration: 0.8 },
  0.5
);

// Syntax highlight animation
const codeLines = document.querySelectorAll('.code-line');
tl.fromTo(codeLines,
  { opacity: 0.3, x: -20 },
  { opacity: 1, x: 0, duration: 0.3, stagger: 0.1 },
  1.2
);

// Checkmark animation
tl.fromTo('.checkmark',
  { opacity: 0, scale: 0, rotation: -180 },
  { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out" },
  2
);
```

---

## Example 3: Comparison Video

**Use Case**: Show before/after or feature comparison  
**Duration**: 20-30 seconds  
**Format**: Split screen comparison

### Structure
```
0-3s   | Section title
3-10s  | Before/Left side animation
10-17s | After/Right side animation
17-25s | Highlight differences
25-30s | Conclusion
```

### Key Animation Concepts
- Split screen reveals
- Parallel animations on both sides
- Highlight effects (glow, color change)
- Counter animations for metrics

### Code Sample
```javascript
const tl = gsap.timeline();

// Title entrance
tl.fromTo('.comparison-title',
  { opacity: 0, y: -40 },
  { opacity: 1, y: 0, duration: 0.8 },
  0
);

// Left side (Before)
tl.fromTo('.before-section',
  { opacity: 0, x: -100 },
  { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
  0.5
);

// Right side (After)
tl.fromTo('.after-section',
  { opacity: 0, x: 100 },
  { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
  0.5
);

// Highlight box animation
tl.fromTo('.highlight',
  { borderColor: 'rgba(255,255,255,0)', scale: 0.9 },
  { borderColor: 'rgba(255,255,255,1)', scale: 1, duration: 0.6, repeat: 2, yoyo: true },
  2
);
```

---

## Example 4: Performance/Metrics Video

**Use Case**: Showcase performance improvements  
**Duration**: 30-45 seconds  
**Format**: Animated charts and metrics

### Structure
```
0-5s   | Title and introduction
5-15s  | Performance metric animation
15-25s | Chart/graph build-up
25-35s | Results highlight
35-45s | Call-to-action
```

### Key Animation Concepts
- Number counter animations
- Chart drawing effects
- Bar/pie chart animations
- Glow effects for emphasis

### Code Sample
```javascript
const tl = gsap.timeline();

// Metric counter
tl.fromTo('.metric-value',
  { textContent: 0 },
  { 
    textContent: 95,
    duration: 2,
    snap: { textContent: 1 },
    ease: "power2.out"
  },
  0.5
);

// Chart bars animate up
tl.fromTo('.chart-bar',
  { height: 0, opacity: 0 },
  { 
    height: (i) => (i + 1) * 20 + '%',
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: "back.out"
  },
  1.5
);

// Percentage label
tl.fromTo('.percentage',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.6 },
  2
);
```

---

## Example 5: Interactive Feature Demo

**Use Case**: Demonstrate interactive features  
**Duration**: 45-90 seconds  
**Format**: Simulated user interaction

### Structure
```
0-10s  | Interface introduction
10-20s | User action simulation (click)
20-35s | Result animation
35-50s | Second feature demo
50-65s | Highlight benefits
65-90s | Closing with resources
```

### Key Animation Concepts
- Cursor/pointer animation
- Click feedback effects
- State change transitions
- Tooltip/label reveals

### Code Sample
```javascript
const tl = gsap.timeline();

// Interface fade in
tl.fromTo('.interface',
  { opacity: 0, scale: 0.95 },
  { opacity: 1, scale: 1, duration: 1 },
  0
);

// Cursor animation (simulated click)
tl.fromTo('.cursor',
  { x: 0, y: 0, opacity: 1 },
  { x: 300, y: 200, duration: 0.5 },
  1
);

// Ripple effect on click
tl.fromTo('.ripple',
  { scale: 0, opacity: 1 },
  { scale: 2, opacity: 0, duration: 0.6 },
  1.5
);

// Result panel reveal
tl.fromTo('.result-panel',
  { height: 0, opacity: 0 },
  { height: 'auto', opacity: 1, duration: 0.8, ease: "back.out" },
  2
);
```

---

## Common Animation Patterns for Docs Videos

### 1. Text Reveal with Typewriter Effect
```javascript
const text = "Learn Capacitor basics";
tl.fromTo('.typewriter',
  { opacity: 1 },
  { duration: text.length * 0.05 },
  0
);
```

### 2. Icon Animation Sequence
```javascript
tl.fromTo('.icon',
  { opacity: 0, rotation: -90 },
  { opacity: 1, rotation: 0, duration: 0.6, stagger: 0.2 },
  0
);
```

### 3. Gradient Color Shift
```javascript
tl.fromTo('.background',
  { backgroundPosition: '0% 50%' },
  { backgroundPosition: '100% 50%', duration: 3, ease: "none" },
  0
);
```

### 4. Parallax Scroll Effect
```javascript
tl.fromTo('.foreground',
  { y: 0 },
  { y: -100, duration: 2 },
  0
)
.fromTo('.background',
  { y: 0 },
  { y: -50, duration: 2 },
  0
);
```

### 5. Loading/Progress Bar
```javascript
tl.fromTo('.progress-bar',
  { width: '0%' },
  { width: '100%', duration: 3, ease: "power1.inOut" },
  0
);
```

---

## Video Export Settings for Capacitor Docs

### Standard Documentation Video
```bash
npx hyperframes export \
  --format mp4 \
  --width 1920 \
  --height 1080 \
  --fps 60 \
  --quality high
```

### Mobile-optimized Version
```bash
npx hyperframes export \
  --format mp4 \
  --width 1280 \
  --height 720 \
  --fps 30 \
  --quality medium
```

### Web-optimized (WebM)
```bash
npx hyperframes export \
  --format webm \
  --width 1920 \
  --height 1080 \
  --fps 60 \
  --quality high
```

---

## Tips for Best Results

### Design
- Use brand colors and typography
- Keep text readable (large font size for video)
- Maintain 16:9 aspect ratio
- Use consistent spacing and alignment

### Animation
- Keep animations smooth (60fps target)
- Use easing for natural motion
- Don't over-animate (less is more)
- Synchronize animations with audio (if using)

### Content
- Keep videos focused and concise
- Include call-to-action
- Start with attention-grabbing intro
- Provide resources/links at end

### Performance
- Optimize image assets
- Minimize complexity
- Test in preview before export
- Monitor file size

---

## Resources

- **GSAP Easing Guide**: https://greensock.com/ease-visualizer/
- **Animation Timing**: https://greensock.com/docs/v3/GSAP/Timeline
- **HyperFrames Docs**: https://hyperframes.heygen.com/docs
- **Video Best Practices**: https://hyperframes.heygen.com/guides/best-practices

---

**Created for Capacitor Documentation Project**  
**Last Updated**: 2026-09-16
