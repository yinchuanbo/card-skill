/**
 * 墨境智库 - 粒子效果
 *
 * 科技感粒子动画效果，结合中国风水墨元素
 */

// 等待DOM加载完成
document.addEventListener("DOMContentLoaded", function () {
  // 获取canvas元素
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // 设置canvas尺寸为父元素的尺寸
  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  // 初始调整尺寸
  resizeCanvas();

  // 监听窗口大小变化，调整canvas尺寸
  window.addEventListener("resize", resizeCanvas);

  // 粒子类
  class InkParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.3;

      // 粒子有小概率成为"墨点"
      this.isInkDrop = Math.random() > 0.95;

      // 墨点有特殊的参数
      if (this.isInkDrop) {
        this.size = Math.random() * 5 + 3;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
      }

      // 确定粒子颜色 - 优先使用CSS变量获取主题颜色
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      this.color =
        computedStyle.getPropertyValue("--mountain-green").trim() || "#3e5c3e";

      // 墨点使用较暗的颜色
      if (this.isInkDrop) {
        this.color =
          computedStyle.getPropertyValue("--pine-dark").trim() || "#2c3c2c";
      }

      // 创建连接线的最大距离
      this.maxConnectDist = 100;

      // 墨点的连接距离更大
      if (this.isInkDrop) {
        this.maxConnectDist = 150;
      }
    }

    // 更新粒子位置和状态
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 简单的边界检查，超出边界时回到另一边
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // 墨点尺寸随时间轻微波动，模拟墨滴扩散效果
      if (this.isInkDrop) {
        this.size = this.size + Math.sin(Date.now() / 1000) * 0.1;
      }
    }

    // 绘制粒子
    draw() {
      ctx.beginPath();

      // 墨点使用特殊的绘制方式，模拟水墨晕开的效果
      if (this.isInkDrop) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, `${this.color}`);
        gradient.addColorStop(1, `${this.color}00`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      } else {
        ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      }

      ctx.fill();
    }

    // 计算与其他粒子的连接线
    connect(particles) {
      for (const particle of particles) {
        if (particle === this) continue;

        // 计算粒子之间的距离
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 如果距离小于最大连接距离，绘制连接线
        if (distance < this.maxConnectDist) {
          // 基于距离计算线的透明度
          const opacity = 1 - distance / this.maxConnectDist;

          // 如果两个粒子都是墨点，使用更明显的连接线
          if (this.isInkDrop && particle.isInkDrop) {
            ctx.strokeStyle = `${this.color}${Math.floor(opacity * 0.7 * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 0.8;
          } else {
            ctx.strokeStyle = `${this.color}${Math.floor(opacity * 0.3 * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 0.5;
          }

          ctx.beginPath();
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
    // 清空现有粒子
    particles.length = 0;

    // 根据canvas尺寸计算粒子数量，但不超过最大值
    const particleCount = Math.min(
      Math.floor((canvas.width * canvas.height) / 6000),
      50
    );

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push(new InkParticle(x, y));
    }
  }

  // 动画函数
  function animate() {
    // 清空canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制所有粒子
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }

    // 绘制粒子之间的连接线
    for (const particle of particles) {
      particle.connect(particles);
    }

    // 继续动画循环
    requestAnimationFrame(animate);
  }

  // 初始化粒子
  initParticles();

  // 开始动画
  animate();

  // 监听窗口大小变化，重新初始化粒子
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  // 为暗色模式切换添加支持，更新粒子颜色
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-theme") {
        // 主题变化时，更新所有粒子的颜色
        for (const particle of particles) {
          const root = document.documentElement;
          const computedStyle = getComputedStyle(root);

          if (particle.isInkDrop) {
            particle.color =
              computedStyle.getPropertyValue("--pine-dark").trim() || "#2c3c2c";
          } else {
            particle.color =
              computedStyle.getPropertyValue("--mountain-green").trim() ||
              "#3e5c3e";
          }
        }
      }
    });
  });

  // 监听html元素的data-theme属性变化
  observer.observe(document.documentElement, { attributes: true });
});
