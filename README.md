# 墨境智库

一个基于 Node.js 开发的知识管理系统，支持 Markdown 格式的知识卡片，具有中国传统文化风格的界面设计。

## 功能特点

- 简洁优雅的中国传统山水风格界面
- 支持 Markdown 格式的知识卡片
- 标签过滤和搜索功能
- 响应式设计，适配各种设备
- 暗色/亮色主题切换
- 佛道儒文化元素装饰

## Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fmojing-zhiku)

## 本地开发

### 环境要求

- Node.js 14+
- npm 或 yarn

### 安装步骤

1. 克隆仓库

   ```bash
   git clone https://github.com/yourusername/mojing-zhiku.git
   cd mojing-zhiku
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 启动开发服务器

   ```bash
   npm run dev
   ```

4. 访问 `http://localhost:3000` 查看效果

## 添加卡片

在 `src` 目录下创建 `.md` 文件，添加以下格式的前置信息:

```markdown
---
title: 卡片标题
tags: [标签1, 标签2]
createdAt: 2023-04-19T12:00:00Z
summary: 卡片摘要，如果不提供将自动截取正文前150个字符
---

这里是卡片正文内容，支持完整的 Markdown 语法。
```

## 部署到 Vercel

1. Fork 或克隆此仓库到您的 GitHub 账户
2. 在 Vercel dashboard 中，点击"New Project"
3. 导入您的 GitHub 仓库
4. 无需更改任何配置，直接点击"Deploy"
5. 部署完成后，您将获得一个`your-project.vercel.app`的域名

## 自定义域名

1. 在 Vercel 项目设置中，找到"Domains"选项卡
2. 添加您的自定义域名
3. 按照 Vercel 的指示配置 DNS 记录

## 许可证

MIT
