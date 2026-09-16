# HyperFrames Integration Guide for Capacitor Docs

Complete guide to using HyperFrames for video content creation in Capacitor documentation.

## 📌 Overview

This project now integrates **HyperFrames** - a powerful HTML5-based video creation and editing framework - for creating professional video content for documentation.

### Why HyperFrames?

✅ **Code-based video creation** - Write videos in HTML/CSS/JavaScript  
✅ **Frame-accurate editing** - Edit at 1/60th second precision  
✅ **Real-time preview** - See changes instantly in browser  
✅ **Smooth 60fps animations** - Professional-quality output  
✅ **Integration with Claude Design** - Two-phase workflow  

## 🔄 Two-Phase Workflow

### Phase 1: Claude Design (Initial Creation)
**What**: Claude Design creates the video foundation
- Extracts brand colors, fonts, and styles
- Fills in content (text, images, layouts)
- Writes GSAP animations for motion
- Exports valid HyperFrames project (ZIP file)

**When to use**: Starting a new video from scratch

**Output**: ZIP file with complete HyperFrames project

### Phase 2: Claude Code (Editing & Refinement)
**What**: Claude Code refines and optimizes the video
- Runs `npx hyperframes preview` to see full video
- Adjusts animation timing and easing
- Enriches static elements with motion
- Fine-tunes performance
- Exports final MP4/WebM video

**When to use**: Improving existing videos, tweaking animations

**Trigger**: `@hyperframes-editing` skill

## 📂 Project Structure

```
capacitor-docs/
├── .claude/
│   ├── settings.json                      # HyperFrames configuration
│   ├── HYPERFRAMES_GUIDE.md               # This file
│   └── skills/
│       └── hyperframes-editing/           # Video editing skill
│           ├── README.md                  # Quick start guide
│           ├── SKILL.md                   # Detailed documentation
│           ├── VIDEO_TEMPLATE.md          # Project template
│           └── EXAMPLES.md                # Real-world examples
│
├── static/videos/                         # Video output directory
│   ├── feature-demo.mp4
│   ├── tutorial-01.mp4
│   └── tutorial-02.mp4
│
└── docs/
    └── guides/
        └── video-guides.md                # Links to video content
```

## 🚀 Getting Started

### Step 1: Install HyperFrames
```bash
# Option A: Global installation (recommended)
npm install -g @heygen/hyperframes

# Option B: Use npx (no installation)
npx @heygen/hyperframes --version
```

### Step 2: Create Video Project
```bash
# Navigate to videos directory
mkdir -p static/videos
cd static/videos

# Create new HyperFrames project
npx hyperframes create my-feature-demo
cd my-feature-demo
```

### Step 3: Use Claude Design
1. Open Claude Design in your chat/editor
2. Request a video creation with HyperFrames
3. Provide:
   - Video title and description
   - Target duration (seconds)
   - Key points to cover
   - Any brand guidelines
4. Download the ZIP file with HyperFrames project

### Step 4: Implement with Claude Code
```bash
# Extract ZIP into project directory
unzip my-feature-demo.zip -d my-feature-demo

# Navigate to project
cd my-feature-demo

# Start preview
npx hyperframes preview

# Open http://localhost:3000 in browser
```

### Step 5: Edit and Export
- Edit animations in `animation.js`
- Adjust styles in `style.css`
- Preview changes in browser (auto-refresh)
- When satisfied, export: `npx hyperframes export`

### Step 6: Integrate into Docs
```markdown
## Feature Overview Video

<video width="100%" controls>
  <source src="/videos/my-feature-demo/output.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

[Feature documentation continues...]
```

## 💻 Essential Commands

### Development Commands
```bash
# Start live preview server
npx hyperframes preview

# Preview on custom port
npx hyperframes preview --port 3001

# Clear cache and restart
npx hyperframes preview --clear-cache
```

### Validation Commands
```bash
# Lint project for errors
npx hyperframes lint

# Auto-fix common issues
npx hyperframes lint --fix

# Detailed error report
npx hyperframes lint --verbose
```

