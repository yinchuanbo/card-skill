/**
 * Markdown to HTML Converter
 * This script converts markdown files in the src directory to HTML files in the doc directory.
 */

const fs = require("fs-extra");
const path = require("path");
const marked = require("marked");
const matter = require("gray-matter");

// 尝试导入Prism，处理Node.js环境下可能的问题
let Prism;
try {
  Prism = require("prismjs");

  // 加载额外的语言组件
  require("prismjs/components/prism-javascript");
  require("prismjs/components/prism-css");
  require("prismjs/components/prism-python");
  require("prismjs/components/prism-java");
  require("prismjs/components/prism-bash");
  require("prismjs/components/prism-yaml");
  require("prismjs/components/prism-json");
  require("prismjs/components/prism-markdown");
} catch (error) {
  console.warn("Prism.js 加载失败，将使用基本代码格式化: ", error.message);
  Prism = null;
}

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
  highlight: function (code, lang) {
    // 如果Prism不可用或语言不支持，使用基本格式
    if (!Prism || !lang || !Prism.languages[lang]) {
      const language = lang || "text";
      const dataAttr = lang ? `data-language="${lang}"` : "";
      return `<pre ${dataAttr}><code class="language-${language}">${code}</code></pre>`;
    }

    // 使用Prism进行高亮处理
    const highlighted = Prism.highlight(code, Prism.languages[lang], lang);
    const dataAttr = `data-language="${lang}"`;
    return `<pre ${dataAttr}><code class="language-${lang}">${highlighted}</code></pre>`;
  },
});

// Main conversion function
async function convertMarkdownToHtml() {
  try {
    console.log("Starting conversion of markdown files to HTML...");

    // Ensure source directory exists
    const srcDir = path.join(__dirname, "..", "src");
    if (!(await fs.pathExists(srcDir))) {
      console.log("Source directory does not exist. Creating src directory...");
      await fs.ensureDir(srcDir);

      // Create a sample markdown file if src is empty
      const samplePath = path.join(srcDir, "sample.md");
      const sampleContent = createSampleMarkdown();
      await fs.writeFile(samplePath, sampleContent);
      console.log("Created sample markdown file in src directory.");
    }

    // Ensure destination directory exists
    const docDir = path.join(__dirname, "..", "doc");
    await fs.ensureDir(docDir);

    // Get all markdown files from src directory
    const files = await fs.readdir(srcDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    if (mdFiles.length === 0) {
      console.log("No markdown files found in src directory.");
      return;
    }

    console.log(`Found ${mdFiles.length} markdown files.`);

    // Array to store card metadata
    const cards = [];

    // Process each markdown file
    for (const file of mdFiles) {
      const filePath = path.join(srcDir, file);
      const content = await fs.readFile(filePath, "utf8");

      // Parse front matter and markdown content
      const { data, content: markdownContent } = matter(content);

      // Default values if front matter is missing
      const title = data.title || path.basename(file, ".md");
      const tags = data.tags || [];
      const createdAt = data.time || data.createdAt || new Date().toISOString();
      const type = data.type || "default";
      const summary = data.summary || markdownContent.slice(0, 150) + "...";

      // Convert markdown to HTML
      const htmlContent = marked.parse(markdownContent);

      // Create HTML file with card information
      const htmlFileName = path.basename(file, ".md") + ".html";
      const htmlFilePath = path.join(docDir, htmlFileName);

      // Create HTML content with metadata
      const htmlWithMeta = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 墨境智库</title>
    
    <!-- SEO Metadata -->
    <meta name="description" content="${
      summary ? summary.slice(0, 160) : "墨境智库知识卡片"
    }" />
    <meta name="keywords" content="${tags.join(",")},墨境智库,知识管理" />
    <meta name="author" content="墨境智库" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://mojingzhiku.com/doc/${path.basename(
      htmlFilePath
    )}" />
    <meta property="og:title" content="${title} - 墨境智库" />
    <meta property="og:description" content="${
      summary ? summary.slice(0, 160) : "墨境智库知识卡片"
    }" />
    <meta property="og:image" content="/images/icons/social-preview.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://mojingzhiku.com/doc/${path.basename(
      htmlFilePath
    )}" />
    <meta property="twitter:title" content="${title} - 墨境智库" />
    <meta property="twitter:description" content="${
      summary ? summary.slice(0, 160) : "墨境智库知识卡片"
    }" />
    <meta property="twitter:image" content="/images/icons/social-preview.png" />
    
    <!-- Favicon and App Icons -->
    <link rel="icon" href="/images/icons/favicon.svg" type="image/svg+xml">
    <link rel="alternate icon" href="/images/icons/favicon.ico.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/images/icons/icon-192.png">
    <meta name="theme-color" content="#3e5c3e">
    <link rel="manifest" href="/site.webmanifest">
    
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&family=ZCOOL+QingKe+HuangYou&family=Noto+Serif+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Prism.js CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
</head>
<body class="card-detail">
    <div class="container">
        <div class="card-content">
            <header>
                <h1>${title}</h1>
                <div class="meta">
                    <time datetime="${createdAt}">${new Date(
        createdAt
      ).toLocaleDateString()}</time>
                    <div class="tags">
                        ${tags
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                </div>
            </header>
            <div class="content ${type}">
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
    <!-- Prism.js JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
    <!-- 添加额外的语言支持 -->
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-css.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-java.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-bash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-yaml.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-json.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-markdown.min.js"></script>
    <!-- 重新初始化Prism.js -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 手动触发Prism高亮，确保动态加载的内容也能高亮
            Prism.highlightAll();
        });
    </script>
</body>
</html>`;

      // Write the HTML file
      await fs.writeFile(htmlFilePath, htmlWithMeta);
      console.log(`Converted ${file} -> ${htmlFileName}`);

      // Add card metadata to the array
      cards.push({
        id: path.basename(file, ".md"),
        title,
        tags,
        createdAt,
        summary,
        type,
        url: `/doc/${htmlFileName}`,
      });
    }

    // Write cards data to a JSON file for the frontend
    const cardsJsonPath = path.join(__dirname, "..", "public", "cards.json");
    await fs.writeFile(cardsJsonPath, JSON.stringify(cards, null, 2));
    console.log(`Generated cards.json with ${cards.length} cards.`);

    console.log("Conversion completed successfully!");
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
  }
}

// Create a sample markdown file
function createSampleMarkdown() {
  return `---
title: 墨境智库入门指南
tags: [教程, markdown, 入门]
time: ${new Date().toISOString()}
summary: 关于如何使用墨境智库进行有效学习和知识管理的快速介绍。
---

# 墨境智库入门指南

欢迎使用墨境智库！本平台帮助您将知识组织成易于消化的卡片形式，以便更有效地学习和检索。

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
  .then(() => console.log("Script completed."))
  .catch((err) => console.error("Script failed:", err));
