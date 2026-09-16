# HyperFrames Video Editing Skill

Professional video creation and editing for Capacitor documentation using HyperFrames and Claude Design integration.

## 🎬 What This Skill Does

This skill enables you to:

✅ **Create video content** for Capacitor documentation  
✅ **Edit and refine animations** frame-by-frame  
✅ **Build video montages** with complex animations  
✅ **Export production-ready videos** (MP4, WebM, etc.)  
✅ **Integrate with Claude Design** for initial video creation  

## 🚀 Quick Start

### 1. Create a New Video Project
```bash
npx hyperframes create videos/my-demo
cd videos/my-demo
```

### 2. Use Claude Design First
- Start with Claude Design to create the initial video
- It extracts brand identity and creates a valid HyperFrames project
- Download the ZIP file

### 3. Edit with Claude Code (This Skill)
- Extract the ZIP file
- Run preview: `npx hyperframes preview`
- Edit animations and timing
- Export final video

### 4. Embed in Documentation
```markdown
<video width="100%" controls>
  <source src="/videos/my-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

## 📋 Workflow Overview

```
┌─────────────────────────────────────────────────────┐
│ Claude Design                                       │
│ - Creates initial video draft                       │
│ - Handles brand identity and content                │
│ - Generates valid HyperFrames ZIP project           │
└──────────────────┬──────────────────────────────────┘
                   │ Download ZIP
                   ▼
┌─────────────────────────────────────────────────────┐
│ Extract & Preview                                   │
│ - npx hyperframes preview                           │
│ - View video in browser (auto-refresh)              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Claude Code (Edit & Refine)                         │
│ - Adjust animation timing                           │
│ - Fine-tune easing curves                           │
│ - Add/remove animations                             │
│ - Optimize performance                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Export & Integrate                                  │
│ - npx hyperframes export                            │
│ - Embed in documentation                            │
│ - Commit to git                                     │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
capacitor-docs/
├── .claude/
│   ├── settings.json                    # Project configuration
│   └── skills/
│       └── hyperframes-editing/         # This skill
│           ├── SKILL.md                 # Detailed documentation
│           ├── VIDEO_TEMPLATE.md        # Project template
│           ├── EXAMPLES.md              # Practical examples
│           └── README.md                # This file
├── static/
│   └── videos/
│       ├── feature-demo.mp4
│       └── tutorial-01.mp4
└── docs/
    └── guides/
        └── video-guide.md               # Links to videos
```

## 🛠️ Essential Commands

### Preview Video in Real-time
```bash
cd static/videos/my-video
npx hyperframes preview
# Open http://localhost:3000
```

### Validate Project Structure
```bash
npx hyperframes lint
npx hyperframes lint --fix        # Auto-fix issues
```

### Export Video
```bash
# Basic export
npx hyperframes export

# With custom settings
npx hyperframes export \
  --format mp4 \
  --width 1920 \
  --height 1080 \
  --fps 60 \
  --quality high
```

### Check Dependencies
```bash
npm list gsap @heygen/hyperframes
```

## 🎨 Animation Fundamentals

### GSAP Timeline
The heart of HyperFrames animations:

```javascript
const tl = gsap.timeline();

