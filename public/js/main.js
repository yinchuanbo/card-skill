// DOM Elements
const cardGrid = document.getElementById("cardGrid");
const searchInput = document.getElementById("searchInput");
const tagFilters = document.getElementById("tagFilters");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

// State
let cards = [];
let activeFilters = [];

// Helper functions
// Format a number as a 2-digit string
const formatDigit = (num) => num.toString().padStart(2, "0");

// Event Listeners
document.addEventListener("DOMContentLoaded", initializeApp);
if (searchInput) searchInput.addEventListener("input", filterCards);
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalOverlay)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Initialize App
async function initializeApp() {
  await fetchCards();
  if (cards.length > 0) {
    renderCards();
    setupTagFilters();
  }

  // 添加阅读进度指示器
  addReadingProgressIndicator();

  // 添加滚动箭头和指示器
  addScrollIndicators();

  // 初始化主题切换功能
  initThemeToggle();

  const cardTitles = document.querySelectorAll(".card-header h2");

  // 为每个标题添加title属性，值为标题的文本内容
  cardTitles.forEach((title) => {
    title.setAttribute("title", title.textContent);
  });
}

// Fetch Cards Data
async function fetchCards() {
  try {
    const response = await fetch("/cards.json");
    if (!response.ok) throw new Error("Failed to fetch cards");
    cards = await response.json();

    // Sort cards by date (newest first)
    cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching cards:", error);
    if (cardGrid) {
      cardGrid.innerHTML = `<div class="error">Failed to load cards. Please try again later.</div>`;
    }
  }
}

// Render Cards
function renderCards() {
  if (!cardGrid) return;

  // Clear loading message
  cardGrid.innerHTML = "";

  // Apply filters
  const filteredCards = filterCardsBySearch(filterCardsByTags(cards));

  if (filteredCards.length === 0) {
    cardGrid.innerHTML = `<div class="tech-loading">
      <div class="tech-loading-spinner"></div>
      <p>没有找到匹配的卡片</p>
    </div>`;
    return;
  }

  // Create cards
  filteredCards.forEach((card, index) => {
    const cardElement = createCardElement(card, index);
    cardGrid.appendChild(cardElement);
  });

  // 添加淡入动画类
  setTimeout(() => {
    document.querySelectorAll(".tech-card").forEach((card) => {
      card.classList.add("fade-in");
    });
  }, 100);
}

// Create Card Element
function createCardElement(card, index) {
  // 如果没有提供index，默认为0
  index = index || 0;

  // 创建卡片元素
  const cardElement = document.createElement("div");
  cardElement.className = `tech-card ${card.type || "default"}`;
  // 设置自定义延迟属性用于动画
  cardElement.style.setProperty("--delay", `${index * 0.05}s`);

  // 格式化日期显示
  const date = new Date(card.createdAt);
  const year = date.getFullYear();
  const month = formatDigit(date.getMonth() + 1);
  const day = formatDigit(date.getDate());
  const hours = formatDigit(date.getHours());
  const minutes = formatDigit(date.getMinutes());
  const seconds = formatDigit(date.getSeconds());

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // 清理摘要内容，移除HTML标签和Markdown语法
  const sanitizedSummary = sanitizeSummary(card.summary);

  // 创建卡片HTML
  cardElement.innerHTML = `
    <div class="tech-card-header">
      <h2>${card.title}</h2>
      <div class="card-meta">
        <time datetime="${card.createdAt}">${formattedDate}</time>
      </div>
      <div class="card-tags">
        ${card.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </div>
    <div class="card-summary">
      ${sanitizedSummary}
    </div>
  `;

  // 添加点击事件以打开模态框
  cardElement.addEventListener("click", () => openModal(card));

  return cardElement;
}

/**
 * 清理摘要内容，移除HTML标签和Markdown语法
 * @param {string} summary - 原始摘要内容
 * @returns {string} 清理后的摘要内容
 */
