---
title: "如何用 Docker 部署前端项目"
tags:
  - Docker
time: 2025-03-14 23:10:34
---

## 前言

在前端开发中，部署项目往往是一个令人头疼的环节。传统的部署方式不仅复杂，还容易因为环境差异导致各种问题。而 Docker 的出现，为前端项目的部署带来了全新的解决方案。今天，就让我们一起探索如何使用 Docker 部署前端项目，让你的部署过程变得轻松又高效！

### 一. Docker 的优势

Docker 是一个开源的应用容器引擎，它通过容器化的方式，将应用及其依赖打包在一起，确保应用在不同环境中都能稳定运行。与传统的虚拟机相比，Docker 的启动速度更快、资源占用更少、性能更接近原生。使用 Docker，你可以轻松实现开发、测试和生产环境的一致性，避免“在我的电脑上能运行，但别人的电脑不行”的尴尬局面。

### 二. Docker 的基本概念

在开始之前，我们需要了解 Docker 的三个基本概念：镜像、容器和仓库。

- **镜像（Image）**：镜像是一个只读的模板，用于创建容器。它包含了运行应用所需的所有内容，如代码、运行时、库等。镜像在构建成功后不会变化，只用于启动容器。
- **容器（Container）**：容器是镜像的运行实例，可以被启动、停止、删除。一个镜像可以实例化出多个容器，每个容器之间是独立的。容器是运行程序的地方，可以理解为一个轻量级的虚拟机。
- **仓库（Repository）**：仓库用于存储和分发镜像。Docker Hub 是一个公共的镜像仓库，用户可以在上面托管和分享自己的镜像。

### 三. 将前端项目容器化

1. **编写 Dockerfile**

在项目根目录下创建一个  `Dockerfile`，用于配置 Docker 的构建信息。以下是一个简单的示例：

```docker
# 使用 Node.js 作为基础镜像
FROM node:16.14.2

# 将当前工作目录设置为/app
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到 /app 目录下
COPY package*.json ./

# 运行 npm install 安装依赖
RUN yarn install

# 将源代码复制到 /app 目录下
COPY . .

# 打包构建
RUN npm run build

# 将构建后的代码复制到 nginx 镜像中
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置到镜像中
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 启动 nginx 服务
CMD ["nginx", "-g", "daemon off;"]
```

2. **构建镜像**

在项目根目录下运行以下命令，构建前端镜像：

```docker
docker build -t my-frontend:v1 .
```

3. **运行容器**

构建完成后，运行以下命令启动容器：

```docker
docker run -d -p 3000:80 --name my-frontend-container my-frontend:v1
```

访问  `http://localhost:3000`，即可看到你的前端项目已经成功部署！

### 四. 后端服务的容器化

如果你的前端项目需要与后端服务交互，同样可以使用 Docker 来部署后端服务。以下是一个简单的 Node.js 后端服务的 Dockerfile 示例：

```docker
# 指定基础镜像
FROM node:16.14.2

# 设置工作目录
WORKDIR /app

# 复制项目文件
ADD . /app

# 安装依赖
RUN npm install

# 暴露端口
EXPOSE 1000

# 启动服务
CMD ["node", "app.js"]
```

构建并运行后端服务容器：

```docker
docker build -t my-backend:v1 .
docker run -d --name my-backend-container -p 9000:1000 my-backend:v1
```

### 五. Nginx 反向代理

为了让前端项目能够正常访问后端接口，我们需要配置 Nginx 作为反向代理。在  `Dockerfile`  中添加以下配置：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
    }

    location /api/ {
        proxy_pass http://<后端容器IP>:<后端端口>;
    }
}
```

修改完成后，重新构建并运行前端容器即可。

## 总结

通过 Docker，你可以轻松实现前端项目的容器化部署，告别复杂的环境配置和部署流程。Docker 不仅能提高开发效率，还能确保应用在不同环境下的稳定性。希望这篇文章能帮助你快速掌握 Docker 的使用，让你的前端项目部署变得更加轻松愉快！
