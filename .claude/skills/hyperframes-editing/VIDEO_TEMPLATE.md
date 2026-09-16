# HyperFrames Video Project Template

This template helps create new video content for Capacitor documentation using HyperFrames.

## Quick Start

### 1. Create Project Structure
```bash
cd capacitor-docs
npx hyperframes create videos/my-feature-demo
cd videos/my-feature-demo
```

### 2. Configure Project
Edit `hyperframes.config.js`:
```javascript
module.exports = {
  title: 'Feature Demo',
  duration: 30, // seconds
  framerate: 60,
  resolution: {
    width: 1920,
    height: 1080
  },
  output: {
    format: 'mp4',
    quality: 'high'
  }
};
```

### 3. Create Video Structure (index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feature Demo</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body>
  <div class="container">
    <div class="scene">
      <h1 class="title">Feature Demo</h1>
      <p class="subtitle">Learn how to use this feature</p>
      <div class="content">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
    </div>
  </div>

  <script src="animation.js"></script>
</body>
</html>
```

### 4. Style Video (style.css)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene {
  text-align: center;
  color: white;
}

.title {
  font-size: 72px;
  font-weight: bold;
  margin-bottom: 20px;
  opacity: 0;
}

.subtitle {
  font-size: 36px;
  margin-bottom: 60px;
  opacity: 0;
}

.content {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.item {
  width: 300px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  font-size: 24px;
  opacity: 0;
  transform: translateY(50px);
  backdrop-filter: blur(10px);
}
```

### 5. Create Animations (animation.js)
```javascript
// Create master timeline
const tl = gsap.timeline();

// Sequence animations
tl
  // Fade in title
  .fromTo('.title',
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1 },
    0
  )
  // Fade in subtitle
  .fromTo('.subtitle',
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.8 },
    0.3
  )
  // Stagger in items
  .fromTo('.item',
    { opacity: 0, y: 50, scale: 0.8 },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      duration: 0.6,
      stagger: 0.2
    },
    1
  );
```

## Common Animation Patterns

### Fade In
```javascript
tl.fromTo(selector,
  { opacity: 0 },
  { opacity: 1, duration: 1 }
);
```

### Slide In from Left
```javascript
tl.fromTo(selector,
  { opacity: 0, x: -100 },
  { opacity: 1, x: 0, duration: 1 }
);
```

### Scale and Fade
```javascript
tl.fromTo(selector,
  { opacity: 0, scale: 0 },
  { opacity: 1, scale: 1, duration: 1 }
);
```

### Rotating Text
```javascript
tl.fromTo(selector,
  { rotation: -180, opacity: 0 },
  { rotation: 0, opacity: 1, duration: 1 }
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
    stagger: 0.15  // 150ms delay between each item
  }
);
```

## Preview & Validation

### Start Preview
```bash
npx hyperframes preview
# Open http://localhost:3000 in browser
```

### Validate Project
```bash
npx hyperframes lint
```

### Fix Issues
```bash
npx hyperframes lint --fix
```

## Export Video

### Basic Export
```bash
npx hyperframes export
```

### Custom Settings
```bash
npx hyperframes export \
  --format mp4 \
  --width 1920 \
  --height 1080 \
  --fps 60 \
  --quality high
```

### Output Options
- **Format**: mp4, webm, gif, png-sequence
- **Quality**: low, medium, high, ultra
- **Frame Rate**: 24, 30, 60 fps

## Integration with Docs

### Embed in Markdown
```markdown
<video width="100%" controls>
  <source src="/videos/feature-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### Directory Structure
```
capacitor-docs/
├── static/
│   └── videos/
│       ├── feature-demo.mp4
│       ├── tutorial-01.mp4
│       └── tutorial-02.mp4
├── docs/
│   └── feature-guide.md
```

## Performance Tips

1. **Optimize Assets**
   - Compress images before adding to project
   - Use appropriate image formats (WebP for modern browsers)
   - Minimize animation complexity

2. **Smooth Animations**
   - Use `transform` and `opacity` only
   - Enable GPU acceleration with `will-change`
   - Keep 60fps target

3. **Reduce File Size**
   - Remove unused assets
   - Minify CSS and JavaScript
   - Use appropriate export quality

## Troubleshooting

### "Preview won't start"
```bash
# Clear cache
npx hyperframes preview --clear-cache

# Check port
npx hyperframes preview --port 3001
```

### "Lint errors"
```bash
# View detailed report
npx hyperframes lint --verbose

# Auto-fix issues
npx hyperframes lint --fix
```

### "Export fails"
```bash
# Check dependencies
npm list gsap

# Reinstall
npm install
```

## Version Control

### .gitignore
```
node_modules/
dist/
build/
.DS_Store
*.log
```

### Commit Message Format
```
feat(video): add feature demo video

- Created HyperFrames project for feature demo
- Added GSAP animations for smooth transitions
- Exported 1920x1080 MP4 video
```

## Next Steps

1. Customize colors and fonts for your brand
2. Add your content and images
3. Fine-tune animation timing in preview
4. Export and embed in documentation
5. Commit to git with descriptive message

---

**For more information, see the SKILL.md documentation**
