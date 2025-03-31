const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const marked = require("marked");
const matter = require("gray-matter");

const app = express();
const port = process.env.PORT || 3000;

// 在Vercel环境中创建临时目录
const docDir = path.join(process.cwd(), "doc");
const publicDir = path.join(process.cwd(), "public");
const srcDir = path.join(process.cwd(), "src");

// 确保目录存在
fs.ensureDirSync(docDir);
fs.ensureDirSync(publicDir);

// Serve static files
app.use(express.static(publicDir));
app.use("/doc", express.static(docDir));

// Route for the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 添加cards.json路由
app.get("/cards.json", async (req, res) => {
  try {
    // 先尝试读取已存在的cards.json文件
    const cardsJsonPath = path.join(publicDir, "cards.json");
    if (fs.existsSync(cardsJsonPath)) {
      const cardsData = await fs.readFile(cardsJsonPath, "utf8");
      return res.json(JSON.parse(cardsData));
    }

    // 如果文件不存在，则动态生成
    const cards = await generateCardsData();
    res.json(cards);
  } catch (error) {
    console.error("Error serving cards.json:", error);
    res.status(500).json({ error: "Failed to load cards data" });
  }
});

// 添加doc路由
app.get("/doc/:htmlFile", async (req, res) => {
  try {
    const htmlFileName = req.params.htmlFile;
    const htmlFilePath = path.join(docDir, htmlFileName);

    // 检查文件是否存在
    if (fs.existsSync(htmlFilePath)) {
      return res.sendFile(htmlFilePath);
    }

    // 如果不存在，尝试从md文件生成
    const mdFileName = htmlFileName.replace(".html", ".md");
    const mdFilePath = path.join(srcDir, mdFileName);

    if (!fs.existsSync(mdFilePath)) {
      return res.status(404).send("File not found");
    }

    // 读取并解析md文件
    const content = await fs.readFile(mdFilePath, "utf8");
    const { data, content: markdownContent } = matter(content);

    // 准备数据
    const title = data.title || path.basename(mdFileName, ".md");
    const tags = data.tags || [];
    const createdAt = data.time || data.createdAt || new Date().toISOString();

    // 转换markdown为html
    const htmlContent = marked.parse(markdownContent);

    // 创建HTML内容
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
                <div class="content">
                    ${htmlContent}
                </div>
            </article>
            <script src="/js/main.js"></script>
        </body>
        </html>
        `;

    // 在Vercel环境中不写入文件，直接返回内容
    res.send(htmlWithMeta);
  } catch (error) {
    console.error("Error serving HTML file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to generate cards data from markdown files
async function generateCardsData() {
  try {
    // 检查源目录是否存在
    await fs.ensureDir(srcDir);

    // 获取所有markdown文件
    const files = await fs.readdir(srcDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // 存储卡片元数据的数组
    const cards = [];

    // 处理每个markdown文件
    for (const file of mdFiles) {
      const filePath = path.join(srcDir, file);
      const content = await fs.readFile(filePath, "utf8");

      // 解析front matter和markdown内容
      const { data, content: markdownContent } = matter(content);

      // 如果front matter缺失则使用默认值
      const title = data.title || path.basename(file, ".md");
      const tags = data.tags || [];
      const createdAt = data.time || data.createdAt || new Date().toISOString();
      const summary = data.summary || markdownContent.slice(0, 150) + "...";

      // 添加卡片元数据到数组
      cards.push({
        id: path.basename(file, ".md"),
        title,
        tags,
        createdAt,
        summary,
        url: `/doc/${path.basename(file, ".md")}.html`,
      });
    }

    // 在非Vercel环境中，写入cards.json文件
    if (process.env.NODE_ENV !== "production") {
      await fs.writeFile(
        path.join(publicDir, "cards.json"),
        JSON.stringify(cards, null, 2)
      );
    }

    return cards;
  } catch (error) {
    console.error("Error generating cards data:", error);
    return [];
  }
}

// Function to convert Markdown files to HTML
async function convertMarkdownToHtml() {
  try {
    // 创建doc目录（如果不存在）
    await fs.ensureDir(docDir);

    // 获取所有markdown文件
    const files = await fs.readdir(srcDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // 处理每个markdown文件
    for (const file of mdFiles) {
      const filePath = path.join(srcDir, file);
      const content = await fs.readFile(filePath, "utf8");

      // 解析front matter和markdown内容
      const { data, content: markdownContent } = matter(content);

      // 如果front matter缺失则使用默认值
      const title = data.title || path.basename(file, ".md");
      const tags = data.tags || [];
      const createdAt = data.time || data.createdAt || new Date().toISOString();

      // 转换markdown为html
      const htmlContent = marked.parse(markdownContent);

      // 创建HTML文件
      const htmlFileName = path.basename(file, ".md") + ".html";
      const htmlFilePath = path.join(docDir, htmlFileName);

      // 创建HTML内容
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
                            <time datetime="${createdAt}">${new Date(
        createdAt
      ).toLocaleDateString()}</time>
                            <div class="tags">
                                ${tags
                                  .map(
                                    (tag) => `<span class="tag">${tag}</span>`
                                  )
                                  .join("")}
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

      // 写入HTML文件
      await fs.writeFile(htmlFilePath, htmlWithMeta);
    }

    // 生成cards.json
    await generateCardsData();

    console.log(
      `Successfully converted ${mdFiles.length} markdown files to HTML`
    );
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
  }
}

// 在非Vercel环境中运行时，进行初始转换
if (process.env.NODE_ENV !== "production") {
  convertMarkdownToHtml();
}

// 在本地开发环境中启动服务器
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// 导出Express应用供Vercel使用
module.exports = app;