function sanitizeSummary(summary) {
  if (!summary) return "";

  let cleaned = summary;

  // 移除HTML标签，但更精确地处理
  cleaned = cleaned.replace(/<img[^>]*>/gi, ""); // 首先专门移除图片标签
  cleaned = cleaned.replace(/<[^>]*>/g, ""); // 然后移除其他所有HTML标签

  // 解码HTML实体
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

  // 移除Markdown图片语法
  cleaned = cleaned.replace(/!\[(?:.*?)\]\((?:.*?)\)/g, "");

  // 移除Markdown链接，但保留文本
  cleaned = cleaned.replace(/\[(.*?)\]\((?:.*?)\)/g, "$1");

  // 移除Markdown标题符号
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");

  // 移除Markdown粗体和斜体
  cleaned = cleaned.replace(/(\*\*|__)(.*?)(\*\*|__)/g, "$2"); // 粗体
  cleaned = cleaned.replace(/(\*|_)(.*?)(\*|_)/g, "$2"); // 斜体

  // 移除Markdown引用符号
  cleaned = cleaned.replace(/^\s*>\s*/gm, "");

  // 移除Markdown代码块
  cleaned = cleaned.replace(/```(?:.*?)\n([\s\S]*?)```/g, "");

  // 移除行内代码
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // 移除表格语法
  cleaned = cleaned.replace(/\|[^\n]*\|/g, "");
  cleaned = cleaned.replace(/^[\s\-:|]+$/gm, "");

  // 移除额外的空白字符和换行
  cleaned = cleaned.replace(/\n+/g, " ");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

// Filter functions
function filterCards() {
  renderCards();
}

function filterCardsBySearch(cardsToFilter) {
  if (!searchInput || !searchInput.value.trim()) return cardsToFilter;

  const searchTerm = searchInput.value.toLowerCase().trim();
  return cardsToFilter.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm) ||
      card.summary.toLowerCase().includes(searchTerm) ||
      card.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
}

function filterCardsByTags(cardsToFilter) {
  if (activeFilters.length === 0) return cardsToFilter;

  return cardsToFilter.filter((card) =>
    activeFilters.every((tag) => card.tags.includes(tag))
  );
}

// Setup Tag Filters
function setupTagFilters() {
  if (!tagFilters) return;

  // Get all unique tags
  const allTags = new Set();
  cards.forEach((card) => {
    card.tags.forEach((tag) => allTags.add(tag));
  });

  // Clear existing filters
  tagFilters.innerHTML = "";

  // Create tag filter elements
  allTags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tech-tag-filter";
    tagElement.textContent = tag;

    // 如果此标签已激活，添加active类
    if (activeFilters.includes(tag)) {
      tagElement.classList.add("active");
    }

    // 添加点击事件
    tagElement.addEventListener("click", () => {
      toggleTagFilter(tag, tagElement);
    });

    tagFilters.appendChild(tagElement);
  });
}

// Toggle Tag Filter
function toggleTagFilter(tag, element) {
  if (activeFilters.includes(tag)) {
    // Remove filter
    activeFilters = activeFilters.filter((t) => t !== tag);
    element.classList.remove("active");
  } else {
    // Add filter
    activeFilters.push(tag);
    element.classList.add("active");
  }

  filterCards();
}

// Modal Functions
async function openModal(card) {
  if (!modalOverlay || !modalContent) return;

  // Fetch the full content
  try {
    const response = await fetch(card.url);
    if (!response.ok) throw new Error("Failed to fetch card content");
    const html = await response.text();

    // Extract the content from the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // 直接提取内容区域，而不是整个card-content容器
    const header = tempDiv.querySelector(".card-content header").innerHTML;
    const content = tempDiv.querySelector(".card-content .content").innerHTML;

    // 设置模态内容，不再嵌套card-content
    modalContent.innerHTML = `
            <header>${header}</header>
            <div class="content ${card?.type || ""}">${content}</div>
        `;

    // 应用代码高亮
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }

    // Show modal with animation
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling

    // Add to browser history
    window.history.pushState({ cardId: card.id }, "", card.url);

    // 添加导航按钮
    addModalNavigation();

    // 禁用body滚动
    document.body.classList.add("modal-open");

    // 重置模态内容滚动位置到顶部
    document.getElementById("modalContent").scrollTop = 0;
  } catch (error) {
    console.error("Error fetching card content:", error);
    modalContent.innerHTML = `<div class="error">Failed to load content. Please try again later.</div>`;
    modalOverlay.classList.add("active");
  }
}

