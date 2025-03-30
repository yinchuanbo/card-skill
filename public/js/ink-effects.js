/**
 * 中国风水墨特效 - 为卡片系统添加水墨动画效果
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('山水墨韵效果初始化...');
    
    // 添加水墨装饰元素
    addInkDecorations();
    
    // 初始化所有特效
    initInkEffects();
    
    // 初始化点击水墨扩散效果
    initInkSplashEffect();
    
    // 添加鼠标移动水墨跟随效果
    initInkFollowEffect();
    
    // 初始化优雅滚动效果
    initElegantScrolling();
    
    // 初始化代码块增强功能
    initCodeBlockEnhancements();
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

// 添加水墨装饰元素
function addInkDecorations() {
    // 创建装饰容器
    const decorContainer = document.createElement('div');
    decorContainer.className = 'ink-decorations';
    decorContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(decorContainer);
    
    // 添加水墨点缀元素
    const inkSpots = [
        { top: '15%', left: '8%', size: 140, rotation: 15, delay: 0.2 },
        { top: '75%', left: '5%', size: 120, rotation: -10, delay: 0.5 },
        { top: '85%', left: '88%', size: 150, rotation: 12, delay: 0.3 },
        { top: '25%', left: '92%', size: 130, rotation: -15, delay: 0.7 }
    ];
    
    inkSpots.forEach(spot => {
        const inkSpot = document.createElement('div');
        inkSpot.className = 'ink-spot';
        inkSpot.style.cssText = `
            position: absolute;
            top: ${spot.top};
            left: ${spot.left};
            width: ${spot.size}px;
            height: ${spot.size}px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 C20,15 10,40 15,60 C20,80 40,90 60,85 C80,80 90,60 85,40 C80,20 60,10 50,10 Z' fill='none' stroke='%233e5c3e' stroke-width='0.5' stroke-opacity='0.07'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            transform: rotate(${spot.rotation}deg) scale(0);
            opacity: 0;
            animation: inkAppear 2s forwards ease-out;
            animation-delay: ${spot.delay}s;
        `;
        decorContainer.appendChild(inkSpot);
    });
    
    // 添加竹叶点缀
    const bamboosPositions = [
        { top: '10%', right: '15%', rotation: 15, delay: 0.4 },
        { top: '80%', right: '25%', rotation: -8, delay: 0.6 }
    ];
    
    bamboosPositions.forEach(pos => {
        const bamboo = document.createElement('div');
        bamboo.className = 'bamboo-leaves';
        bamboo.style.cssText = `
            position: absolute;
            top: ${pos.top};
            right: ${pos.right};
            width: 80px;
            height: 120px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'%3E%3Cpath d='M50,10 L50,140' stroke='%233e5c3e' stroke-width='1' stroke-opacity='0.1'/%3E%3Cpath d='M50,30 L70,20 L50,35 M50,50 L75,40 L50,55 M50,70 L65,60 L50,75 M50,40 L30,30 L50,45 M50,60 L25,50 L50,65 M50,80 L35,70 L50,85' stroke='%233e5c3e' stroke-width='0.8' stroke-opacity='0.1' fill='none'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            transform: rotate(${pos.rotation}deg) translateY(20px);
            opacity: 0;
            animation: bambooAppear 1.5s forwards ease-out;
            animation-delay: ${pos.delay}s;
        `;
        decorContainer.appendChild(bamboo);
    });
    
    // 添加飘带效果
    const ribbon = document.createElement('div');
    ribbon.className = 'ink-ribbon';
    ribbon.style.cssText = `
        position: absolute;
        top: 30%;
        left: -100px;
        width: 500px;
        height: 300px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 300'%3E%3Cpath d='M0,150 Q125,100 250,150 T500,150' stroke='%233c5a78' stroke-width='1.5' stroke-opacity='0.03' fill='none'/%3E%3Cpath d='M0,170 Q125,120 250,170 T500,170' stroke='%233c5a78' stroke-width='1' stroke-opacity='0.02' fill='none'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        transform: translateX(-100px);
        opacity: 0;
        animation: ribbonMove 25s infinite alternate ease-in-out;
        animation-delay: 1s;
    `;
    decorContainer.appendChild(ribbon);
    
    // 添加CSS动画
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes inkAppear {
            0% { transform: rotate(var(--rotation)) scale(0); opacity: 0; }
            70% { transform: rotate(var(--rotation)) scale(1.1); opacity: 0.7; }
            100% { transform: rotate(var(--rotation)) scale(1); opacity: 0.6; }
        }
        
        @keyframes bambooAppear {
            0% { transform: rotate(var(--rotation)) translateY(20px); opacity: 0; }
            100% { transform: rotate(var(--rotation)) translateY(0); opacity: 0.7; }
        }
        
        @keyframes ribbonMove {
            0% { transform: translateX(-100px); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100px); }
        }
        
        @keyframes inkSplash {
            0% { transform: scale(0); opacity: 0.7; }
            70% { opacity: 0.5; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        
        @keyframes inkFollow {
            0% { transform: scale(0) rotate(0deg); opacity: 0.2; }
            70% { opacity: 0.1; }
            100% { transform: scale(1) rotate(45deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
}

// 初始化墨迹特效
function initInkEffects() {
    // 为卡片添加墨迹悬停效果
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // 设置自定义属性用于动画延迟
        card.style.setProperty('--index', index);
        
        // 添加墨迹边框效果
        card.addEventListener('mouseenter', () => {
            if (!card.querySelector('.card-ink-border')) {
                const inkBorder = document.createElement('div');
                inkBorder.className = 'card-ink-border';
                inkBorder.style.cssText = `
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    right: -8px;
                    bottom: -8px;
                    border-radius: 16px;
                    border: 2px solid var(--mountain-green);
                    border-radius: var(--border-radius-lg);
                    opacity: 0;
                    transform: scale(0.95);
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    pointer-events: none;
                    z-index: -1;
                `;
                card.appendChild(inkBorder);
                
                // 触发重绘以应用动画
                setTimeout(() => {
                    inkBorder.style.opacity = '0.15';
                    inkBorder.style.transform = 'scale(1.02)';
                }, 10);
            } else {
                const inkBorder = card.querySelector('.card-ink-border');
                inkBorder.style.opacity = '0.15';
                inkBorder.style.transform = 'scale(1.02)';
            }
            
            // 显示卡片角落的装饰
            if (card.querySelector('.card::before')) {
                card.querySelector('.card::before').style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const inkBorder = card.querySelector('.card-ink-border');
            if (inkBorder) {
                inkBorder.style.opacity = '0';
                inkBorder.style.transform = 'scale(0.95)';
            }
            
            // 隐藏卡片角落的装饰
            if (card.querySelector('.card::before')) {
                card.querySelector('.card::before').style.opacity = '0';
            }
        });
    });
}

// 初始化点击水墨扩散效果
function initInkSplashEffect() {
    document.addEventListener('click', (e) => {
        // 不在输入框和其他特定控件上触发
        if (e.target.tagName.toLowerCase() === 'input' || 
            e.target.tagName.toLowerCase() === 'textarea' ||
            e.target.tagName.toLowerCase() === 'select' ||
            e.target.tagName.toLowerCase() === 'button' ||
            e.target.classList.contains('close-button')) {
            return;
        }
        
        // 创建墨迹扩散元素
        const splash = document.createElement('div');
        splash.className = 'ink-splash';
        splash.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            width: 80px;
            height: 80px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 C20,15 10,40 15,60 C20,80 40,90 60,85 C80,80 90,60 85,40 C80,20 60,10 50,10 Z' fill='none' stroke='%233e5c3e' stroke-width='0.8' stroke-opacity='0.2'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            transform: translate(-50%, -50%) scale(0);
            animation: inkSplash 1.2s forwards cubic-bezier(0.19, 1, 0.22, 1);
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(splash);
        
        // 动画结束后移除元素
        splash.addEventListener('animationend', () => {
            splash.remove();
        });
    });
}

// 初始化鼠标移动水墨跟随效果
function initInkFollowEffect() {
    let timeout;
    let lastX = 0, lastY = 0;
    
    document.addEventListener('mousemove', (e) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        
        // 只有鼠标移动超过一定距离才创建新的墨迹跟随
        const distanceSquared = (e.clientX - lastX) ** 2 + (e.clientY - lastY) ** 2;
        if (distanceSquared < 1000) {
            return;
        }
        
        lastX = e.clientX;
        lastY = e.clientY;
        
        timeout = setTimeout(() => {
            // 创建墨迹跟随元素
            const follow = document.createElement('div');
            follow.className = 'ink-follow';
            follow.style.cssText = `
                position: fixed;
                top: ${e.clientY}px;
                left: ${e.clientX}px;
                width: 40px;
                height: 40px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M25,25 L75,75 M25,75 L75,25' stroke='%233c5a78' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
                transform: translate(-50%, -50%) scale(0) rotate(0deg);
                animation: inkFollow 1.5s forwards ease-out;
                pointer-events: none;
                z-index: 9998;
            `;
            document.body.appendChild(follow);
            
            // 动画结束后移除元素
            follow.addEventListener('animationend', () => {
                follow.remove();
            });
        }, 50);
    });
}

// 初始化优雅滚动效果
function initElegantScrolling() {
    // 为内容区域添加平滑滚动
    document.querySelectorAll('.card-content, #modalContent').forEach(element => {
        if (element) {
            // 添加滚动监听
            element.addEventListener('scroll', debounce(function() {
                addScrollDecoration(this);
            }, 50));
        }
    });
    
    // 滚动监听 - 全局
    window.addEventListener('scroll', debounce(() => {
        addGlobalScrollEffect();
    }, 50));
    
    // 为所有内部链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 添加墨迹强调效果
                addInkHighlight(targetElement);
            }
        });
    });
}

// 添加滚动装饰效果
function addScrollDecoration(element) {
    if (!element) return;
    
    // 计算滚动百分比
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    
    // 移除旧的装饰
    const oldDecoration = element.querySelector('.scroll-decoration');
    if (oldDecoration) {
        oldDecoration.remove();
    }
    
    // 仅在滚动区域有实际滚动的情况下添加装饰
    if (element.scrollHeight > element.clientHeight) {
        // 创建新的装饰元素
        const decoration = document.createElement('div');
        decoration.className = 'scroll-decoration';
        
        // 基于滚动位置设置样式
        decoration.style.cssText = `
            position: absolute;
            right: 4px;
            width: 16px;
            height: 80px;
            pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='200' viewBox='0 0 40 200'%3E%3Cpath d='M20,10 L20,190 M12,20 L20,10 L28,20 M12,180 L20,190 L28,180' stroke='%233e5c3e' stroke-width='1' stroke-opacity='0.1' fill='none'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            opacity: ${scrollPercentage > 5 && scrollPercentage < 95 ? '0.4' : '0'};
            transition: opacity 0.5s ease;
            z-index: 10;
        `;
        
        // 根据滚动位置移动装饰
        decoration.style.top = `${Math.max(5, Math.min(90, scrollPercentage))}%`;
        
        // 添加到容器
        element.style.position = element.style.position || 'relative';
        element.appendChild(decoration);
    }
}

// 添加全局滚动特效
function addGlobalScrollEffect() {
    // 获取滚动位置
    const scrollPosition = window.scrollY;
    
    // 获取背景元素
    const bodyBg = document.querySelector('body::after');
    const decorElements = document.querySelectorAll('.ink-decorations > div');
    
    // 应用视差滚动效果到背景元素
    if (bodyBg) {
        bodyBg.style.transform = `translateY(${scrollPosition * 0.03}px) rotate(10deg)`;
    }
    
    // 为装饰元素添加微妙移动
    decorElements.forEach(elem => {
        const randomFactor = parseFloat(elem.dataset.scrollFactor || Math.random() * 0.05);
        elem.style.transform = `translateY(${scrollPosition * randomFactor}px) rotate(${elem.dataset.rotation || '0deg'})`;
    });
}

// 为目标元素添加墨迹高亮效果
function addInkHighlight(element) {
    // 创建高亮效果
    const highlight = document.createElement('div');
    highlight.className = 'ink-highlight';
    highlight.style.cssText = `
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border-radius: 8px;
        pointer-events: none;
        z-index: -1;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M20,20 C30,10 70,10 80,20 C90,30 90,70 80,80 C70,90 30,90 20,80 C10,70 10,30 20,20 Z' stroke='%233e5c3e' stroke-width='1.5' stroke-opacity='0.2' stroke-dasharray='2 4' fill='none'/%3E%3C/svg%3E");
        background-size: cover;
        transform: scale(0.95);
        opacity: 0;
    `;
    
    // 确保元素有相对或绝对定位
    const currentPosition = window.getComputedStyle(element).position;
    if (currentPosition === 'static') {
        element.style.position = 'relative';
    }
    
    // 添加到元素
    element.appendChild(highlight);
    
    // 触发动画
    setTimeout(() => {
        highlight.style.transition = 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
        highlight.style.transform = 'scale(1.02)';
        highlight.style.opacity = '1';
        
        // 移除高亮效果
        setTimeout(() => {
            highlight.style.opacity = '0';
            highlight.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                highlight.remove();
            }, 600);
        }, 1200);
    }, 10);
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 初始化代码块增强功能
function initCodeBlockEnhancements() {
    // 设置代码块的语言标签
    setupCodeLanguageTags();
    
    // 添加代码复制按钮
    addCodeCopyButtons();
    
    // 添加代码块墨迹装饰
    addCodeBlockInkDecorations();
}

// 设置代码块的语言标签
function setupCodeLanguageTags() {
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
    
    codeBlocks.forEach(block => {
        // 获取代码块语言类
        const classes = block.className.split(' ');
        let language = '';
        
        for (const cls of classes) {
            if (cls.startsWith('language-')) {
                language = cls.replace('language-', '');
                break;
            }
        }
        
        // 设置语言属性
        if (language) {
            block.setAttribute('data-language', language);
        } else {
            block.setAttribute('data-language', 'code');
        }
    });
}

// 添加代码复制按钮
function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
    
    codeBlocks.forEach(block => {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyButton.title = '复制代码';
        
        // 添加复制功能
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const code = block.querySelector('code');
            if (code) {
                copyTextToClipboard(code.innerText);
                
                // 添加复制成功状态
                copyButton.classList.add('copied');
                copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                
                // 显示墨迹效果
                addInkSplashAtElement(copyButton, 30);
                
                // 恢复原始状态
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            }
        });
        
        // 添加按钮到代码块
        block.appendChild(copyButton);
    });
}

// 复制文本到剪贴板
function copyTextToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('无法复制文本: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// 兼容性复制文本方法
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 使文本框不可见
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('无法复制文本: ', err);
    }
    
    document.body.removeChild(textArea);
}

// 在指定元素位置添加墨迹效果
function addInkSplashAtElement(element, size = 60) {
    const rect = element.getBoundingClientRect();
    const splash = document.createElement('div');
    splash.className = 'ink-splash';
    splash.style.cssText = `
        position: fixed;
        top: ${rect.top + rect.height/2}px;
        left: ${rect.left + rect.width/2}px;
        width: ${size}px;
        height: ${size}px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,10 C20,15 10,40 15,60 C20,80 40,90 60,85 C80,80 90,60 85,40 C80,20 60,10 50,10 Z' fill='none' stroke='%233e5c3e' stroke-width='0.8' stroke-opacity='0.3'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        transform: translate(-50%, -50%) scale(0);
        animation: inkSplash 1s forwards cubic-bezier(0.19, 1, 0.22, 1);
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(splash);
    
    // 动画结束后移除元素
    splash.addEventListener('animationend', () => {
        splash.remove();
    });
}

// 添加代码块墨迹装饰
function addCodeBlockInkDecorations() {
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
    
    codeBlocks.forEach(block => {
        // 创建墨迹装饰
        const inkDecoration = document.createElement('div');
        inkDecoration.className = 'ink-decoration';
        
        // 添加装饰到代码块
        block.appendChild(inkDecoration);
    });
} 