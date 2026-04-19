function saveMaterial() {
    const materialImage = document.getElementById('materialImage');
    const imagePreview = document.getElementById('imagePreview');
    
    let imageUrl = 'https://via.placeholder.com/500';
    if (imagePreview.src && imagePreview.src !== '') {
        imageUrl = imagePreview.src;
    }
    
    const newMaterial = {
        id: Date.now(),
        name: document.getElementById('materialName').value,
        category: document.getElementById('materialCategory').value,
        categoryName: getCategoryName(document.getElementById('materialCategory').value),
        brand: document.getElementById('materialBrand').value,
        brandName: document.getElementById('materialBrand').value,
        style: document.getElementById('materialStyle').value,
        price: parseFloat(document.getElementById('materialPrice').value),
        stock: parseInt(document.getElementById('materialStock').value),
        unit: document.getElementById('materialUnit').value,
        spec: document.getElementById('materialSpec').value,
        image: imageUrl,
        description: document.getElementById('materialDescription').value,
        tags: document.getElementById('materialTags').value,
        isFeatured: document.getElementById('isFeatured').checked,
        isNew: document.getElementById('isNew').checked
    };
    
    if (validateForm(newMaterial)) {
        fetch('http://localhost:3002/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newMaterial.name,
                category: newMaterial.category,
                categoryName: newMaterial.categoryName,
                brand: newMaterial.brand,
                brandName: newMaterial.brandName,
                style: newMaterial.style,
                price: newMaterial.price,
                stock: newMaterial.stock,
                unit: newMaterial.unit,
                spec: newMaterial.spec,
                image: newMaterial.image,
                description: newMaterial.description
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('材料添加成功！');
            resetForm();
        })
        .catch(error => {
            console.error('Error adding material:', error);
            alert('材料添加失败，请重试');
        });
    }
}

function validateForm(material) {
    if (!material.name) {
        alert('请输入材料名称');
        return false;
    }
    if (!material.category) {
        alert('请选择材料类别');
        return false;
    }
    if (!material.brand) {
        alert('请输入品牌名称');
        return false;
    }
    if (!material.style) {
        alert('请选择风格');
        return false;
    }
    if (!material.price || material.price <= 0) {
        alert('请输入有效的价格');
        return false;
    }
    if (!material.stock || material.stock < 0) {
        alert('请输入有效的库存数量');
        return false;
    }
    if (!material.unit) {
        alert('请选择单位');
        return false;
    }
    return true;
}

function resetForm() {
    document.getElementById('addMaterialForm').reset();
    document.getElementById('isNew').checked = true;
    document.getElementById('isFeatured').checked = false;
    // 重置图片预览
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = '';
    imagePreview.style.display = 'none';
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
    $('#materialPrice').on('input', function() {
        let value = $(this).val();
        if (value < 0) {
            $(this).val(0);
        }
    });
    
    $('#materialStock').on('input', function() {
        let value = $(this).val();
        if (value < 0) {
            $(this).val(0);
        }
    });
    
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
});