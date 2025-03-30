---
title: "Promise.allSettled"
tags:
  - Promise
time: 2025-03-09 09:50:25
---

处理异步操作已经成为了 JavaScript 日常编码的核心部分。随着应用复杂度的增加，我们经常需要并发执行多个异步任务并合理处理它们的结果。长期以来，`Promise.all()`  一直是我们处理并发 Promise 的首选方法，但它存在一个致命缺陷：一旦任何一个 Promise 被拒绝（rejected），整个操作就会失败。

## Promise.all 的局限性

让我们先回顾一下  `Promise.all()`  的工作方式及其局限性：

```js
const promises = [
  fetch("/api/users"),
  fetch("/api/products"),
  fetch("/api/orders"),
];
Promise.all(promises)
  .then((results) => {
    // 处理所有成功结果
    const [users, products, orders] = results;
    // 进一步处理数据
  })
  .catch((error) => {
    // 如果任何一个 Promise 失败，就会执行这里
    console.error("至少有一个请求失败：", error);
    // 但我们不知道哪些请求成功了，哪些失败了
  });
```

这种方法的主要问题在于：

- 任何一个 Promise 失败都会导致整个操作失败
- 你无法知道哪些操作成功，哪些失败
- 你无法获取成功操作的结果

在实际应用中，我们通常希望即使某些操作失败，也能继续处理成功的结果。例如，在加载仪表板组件时，即使某个组件的数据获取失败，我们也希望显示其他组件。

## Promise.allSettled 来拯救

`Promise.allSettled()`  解决了上述所有问题。它会等待所有 Promise 完成（无论成功或失败），并返回一个包含每个 Promise 结果的数组：

```js
const promises = [
  fetch("/api/users").then((r) => r.json()),
  fetch("/api/products").then((r) => r.json()),
  fetch("/api/orders").then((r) => r.json()),
];

Promise.allSettled(promises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Promise ${index} 成功：`, result.value);
    } else {
      console.log(`Promise ${index} 失败：`, result.reason);
    }
  });
  // 你可以处理所有成功的结果，同时了解哪些失败了
  const successfulData = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  // 处理成功获取的数据
  processData(successfulData);
});
```

## Promise.allSettled 返回值结构

`Promise.allSettled()`  的返回值是一个数组，每个元素对应一个 Promise 的结果，具有以下结构：

- 对于成功的 Promise：`{ status: 'fulfilled', value: 结果值 }`
- 对于失败的 Promise：`{ status: 'rejected', reason: 错误原因 }`

这种统一的结构使得处理结果变得简单明了。尤其在需要并发执行多个独立异步操作，并且希望无论个别操作成功与否都能获取完整结果的场景中，`Promise.allSettled()`  无疑是最佳选择。它使我们能够构建更具弹性的应用程序，优雅地处理现实世界中不可避免的错误和异常情况。
