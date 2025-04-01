/**
 * 墨境智库 - 文章页高级科技效果
 *
 * 为文章页提供粒子效果、动态装饰和交互功能
 */

document.addEventListener("DOMContentLoaded", function () {
  // 初始化文章页效果
  initArticleParticles();
  initCodeEnhancements();
  initReadingProgress();
  initImageZoom();
  animateElements();
});

/**
 * 初始化文章页头部粒子效果
 */
function initArticleParticles() {
  const canvas = document.getElementById("headerParticles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // 设置canvas尺寸为父元素的尺寸
  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // 粒子类
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;

      // 获取主题颜色
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      this.color =
        computedStyle.getPropertyValue("--tech-accent").trim() || "#3e5c3e";
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界检查
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.fill();
    }

    connect(particles) {
      for (const particle of particles) {
        if (particle === this) continue;

        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = 1 - distance / 100;
          ctx.beginPath();
          ctx.strokeStyle = `${this.color}${Math.floor(opacity * 0.2 * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
        }
      }
    }
  }

  // 创建粒子数组
  const particles = [];

  // 初始化粒子
  function initParticles() {
    particles.length = 0;
    const particleCount = Math.min(
      Math.floor((canvas.width * canvas.height) / 6000),
      40
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // 动画函数
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      particle.update();
      particle.draw();
      particle.connect(particles);
    }

    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // 监听窗口大小变化
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-theme") {
        // 重新创建粒子以更新颜色
        initParticles();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}

/**
 * 初始化代码块增强功能
 */
function initCodeEnhancements() {
  // 为代码块添加装饰和复制功能
  document.querySelectorAll("pre").forEach((pre) => {
    // 添加科技感装饰
    const decoration = document.createElement("div");
    decoration.className = "tech-code-decoration";
    pre.appendChild(decoration);

    // 添加复制按钮
    const copyBtn = document.createElement("button");
    copyBtn.className = "tech-copy-btn";
    copyBtn.innerHTML = '<span class="tech-copy-icon"></span>';
    copyBtn.title = "复制代码";

    copyBtn.addEventListener("click", function () {
      const code = pre.querySelector("code").textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.classList.add("copied");
        setTimeout(() => copyBtn.classList.remove("copied"), 1500);
      });
    });

    pre.appendChild(copyBtn);
  });
}

/**
 * 初始化阅读进度条
 */
function initReadingProgress() {
  const progressBar = document.querySelector(".tech-progress-bar");
  if (!progressBar) return;

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });

  // 计算阅读时间
  const content = document.querySelector(".content");
  if (content && document.getElementById("readTime")) {
    const text = content.textContent || content.innerText;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 300)); // 假设阅读速度为300字/分钟
    document.getElementById("readTime").textContent = readingTime;
  }
}

/**
 * 初始化图片放大功能
 */
function initImageZoom() {
  document.querySelectorAll(".content img").forEach((img) => {
    img.addEventListener("click", function () {
      const overlay = document.createElement("div");
      overlay.className = "tech-image-overlay";

      const imgClone = document.createElement("img");
      imgClone.src = this.src;
      imgClone.alt = this.alt;

      overlay.appendChild(imgClone);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", function () {
        this.remove();
      });
    });
  });
}

/**
 * 动态元素动画效果
 */
function animateElements() {
  // 为标题添加打字机效果
  const title = document.querySelector(".tech-article-header h1");
  if (title) {
    title.style.opacity = "0";
    setTimeout(() => {
      title.style.transition = "opacity 1s ease";
      title.style.opacity = "1";
    }, 300);
  }

  // 为角落装饰添加渐入效果
  document
    .querySelectorAll(".tech-article-decoration")
    .forEach((decoration, index) => {
      decoration.style.opacity = "0";
      setTimeout(() => {
        decoration.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        decoration.style.opacity = "0.5";
        decoration.style.transform = "scale(1)";
      }, 500 + index * 100);
    });

  // 为标签添加延迟渐入效果
  document.querySelectorAll(".tech-tag").forEach((tag, index) => {
    tag.style.opacity = "0";
    tag.style.transform = "translateY(10px)";
    setTimeout(() => {
      tag.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      tag.style.opacity = "1";
      tag.style.transform = "translateY(0)";
    }, 800 + index * 100);
  });
}
