---
layout: post
title: "Jekyll Features Showcase & Markdown Guide"
date: 2026-06-06
tags: [jekyll, markdown, guide, showcase]
description: "A comprehensive guide showing how our cyberpunk theme styles various markdown and Jekyll features."
---

This post serves as a **live showcase** and reference document for writing blogs on your new Jekyll portfolio. It displays all the custom styling features implemented in `assets/css/styles.css` for rendered markdown content, including headings, code blocks, lists, blockquotes, tables, and more.

---

## Headings and Hierarchy

All standard markdown headings (H1, H2, and H3) are styled using the display font (**Syncopate**) to match the cyberpunk/neon aesthetic:

# Heading 1 (Large Title)
## Heading 2 (Section Title with Neon Underline)
### Heading 3 (Subsection Title in Neon Cyan)

---

## Inline Styles & Formatting

You can apply standard typographic styles to emphasize your content:

- **Bold Text**: Styled in pure white and bold (`**bold**` or `__bold__`).
- *Italic Text*: Styled with a neon-purple accent (`*italics*` or `_italics_`).
- **_Combined Bold & Italic_**: Renders both styles nested together.
- [Clickable Link](https://github.com/nirusaki-malaal): Custom styled in neon-cyan with a smooth transition. Hovering turns the link neon-pink.

---

## Bullet & Numbered Lists

Lists have custom bullet points matching our terminal/ninja theme.

### Unordered Lists (Custom Chevron Bullets)

* Python automation pipelines
* Telegram API integrations using Pyrogram
* Linux configurations and scripts
  * Nested item with custom indentation
  * Nested item 2

### Ordered Lists (Neon Numbering)

1. First, build the backend server (FastAPI/Flask)
2. Next, deploy to your cloud infrastructure (Vercel/Heroku/Railway)
3. Finally, verify responsiveness and user experience

---

## Blockquotes (Accent Borders)

Blockquotes are styled with a neon-purple left border and a subtle purple background opacity (`rgba(176, 38, 255, 0.05)`) to highlight quotes, warnings, or core concepts.

> "In the shadows of the terminal, every line of code tells a story. We don't build bugs; we craft silent automation systems."
> — *Code Shinobi Philosophy*

---

## Code Blocks & Syntax Highlighting

### Inline Code
Use backticks to define inline code. It renders with a soft neon-cyan background highlight: `const GITHUB_USERNAME = 'Nirusaki-Malaal';`.

### Fenced Code Blocks
Use triple backticks with a language specifier for syntax highlighting. They render inside custom scrollable dark boxes with borders:

```python
import json
import time

def fetch_repos(username):
    # Caching helper demonstration
    cache_ttl = 1800 # 30 minutes
    print(f"Fetching GitHub repos for {username}...")
    
    return {
        "status": 200,
        "username": username,
        "timestamp": int(time.time())
    }
```

```javascript
// Keyboard Shortcuts for Search
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch(); // Triggers modal search overlay
    }
});
```

---

## Tables

Tables have full custom styling with neon-cyan heading backgrounds, transparent row layouts, and white border lines.

| Technology Stack | Category | Usage in Portfolio |
| :--- | :--- | :--- |
| **Python** | Backend & Scripts | Telegram bots, automated scraping |
| **Jekyll** | Static Site Generator | Modular blog posts and pages compilation |
| **TailwindCSS** | Utility UI CSS | Modern responsive card layout system |
| **Three.js & GSAP** | Animation | Particle background and scroll transitions |

---

## Responsive Media & Images

Images are styled with thin borders and rounded corners, scaling perfectly on both PC and mobile devices.

![Default GitHub Avatar](https://avatars.githubusercontent.com/u/213580728?v=4&s=200)

*Caption: The responsive GitHub avatar dynamically adjusts width up to 100%.*

---

## Front Matter Configurations

Every post must start with a Front Matter block at the top of the file enclosed in `---` dashes:

```yaml
---
layout: post                         # Uses the blog post layout template
title: "Jekyll Features Showcase"    # Title of the post
date: 2026-06-06                     # Publish date
tags: [jekyll, markdown, guide]      # List of tags (useful for search/filters)
description: "A custom description." # SEO description for head tags
---
```

Use these properties to automatically update layout structure, build tags, generate search indexes, and populate SEO tags under the hood!
