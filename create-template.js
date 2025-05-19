#!/usr/bin/env node

/**
 * 自动创建新的Markdown文件模板
 *
 * 此脚本会:
 * 1. 扫描src目录中现有的.md文件
 * 2. 找出最大的数字编号
 * 3. 创建一个新文件，编号为最大编号+1
 * 4. 使用预定义的模板格式
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Configuration
const config = {
  sourceDir: "./src",
  defaultTitle: "新文章标题",
  defaultTags: ["前端", "学习笔记"],
};

// Function to find the maximum file number in the src directory
function findMaxFileNumber() {
  try {
    if (!fs.existsSync(config.sourceDir)) {
      console.log(`Creating ${config.sourceDir} directory...`);
      fs.mkdirSync(config.sourceDir, { recursive: true });
      return 0;
    }

    const files = fs.readdirSync(config.sourceDir);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    if (markdownFiles.length === 0) {
      return 0;
    }

    const fileNumbers = markdownFiles.map((file) => {
      // Extract number from filename (e.g., "01.md" -> 1, "54.md" -> 54)
      const match = file.match(/^(\d+)\.md$/);
      return match ? parseInt(match[1], 10) : 0;
    });

    return Math.max(...fileNumbers);
  } catch (error) {
    console.error("Error finding max file number:", error);
    return 0;
  }
}

// Function to generate a timestamp in the format YYYY-MM-DD HH:MM:SS
function generateTimestamp() {
  const now = new Date();
  const year = 2025; // Fixed year to match existing pattern
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to create a Markdown template
function createMarkdownTemplate(title, tags) {
  const timestamp = generateTimestamp();

  // Format tags with proper indentation
  const formattedTags = tags.map((tag) => `  - ${tag}`).join("\n");

  return `---
title: "${title}"
tags:
${formattedTags}
time: ${timestamp}
---
`;
}

// Main function
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Find the next file number
    const maxFileNumber = findMaxFileNumber();
    const nextFileNumber = maxFileNumber + 1;
    const paddedFileNumber = String(nextFileNumber).padStart(2, "0");
    const newFileName = `${paddedFileNumber}.md`;
    const filePath = path.join(config.sourceDir, newFileName);

    // Ask for title
    const title = await new Promise((resolve) => {
      rl.question(
        `Enter article title (default: "${config.defaultTitle}"): `,
        (answer) => {
          resolve(answer.trim() || config.defaultTitle);
        }
      );
    });

    // Ask for tags
    const tagsInput = await new Promise((resolve) => {
      rl.question(
        `Enter tags separated by commas (default: ${config.defaultTags.join(
          ", "
        )}): `,
        (answer) => {
          resolve(answer.trim());
        }
      );
    });

    // Process tags
    const tags = tagsInput
      ? tagsInput.split(",").map((tag) => tag.trim())
      : config.defaultTags;

    // Create the markdown content
    const markdownContent = createMarkdownTemplate(title, tags);

    // Write to file
    fs.writeFileSync(filePath, markdownContent);

    console.log(`✅ New markdown template created: ${filePath}`);
    console.log(`Title: ${title}`);
    console.log(`Tags: ${tags.join(", ")}`);
    console.log(`Next file number: ${nextFileNumber}`);
  } catch (error) {
    console.error("Error creating template:", error);
  } finally {
    rl.close();
  }
}

// Run the script
main();
