// DOM 元素
const websiteGrid = document.getElementById("websiteGrid");
const searchInput = document.getElementById("searchWebsites");
const categoriesBar = document.getElementById("categoriesBar");
const addWebsiteBtn = document.getElementById("addWebsiteBtn");
const addWebsiteModal = document.getElementById("addWebsiteModal");
const addModalClose = document.getElementById("addModalClose");
const cancelAddBtn = document.getElementById("cancelAdd");
const addWebsiteForm = document.getElementById("addWebsiteForm");
const websiteCategorySelect = document.getElementById("websiteCategory");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileNav = document.getElementById("mobileNav");

// 状态
let websites = [];
let categories = [];
let activeCategory = "all";
let websiteData = localStorage.getItem("savedWebsites")
  ? JSON.parse(localStorage.getItem("savedWebsites"))
  : [];

// 默认分类
const defaultCategories = [
  "全部",
  "技术博客",
  "设计资源",
  "工具网站",
  "学习平台",
  "开发文档",
  "社区论坛",
  "资源下载",
  "娱乐休闲",
];

// 默认网站数据
const defaultWebsites = [
  {
    name: "GitHub",
    url: "https://github.com",
    description: "全球最大的开源代码托管平台，为开发者提供Git仓库服务",
    category: "开发文档",
    icon: "https://github.githubassets.com/favicons/favicon.svg",
  },
  {
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Mozilla的开发者网络，提供Web技术文档和学习资源",
    category: "开发文档",
    icon: "https://developer.mozilla.org/favicon-48x48.png",
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com",
    description: "设计师分享作品的平台，展示UI、图标、插画等设计作品",
    category: "设计资源",
    icon: "https://cdn.dribbble.com/assets/favicon-63b2904a073c89b52b19aa08cebc16a154bcf83fee8ecc6439968b1e6db569c7.ico",
  },
  {
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "专业的程序设计领域的问答网站，解决编程问题的社区",
    category: "社区论坛",
    icon: "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196",
  },
  {
    name: "Figma",
    url: "https://www.figma.com",
    description: "基于浏览器的协作式界面设计工具，支持原型设计和交互",
    category: "设计资源",
    icon: "https://static.figma.com/app/icon/1/favicon.svg",
  },
  {
    name: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "分享CSS技巧和前端开发资源的网站",
    category: "技术博客",
    icon: "https://css-tricks.com/favicon.ico",
  },
  {
    name: "Coursera",
    url: "https://www.coursera.org",
    description: "提供来自顶尖大学和公司的在线课程",
    category: "学习平台",
    icon: "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-32x32.png",
  },
  {
    name: "Unsplash",
    url: "https://unsplash.com",
    description: "免费高质量图片分享网站，所有图片均可商用",
    category: "资源下载",
    icon: "https://unsplash.com/favicon.ico",
  },
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com",
    description: "发现新产品和创新科技的平台",
    category: "技术博客",
    icon: "https://ph-static.imgix.net/ph-ios-icon.png",
  },
  {
    name: "CodePen",
    url: "https://codepen.io",
    description: "前端代码分享社区，可在线编辑和预览HTML、CSS和JavaScript",
    category: "工具网站",
    icon: "https://cpwebassets.codepen.io/assets/favicon/favicon-touch-de50acbf5d634ec6791894eba4ba9cf490f709b3d742597c6fc4b734e6492a5a.png",
  },
  {
    name: "Behance",
    url: "https://www.behance.net",
    description: "Adobe旗下的创意作品展示平台",
    category: "设计资源",
    icon: "https://a5.behance.net/5a5349b1b1a5071eb71fc8ee02976117a5a5b54e/img/site/favicon.ico?cb=264615658",
  },
  {
    name: "Medium",
    url: "https://medium.com",
    description: "高质量文章发布平台，涵盖技术、设计、创业等多个领域",
    category: "技术博客",
    icon: "https://medium.com/favicon.ico",
  },
];

// 初始化应用
document.addEventListener("DOMContentLoaded", initializeApp);

// 事件监听器
if (searchInput) searchInput.addEventListener("input", filterWebsites);
if (addWebsiteBtn) addWebsiteBtn.addEventListener("click", openAddModal);
if (addModalClose) addModalClose.addEventListener("click", closeAddModal);
if (cancelAddBtn) cancelAddBtn.addEventListener("click", closeAddModal);
if (addWebsiteForm) addWebsiteForm.addEventListener("submit", handleAddWebsite);
if (mobileMenuToggle)
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);