function closeModal() {
  if (!modalOverlay) return;

  modalOverlay.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling

  // Go back in history if we pushed a state
  if (window.history.state && window.history.state.cardId) {
    window.history.back();
  }

  // 移除导航按钮
  const navButtons = document.querySelectorAll(".modal-nav");
  navButtons.forEach((button) => button.remove());

  // 恢复body滚动
  document.body.classList.remove("modal-open");
}

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  closeModal();
});

// Add entry animation when content is loaded
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  document.body.classList.add("scroll-fade");
});

/**
 * 添加阅读进度指示器
 */
function addReadingProgressIndicator() {
  // 创建容器
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";

  // 创建进度条
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  // 组合元素
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);

  // 监听滚动事件更新进度条
  window.addEventListener("scroll", function () {
    // 计算滚动百分比
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    // 更新进度条宽度
    if (progressBar) {
      progressBar.style.width = scrolled + "%";

      // 在接近顶部时隐藏进度条
      if (scrolled < 2) {
        progressBar.style.opacity = "0";
      } else {
        progressBar.style.opacity = "1";
      }
    }
  });
}

/**
 * 添加滚动指示器和滚动箭头
 */
function addScrollIndicators() {
  // 创建滚动指示器
  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "scroll-indicator";
  document.body.appendChild(scrollIndicator);

  // 为长页面添加滚动箭头
  const mainContainer = document.querySelector(".container");
  if (mainContainer && document.body.scrollHeight > window.innerHeight * 1.5) {
    const scrollArrow = document.createElement("div");
    scrollArrow.className = "scroll-arrow";
    mainContainer.appendChild(scrollArrow);

    // 箭头点击事件 - 平滑滚动到内容
    scrollArrow.addEventListener("click", function () {
      window.scrollBy({
        top: window.innerHeight / 2,
        behavior: "smooth",
      });
    });
  }

  // 监听滚动事件显示/隐藏滚动指示器
  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 向下滚动超过300px显示回到顶部按钮
    if (scrollTop > 300) {
      scrollIndicator.classList.add("visible");
    } else {
      scrollIndicator.classList.remove("visible");
    }

    // 记录上次滚动位置
    lastScrollTop = scrollTop;
  });

  // 点击滚动指示器回到顶部
  scrollIndicator.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * Image Lightbox Functionality
 */
function initImageLightbox() {
  // Create lightbox elements
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.innerHTML = `
        <button class="lightbox-close">&times;</button>
        <button class="lightbox-nav lightbox-prev">&larr;</button>
        <button class="lightbox-nav lightbox-next">&rarr;</button>
        <div class="lightbox-content">
            <img src="" alt="Lightbox Image">
        </div>
        <div class="lightbox-counter">1 / 1</div>
    `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-content img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");
  const lightboxCounter = lightbox.querySelector(".lightbox-counter");

  let images = [];
  let currentIndex = 0;

  // Collect all images when a modal is opened
  function collectImagesInModal() {
    if (!modalContent) return;
    images = Array.from(modalContent.querySelectorAll("img"));

    // Hide navigation if there's only one image
    if (images.length <= 1) {
      lightboxPrev.style.display = "none";
      lightboxNext.style.display = "none";
      lightboxCounter.style.display = "none";
    } else {
      lightboxPrev.style.display = "flex";
      lightboxNext.style.display = "flex";
      lightboxCounter.style.display = "block";
    }
  }

  // Observer to watch for changes in the modal content
  if (modalContent) {
    const observer = new MutationObserver(collectImagesInModal);
    observer.observe(modalContent, { childList: true, subtree: true });
  }

  // Add click event to images in modal content
  document.addEventListener("click", function (event) {
    const clickedImage = event.target.closest("#modalContent img");
    if (!clickedImage) return;

    collectImagesInModal();
    currentIndex = images.indexOf(clickedImage);
    openLightbox(clickedImage.src);
    event.preventDefault();
  });

  // Open lightbox with specified image
  function openLightbox(src) {
    lightboxImg.src = src;
    updateCounter();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Navigate to previous image
  function prevImage() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    updateCounter();
  }

  // Navigate to next image
  function nextImage() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    updateCounter();
  }

  // Update the counter display
  function updateCounter() {
    if (images.length > 1) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  // Event listeners
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", prevImage);
  lightboxNext.addEventListener("click", nextImage);

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "ArrowRight") {
      nextImage();
    }
  });

  // Close when clicking outside the image
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Initialize image lightbox when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initImageLightbox();
});

