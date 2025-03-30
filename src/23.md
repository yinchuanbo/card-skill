---
title: "HTML 中的 JavaScript"
tags:
  - 高级程序设计
  - script 元素
time: 2025-03-15 20:37:45
---

## script 元素

**script 元素有下列 8 个属性：**

### 1. async:

可选，表示应该立即下载脚本，但不能妨碍页面上的其他操作，比如下载资源或等待其他脚本加载，这个属性只对外部脚本文件有效。

### 2. charset:

可选，使用 src 属性指定的代码所使用的字符集，这个属性很少用，因为大多数浏览器不在乎它的值。

### 3. crossorgin:

可选，配置相关请求的 CORS 设置，默认不适用 CORS。`crossorgin="anonymous"` 表示对脚本文件的请求中不设置用户凭据标志。`crossorgin="use-credentials"` 表示设置凭据标志，意味着发出的请求中会包含用户凭据。

### 4. defer:

可选，表示将脚本延迟到文档完全被解析和显示之后再执行，只对外部脚本文件有效。

### 5. integrity:

可选，允许比对接收到的资源和指定的加密签名以验证子资源完整性，如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保内容分发网络，不会提供恶意内容。

### 6. language:

废弃

### 7. src:

可选，指向包含要执行的脚本代码的外部文件。

### 8. type:

可选，代替 language 属性，表示代码中脚本语言的内容类型，按照惯例，这个值始终都是 `"text/javascript"`，尽管 `"text/javascript"` 和 `"text/ecmascript"` 都已经废弃了。

JavaScript 文件的 MIME 类型通常是 `"application/x-javascript"`，不过给 type 属性这个值有可能导致脚本被忽略。有效的其他值还有 `"application/javascript"` 和 `"application/ecmascript"`。

如果这个属性的值是 `module`，则代码会被当成 `ES6` 模块，只有这时候代码中才能出现 `import` 和 `export` 关键字。

要嵌入行内 JavaScript 代码，就直接把代码挡在 `<script>` 元素中：

```html
<script>
  function sayHi() {
    console.log("Hi!");
  }
</script>
```

包含在 `<script>` 内的代码会被从上到下逐行解释。

在 `<script>` 元素中的代码被解释完成之前，页面的其余内容不会被加载，也不会被显示。

在使用行内 JavaScript 代码时，要注意代码中不能出现字符串 `</script>`。比如，下面的代码会导致浏览器报错：

```html
<script>
  function sayScript() {
    console.log("</script>")
  }
</script>
```

浏览器解析行内脚本的方式决定了它在看到字符串 `"</script>"` 时，会将其当成结束的 `</script>` 标签，想避免这个问题，只需要转义字符串 `"/"` 即可。

```html
<script>
  function sayScript() {
    console.log("<\/script>");
  }
</script>
```

这样修改之后，代码可以被浏览器接受，不会导致任何错误。

## 标签位置

过去，所有 `<script>` 元素都被放在页面的 `<head>` 标签内，如下面的例子所示：

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <script src="example1.js"></script>
    <script src="example2.js"></script>
  </head>
  <body>
    <!-- 这里是页面内容 -->
  </body>
</html>
```

把所有 JavaScript 文件都放在 `<head>` 里面，也就意味着必须把所有的 JavaScript 代码都下载、解析和解释完成后，才能开始渲染页面（页面在浏览器解析到 `<body>` 的起始标签时开始渲染）。对于需要很多 JavaScript 的页面，这会导致页面渲染的明显延迟，在此期间浏览器窗口完全空白。

为了解决这个问题，现代 web 应用程序通常将所有 JavaScript 引用放在 `<body>` 元素中的页面内容后面，如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <!-- 这里是页面内容 -->
    <script src="example1.js"></script>
    <script src="example2.js"></script>
  </body>
</html>
```

这样一来，浏览器会在处理 JavaScript 代码之前先渲染页面，用户会感觉页面加载更快了，因为浏览器显示空白页面的时间短了。

### 推迟执行脚本

