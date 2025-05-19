# Card Learning System

A high-quality card learning website system using Node.js, HTML, CSS, and JavaScript.

## Features

- Markdown-based content management
- Card-based learning interface
- Responsive design
- Tag-based filtering
- Dark/Light mode toggle

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at http://localhost:3000 (or the port specified in your environment).

### Building

```bash
npm run build
```

## Content Management

### Creating New Content

To create a new card content file:

```bash
npm run new
```

This command will:

1. Find the next available number in the sequence
2. Prompt you for a title and tags
3. Create a new Markdown file in the `src` directory with the proper format

### Editing Content

All content is stored in the `src` directory as Markdown files. Each file has a front matter section with metadata:

```markdown
---
title: "Article Title"
tags:
  - Tag1
  - Tag2
time: YYYY-MM-DD HH:MM:SS
---

## Content starts here...
```

### Converting Content

The system automatically converts Markdown content to HTML:

```bash
npm run convert
```

## License

MIT
