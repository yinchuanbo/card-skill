# 山水卡片学习系统环境配置指南

本文档详细说明如何为山水卡片学习系统配置本地开发环境和 Vercel 部署环境中的环境变量。正确配置环境变量对于系统安全运行和功能正常工作至关重要。

## 环境变量概述

环境变量是一种在应用程序外部存储配置信息的方法，有助于：

- 保护敏感信息（如 API 密钥、数据库凭据）
- 在不同环境（开发、测试、生产）之间轻松切换配置
- 遵循应用程序配置的最佳实践

## 本地开发环境变量配置

### 创建.env 文件

1. 在项目根目录创建一个名为`.env`的文件
2. 添加必要的环境变量，每行一个，格式为`KEY=VALUE`
3. 确保`.env`文件已添加到`.gitignore`文件中，避免意外提交敏感信息

### 示例.env 文件

```
# 服务器配置
PORT=3000
NODE_ENV=development

# API密钥（如果需要）
THIRD_PARTY_API_KEY=your_api_key_here

# 其他配置
ENABLE_LOGGING=true
```

### 使用 dotenv 加载环境变量

在`server.js`文件开头添加以下代码以加载环境变量：

```javascript
// 仅在非生产环境加载.env文件
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
```

确保已安装 dotenv 包：

```bash
npm install dotenv --save
```

## 在 Vercel 中配置环境变量

### 通过 Vercel 仪表板配置

1. 登录 Vercel 控制台 (https://vercel.com)
2. 进入您的项目
3. 点击"Settings"选项卡
4. 在左侧菜单中选择"Environment Variables"
5. 添加必要的环境变量，包括：
   - 键名（变量名）
   - 值
   - 选择应用环境（生产、预览、开发）

### 必需的环境变量

以下是在 Vercel 上部署山水卡片学习系统时必需的环境变量：

| 变量名              | 描述                              | 示例值     | 必需性 |
| ------------------- | --------------------------------- | ---------- | ------ |
| NODE_ENV            | 运行环境                          | production | 必需   |
| PORT                | 应用程序端口（Vercel 会自动设置） | 3000       | 可选   |
| THIRD_PARTY_API_KEY | 第三方 API 密钥（如有使用）       | xyz123...  | 视情况 |

### 使用 vercel.json 配置环境变量

除了通过仪表板，您还可以在`vercel.json`文件中预配置某些环境变量：

```json
{
  "env": {
    "MY_VARIABLE": "default_value"
  },
  "build": {
    "env": {
      "BUILD_TIME_VARIABLE": "value"
    }
  }
}
```

注意：不要在`vercel.json`中包含敏感信息，因为该文件会提交到代码仓库。

## 使用环境变量

### 在 Node.js 中访问环境变量

在服务器端代码中，可以通过`process.env`对象访问环境变量：

```javascript
const port = process.env.PORT || 3000;
const apiKey = process.env.THIRD_PARTY_API_KEY;

console.log(`服务器运行在端口 ${port}`);
```

### 在前端代码中安全地使用环境变量

要在前端 JavaScript 中使用环境变量，请遵循以下安全实践：

1. **仅暴露非敏感信息**：只将必要且非敏感的配置传递给前端
2. **通过服务器端渲染或 API 注入变量**：

   - 服务器渲染方法（推荐）：

     ```javascript
     app.get("/", (req, res) => {
       res.render("index", {
         PUBLIC_CONFIG: JSON.stringify({
           APP_VERSION: process.env.APP_VERSION,
           FEATURE_FLAGS: process.env.FEATURE_FLAGS,
         }),
       });
     });
     ```

   - 在 HTML 模板中：

     ```html
     <script>
       window.APP_CONFIG = {{{PUBLIC_CONFIG}}};
     </script>
     ```

3. **替代方法**：创建一个专门的 API 端点来获取公共配置

## 环境变量命名最佳实践

1. **使用大写字母和下划线**：`DATABASE_URL`而非`databaseUrl`
2. **使用描述性名称**：确保名称清晰表达变量的用途
3. **使用前缀分组相关变量**：如`DB_HOST`、`DB_USER`、`DB_PASSWORD`
4. **避免通用名称**：如`URL`、`KEY`，这可能导致命名冲突

## 环境变量安全最佳实践

1. **永远不要将.env 文件提交到代码仓库**
2. **定期轮换敏感凭据**，如 API 密钥
3. **限制环境变量的范围**，仅对需要访问的环境公开
4. **使用 Vercel 的加密环境变量**功能存储特别敏感的信息
5. **在团队中安全共享环境变量**，考虑使用密码管理器

## 环境变量故障排除

### 常见问题

1. **变量未定义**：确保变量名称拼写正确，区分大小写
2. **变量值不正确**：检查是否有多余的空格或引号
3. **变量不可在生产环境访问**：确保在 Vercel 控制台中正确设置

### 调试方法

1. 临时添加环境变量调试日志：

   ```javascript
   console.log("环境变量:", {
     NODE_ENV: process.env.NODE_ENV,
     PORT: process.env.PORT,
     // 不要记录敏感变量的完整值！
     HAS_API_KEY: !!process.env.API_KEY,
   });
   ```

2. 使用 Vercel CLI 查看当前环境变量：
   ```bash
   vercel env ls
   ```

## 不同环境的配置策略

### 开发环境

- 使用本地`.env`文件
- 可以使用测试/模拟 API 密钥
- 启用调试和日志记录

### 预览环境（Vercel 预览部署）

- 为测试/QA 配置近似生产的设置
- 使用独立的测试数据存储
- 可能启用额外的调试功能

### 生产环境

- 使用真实 API 密钥和生产配置
- 禁用详细日志记录
- 优化性能相关配置

## 结论

正确配置环境变量对于山水卡片学习系统的安全性和可维护性至关重要。遵循本指南确保您的应用程序在本地开发和 Vercel 部署中都能安全、正确地运行。

记住，环境变量是保护敏感配置信息的第一道防线，应当谨慎处理并遵循最佳实践。