// 初始化应用
function initializeApp() {
  // 如果本地存储中没有数据，使用默认数据
  if (websiteData.length === 0) {
    websiteData = defaultWebsites;
    localStorage.setItem("savedWebsites", JSON.stringify(websiteData));
  }

  websites = websiteData;
  extractCategories();
  setupCategoryFilters();
  renderWebsites();

  // 填充类别选择框
  populateCategorySelect();

  // 初始化粒子效果
  if (typeof initParticleCanvas === "function") {
    initParticleCanvas();
  }

  // 点击页面任何区域关闭移动菜单
  document.addEventListener("click", function (e) {
    if (
      mobileNav &&
      mobileNav.classList.contains("active") &&
      !mobileNav.contains(e.target) &&
      e.target !== mobileMenuToggle &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
}

// 切换移动菜单
function toggleMobileMenu() {
  if (mobileNav.classList.contains("active")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

// 打开移动菜单
function openMobileMenu() {
  mobileNav.classList.add("active");
  mobileMenuToggle.setAttribute("aria-expanded", "true");
  mobileMenuToggle.classList.add("active");

  // 添加菜单打开时的汉堡按钮动画
  const spans = mobileMenuToggle.querySelectorAll("span");
  if (spans.length >= 3) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  }

  // 禁止背景滚动
  document.body.style.overflow = "hidden";
}

// 关闭移动菜单
function closeMobileMenu() {
  mobileNav.classList.remove("active");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  mobileMenuToggle.classList.remove("active");

  // 恢复汉堡按钮
  const spans = mobileMenuToggle.querySelectorAll("span");
  if (spans.length >= 3) {
    spans[0].style.transform = "";
    spans[1].style.opacity = "";
    spans[2].style.transform = "";
  }

  // 恢复背景滚动
  document.body.style.overflow = "";
}

// 提取所有分类
function extractCategories() {
  // 从网站数据中提取唯一分类
  const uniqueCategories = [...new Set(websites.map((site) => site.category))];
  categories = ["全部", ...uniqueCategories.sort()];
}

// 设置分类过滤器
function setupCategoryFilters() {
  if (!categoriesBar) return;

  categoriesBar.innerHTML = "";

  categories.forEach((category) => {
    const categoryTag = document.createElement("div");
    categoryTag.className = `category-tag ${
      category === "全部" && activeCategory === "all" ? "active" : ""
    }`;
    categoryTag.textContent = category;
    categoryTag.dataset.category = category === "全部" ? "all" : category;

    categoryTag.addEventListener("click", () => {
      activeCategory = categoryTag.dataset.category;
      updateCategoryUI();
      renderWebsites();
    });

    categoriesBar.appendChild(categoryTag);
  });
}

// 更新分类UI
function updateCategoryUI() {
  document.querySelectorAll(".category-tag").forEach((tag) => {
    tag.classList.toggle("active", tag.dataset.category === activeCategory);
  });
}

// 填充类别选择框
function populateCategorySelect() {
  if (!websiteCategorySelect) return;

  // 清除默认选项之外的所有选项
  websiteCategorySelect.innerHTML = '<option value="">选择分类...</option>';

  // 添加所有分类（除了"全部"）作为选项
  categories
    .filter((cat) => cat !== "全部")
    .forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      websiteCategorySelect.appendChild(option);
    });

  // 添加"新建分类"选项
  const newCategoryOption = document.createElement("option");
  newCategoryOption.value = "new";
  newCategoryOption.textContent = "➕ 新建分类";
  websiteCategorySelect.appendChild(newCategoryOption);

  // 添加选择变化事件监听器
  websiteCategorySelect.addEventListener("change", handleCategorySelect);
}

// 处理类别选择
function handleCategorySelect() {
  if (websiteCategorySelect.value === "new") {
    const newCategory = prompt("请输入新分类名称:");
    if (newCategory && newCategory.trim() !== "") {
      // 添加新分类到选择框
      const option = document.createElement("option");
      option.value = newCategory.trim();
      option.textContent = newCategory.trim();
      websiteCategorySelect.insertBefore(
        option,
        websiteCategorySelect.lastChild
      );

      // 选中新分类
      websiteCategorySelect.value = newCategory.trim();
    } else {
      // 如果取消或输入为空，恢复到第一个选项
      websiteCategorySelect.value = "";
    }
  }
}

// 渲染网站
function renderWebsites() {
  if (!websiteGrid) return;

  // 清除加载消息
  websiteGrid.innerHTML = "";

  // 应用过滤器
  const filteredWebsites = filterWebsitesBySearch(
    filterWebsitesByCategory(websites)
  );

  if (filteredWebsites.length === 0) {
    websiteGrid.innerHTML = `
      <div class="tech-loading">
        <p>没有找到匹配的网站</p>
      </div>
    `;
    return;
  }

  // 创建网站卡片
  filteredWebsites.forEach((website, index) => {
    const websiteElement = createWebsiteElement(website, index);
    websiteGrid.appendChild(websiteElement);
  });
}

// 创建网站元素
function createWebsiteElement(website, index) {
  // 创建网站卡片元素
  const websiteElement = document.createElement("div");
  websiteElement.className = "website-card";
  websiteElement.style.animationDelay = `${index * 0.05}s`;

  // 创建网站图标元素
  let iconHtml = "";
  if (website.icon) {
    iconHtml = `<img src="${website.icon}" alt="${
      website.name
    }" onerror="this.parentNode.innerHTML='${website.name.charAt(0)}'">`;
  } else {
    iconHtml = website.name.charAt(0);
  }

  // 创建卡片HTML
  websiteElement.innerHTML = `
    <div class="website-card-header">
      <div class="website-icon">${iconHtml}</div>
      <h3 class="website-title">${website.name}</h3>
    </div>
    <div class="website-description">
      ${website.description || "没有描述"}
    </div>
    <div class="website-actions">
      <span class="website-category">${website.category}</span>
      <a href="${
        website.url
      }" class="website-visit" target="_blank" rel="noopener noreferrer">
        访问网站
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
  `;

  return websiteElement;
}

// 按分类过滤网站
function filterWebsitesByCategory(websitesToFilter) {
  if (activeCategory === "all") return websitesToFilter;
  return websitesToFilter.filter(
    (website) => website.category === activeCategory
  );
}

// 按搜索过滤网站
function filterWebsitesBySearch(websitesToFilter) {
  if (!searchInput || !searchInput.value.trim()) return websitesToFilter;

  const searchTerm = searchInput.value.trim().toLowerCase();
  return websitesToFilter.filter(
    (website) =>
      website.name.toLowerCase().includes(searchTerm) ||
      website.description.toLowerCase().includes(searchTerm) ||
      website.category.toLowerCase().includes(searchTerm) ||
      website.url.toLowerCase().includes(searchTerm)
  );
}

// 过滤网站
function filterWebsites() {
  renderWebsites();
}

// 打开添加模态框
function openAddModal() {
  if (!addWebsiteModal) return;
  addWebsiteModal.classList.add("active");

  // 重置表单
  if (addWebsiteForm) addWebsiteForm.reset();
}

// 关闭添加模态框
function closeAddModal() {
  if (!addWebsiteModal) return;
  addWebsiteModal.classList.remove("active");
}

// 处理添加网站表单提交
function handleAddWebsite(e) {
  e.preventDefault();

  // 获取表单数据
  const name = document.getElementById("websiteName").value.trim();
  const url = document.getElementById("websiteUrl").value.trim();
  const description = document
    .getElementById("websiteDescription")
    .value.trim();
  const category = document.getElementById("websiteCategory").value;
  const icon = document.getElementById("websiteIcon").value.trim();

  // 验证必填字段
  if (!name || !url || !category) {
    alert("请填写必填字段（网站名称、网站链接和分类）");
    return;
  }

  // 验证URL格式
  try {
    new URL(url);
  } catch (error) {
    alert("请输入有效的网站链接");
    return;
  }

  // 创建新网站对象
  const newWebsite = {
    name,
    url,
    description,
    category,
    icon: icon || "",
  };

  // 添加到数据和本地存储
  websites.push(newWebsite);
  websiteData.push(newWebsite);
  localStorage.setItem("savedWebsites", JSON.stringify(websiteData));

  // 更新UI
  extractCategories();
  setupCategoryFilters();
  populateCategorySelect();
  renderWebsites();

  // 关闭模态框
  closeAddModal();
}

// 处理键盘事件
document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    addWebsiteModal &&
    addWebsiteModal.classList.contains("active")
  ) {
    closeAddModal();
  }
});

// 点击模态框背景关闭
if (addWebsiteModal) {
  addWebsiteModal.addEventListener("click", function (e) {
    if (e.target === addWebsiteModal) {
      closeAddModal();
    }
  });
}