HTML 4.01 为 `<script>` 元素定义了一个叫 defer 的属性，这个属性表示脚本在执行的时候不会改变页面的结构。也就是说，脚本会被延迟到整个页面都解析完毕后再执行。因此，在 `<script>` 元素上设置 defer 属性，相当于告诉`浏览器立即下载`，但`延迟执行`。

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
  </head>
  <body>
    <!-- 这里是页面内容 -->
  </body>
</html>
```

虽然这个例子中的 `<script>` 元素包含在页面的 `<head>` 中，但它们会在浏览器解析到结束的 `</html>` 标签后才会执行。

HTML5 规范要求脚本应该按照它们出现的顺序执行，因此第一个推迟的脚本会在第二个推迟的脚本之前执行，而且两者都会在 `DOMContentLoaded` 事件之前执行。

> 不过在现实中，推迟执行的脚本不一定总会按顺序执行或者在 DOMContentLoaded 事件之前执行，因此最好只包含一个这样的脚本。

### 异步执行脚本

HTML5 为 `<script>` 元素定义了 async 属性，从改变脚本处理方式上看，async 属性与 defer 类似，同样与 defer 类似，async 也只作用于外部脚本，也会告诉浏览器立即开始下载，不过与 defer 不同的是，标记为 async 的脚本并不保证能按照它们出现的次序执行。

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <script async src="example1.js"></script>
    <script async src="example2.js"></script>
  </head>
  <body>
    <!-- 这里是页面内容 -->
  </body>
</html>
```

在这个例子中，第二个脚本可能先于第一个脚本执行。因此，重点在于它们之间没有依赖关系。给脚本添加 async 属性的目的是告诉浏览器，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本，正因为如此，异步脚本不应该在加载期间修改 DOM。

异步脚本保证会在页面的 load 事件前执行，但是可能会在 `DOMContentLoaded` 之前或之后。使用异步脚本也相当于隐式地告诉页面你不会使用 `document.write`，不过好的 web 开发实践根本就不推荐使用这个方法。

### 动态加载脚本

除了 `<script>` 标签，还有其他方式可以加载脚本，因为 JavaScript 可以使用 DOM.API，所以通过向 DOM 中动态添加 script 元素同样可以加载指定的脚本。

只要创建一个 script 元素并将其添加到 DOM 即可。

```js
let script = document.createElement("script");
script.src = "mvscript.js";
document.head.appendChild(script);
```

当然，在把 HTMLElement 元素添加到 DOM 且执行到这段代码之前不会发送请求，默认情况下，以这种方式创建的 `<script>` 元素是以异步方式加载的。

以这种方式获取的资源对浏览器预加载是不可见的。这会严重影响它们在资源获取队列中的优先级。取决于你的应用逻辑以及具体的使用方式，动态加载脚本可能会严重影响性能。要想让预加载器知道这些动态请求文件的存在，可以在文档头部显式声明它们：

```html
<link rel="preload" href="myscript.js" />
```

## 行内代码和外部文件

虽然可以直接在 HTML 文件中嵌入 JavaScript 代码，但通常认为最佳实践是尽可能将 JavaScript 代码放在外部文件中。

- **可维护性**

- **缓存**: 浏览器会根据特定的设置缓存所有外部链接的 JavaScript 文件，这意味着如果两个页面都用到同一个文件，则该文件只需要下载一次。这最终意味着页面加载会更快。

## noscript 元素

用于给不支持 JavaScript 的浏览器提供替代内容，虽然所有现代浏览器都支持 JavaScript，但对于禁用 JavaScript 的浏览器来说，这个元素仍然有它的用处。

`<noscript>` 元素可以包含任何能出现的 `<body>` 中的 HTML 元素，`<script>` 除外，在下列两种情况下，浏览器将显示包含在 `<noscript>` 中的内容:

- **浏览器不支持脚本**

- **浏览器对脚本的支持被关闭**

满足其中任何一个条件，包含在 `<noscript>` 中的内容就会被渲染，否则，浏览器不会渲染 `<noscript>` 中的内容。

```html
<!DOCTYPE html>
  <head>
    <title></title>
    <script defer="defer" src="example1.js"></script>
    <script defer="defer" src="example2.js"></script>
  </head>
  <body>
    <noscript>
     <p>This page requires a JavaScript-enabled broswer.</p>
    </noscript>
  </body>
</html>
```

