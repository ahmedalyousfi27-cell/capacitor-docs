---
name: hyperframes-editing
description: HyperFrames video editing and montage skill for Capacitor Docs
tags:
  - video
  - editing
  - hyperframes
  - montage
  - animation
---

# HyperFrames Video Editing & Montage Skill

This skill enables comprehensive video editing, animation montage creation, and frame-by-frame optimization using HyperFrames technology integrated with Claude Design.

## Overview

HyperFrames is a powerful HTML5-based video creation and editing framework that enables:
- **Frame-accurate video editing** at the code level
- **Animation montage** with GSAP timeline control
- **Real-time preview** of video changes
- **Multi-layer compositing** with HTML/CSS/JavaScript
- **Export-ready video production** workflow

## Workflow: Claude Design → Claude Code

### Phase 1: Claude Design (Initial Build)
Claude Design creates the initial video draft by:
- Extracting brand identity (colors, fonts, styles) from attachments
- Filling scene content (text, images, layout)
- Writing all motion and transitions using GSAP on plain HTML
- Delivering a ZIP file with a **valid HyperFrames project** that passes `npx hyperframes lint`

### Phase 2: Claude Code (Editing & Refinement)
After download, Claude Code enhances the video by:
- Running `npx hyperframes preview` to view the complete video
- Adjusting easing curves, timing, and pacing
- Enriching static motions with mid-scene activities
- Quality checking and cross-browser testing
- Fine-tuning animation synchronization

## Prerequisites

### Installation
```bash
# Install HyperFrames CLI
npm install -g @heygen/hyperframes

# Or use npx (no installation required)
npx @heygen/hyperframes --version
```

### Project Setup
```bash
# Create a new HyperFrames project
npx hyperframes create my-video

# Or initialize in existing directory
npx hyperframes init
```

## Core Commands

### Preview Video
```bash
# Start real-time preview server
npx hyperframes preview

# Preview runs on http://localhost:3000
# Changes auto-refresh in browser
```

### Validate Project
```bash
# Lint project structure and code
npx hyperframes lint

# Fix common issues automatically
npx hyperframes lint --fix
```

### Export Video
```bash
# Export to MP4/WebM
npx hyperframes export --format mp4

# Custom output settings
npx hyperframes export --width 1920 --height 1080 --fps 60
```

## Project Structure

```
my-video/
├── src/
│   ├── index.html       # Main scene structure
│   ├── style.css        # Styling and layout
│   ├── animation.js     # GSAP timeline and keyframes
│   └── assets/          # Images, fonts, media
├── hyperframes.config.js # Project configuration
├── package.json
└── README.md
```

## Key Concepts

### 1. GSAP Timeline
- Control all animations with GSAP timeline
- Precise timing and easing control
- Multi-layer synchronization

```javascript
const timeline = gsap.timeline();

timeline
  .fromTo('.element', 
    { opacity: 0 }, 
    { opacity: 1, duration: 1 },
    0
  )
  .to('.element',
    { x: 100, duration: 0.5 },
    '+=0.5'
  );
```

### 2. Scene Management
- Multiple scenes in single project
- Scene transitions and wipes
- Dynamic content updates

### 3. Frame Accuracy
- Edit at frame level (1/60th second precision)
- Real-time preview feedback
- Pixel-perfect rendering

## Editing Tasks

### Adjust Animation Timing
- Modify duration and delay properties
- Fine-tune easing curves (ease-in, ease-out, ease-in-out)
- Synchronize multiple elements

### Add/Remove Animations
- Insert new GSAP tweens
- Remove or replace keyframes
- Create animation sequences

### Montage Assembly
- Combine multiple scenes
- Create transitions between clips
- Layer overlays and effects

### Performance Optimization
- Minimize layout thrashing
- Use GPU acceleration (transform, opacity)
- Optimize asset loading

## Best Practices

### Animation Quality
✓ Use `transform` and `opacity` for smooth 60fps animations  
✓ Leverage GPU acceleration with will-change  
✓ Keep timeline organized with labels  
✗ Avoid animating width/height (use scale instead)  
✗ Don't animate too many elements simultaneously  

### Rendering
✓ Test on target devices and browsers  
✓ Verify frame rate consistency  
✓ Check export quality settings  
✗ Don't rely on single-browser testing  

### Code Organization
✓ Separate content, styling, and animation  
✓ Use meaningful variable and function names  
✓ Comment complex timeline logic  
✓ Modularize reusable animation patterns  

## Integration with Capacitor Docs

### Creating Video Documentation
1. Design video structure in Claude Design
2. Export ZIP file with HyperFrames project
3. Use Claude Code to refine animations
4. Export final MP4 for embedding
5. Add to documentation with video controls

### Embedding Videos
```html
<video width="100%" controls>
  <source src="/videos/feature-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

## Troubleshooting

### Preview Won't Start
```bash
# Clear cache and restart
npx hyperframes preview --clear-cache
```

### Lint Errors
```bash
# View detailed errors
npx hyperframes lint --verbose

# Auto-fix common issues
npx hyperframes lint --fix
```

### Export Issues
- Check asset paths are correct
- Verify all imports are resolved
- Ensure GSAP and dependencies are installed
- Try clearing node_modules and reinstalling

## Resources

- **GitHub Repository**: https://github.com/heygen-com/hyperframes
- **Documentation**: https://hyperframes.heygen.com/docs
- **Prompting Guide**: https://hyperframes.heygen.com/prompting/overview
- **Claude Design Integration**: https://github.com/heygen-com/hyperframes/blob/main/docs/guides/claude-design-hyperframes.md
- **GSAP Documentation**: https://greensock.com/gsap/

## Commands for Claude Code

When working on HyperFrames projects, use these commands:

```bash
# Start editing session
npx hyperframes preview

# Validate changes
npx hyperframes lint

# Generate final video
npx hyperframes export --format mp4

# Check dependencies
npm list gsap @heygen/hyperframes
```

## Version Requirements

- **Node.js**: 16.x or higher
- **npm**: 7.x or higher
- **GSAP**: 3.12.0 or higher
- **HyperFrames**: Latest stable version

---

**Last Updated**: 2026-09-16
**Maintained by**: Claude Haiku 4.5