### Export Commands
```bash
# Standard MP4 export
npx hyperframes export

# Custom settings
npx hyperframes export \
  --format mp4 \
  --width 1920 \
  --height 1080 \
  --fps 60 \
  --quality high

# WebM export (smaller files)
npx hyperframes export --format webm

# Multiple formats at once
npx hyperframes export --formats mp4,webm
```

## 🎬 Video Creation Examples

### Example 1: Feature Introduction (30s)
**Use case**: Introduce new Capacitor feature

**Structure**:
- 0-2s: Logo and title
- 2-8s: Feature description
- 8-14s: Key benefits
- 14-30s: Call-to-action

**See**: `skills/hyperframes-editing/EXAMPLES.md` (Example 1)

### Example 2: Installation Guide (60s)
**Use case**: Step-by-step walkthrough

**Structure**:
- 0-5s: Requirements intro
- 5-30s: Installation steps
- 30-50s: Configuration
- 50-60s: Resources

**See**: `skills/hyperframes-editing/EXAMPLES.md` (Example 2)

### Example 3: Feature Comparison (30s)
**Use case**: Before/after comparison

**Structure**:
- 0-3s: Title
- 3-15s: Before side
- 15-25s: After side
- 25-30s: Results

**See**: `skills/hyperframes-editing/EXAMPLES.md` (Example 3)

## 🎨 Animation Techniques

### Fade In/Out
```javascript
tl.fromTo('.element',
  { opacity: 0 },
  { opacity: 1, duration: 1 }
);
```

### Slide In
```javascript
tl.fromTo('.element',
  { x: -100, opacity: 0 },
  { x: 0, opacity: 1, duration: 1 }
);
```

### Scale and Rotate
```javascript
tl.fromTo('.element',
  { scale: 0, rotation: -180 },
  { scale: 1, rotation: 0, duration: 1 }
);
```

### Staggered Animation
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

### Number Counter
```javascript
tl.fromTo('.counter',
  { textContent: 0 },
  { 
    textContent: 100,
    duration: 2,
    snap: { textContent: 1 }
  }
);
```

## 🔧 Troubleshooting

### Preview Won't Start
```bash
# Solution 1: Clear cache
npx hyperframes preview --clear-cache

# Solution 2: Use different port
npx hyperframes preview --port 3001

# Solution 3: Check node_modules
npm install
npx hyperframes preview
```

### Lint Errors After Editing
```bash
# View detailed errors
npx hyperframes lint --verbose

# Auto-fix issues
npx hyperframes lint --fix

# Common issues:
# - Missing imports (add <script> tags)
# - Invalid HTML structure (check tags)
# - Unresolved dependencies (npm install)
```

### Export Fails
```bash
# Verify dependencies
npm list gsap @heygen/hyperframes

# Reinstall if needed
npm install

# Try export again
npx hyperframes export

# Check FFmpeg installation
which ffmpeg  # Should be in system PATH
```

### Video Quality Issues
```bash
# Increase quality for export
npx hyperframes export --quality ultra --fps 60

# Check source resolution (should match)
# width: 1920, height: 1080 recommended
```

## 📋 Checklist for Creating Videos

### Planning
- [ ] Define video purpose and target audience
- [ ] Write script/outline
- [ ] Plan scene transitions
- [ ] Gather brand guidelines
- [ ] Collect images and assets

### Creation (Claude Design)
- [ ] Request video with HyperFrames
- [ ] Provide detailed requirements
- [ ] Review initial draft
- [ ] Get ZIP export

### Editing (Claude Code)
- [ ] Extract and preview video
- [ ] Test all animations
- [ ] Adjust timing and pacing
- [ ] Optimize performance
- [ ] Cross-browser testing

### Finalization
- [ ] Export final video(s)
- [ ] Verify file size
- [ ] Test embedding in docs
- [ ] Add captions/subtitles
- [ ] Commit to git

### Integration
- [ ] Place video in `static/videos/`
- [ ] Add to documentation markdown
- [ ] Update table of contents
- [ ] Test on mobile devices
- [ ] Push to repository

