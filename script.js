/* ==================== 全局变量 ==================== */
let foodData = null;
let currentSlideIndex = 0;
let slideInterval = null;
let typewriterTimeout = null;

/* ==================== DOM 元素获取 ==================== */
const typewriterElement = document.getElementById('typewriter');
const noodlesGrid = document.getElementById('noodlesGrid');
const snacksGrid = document.getElementById('snacksGrid');
const techniquesGrid = document.getElementById('techniquesGrid');
const mapMarkers = document.getElementById('mapMarkers');
const mapInfo = document.getElementById('mapInfo');
const modal = document.getElementById('foodModal');
const modalBody = document.getElementById('modalBody');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const slides = document.querySelectorAll('.hero-slide');
const slideDots = document.querySelectorAll('.slide-dot');

/* ==================== 打字机文案 ==================== */
const typewriterTexts = [
    '世界面食在中国，中国面食在山西',
    '一面百样，一面百味',
    '刀削、剔尖、栲栳栳，舌尖上的三晋',
    '晋商故里，美食传承'
];

/* ==================== 地图标记位置 ==================== */
const mapMarkerPositions = {
    '太原': { x: 300, y: 380 },
    '大同': { x: 380, y: 180 },
    '晋中': { x: 280, y: 320 },
    '晋北': { x: 350, y: 220 },
    '忻州': { x: 340, y: 280 },
    '临汾': { x: 260, y: 520 },
    '运城': { x: 240, y: 620 },
    '平遥': { x: 270, y: 350 },
    '吕梁': { x: 180, y: 420 },
    '柳林': { x: 170, y: 480 }
};

/* ==================== 初始化函数 ==================== */
async function init() {
    try {
        await loadFoodData();
        renderAllComponents();
        initTypewriter();
        initSlideShow();
        initScrollAnimations();
        initEventListeners();
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

/* ==================== 加载数据 ==================== */
async function loadFoodData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('无法加载数据文件');
        }
        foodData = await response.json();
        console.log('数据加载成功');
    } catch (error) {
        console.error('加载数据失败:', error);
        throw error;
    }
}

/* ==================== 渲染所有组件 ==================== */
function renderAllComponents() {
    if (!foodData) return;
    
    renderNoodles();
    renderSnacks();
    renderTechniques();
    renderMapMarkers();
}

/* ==================== 渲染面食卡片 ==================== */
function renderNoodles() {
    const noodles = foodData.foods.filter(food => food.category === 'noodle');
    
    noodlesGrid.innerHTML = noodles.map(food => `
        <div class="food-card scroll-animate" data-food-id="${food.id}">
            <img src="${food.image}" alt="${food.name}" class="food-card-image" loading="lazy">
            <div class="food-card-content">
                <div class="food-card-header">
                    <h3 class="food-card-title">${food.name}</h3>
                    <span class="food-card-craft">${food.craft}</span>
                </div>
                <p class="food-card-description">${food.description}</p>
                <span class="food-card-region">${food.region}</span>
            </div>
        </div>
    `).join('');
}

/* ==================== 渲染特色小吃（瀑布流） ==================== */
function renderSnacks() {
    const snacks = foodData.foods.filter(food => food.category === 'snack');
    
    snacksGrid.innerHTML = snacks.map(food => `
        <div class="snack-card scroll-animate" data-food-id="${food.id}">
            <img src="${food.image}" alt="${food.name}" class="snack-card-image" loading="lazy">
            <div class="snack-card-content">
                <div class="snack-card-header">
                    <h3 class="snack-card-title">${food.name}</h3>
                    <span class="snack-card-craft">${food.craft}</span>
                </div>
                <p class="snack-card-description">${food.description}</p>
                <span class="snack-card-region">${food.region}</span>
            </div>
        </div>
    `).join('');
}

/* ==================== 渲染制作技法 ==================== */
function renderTechniques() {
    const techniques = foodData.techniques;
    
    techniquesGrid.innerHTML = techniques.map(tech => `
        <div class="technique-item scroll-animate">
            <span class="technique-icon">${tech.icon}</span>
            <span class="technique-name">${tech.name}</span>
            <span class="technique-desc">${tech.description}</span>
        </div>
    `).join('');
}

