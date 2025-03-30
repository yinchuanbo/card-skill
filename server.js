const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const marked = require('marked');
const matter = require('gray-matter');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));
app.use('/doc', express.static('doc'));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to convert Markdown files to HTML
const convertMarkdownToHtml = async () => {
    try {
        // Create doc directory if it doesn't exist
        await fs.ensureDir(path.join(__dirname, 'doc'));
        
        // Get all markdown files from src directory
        const files = await fs.readdir(path.join(__dirname, 'src'));
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        // Array to store card metadata
        const cards = [];
        
        // Process each markdown file
        for (const file of mdFiles) {
            const filePath = path.join(__dirname, 'src', file);
            const content = await fs.readFile(filePath, 'utf8');
            
            // Parse front matter and markdown content
            const { data, content: markdownContent } = matter(content);
            
            // Default values if front matter is missing
            const title = data.title || path.basename(file, '.md');
            const tags = data.tags || [];
            const createdAt = data.createdAt || new Date().toISOString();
            const summary = data.summary || markdownContent.slice(0, 150) + '...';
            
            // Convert markdown to HTML
            const htmlContent = marked.parse(markdownContent);
            
            // Create HTML file with card information
            const htmlFileName = path.basename(file, '.md') + '.html';
            const htmlFilePath = path.join(__dirname, 'doc', htmlFileName);
            
            // Create HTML content with metadata
            const htmlWithMeta = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body class="card-detail">
                <article class="card-content">
                    <header>
                        <h1>${title}</h1>
                        <div class="meta">
                            <time datetime="${createdAt}">${new Date(createdAt).toLocaleDateString()}</time>
                            <div class="tags">
                                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </header>
                    <div class="content">
                        ${htmlContent}
                    </div>
                </article>
                <script src="/js/main.js"></script>
            </body>
            </html>
            `;
            
            // Write the HTML file
            await fs.writeFile(htmlFilePath, htmlWithMeta);
            
            // Add card metadata to the array
            cards.push({
                id: path.basename(file, '.md'),
                title,
                tags,
                createdAt,
                summary,
                url: `/doc/${htmlFileName}`
            });
        }
        
        // Write cards data to a JSON file for the frontend
        await fs.writeFile(
            path.join(__dirname, 'public', 'cards.json'),
            JSON.stringify(cards, null, 2)
        );
        
        console.log(`Successfully converted ${mdFiles.length} markdown files to HTML`);
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
    }
};

// Convert markdown to HTML on server start
convertMarkdownToHtml();

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 