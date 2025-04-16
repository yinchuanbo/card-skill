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
async function initializeApp() {
  try {
    // 从API获取网站数据
    await fetchWebsites();

    // 提取分类和渲染网站
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
  } catch (error) {
    console.error("初始化应用失败:", error);
    showErrorMessage("加载网站数据失败，请刷新页面重试。");
  }
}

// 从API获取网站数据
async function fetchWebsites() {
  try {
    // 显示加载中状态
    if (websiteGrid) {
      websiteGrid.innerHTML = `
        <div class="tech-loading">
          <div class="tech-loading-spinner"></div>
          <p>正在加载网站数据...</p>
        </div>
      `;
    }

    const response = await fetch("/api/websites");

    if (!response.ok) {
      throw new Error(`API响应错误: ${response.status}`);
    }

    const data = await response.json();
    websites = data.websites || [];

    return websites;
  } catch (error) {
    console.error("获取网站数据失败:", error);
    throw error;
  }
}

// 显示错误消息
function showErrorMessage(message) {
  if (websiteGrid) {
    websiteGrid.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
        <button onclick="location.reload()">重试</button>
      </div>
    `;
  }
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
async function handleAddWebsite(e) {
  e.preventDefault();

  try {
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

    // 显示提交中状态
    const submitBtn = addWebsiteForm.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "保存中...";
    submitBtn.disabled = true;

    // 调用API保存网站
    const response = await fetch("/api/websites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWebsite),
    });

    // 恢复按钮状态
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "添加网站失败");
    }

    // 获取更新后的网站列表
    await fetchWebsites();

    // 更新UI
    extractCategories();
    setupCategoryFilters();
    populateCategorySelect();
    renderWebsites();

    // 关闭模态框
    closeAddModal();

    // 显示成功消息
    showSuccessToast("网站添加成功！");
  } catch (error) {
    console.error("添加网站失败:", error);
    alert(`添加网站失败: ${error.message}`);
  }
}

// 显示成功提示
function showSuccessToast(message) {
  // 创建toast元素
  const toast = document.createElement("div");
  toast.className = "success-toast";
  toast.textContent = message;

  // 添加到页面
  document.body.appendChild(toast);

  // 显示
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // 自动消失
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
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