/**
 * 初始化主题切换功能
 */
function initThemeToggle() {
  // 创建主题切换按钮
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.innerHTML = "🌓";
  themeToggle.setAttribute("aria-label", "Toggle dark mode");
  themeToggle.setAttribute("title", "Toggle dark mode");
  document.body.appendChild(themeToggle);

  // 检查本地存储中的主题偏好
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // 如果用户系统偏好暗色主题，则自动应用
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // 更新按钮图标
  updateThemeIcon();

  // 添加点击事件
  themeToggle.addEventListener("click", toggleTheme);
}

/**
 * 切换主题
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // 设置新主题
  document.documentElement.setAttribute("data-theme", newTheme);

  // 保存到本地存储
  localStorage.setItem("theme", newTheme);

  // 更新按钮图标
  updateThemeIcon();
}

/**
 * 更新主题切换按钮图标
 */
function updateThemeIcon() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  const currentTheme = document.documentElement.getAttribute("data-theme");
  themeToggle.innerHTML = currentTheme === "dark" ? "☀️" : "🌙";
}

// 在DOM加载完成后初始化主题切换
document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();
});

// 添加模态窗口导航功能
function addModalNavigation() {
  // 移除现有的导航按钮（如果有）
  const existingButtons = document.querySelectorAll(".modal-nav");
  existingButtons.forEach((button) => button.remove());

  // 创建导航按钮
  const prevButton = document.createElement("button");
  prevButton.className = "modal-nav modal-nav-prev";
  prevButton.innerHTML = "&larr;";
  prevButton.setAttribute("aria-label", "Previous article");
  prevButton.setAttribute("title", "Previous article");

  const nextButton = document.createElement("button");
  nextButton.className = "modal-nav modal-nav-next";
  nextButton.innerHTML = "&rarr;";
  nextButton.setAttribute("aria-label", "Next article");
  nextButton.setAttribute("title", "Next article");

  // 添加到模态窗口
  modalOverlay.appendChild(prevButton);
  modalOverlay.appendChild(nextButton);

  // 获取当前卡片的索引
  const currentCardId = window.history.state?.cardId;
  const currentCardIndex = cards.findIndex((card) => card.id === currentCardId);

  // 添加点击事件
  prevButton.addEventListener("click", () => {
    if (currentCardIndex > 0) {
      // 导航到上一篇文章
      openModal(cards[currentCardIndex - 1]);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentCardIndex < cards.length - 1) {
      // 导航到下一篇文章
      openModal(cards[currentCardIndex + 1]);
    }
  });

  // 禁用不可用的按钮
  if (currentCardIndex <= 0) {
    prevButton.disabled = true;
    prevButton.style.opacity = "0.3";
    prevButton.style.cursor = "not-allowed";
  }

  if (currentCardIndex >= cards.length - 1) {
    nextButton.disabled = true;
    nextButton.style.opacity = "0.3";
    nextButton.style.cursor = "not-allowed";
  }
}
