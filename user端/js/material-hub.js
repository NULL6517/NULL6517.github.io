// 从API加载材料数据
let materials = [];

// 从API读取数据
async function loadMaterials() {
    try {
        const response = await fetch('http://localhost:3002/api/materials');
        if (response.ok) {
            materials = await response.json();
        } else {
            console.error('加载材料数据失败:', response.status);
            materials = [];
        }
    } catch (error) {
        console.error('加载材料数据失败:', error);
        materials = [];
    }
    renderMaterials(materials);
}

let currentFilter = {
    category: 'all',
    price: 'all',
    brand: 'all',
    style: 'all',
    search: ''
};

let currentSort = 'default';

function renderMaterials(materialsToRender) {
    const grid = document.getElementById('materialGrid');
    grid.innerHTML = '';
    
    // 隐藏加载状态
    document.getElementById('loadingState').style.display = 'none';
    
    if (materialsToRender.length === 0) {
        // 显示无结果状态
        document.getElementById('noResultsState').style.display = 'block';
        document.getElementById('materialGrid').style.display = 'none';
    } else {
        // 显示搜索结果
        document.getElementById('noResultsState').style.display = 'none';
        document.getElementById('materialGrid').style.display = 'block';
        
        materialsToRender.forEach(material => {
            const item = document.createElement('div');
            // 添加推荐材料的特殊类名
            const itemClass = material.is_featured ? 'material-item featured' : 'material-item';
            item.className = itemClass;
            // 确保图片路径正确
            const imagePath = material.image.startsWith('data:') || material.image.startsWith('http') ? material.image : `../../${material.image}`;
            
            // 生成标签
            const tags = [];
            if (material.is_new) tags.push('新品');
            if (material.stock < 10) tags.push('库存紧张');
            
            item.innerHTML = `
                <img src="${imagePath}" alt="${material.name}" class="material-img">
                <div class="material-info">
                    <div class="material-name">${material.name}</div>
                    <div class="material-category">${material.categoryName} / ${material.brandName}</div>
                    <div class="material-price">¥${material.price}/${material.unit}</div>
                    ${tags.length > 0 ? `
                        <div class="material-tags">
                            ${tags.map(tag => `<span class="material-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="material-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetail(${material.id})">查看详情</button>
                        <button class="btn btn-sm btn-primary" onclick="addToCart(${material.id})">加入采购单</button>
                    </div>
                </div>
            `;
            grid.appendChild(item);
        });
    }
}

function filterMaterials() {
    // 显示加载状态
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('noResultsState').style.display = 'none';
    document.getElementById('materialGrid').style.display = 'none';
    
    setTimeout(() => {
        try {
            let filtered = [...materials];
            
            if (currentFilter.category !== 'all') {
                filtered = filtered.filter(m => m.category === currentFilter.category);
            }
            
            if (currentFilter.price !== 'all') {
                const [min, max] = currentFilter.price.split('-').map(Number);
                if (currentFilter.price === '1000+') {
                    filtered = filtered.filter(m => m.price >= 1000);
                } else {
                    filtered = filtered.filter(m => m.price >= min && m.price <= max);
                }
            }
            
            if (currentFilter.brand !== 'all') {
                filtered = filtered.filter(m => m.brand === currentFilter.brand);
            }
            
            if (currentFilter.style !== 'all') {
                filtered = filtered.filter(m => m.style === currentFilter.style);
            }
            
            if (currentFilter.search) {
                const search = currentFilter.search.toLowerCase();
                filtered = filtered.filter(m => 
                    m.name.toLowerCase().includes(search) || 
                    m.brandName.toLowerCase().includes(search) ||
                    m.categoryName.toLowerCase().includes(search)
                );
            }
            
            if (currentSort === 'price-asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'price-desc') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (currentSort === 'newest') {
                filtered.sort((a, b) => b.id - a.id);
            }
            
            renderMaterials(filtered);
        } catch (error) {
            console.error('搜索失败:', error);
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('errorState').style.display = 'block';
            document.getElementById('noResultsState').style.display = 'none';
            document.getElementById('materialGrid').style.display = 'none';
        }
    }, 300); // 添加小延迟以显示加载状态
}

function filterByCategory(category, element) {
    currentFilter.category = category;
    document.querySelectorAll('.filter-options .filter-option').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    filterMaterials();
}

function filterByPrice(price, element) {
    currentFilter.price = price;
    document.querySelectorAll('.filter-options .filter-option').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    filterMaterials();
}

function filterByBrand(brand, element) {
    currentFilter.brand = brand;
    document.querySelectorAll('.filter-options .filter-option').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    filterMaterials();
}

function filterByStyle(style, element) {
    currentFilter.style = style;
    document.querySelectorAll('.filter-options .filter-option').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    filterMaterials();
}

function sortMaterials(sort, element) {
    currentSort = sort;
    document.querySelectorAll('.filter-options .filter-option').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    filterMaterials();
}

function searchMaterials() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    // 输入验证
    if (!searchTerm) {
        alert('请输入搜索关键词');
        return;
    }
    
    // 特殊字符处理
    const sanitizedSearch = searchTerm.replace(/[<>&"'()]/g, '');
    currentFilter.search = sanitizedSearch;
    filterMaterials();
}

// 从URL参数中获取搜索词
function getSearchFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    if (searchTerm) {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = searchTerm;
        currentFilter.search = searchTerm;
        filterMaterials();
    }
}

// 清除搜索
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    currentFilter.search = '';
    filterMaterials();
}

function viewDetail(id) {
    window.location.href = `material-detail.html?id=${id}`;
}

async function addToCart(id) {
    try {
        const response = await fetch(`http://localhost:3002/api/materials/${id}`);
        if (response.ok) {
            const material = await response.json();
            
            // 获取现有采购单
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // 检查材料是否已在采购单中
            const existingItemIndex = cart.findIndex(item => item.id === material.id);
            
            if (existingItemIndex !== -1) {
                // 材料已存在，增加数量
                cart[existingItemIndex].quantity++;
            } else {
                // 材料不存在，添加到采购单
                cart.push({
                    id: material.id,
                    name: material.name,
                    categoryName: material.categoryName,
                    brandName: material.brandName,
                    spec: material.spec,
                    price: material.price,
                    unit: material.unit,
                    image: material.image,
                    quantity: 1
                });
            }
            
            // 保存采购单
            localStorage.setItem('cart', JSON.stringify(cart));
            
            alert(`已将 ${material.name} 加入采购单`);
        }
    } catch (error) {
        console.error('添加到采购单失败:', error);
        alert('添加到采购单失败，请检查网络连接');
    }
}

$(document).ready(function() {
    loadMaterials();
    
    // 从URL参数中获取搜索词
    getSearchFromUrl();
    
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            searchMaterials();
        }
    });
});