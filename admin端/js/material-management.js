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
    renderMaterials();
}

// 保存材料数据到API
async function saveMaterials() {
    // 数据已通过API实时保存，无需额外操作
}

let currentPage = 1;
const itemsPerPage = 10;
let deleteId = null;

function renderMaterials() {
    const tbody = document.getElementById('materialTableBody');
    tbody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageMaterials = materials.slice(startIndex, endIndex);
    
    pageMaterials.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.id}</td>
            <td>${material.name}</td>
            <td>${material.categoryName}</td>
            <td>${material.brandName}</td>
            <td>¥${material.price}/${material.unit}</td>
            <td>${material.stock}</td>
            <td>${material.unit}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-info" onclick="viewMaterial(${material.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editMaterial(${material.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMaterial(${material.id})">
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
    
    const totalPages = Math.ceil(materials.length / itemsPerPage);
    
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
    renderMaterials();
}

function filterMaterials() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filtered = materials.filter(material => {
        const matchSearch = material.name.toLowerCase().includes(searchInput) || 
                           material.brandName.toLowerCase().includes(searchInput);
        const matchCategory = !categoryFilter || material.category === categoryFilter;
        return matchSearch && matchCategory;
    });
    
    materials = filtered;
    currentPage = 1;
    renderMaterials();
}

function openAddModal() {
    $('#addMaterialModal').modal('show');
    resetAddForm();
}

function resetAddForm() {
    document.getElementById('addMaterialForm').reset();
}

async function saveMaterial() {
    const materialImage = document.getElementById('materialImage');
    const imagePreview = document.getElementById('imagePreview');
    
    let imageUrl = 'https://via.placeholder.com/500';
    if (imagePreview.src && imagePreview.src !== '') {
        imageUrl = imagePreview.src;
    }
    
    const newMaterial = {
        name: document.getElementById('materialName').value,
        category: document.getElementById('materialCategory').value,
        categoryName: getCategoryName(document.getElementById('materialCategory').value),
        brand: document.getElementById('materialBrand').value,
        brandName: document.getElementById('materialBrand').value,
        price: parseFloat(document.getElementById('materialPrice').value),
        stock: parseInt(document.getElementById('materialStock').value),
        unit: document.getElementById('materialUnit').value,
        spec: document.getElementById('materialSpec').value,
        image: imageUrl,
        description: document.getElementById('materialDescription').value,
        style: 'modern' // 默认风格
    };
    
    if (newMaterial.name && newMaterial.category && newMaterial.brand && newMaterial.price && newMaterial.stock && newMaterial.unit) {
        try {
            const response = await fetch('http://localhost:3002/api/materials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMaterial)
            });
            
            if (response.ok) {
                await loadMaterials();
                $('#addMaterialModal').modal('hide');
                alert('材料添加成功！');
            } else {
                alert('材料添加失败，请重试');
            }
        } catch (error) {
            console.error('添加材料失败:', error);
            alert('材料添加失败，请检查网络连接');
        }
    } else {
        alert('请填写所有必填字段');
    }
}

function editMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (material) {
        document.getElementById('editMaterialId').value = material.id;
        document.getElementById('editMaterialName').value = material.name;
        document.getElementById('editMaterialCategory').value = material.category;
        document.getElementById('editMaterialBrand').value = material.brandName;
        document.getElementById('editMaterialStyle').value = material.style;
        document.getElementById('editMaterialPrice').value = material.price;
        document.getElementById('editMaterialStock').value = material.stock;
        document.getElementById('editMaterialUnit').value = material.unit;
        document.getElementById('editMaterialSpec').value = material.spec;
        // 重置文件输入框
        document.getElementById('editMaterialImage').value = '';
        // 显示图片预览
        const editImagePreview = document.getElementById('editImagePreview');
        editImagePreview.src = material.image;
        editImagePreview.style.display = 'block';
        document.getElementById('editMaterialDescription').value = material.description;
        
        $('#editMaterialModal').modal('show');
    }
}

async function updateMaterial() {
    const id = parseInt(document.getElementById('editMaterialId').value);
    
    const editMaterialImage = document.getElementById('editMaterialImage');
    const editImagePreview = document.getElementById('editImagePreview');
    
    let imageUrl = materials.find(m => m.id === id).image;
    if (editImagePreview.src && editImagePreview.src !== '') {
        imageUrl = editImagePreview.src;
    }
    
    const updatedMaterial = {
        name: document.getElementById('editMaterialName').value,
        category: document.getElementById('editMaterialCategory').value,
        categoryName: getCategoryName(document.getElementById('editMaterialCategory').value),
        brand: document.getElementById('editMaterialBrand').value,
        brandName: document.getElementById('editMaterialBrand').value,
        style: document.getElementById('editMaterialStyle').value,
        price: parseFloat(document.getElementById('editMaterialPrice').value),
        stock: parseInt(document.getElementById('editMaterialStock').value),
        unit: document.getElementById('editMaterialUnit').value,
        spec: document.getElementById('editMaterialSpec').value,
        image: imageUrl,
        description: document.getElementById('editMaterialDescription').value
    };
    
    try {
        const response = await fetch(`http://localhost:3002/api/materials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedMaterial)
        });
        
        if (response.ok) {
            await loadMaterials();
            $('#editMaterialModal').modal('hide');
            alert('材料更新成功！');
        } else {
            alert('材料更新失败，请重试');
        }
    } catch (error) {
        console.error('更新材料失败:', error);
        alert('材料更新失败，请检查网络连接');
    }
}

function viewMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (material) {
        alert(`材料详情：\n名称：${material.name}\n类别：${material.categoryName}\n品牌：${material.brandName}\n价格：¥${material.price}/${material.unit}\n库存：${material.stock}\n规格：${material.spec}`);
    }
}

function deleteMaterial(id) {
    deleteId = id;
    $('#deleteModal').modal('show');
}

async function confirmDelete() {
    if (deleteId !== null) {
        try {
            const response = await fetch(`http://localhost:3002/api/materials/${deleteId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadMaterials();
                $('#deleteModal').modal('hide');
                alert('材料删除成功！');
                deleteId = null;
            } else {
                alert('材料删除失败，请重试');
            }
        } catch (error) {
            console.error('删除材料失败:', error);
            alert('材料删除失败，请检查网络连接');
        }
    }
}

function exportData() {
    const dataStr = JSON.stringify(materials, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'materials.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        materials = importedData;
                        saveMaterials();
                        renderMaterials();
                        alert('数据导入成功！');
                    } else {
                        alert('导入的数据格式不正确！');
                    }
                } catch (error) {
                    alert('导入失败：' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function getCategoryName(category) {
    const categoryMap = {
        'floor': '地板',
        'tile': '瓷砖',
        'paint': '涂料',
        'door': '门窗',
        'hardware': '五金',
        'bathroom': '卫浴'
    };
    return categoryMap[category] || category;
}

$(document).ready(function() {
    loadMaterials();
    
    // 添加图片预览功能
    document.getElementById('materialImage').addEventListener('change', function(e) {
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
    document.getElementById('editMaterialImage').addEventListener('change', function(e) {
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
    
    // 绑定导入按钮事件
    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-primary';
    importBtn.innerHTML = '<i class="fas fa-upload"></i> 导入数据';
    importBtn.onclick = importData;
    
    const exportBtn = document.querySelector('button[onclick="exportData()"]');
    if (exportBtn) {
        exportBtn.parentNode.insertBefore(importBtn, exportBtn.nextSibling);
        importBtn.style.marginLeft = '10px';
    }
});