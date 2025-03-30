# Card Learning System

A high-quality card learning website system built with Node.js, HTML, CSS, and JavaScript. This application allows you to create and manage learning cards from Markdown files with beautiful presentation and advanced animations.

## Features

- **Markdown to HTML Conversion**: Automatically converts Markdown files to HTML cards
- **Beautiful Card Layout**: Displays cards with a modern, responsive design
- **Advanced Animations**: Smooth transitions and effects for a polished user experience
- **Search & Filter**: Easily find cards by title, content, or tags
- **Full-Screen Card View**: View complete card content in an elegant modal overlay
- **Mobile-Friendly**: Fully responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/card-learning-system.git
   cd card-learning-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Markdown files to the `src` directory. Each file should have front matter metadata:
   ```md
   ---
   title: Your Card Title
   tags: [tag1, tag2, tag3]
   createdAt: 2023-01-01T12:00:00Z
   summary: A brief summary of what this card contains.
   ---

   # Your content goes here
   ```

4. Convert Markdown files to HTML:
   ```bash
   npm run convert
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Development Mode

For development with automatic restarts:
```bash
npm run dev
```

## Folder Structure

- `src/`: Source Markdown files
- `doc/`: Generated HTML files
- `public/`: Static assets (CSS, JS, images)
- `scripts/`: Utility scripts
- `server.js`: Express server for serving the application

## Customization

### Styling

Modify the CSS in `public/css/styles.css` to customize the appearance.

### Card Layout

Edit the HTML generation in `scripts/converter.js` to change the card structure.

### Adding Features

The application is built on Express.js, making it easy to add new routes and functionality.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Marked](https://marked.js.org/)
- [Gray Matter](https://github.com/jonschlinkert/gray-matter)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)