// Animate elements in sequence
tl.fromTo('.element-1', { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
  .fromTo('.element-2', { x: -100 }, { x: 0, duration: 1 }, 0.5)
  .fromTo('.element-3', { scale: 0 }, { scale: 1, duration: 0.8 }, 1);
```

### Key Concepts

**Timing**
- `duration`: How long animation takes (seconds)
- `delay`: Wait before animation starts
- `stagger`: Space between multiple animations

**Easing**
- `ease: "power1.out"` - Smooth exit
- `ease: "back.in"` - Bouncy entrance
- `ease: "elastic.out"` - Springy exit

**GPU Acceleration**
```css
.element {
  will-change: transform, opacity;
}
```

## 📚 Documentation Files

### SKILL.md
Comprehensive technical documentation including:
- Project setup and configuration
- Command reference
- Best practices
- Troubleshooting guide

### VIDEO_TEMPLATE.md
Step-by-step template for creating new videos:
- Project structure
- HTML template
- CSS styling
- JavaScript animations
- Common patterns

### EXAMPLES.md
Real-world examples for Capacitor docs:
1. Feature Introduction Video
2. Installation Guide
3. Comparison Video
4. Performance/Metrics Video
5. Interactive Feature Demo

## 💡 Common Tasks

### Task: Speed Up Animation
**Problem**: Animation is too slow  
**Solution**: Reduce `duration` value
```javascript
// Before: 2 seconds
.to('.element', { opacity: 1, duration: 2 })

// After: 0.5 seconds
.to('.element', { opacity: 1, duration: 0.5 })
```

### Task: Stagger Multiple Elements
**Problem**: Elements animate all at once  
**Solution**: Use `stagger` property
```javascript
tl.fromTo('.items',
  { opacity: 0, y: 20 },
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.5,
    stagger: 0.15  // 150ms between each
  }
);
```

### Task: Add Easing to Animation
**Problem**: Animation is too linear/boring  
**Solution**: Add `ease` property
```javascript
tl.to('.element', 
  { y: 100, duration: 1, ease: "power2.out" }
);
```

### Task: Reduce Video File Size
**Problem**: Exported video is too large  
**Solution**: Reduce quality or frame rate
```bash
npx hyperframes export \
  --quality medium \
  --fps 30
```

## 🔧 Troubleshooting

### Preview Shows Blank Page
```bash
# Clear cache and restart
npx hyperframes preview --clear-cache

# Check if port is in use
npx hyperframes preview --port 3001
```

### Lint Reports Errors
```bash
# See detailed error messages
npx hyperframes lint --verbose

# Attempt automatic fixes
npx hyperframes lint --fix

# If still failing, check:
# - All imports are resolved
# - GSAP is installed
# - HTML structure is valid
```

### Export Creates Small File
```bash
# Increase quality settings
npx hyperframes export \
  --quality ultra \
  --fps 60 \
  --codec h264
```

### GSAP Not Working
```bash
# Verify GSAP installation
npm list gsap

# Reinstall if needed
npm install gsap@latest
```

## 📦 Dependencies

- **Node.js**: 16.x or higher
- **npm**: 7.x or higher
- **HyperFrames**: Latest stable version
- **GSAP**: 3.12.0 or higher
- **HTML5 Canvas**: For rendering
- **FFmpeg**: For video export (installed with HyperFrames)

## 🎯 Best Practices

### Animation Quality
✓ Use `transform` and `opacity` for smooth animations  
✓ Target 60fps for desktop videos  
✓ Use `will-change` for GPU acceleration  
✗ Don't animate `width` or `height` (use `scale`)  
✗ Don't animate too many elements simultaneously  

### Code Organization
✓ Separate HTML structure from animations  
✓ Use meaningful variable names  
✓ Keep animations modular and reusable  
✓ Comment complex timeline logic  

### Video Format
✓ Use MP4 for broad compatibility  
✓ Use WebM for modern browsers (smaller file)  
✓ Provide captions/subtitles for accessibility  
✓ Test on multiple devices  

## 🔗 Resources

- **HyperFrames Official**: https://hyperframes.heygen.com/
- **GitHub Repository**: https://github.com/heygen-com/hyperframes
- **GSAP Documentation**: https://greensock.com/gsap/
- **Claude Design Guide**: https://github.com/heygen-com/hyperframes/blob/main/docs/guides/claude-design-hyperframes.md

## 📞 Support

When working with this skill:

1. **Start with Claude Design** - Creates the foundation
2. **Use the preview** - Always preview before exporting
3. **Follow the examples** - See `EXAMPLES.md` for practical implementations
4. **Check the template** - Use `VIDEO_TEMPLATE.md` when creating new videos
5. **Refer to SKILL.md** - Comprehensive technical documentation

## 🎓 Learning Path

1. Read `README.md` (this file) - Understand the basics
2. Check `VIDEO_TEMPLATE.md` - See project structure
3. Study `EXAMPLES.md` - Learn from real examples
4. Review `SKILL.md` - Deep technical reference
5. Start creating! - Build your first video

---

**Skill Version**: 1.0.0  
**Last Updated**: 2026-09-16  
**Maintained by**: Claude Haiku 4.5  

**For Capacitor Documentation Project** 🚀
