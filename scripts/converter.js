/**
 * Markdown to HTML Converter
 * This script converts markdown files in the src directory to HTML files in the doc directory.
 */

const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

// Configure marked for GitHub-flavored markdown
marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
});

// Main conversion function
async function convertMarkdownToHtml() {
    try {
        console.log('Starting conversion of markdown files to HTML...');
        
        // Ensure source directory exists
        const srcDir = path.join(__dirname, '..', 'src');
        if (!await fs.pathExists(srcDir)) {
            console.log('Source directory does not exist. Creating src directory...');
            await fs.ensureDir(srcDir);
            
            // Create a sample markdown file if src is empty
            const samplePath = path.join(srcDir, 'sample.md');
            const sampleContent = createSampleMarkdown();
            await fs.writeFile(samplePath, sampleContent);
            console.log('Created sample markdown file in src directory.');
        }
        
        // Ensure destination directory exists
        const docDir = path.join(__dirname, '..', 'doc');
        await fs.ensureDir(docDir);
        
        // Get all markdown files from src directory
        const files = await fs.readdir(srcDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        if (mdFiles.length === 0) {
            console.log('No markdown files found in src directory.');
            return;
        }
        
        console.log(`Found ${mdFiles.length} markdown files.`);
        
        // Array to store card metadata
        const cards = [];
        
        // Process each markdown file
        for (const file of mdFiles) {
            const filePath = path.join(srcDir, file);
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
            const htmlFilePath = path.join(docDir, htmlFileName);
            
            // Create HTML content with metadata
            const htmlWithMeta = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="card-detail">
    <div class="container">
        <div class="card-content">
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
        </div>
        
        <div class="return-link">
            <a href="/">&larr; 返回卡片列表</a>
        </div>
    </div>

    <!-- 简化后的模态框结构 -->
    <div class="modal-overlay" id="modalOverlay">
        <button class="modal-close" id="modalClose">&times;</button>
        <div id="modalContent">
            <!-- 模态框内容将在这里加载 -->
        </div>
    </div>
    
    <script src="/js/main.js"></script>
    <script src="/js/ink-effects.js"></script>
</body>
</html>`;
            
            // Write the HTML file
            await fs.writeFile(htmlFilePath, htmlWithMeta);
            console.log(`Converted ${file} -> ${htmlFileName}`);
            
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
        const cardsJsonPath = path.join(__dirname, '..', 'public', 'cards.json');
        await fs.writeFile(cardsJsonPath, JSON.stringify(cards, null, 2));
        console.log(`Generated cards.json with ${cards.length} cards.`);
        
        console.log('Conversion completed successfully!');
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
    }
}

// Create a sample markdown file
function createSampleMarkdown() {
    return `---
title: 山水卡片系统入门指南
tags: [教程, markdown, 入门]
createdAt: ${new Date().toISOString()}
summary: 关于如何使用山水卡片学习系统进行有效学习和知识管理的快速介绍。
---

# 山水卡片学习系统入门指南

欢迎使用山水卡片学习系统！本平台帮助您将知识组织成易于消化的卡片形式，以便更有效地学习和检索。

## 如何创建卡片

要创建新卡片，只需将 Markdown (.md) 文件添加到 \`src\` 文件夹中。每个 Markdown 文件代表系统中的一张卡片。

### 前置元数据

在每个 Markdown 文件的顶部，您可以使用 YAML 前置元数据添加元数据：

\`\`\`yaml
---
title: 您的卡片标题
tags: [标签1, 标签2, 标签3]
createdAt: 2023-01-01T12:00:00Z
summary: 此卡片包含内容的简短摘要。
---
\`\`\`

### Markdown 内容

在前置元数据之后，您可以使用 Markdown 编写卡片内容：

- 使用 **粗体** 和 *斜体* 强调
- 创建列表，如本列表
- 添加 [链接](https://example.com)
- 包含 \`代码片段\`
- 以及更多功能！

## 整理您的卡片

使用标签来组织和过滤您的卡片。相似主题的卡片应该共享标签，以便更容易找到它们。

祝您学习愉快！
`;
}

// Run the conversion
convertMarkdownToHtml()
    .then(() => console.log('Script completed.'))
    .catch(err => console.error('Script failed:', err)); 