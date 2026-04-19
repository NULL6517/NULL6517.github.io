// 从localStorage获取采购单数据
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// 保存采购单数据到localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 加载采购单
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart text-muted" style="font-size: 3rem;"></i>
                <p class="mt-3 text-muted">采购单为空</p>
                <a href="material-hub.html" class="btn btn-primary mt-2">去添加材料</a>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                    </div>
                    <div class="col-md-4 item-info">
                        <h5>${item.name}</h5>
                        <p class="text-muted">${item.categoryName} | ${item.brandName}</p>
                        <p class="text-muted">${item.spec}</p>
                    </div>
                    <div class="col-md-2">
                        <p class="font-weight-bold">¥${item.price}/${item.unit}</p>
                    </div>
                    <div class="col-md-2">
                        <div class="item-quantity">
                            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <p class="font-weight-bold">¥${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="btn btn-danger btn-sm mt-2" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    updateCartSummary();
}

// 更新采购单汇总
function updateCartSummary() {
    const cart = getCart();
    let totalQuantity = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = `¥${totalPrice.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `¥${totalPrice.toFixed(2)}`;
}

// 增加数量
function increaseQuantity(index) {
    const cart = getCart();
    cart[index].quantity++;
    saveCart(cart);
    loadCart();
}

// 减少数量
function decreaseQuantity(index) {
    const cart = getCart();
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart(cart);
        loadCart();
    }
}

// 更新数量
function updateQuantity(index, value) {
    const cart = getCart();
    const quantity = parseInt(value) || 1;
    cart[index].quantity = Math.max(1, quantity);
    saveCart(cart);
    loadCart();
}

// 删除商品
function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
}

// 清空采购单
function clearCart() {
    if (confirm('确定要清空采购单吗？')) {
        localStorage.removeItem('cart');
        loadCart();
    }
}

// 导出为Excel
function exportToExcel() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('采购单为空，无法导出');
        return;
    }
    
    // 创建CSV内容
    let csvContent = "材料名称,类别,品牌,规格,单价,数量,总价\n";
    
    cart.forEach(item => {
        const row = [
            item.name,
            item.categoryName,
            item.brandName,
            item.spec,
            item.price,
            item.quantity,
            item.price * item.quantity
        ];
        csvContent += row.join(',') + "\n";
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `采购单_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 邮件发送
function sendEmail() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('采购单为空，无法发送邮件');
        return;
    }
    
    // 构建邮件内容
    let emailBody = "采购单\n\n";
    emailBody += "材料清单：\n";
    
    let totalPrice = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        emailBody += `• ${item.name} - ${item.spec} - ¥${item.price}/${item.unit} × ${item.quantity} = ¥${itemTotal.toFixed(2)}\n`;
    });
    
    emailBody += `\n总计：¥${totalPrice.toFixed(2)}`;
    
    // 打开邮件客户端
    const subject = `采购单 - ${new Date().toISOString().slice(0, 10)}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
}

// 页面加载时执行
window.onload = function() {
    loadCart();
};