## 📚 Documentation Reference

### Within This Project
- `.claude/skills/hyperframes-editing/README.md` - Quick start
- `.claude/skills/hyperframes-editing/SKILL.md` - Technical details
- `.claude/skills/hyperframes-editing/VIDEO_TEMPLATE.md` - Project template
- `.claude/skills/hyperframes-editing/EXAMPLES.md` - Code examples

### External Resources
- **HyperFrames Official Docs**: https://hyperframes.heygen.com/docs
- **GSAP Documentation**: https://greensock.com/gsap/
- **GitHub Repository**: https://github.com/heygen-com/hyperframes
- **Claude Design Guide**: https://github.com/heygen-com/hyperframes/blob/main/docs/guides/claude-design-hyperframes.md

## 🎯 Best Practices

### Animation Quality
✓ Keep frame rate at 60fps  
✓ Use `transform` and `opacity` only  
✓ Apply `will-change` for GPU acceleration  
✓ Test animations at different speeds  
✗ Don't animate layout properties (width, height)  
✗ Don't over-animate (less is more)  

### Video Organization
✓ Keep videos under 60 seconds for web  
✓ Use clear, descriptive filenames  
✓ Store in `static/videos/` directory  
✓ Provide multiple formats (MP4 + WebM)  
✓ Include video captions/subtitles  

### Development Workflow
✓ Always preview before exporting  
✓ Use version control for source files  
✓ Keep original HyperFrames project  
✓ Document custom animations  
✓ Test on multiple browsers  

## 🔐 Security Notes

- Videos are stored locally, no external uploads required
- All code is client-side rendering
- No sensitive data should be embedded in videos
- FFmpeg is installed with HyperFrames automatically

## 🆚 Skill vs Manual Workflow

### Using `@hyperframes-editing` Skill
```
💬 "Edit the timing of animations in this video"
```
Automatically loads:
- Context from SKILL.md
- Best practices from EXAMPLES.md
- Template from VIDEO_TEMPLATE.md

### Manual Workflow
```bash
# Without the skill
npx hyperframes preview
# Edit files manually
# npx hyperframes lint
# npx hyperframes export
```

**Recommendation**: Use the skill for guidance, manual commands for execution.

## 🎓 Learning Resources

### Beginner Path
1. Read `README.md` in skills folder
2. Review `VIDEO_TEMPLATE.md`
3. Try Example 1 in `EXAMPLES.md`
4. Create your first simple video

### Intermediate Path
1. Study `SKILL.md` technical details
2. Explore all examples in `EXAMPLES.md`
3. Learn GSAP easing and timing
4. Build feature demo video

### Advanced Path
1. Master timeline synchronization
2. Create complex animations
3. Optimize video performance
4. Build automated export pipeline

## 📊 Configuration

Your project is configured in `.claude/settings.json`:

```json
{
  "video": {
    "outputDir": "static/videos",
    "defaultFormat": "mp4",
    "defaultResolution": {
      "width": 1920,
      "height": 1080
    },
    "defaultFrameRate": 60,
    "defaultQuality": "high"
  }
}
```

Modify as needed for your documentation requirements.

## 🚀 Next Steps

1. **Install HyperFrames**: `npm install -g @heygen/hyperframes`
2. **Review Examples**: Check `skills/hyperframes-editing/EXAMPLES.md`
3. **Start with Claude Design**: Request your first video
4. **Edit with Claude Code**: Refine using this skill
5. **Embed in Docs**: Add video to your documentation
6. **Share & Iterate**: Get feedback and improve

## 📞 Support & Troubleshooting

For issues:
1. Check troubleshooting section above
2. Review SKILL.md for technical details
3. See EXAMPLES.md for implementation patterns
4. Consult external resources (HyperFrames, GSAP docs)

---

**HyperFrames Integration Version**: 1.0.0  
**Created**: 2026-09-16  
**For**: Capacitor Documentation Project  

**Skill Name**: `@hyperframes-editing`  
**Ready to use!** 🎬🚀
