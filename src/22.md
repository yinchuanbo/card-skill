---
title: "告别 React 性能瓶颈"
tags:
  - React
  - 性能优化
time: 2025-03-15 18:11:08
---

## 1\. 分析和监控性能

使用工具找出瓶颈：

- React DevTools：检查组件层次结构，识别重新渲染问题。

```sh
npm install --save-dev @react-devtools/extension
```

在浏览器中使用它来检查不必要的渲染。

VS Code 扩展：

- ESLint：确保代码干净且优化。
- Prettier：强制执行一致的代码格式。
- Code Time：跟踪您的编码习惯，关注缓慢的部分。

## 2\. 优化渲染

使用 `React.memo`：包装函数组件，避免不必要的重新渲染。

```jsx
import React, { memo } from "react";

constMyComponent = memo(({ prop }) => {
  console.log("Rendering MyComponent");
  return <div>{prop}</div>;
});

exportdefaultMyComponent;
```

使用`useCallback`和`useMemo`：防止每次渲染时创建新的函数实例。

```jsx
import React, { useState, useCallback, useMemo } from "react";

constApp = () => {
  const [count, setCount] = useState(0);

  const expensiveComputation = useMemo(() => {
    console.log("Expensive computation");
    return count * 2;
  }, [count]);

  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      Count: {count}
      <br />
      Double: {expensiveComputation}
      <br />
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default App;
```

## 3\. 最小化状态重新渲染

提升状态：仅在必要时共享状态。

避免 **Props Drilling** ：使用 Context API 或状态管理工具，如 Redux 或 Zustand。

```sh
npm install zustand
```

使用 Zustand 的示例：

```jsx
import create from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

constCounter = () => {
  const { count, increment } = useStore();

  return (
    <div>
      Count: {count}
      <br />
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Counter;
```

## 4\. 代码分割和懒加载

通过分割代码和懒加载组件来减少初始加载时间：

```jsx
import React, { Suspense, lazy } from "react";

constLazyComponent = lazy(() => import("./LazyComponent"));

constApp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};

export default App;
```

## 5\. 使用正确的构建工具

使用 ESBuild 或 SWC 进行更快的构建：

```sh
npm install -D esbuild
```

切换到 Vite 以获得更快的开发服务器：

```sh
npm create vite@latest
```

## 6\. 审查您的依赖项

使用工具如 npm analyze 来识别大型库：

```sh
npm install -g source-map-explorer
source-map-explorer build/static/js/*.js
```

用轻量级替代品替换沉重的库：

- 用原生 JS 或较小的实用库如 remeda 替换 Lodash。
- 使用 date-fns 代替 moment。

## 7\. 提高 VS Code 性能

安装扩展以进行代码检查和性能建议：

- Auto Import：节省管理导入的时间。
- React Pure Components：突出显示可以优化的组件。

调整 VS Code 设置：

```json
{
  "editor.quickSuggestions": {
    "other": true
  },
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "typescript.tsserver.experimental.enableProjectDiagnostics": true
}
```

## 8\. 优化图片和资产

使用 Next.js Image Optimization 或 react-image 等库进行懒加载图片。

压缩资产：

```sh
npm install imagemin-cli
imagemin src/assets/* --out-dir=dist/assets
```

## 9\. 切换到替代品

如果 React 无法满足您的性能需求，请尝试其他框架：

- Solid.js：比 React 更小更快。
- Svelte：在编译时优化组件。
