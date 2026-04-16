// 从API加载作品集数据
let portfolioItems = [];

let currentPage = 1;
const itemsPerPage = 10;
let deleteId = null;

// 从API读取数据
async function loadPortfolioItems() {
    try {
        const response = await fetch('http://localhost:3002/api/portfolios');
        if (response.ok) {
            portfolioItems = await response.json();
        } else {
            // 如果API失败，使用默认数据
            portfolioItems = getDefaultPortfolioItems();
        }
    } catch (error) {
        console.error('加载作品集数据失败:', error);
        portfolioItems = getDefaultPortfolioItems();
    }
    renderPortfolio();
}

// 默认作品集数据
function getDefaultPortfolioItems() {
    return [
        {
            id: 1,
            name: '现代简约风格 VR展示',
            style: 'modern',
            type: 'vr',
            vrLink: 'https://www.vrjusteasy.com/view/your-vr-project-1',
            image: '../../img/作品展示1.jpg',
            description: '这是一个现代简约风格的装修设计项目，通过VR技术您可以360度全方位体验空间效果。',
            recommended: true,
            category: '住宅公寓'
        },
        {
            id: 2,
            name: '欧式风格 VR展示',
            style: 'european',
            type: 'vr',
            vrLink: 'https://www.vrjusteasy.com/view/your-vr-project-2',
            image: '../../img/作品展示2.jpg',
            description: '这是一个欧式风格的装修设计项目，通过VR技术您可以360度全方位体验空间效果。',
            recommended: true,
            category: '别墅豪宅'
        },
        {
            id: 3,
            name: '中式风格传统展示',
            style: 'chinese',
            type: 'traditional',
            image: '../../img/公司简介.jpg',
            description: '这是一个中式风格的装修设计项目，展现了传统中式元素与现代设计的完美融合。',
            recommended: false,
            category: '住宅公寓'
        },
        {
            id: 4,
            name: '工业风格传统展示',
            style: 'industrial',
            type: 'traditional',
            image: '../../img/公司商标.jpg',
            description: '这是一个工业风格的装修设计项目，展现了现代工业风的粗犷与时尚。',
            recommended: false,
            category: '商业空间'
        }
    ];
}

// 保存作品集数据（通过API实现）
async function savePortfolioItems() {
    // 保存到localStorage作为缓存
    localStorage.setItem('portfolioItems', JSON.stringify(portfolioItems));
}

