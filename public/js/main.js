// DOM Elements
const cardGrid = document.getElementById('cardGrid');
const searchInput = document.getElementById('searchInput');
const tagFilters = document.getElementById('tagFilters');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

// State
let cards = [];
let activeFilters = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
if (searchInput) searchInput.addEventListener('input', filterCards);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
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
}

// Fetch Cards Data
async function fetchCards() {
    try {
        const response = await fetch('/cards.json');
        if (!response.ok) throw new Error('Failed to fetch cards');
        cards = await response.json();
        
        // Sort cards by date (newest first)
        cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error('Error fetching cards:', error);
        if (cardGrid) {
            cardGrid.innerHTML = `<div class="error">Failed to load cards. Please try again later.</div>`;
        }
    }
}

// Render Cards
function renderCards() {
    if (!cardGrid) return;
    
    // Clear loading message
    cardGrid.innerHTML = '';
    
    // Apply filters
    const filteredCards = filterCardsBySearch(filterCardsByTags(cards));
    
    if (filteredCards.length === 0) {
        cardGrid.innerHTML = `<div class="no-results">No cards match your filters</div>`;
        return;
    }
    
    // Create cards
    filteredCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardGrid.appendChild(cardElement);
    });
}

// Create Card Element
function createCardElement(card, index) {
    const cardElement = document.createElement('article');
    cardElement.className = 'card';
    cardElement.style.setProperty('--index', index); // For staggered animation
    
    // Format date
    const date = new Date(card.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Create card HTML
    cardElement.innerHTML = `
        <div class="card-header">
            <h2>${card.title}</h2>
            <div class="card-meta">
                <time datetime="${card.createdAt}">${formattedDate}</time>
            </div>
            <div class="card-tags">
                ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="card-body">
            <p class="card-summary">${card.summary}</p>
        </div>
    `;
    
    // Add click event to open modal
    cardElement.addEventListener('click', () => openModal(card));
    
    return cardElement;
}

// Filter functions
function filterCards() {
    renderCards();
}

function filterCardsBySearch(cardsToFilter) {
    if (!searchInput || !searchInput.value.trim()) return cardsToFilter;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    return cardsToFilter.filter(card => 
        card.title.toLowerCase().includes(searchTerm) || 
        card.summary.toLowerCase().includes(searchTerm) ||
        card.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
}

function filterCardsByTags(cardsToFilter) {
    if (activeFilters.length === 0) return cardsToFilter;
    
    return cardsToFilter.filter(card => 
        activeFilters.every(tag => card.tags.includes(tag))
    );
}

// Setup Tag Filters
function setupTagFilters() {
    if (!tagFilters) return;
    
    // Get all unique tags
    const allTags = new Set();
    cards.forEach(card => {
        card.tags.forEach(tag => allTags.add(tag));
    });
    
    // Clear existing filters
    tagFilters.innerHTML = '';
    
    // Create tag filter elements
    allTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-filter';
        tagElement.textContent = tag;
        
        tagElement.addEventListener('click', () => {
            toggleTagFilter(tag, tagElement);
        });
        
        tagFilters.appendChild(tagElement);
    });
}

// Toggle Tag Filter
function toggleTagFilter(tag, element) {
    if (activeFilters.includes(tag)) {
        // Remove filter
        activeFilters = activeFilters.filter(t => t !== tag);
        element.classList.remove('active');
    } else {
        // Add filter
        activeFilters.push(tag);
        element.classList.add('active');
    }
    
    filterCards();
}

// Modal Functions
async function openModal(card) {
    if (!modalOverlay || !modalContent) return;
    
    // Fetch the full content
    try {
        const response = await fetch(card.url);
        if (!response.ok) throw new Error('Failed to fetch card content');
        const html = await response.text();
        
        // Extract the content from the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 直接提取内容区域，而不是整个card-content容器
        const header = tempDiv.querySelector('.card-content header').innerHTML;
        const content = tempDiv.querySelector('.card-content .content').innerHTML;
        
        // 设置模态内容，不再嵌套card-content
        modalContent.innerHTML = `
            <header>${header}</header>
            <div class="content">${content}</div>
        `;
        
        // 应用代码高亮
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
        
        // Show modal with animation
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add to browser history
        window.history.pushState({ cardId: card.id }, '', card.url);
        
    } catch (error) {
        console.error('Error fetching card content:', error);
        modalContent.innerHTML = `<div class="error">Failed to load content. Please try again later.</div>`;
        modalOverlay.classList.add('active');
    }
}

function closeModal() {
    if (!modalOverlay) return;
    
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Go back in history if we pushed a state
    if (window.history.state && window.history.state.cardId) {
        window.history.back();
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    closeModal();
});

// Add entry animation when content is loaded
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/**
 * 添加阅读进度指示器
 */
function addReadingProgressIndicator() {
    // 创建容器
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    // 创建进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    // 组合元素
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // 监听滚动事件更新进度条
    window.addEventListener('scroll', function() {
        // 计算滚动百分比
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // 更新进度条宽度
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
            
            // 在接近顶部时隐藏进度条
            if (scrolled < 2) {
                progressBar.style.opacity = '0';
            } else {
                progressBar.style.opacity = '1';
            }
        }
    });
}

/**
 * 添加滚动指示器和滚动箭头
 */
function addScrollIndicators() {
    // 创建滚动指示器
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);
    
    // 为长页面添加滚动箭头
    const mainContainer = document.querySelector('.container');
    if (mainContainer && document.body.scrollHeight > window.innerHeight * 1.5) {
        const scrollArrow = document.createElement('div');
        scrollArrow.className = 'scroll-arrow';
        mainContainer.appendChild(scrollArrow);
        
        // 箭头点击事件 - 平滑滚动到内容
        scrollArrow.addEventListener('click', function() {
            window.scrollBy({
                top: window.innerHeight / 2,
                behavior: 'smooth'
            });
        });
    }
    
    // 监听滚动事件显示/隐藏滚动指示器
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动超过300px显示回到顶部按钮
        if (scrollTop > 300) {
            scrollIndicator.classList.add('visible');
        } else {
            scrollIndicator.classList.remove('visible');
        }
        
        // 记录上次滚动位置
        lastScrollTop = scrollTop;
    });
    
    // 点击滚动指示器回到顶部
    scrollIndicator.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 