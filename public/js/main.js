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
    
    // Format as YYYY-MM-DD HH:MM:SS
    const formatDigit = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = formatDigit(date.getMonth() + 1); // getMonth() is 0-indexed
    const day = formatDigit(date.getDate());
    const hours = formatDigit(date.getHours());
    const minutes = formatDigit(date.getMinutes());
    const seconds = formatDigit(date.getSeconds());
    
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
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
    document.body.classList.add('scroll-fade');
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

/**
 * Image Lightbox Functionality
 */
function initImageLightbox() {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
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

    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    let images = [];
    let currentIndex = 0;

    // Collect all images when a modal is opened
    function collectImagesInModal() {
        if (!modalContent) return;
        images = Array.from(modalContent.querySelectorAll('img'));
        
        // Hide navigation if there's only one image
        if (images.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
            lightboxCounter.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
            lightboxCounter.style.display = 'block';
        }
    }

    // Observer to watch for changes in the modal content
    if (modalContent) {
        const observer = new MutationObserver(collectImagesInModal);
        observer.observe(modalContent, { childList: true, subtree: true });
    }

    // Add click event to images in modal content
    document.addEventListener('click', function(event) {
        const clickedImage = event.target.closest('#modalContent img');
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
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
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
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });

    // Close when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Initialize image lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImageLightbox();
}); 