function renderPortfolio() {
    const tbody = document.getElementById('portfolioTableBody');
    tbody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = portfolioItems.slice(startIndex, endIndex);
    
    pageItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${getStyleName(item.style)}</td>
            <td>${item.type === 'vr' ? 'VR作品' : '传统作品'}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-info" onclick="viewPortfolio(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editPortfolio(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePortfolio(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        `;
        pagination.appendChild(li);
    }
}

function changePage(page) {
    currentPage = page;
    renderPortfolio();
}

function filterPortfolio() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const styleFilter = document.getElementById('styleFilter').value;
    
    // 这里可以实现筛选逻辑
    // 目前只是重新渲染所有数据
    renderPortfolio();
}

function openAddModal() {
    $('#addPortfolioModal').modal('show');
    resetAddForm();
}

function resetAddForm() {
    document.getElementById('addPortfolioForm').reset();
    // 重置图片预览
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = '';
    imagePreview.style.display = 'none';
}

async function savePortfolio() {
    const portfolioImage = document.getElementById('portfolioImage');
    const imagePreview = document.getElementById('imagePreview');
    
    let imageUrl = '';
    if (imagePreview.src && imagePreview.src !== '') {
        imageUrl = imagePreview.src;
    }
    
    const newItem = {
        name: document.getElementById('portfolioName').value,
        style: document.getElementById('portfolioStyle').value,
        type: document.getElementById('portfolioType').value,
        vrLink: document.getElementById('portfolioVrLink').value,
        image: imageUrl,
        description: document.getElementById('portfolioDescription').value,
        recommended: document.getElementById('portfolioRecommended').checked,
        category: document.getElementById('portfolioCategory').value
    };
    
    if (newItem.name && newItem.style && newItem.type && newItem.image && newItem.description && newItem.category) {
        try {
            const response = await fetch('http://localhost:3002/api/portfolios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });
            
            if (response.ok) {
                const savedItem = await response.json();
                portfolioItems.push(savedItem);
                await savePortfolioItems();
                renderPortfolio();
                $('#addPortfolioModal').modal('hide');
                alert('作品添加成功！');
            } else {
                alert('作品添加失败，请重试');
            }
        } catch (error) {
            console.error('添加作品集失败:', error);
            alert('作品添加失败，请检查网络连接');
        }
    } else {
        alert('请填写所有必填字段');
    }
}

function editPortfolio(id) {
    const item = portfolioItems.find(p => p.id === id);
    if (item) {
        document.getElementById('editPortfolioId').value = item.id;
        document.getElementById('editPortfolioName').value = item.name;
        document.getElementById('editPortfolioStyle').value = item.style;
        document.getElementById('editPortfolioType').value = item.type;
        document.getElementById('editPortfolioVrLink').value = item.vrLink;
        document.getElementById('editPortfolioRecommended').checked = item.recommended || false;
        document.getElementById('editPortfolioCategory').value = item.category || '住宅公寓';
        // 重置文件输入框
        document.getElementById('editPortfolioImage').value = '';
        // 显示图片预览
        const editImagePreview = document.getElementById('editImagePreview');
        editImagePreview.src = item.image;
        editImagePreview.style.display = 'block';
        document.getElementById('editPortfolioDescription').value = item.description;
        
        $('#editPortfolioModal').modal('show');
    }
}

async function updatePortfolio() {
    const id = parseInt(document.getElementById('editPortfolioId').value);
    const itemIndex = portfolioItems.findIndex(p => p.id === id);
    
    const editPortfolioImage = document.getElementById('editPortfolioImage');
    const editImagePreview = document.getElementById('editImagePreview');
    
    let imageUrl = portfolioItems[itemIndex].image;
    if (editImagePreview.src && editImagePreview.src !== '') {
        imageUrl = editImagePreview.src;
    }
    
    if (itemIndex !== -1) {
        const updatedItem = {
            ...portfolioItems[itemIndex],
            name: document.getElementById('editPortfolioName').value,
            style: document.getElementById('editPortfolioStyle').value,
            type: document.getElementById('editPortfolioType').value,
            vrLink: document.getElementById('editPortfolioVrLink').value,
            image: imageUrl,
            description: document.getElementById('editPortfolioDescription').value,
            recommended: document.getElementById('editPortfolioRecommended').checked,
            category: document.getElementById('editPortfolioCategory').value
        };
        
        try {
            const response = await fetch(`http://localhost:3002/api/portfolios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
            
            if (response.ok) {
                portfolioItems[itemIndex] = updatedItem;
                await savePortfolioItems();
                renderPortfolio();
                $('#editPortfolioModal').modal('hide');
                alert('作品更新成功！');
            } else {
                alert('作品更新失败，请重试');
            }
        } catch (error) {
            console.error('更新作品集失败:', error);
            alert('作品更新失败，请检查网络连接');
        }
    }
}

function viewPortfolio(id) {
    const item = portfolioItems.find(p => p.id === id);
    if (item) {
        alert(`作品详情：\n名称：${item.name}\n风格：${getStyleName(item.style)}\n类型：${item.type === 'vr' ? 'VR作品' : '传统作品'}\n${item.vrLink ? `VR链接：${item.vrLink}\n` : ''}描述：${item.description}`);
    }
}

function deletePortfolio(id) {
    deleteId = id;
    $('#deleteModal').modal('show');
}

async function confirmDelete() {
    if (deleteId !== null) {
        try {
            const response = await fetch(`http://localhost:3002/api/portfolios/${deleteId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                portfolioItems = portfolioItems.filter(p => p.id !== deleteId);
                await savePortfolioItems();
                renderPortfolio();
                $('#deleteModal').modal('hide');
                alert('作品删除成功！');
                deleteId = null;
            } else {
                alert('作品删除失败，请重试');
            }
        } catch (error) {
            console.error('删除作品集失败:', error);
            alert('作品删除失败，请检查网络连接');
        }
    }
}

function exportData() {
    const dataStr = JSON.stringify(portfolioItems, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.json';
    link.click();
    URL.revokeObjectURL(url);
}

function getStyleName(style) {
    const styleMap = {
        'modern': '现代简约',
        'european': '欧式风格',
        'chinese': '中式风格',
        'minimalist': '极简风格',
        'industrial': '工业风格'
    };
    return styleMap[style] || style;
}

$(document).ready(function() {
    loadPortfolioItems();
    
    // 添加图片预览功能
    document.getElementById('portfolioImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagePreview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 编辑模态框的图片预览功能
    document.getElementById('editPortfolioImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('editImagePreview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
});