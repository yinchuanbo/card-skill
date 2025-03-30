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