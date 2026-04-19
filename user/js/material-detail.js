async function loadMaterialDetail() {
    // 从URL中获取材料ID
    const urlParams = new URLSearchParams(window.location.search);
    const materialId = urlParams.get('id');
    
    if (materialId) {
        try {
            const response = await fetch(`http://localhost:3002/api/materials/${materialId}`);
            if (response.ok) {
                const material = await response.json();
                
                // 确保图片路径正确
                const imagePath = material.image.startsWith('data:') || material.image.startsWith('http') ? material.image : `../../${material.image}`;
                document.getElementById('materialImage').src = imagePath;
                document.getElementById('materialName').textContent = material.name;
                document.getElementById('materialPrice').textContent = `¥${material.price}/${material.unit}`;
                document.getElementById('materialCategory').textContent = material.categoryName;
                document.getElementById('materialBrand').textContent = material.brandName;
                document.getElementById('materialSpec').textContent = material.spec;
                document.getElementById('materialStock').textContent = material.stock;
                document.getElementById('materialUnit').textContent = material.unit;
            } else {
                alert('未找到材料信息');
                window.location.href = 'material-hub.html';
            }
        } catch (error) {
            console.error('加载材料详情失败:', error);
            alert('加载材料详情失败，请检查网络连接');
        }
    } else {
        alert('未找到材料信息');
        window.location.href = 'material-hub.html';
    }
}

async function addToCart() {
    // 从URL中获取材料ID
    const urlParams = new URLSearchParams(window.location.search);
    const materialId = urlParams.get('id');
    
    if (materialId) {
        try {
            const response = await fetch(`http://localhost:3002/api/materials/${materialId}`);
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
}

function goBack() {
    window.location.href = 'material-hub.html';
}

$(document).ready(function() {
    loadMaterialDetail();
});