/* ==================== 渲染地图标记 ==================== */
function renderMapMarkers() {
    const regions = foodData.regions;
    let markersHTML = '';
    
    regions.forEach(region => {
        const pos = mapMarkerPositions[region.name];
        if (pos) {
            markersHTML += `
                <g class="map-marker" data-region="${region.name}" transform="translate(${pos.x}, ${pos.y})">
                    <circle class="map-marker-circle" cx="0" cy="0" r="12"/>
                    <text class="map-marker-text" x="0" y="25">${region.name}</text>
                </g>
            `;
        }
    });
    
    mapMarkers.innerHTML = markersHTML;
}

/* ==================== 打字机效果 ==================== */
function initTypewriter() {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    
    function type() {
        const currentText = typewriterTexts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typewriterTimeout = setTimeout(() => {
                isDeleting = true;
                type();
            }, pauseTime);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typewriterTexts.length;
        }
        
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        typewriterTimeout = setTimeout(type, speed);
    }
    
    type();
}

/* ==================== 轮播图 ==================== */
function initSlideShow() {
    if (slides.length === 0) return;
    
    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        
        slideDots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
        
        currentSlideIndex = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    slideInterval = setInterval(nextSlide, 5000);
    
    slideDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
}

/* ==================== 滚动动画 ==================== */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    const header = document.getElementById('header');
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollY = currentScrollY;
    });
}

/* ==================== 事件监听初始化 ==================== */
function initEventListeners() {
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        const foodCard = e.target.closest('.food-card, .snack-card');
        if (foodCard) {
            const foodId = parseInt(foodCard.dataset.foodId);
            openFoodModal(foodId);
        }
    });
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    document.addEventListener('click', (e) => {
        const marker = e.target.closest('.map-marker');
        if (marker) {
            const regionName = marker.dataset.region;
            showRegionFoods(regionName);
        }
    });
}

/* ==================== 移动端菜单切换 ==================== */
function toggleMobileMenu() {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

/* ==================== 打开美食详情模态框 ==================== */
function openFoodModal(foodId) {
    const food = foodData.foods.find(f => f.id === foodId);
    if (!food) return;
    
    modalBody.innerHTML = `
        <img src="${food.image}" alt="${food.name}" class="modal-food-image">
        <div class="modal-food-content">
            <div class="modal-food-header">
                <h3 class="modal-food-title">${food.name}</h3>
                <span class="modal-food-craft">${food.craft}</span>
            </div>
            <span class="modal-food-region">${food.region}</span>
            <p class="modal-food-description">${food.description}</p>
            <div class="modal-food-detail">
                <h4>制作工艺</h4>
                <p>${food.craftDescription}</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* ==================== 关闭模态框 ==================== */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==================== 显示地区美食 ==================== */
function showRegionFoods(regionName) {
    const region = foodData.regions.find(r => r.name === regionName);
    if (!region) return;
    
    const foods = foodData.foods.filter(f => 
        region.foods.includes(f.name) || f.region.includes(regionName)
    );
    
    if (foods.length === 0) {
        mapInfo.innerHTML = `
            <div class="map-info-placeholder">
                <h3>${regionName}</h3>
                <p>该地区暂无详细美食信息</p>
            </div>
        `;
        return;
    }
    
    const food = foods[0];
    
    mapInfo.innerHTML = `
        <div class="map-info-food">
            <div class="map-info-food-header">
                <img src="${food.image}" alt="${food.name}" class="map-info-food-image">
                <div>
                    <h3 class="map-info-food-title">${food.name}</h3>
                    <span class="map-info-food-craft">${food.craft}</span>
                </div>
            </div>
            <p class="map-info-food-description">${food.description}</p>
            <div class="map-info-food-detail">
                <h4>制作工艺</h4>
                <p>${food.craftDescription}</p>
            </div>
        </div>
    `;
}

/* ==================== 页面加载完成后初始化 ==================== */
document.addEventListener('DOMContentLoaded', init);

/* ==================== 页面卸载时清理定时器 ==================== */
window.addEventListener('beforeunload', () => {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
});
