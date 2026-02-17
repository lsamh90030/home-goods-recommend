/**
 * 家居好物推荐网站主脚本
 * 功能：交互效果、数据跟踪、用户体验优化
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('家居好物推荐网站已加载');
    
    // 初始化所有功能
    initMenuToggle();
    initSmoothScroll();
    initProductHover();
    initVisitorTracking();
    initLazyLoading();
    initThemeToggle();
    initBackToTop();
});

/**
 * 菜单切换功能（移动端）
 */
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            menuToggle.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });
        
        // 点击外部关闭菜单
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('show');
                menuToggle.textContent = '☰';
            }
        });
        
        // 窗口大小变化时重置菜单
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('show');
                menuToggle.textContent = '☰';
            }
        });
    }
}

/**
 * 平滑滚动功能
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 排除空链接和特殊链接
            if (href === '#' || href.startsWith('#!')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // 移动端关闭菜单
                if (window.innerWidth < 768) {
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (navLinks) navLinks.classList.remove('show');
                    if (menuToggle) menuToggle.textContent = '☰';
                }
                
                // 平滑滚动到目标
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL（不刷新页面）
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * 商品卡片悬停效果
 */
function initProductHover() {
    const productCards = document.querySelectorAll('.product-card, .category-card, .article-card');
    
    productCards.forEach(card => {
        // 鼠标悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // 点击效果
        card.addEventListener('click', function(e) {
            // 如果不是链接元素，添加点击反馈
            if (!e.target.closest('a')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

/**
 * 访客跟踪
 */
function initVisitorTracking() {
    // 检查是否是新访客
    const visited = localStorage.getItem('homeGoodsVisited');
    const today = new Date().toISOString().split('T')[0];
    
    if (!visited) {
        // 新访客
        localStorage.setItem('homeGoodsVisited', today);
        localStorage.setItem('homeGoodsVisitCount', '1');
        console.log('👋 欢迎新访客！');
    } else {
        // 老访客
        let visitCount = parseInt(localStorage.getItem('homeGoodsVisitCount') || '0');
        visitCount++;
        localStorage.setItem('homeGoodsVisitCount', visitCount.toString());
        
        // 如果上次访问不是今天，更新日期
        if (visited !== today) {
            localStorage.setItem('homeGoodsVisited', today);
        }
        
        console.log(`🔄 欢迎回来！这是您的第${visitCount}次访问。`);
    }
    
    // 记录页面浏览
    const pageViews = localStorage.getItem('homeGoodsPageViews') || '{}';
    const views = JSON.parse(pageViews);
    const currentPage = window.location.pathname || '/';
    
    views[currentPage] = (views[currentPage] || 0) + 1;
    localStorage.setItem('homeGoodsPageViews', JSON.stringify(views));
}

/**
 * 图片懒加载
 */
function initLazyLoading() {
    // 如果浏览器支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * 主题切换（日间/夜间模式）
 */
function initThemeToggle() {
    // 检查用户主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('homeGoodsTheme');
    
    // 应用主题
    function applyTheme(theme) {
        if (theme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
    
    // 初始应用主题
    applyTheme(savedTheme);
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('homeGoodsTheme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // 创建主题切换按钮（可选）
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    themeToggle.title = '切换主题';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('homeGoodsTheme', newTheme);
        
        // 更新按钮图标
        this.innerHTML = newTheme === 'dark' ? '☀️' : '🌓';
    });
    
    // 初始设置按钮图标
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggle.innerHTML = initialTheme === 'dark' ? '☀️' : '🌓';
    
    // 添加到页面
    document.body.appendChild(themeToggle);
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = '返回顶部';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: none;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s;
    `;
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'flex';
            setTimeout(() => {
                backToTop.style.opacity = '1';
            }, 10);
        } else {
            backToTop.style.opacity = '0';
            setTimeout(() => {
                backToTop.style.display = 'none';
            }, 300);
        }
    });
    
    // 添加到页面
    document.body.appendChild(backToTop);
}

/**
 * 商品点击统计
 */
function trackProductClick(productName, productId) {
    const clicks = JSON.parse(localStorage.getItem('homeGoodsProductClicks') || '{}');
    const key = `${productName}_${productId}`;
    
    clicks[key] = (clicks[key] || 0) + 1;
    localStorage.setItem('homeGoodsProductClicks', JSON.stringify(clicks));
    
    console.log(`📊 商品点击: ${productName} (ID: ${productId})`);
    
    // 这里可以发送到分析服务
    // sendAnalytics('product_click', { productName, productId });
}

/**
 * 页面性能监控
 */
function monitorPerformance() {
    // 记录页面加载时间
    window.addEventListener('load', function() {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('⚠️ 页面加载较慢，建议优化');
        }
    });
    
    // 监控资源加载错误
    window.addEventListener('error', function(e) {
        if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
            console.error(`❌ 资源加载失败: ${e.target.src || e.target.href}`);
        }
    }, true);
}

/**
 * 分享功能
 */
function initShareButtons() {
    const shareData = {
        title: document.title,
        text: '发现提升生活品质的家居神器！',
        url: window.location.href
    };
    
    // 检查Web Share API支持
    if (navigator.share) {
        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.innerHTML = '🔗 分享';
        shareButton.style.cssText = `
            position: fixed;
            bottom: 140px;
            right: 20px;
            padding: 10px 20px;
            background: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-weight: 500;
        `;
        
        shareButton.addEventListener('click', async function() {
            try {
                await navigator.share(shareData);
                console.log('✅ 内容已分享');
            } catch (err) {
                console.log('❌ 分享取消:', err);
            }
        });
        
        document.body.appendChild(shareButton);
    }
}

// 初始化性能监控
monitorPerformance();

// 初始化分享按钮（可选）
// initShareButtons();

// 导出函数供其他脚本使用
window.HomeGoods = {
    trackProductClick,
    initThemeToggle,
    initBackToTop
};

console.log('🎉 家居好物网站脚本初始化完成');