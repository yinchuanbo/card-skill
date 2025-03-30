/**
 * 中国风水墨特效 - 为卡片系统添加水墨动画效果
 */

document.addEventListener('DOMContentLoaded', function() {
    // 添加印章效果
    addSeals();
    
    // 添加墨点特效
    setupInkSplashEffect();
    
    // 添加卡片悬停特效
    setupCardHoverEffects();
    
    // 添加页面载入动画
    document.body.classList.add('loaded');
});

/**
 * 添加印章装饰
 */
function addSeals() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // 添加页面顶部印章
    const seal = document.createElement('div');
    seal.className = 'seal seal-top-right';
    container.appendChild(seal);
}

/**
 * 墨点特效 - 点击时产生水墨扩散效果
 */
function setupInkSplashEffect() {
    document.addEventListener('click', function(e) {
        // 创建墨点元素
        const splash = document.createElement('div');
        splash.className = 'ink-splash';
        
        // 设置墨点位置
        splash.style.left = (e.pageX - 50) + 'px';
        splash.style.top = (e.pageY - 50) + 'px';
        
        // 添加到页面
        document.body.appendChild(splash);
        
        // 动画结束后移除元素
        setTimeout(() => {
            splash.remove();
        }, 1000);
    });
}

/**
 * 为卡片添加悬停特效
 */
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // 添加移动视差效果
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠标在卡片内的X坐标
            const y = e.clientY - rect.top;  // 鼠标在卡片内的Y坐标
            
            // 计算鼠标位置相对于卡片中心的偏移量（范围：-1到1）
            const xOffset = ((x / rect.width) - 0.5) * 2;
            const yOffset = ((y / rect.height) - 0.5) * 2;
            
            // 根据鼠标位置设置卡片的旋转角度
            this.style.transform = `
                translateY(-5px)
                rotateX(${yOffset * -2}deg) 
                rotateY(${xOffset * 2}deg)
                scale(1.02)
            `;
        });
        
        // 鼠标离开时恢复原状
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * 为页面添加山水画笔刷装饰
 */
function addBrushDecorations() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // 创建装饰元素
    const decoration = document.createElement('div');
    decoration.className = 'brush-decoration';
    decoration.style.position = 'absolute';
    decoration.style.opacity = '0.03';
    decoration.style.pointerEvents = 'none';
    decoration.style.zIndex = '-1';
    
    // 随机位置
    decoration.style.top = Math.random() * 80 + '%';
    decoration.style.right = Math.random() * 20 + '%';
    decoration.style.width = (Math.random() * 200 + 100) + 'px';
    decoration.style.height = (Math.random() * 300 + 100) + 'px';
    
    // 随机选择装饰样式
    const types = ['mountain', 'tree', 'cloud', 'bird'];
    const type = types[Math.floor(Math.random() * types.length)];
    decoration.classList.add(`brush-${type}`);
    
    container.appendChild(decoration);
}

/**
 * 平滑滚动效果
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 检测页面可见性变化，重新应用动画
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        document.body.classList.remove('loaded');
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 10);
    }
}); 