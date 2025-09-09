// ===== العناصر الأساسية في DOM =====
const productTitle = document.getElementById('title');
const productPrice = document.getElementById('price');
const productTaxes = document.getElementById('taxes');
const productAds = document.getElementById('ads');
const productDiscount = document.getElementById('discount');
const productCount = document.getElementById('count');
const productCategory = document.getElementById('category');
const searchInput = document.getElementById('search');
const totalValue = document.getElementById('total-value');
const createBtn = document.getElementById('create-btn');
const updateBtn = document.getElementById('update-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const productsCount = document.getElementById('products-count');
const productsTableBody = document.getElementById('products-table-body');
const searchTitleBtn = document.getElementById('search-title-btn');
const searchCategoryBtn = document.getElementById('search-category-btn');

// ===== المتغيرات العامة =====
let products = []; // مصفوفة لتخزين المنتجات
let currentMode = 'create'; // وضع الحالي (إنشاء أو تحديث)
let currentProductId = null; // معرف المنتج الحالي للتحديث
let searchMode = 'title'; // وضع البحث الحالي

// ===== التهيئة الأولية =====
// تحميل البيانات من LocalStorage عند بدء التحميل
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromLocalStorage();
    updateProductsCount();
    displayProducts();
});

// ===== دوال المعالجة =====

// حساب المجموع الكلي
function calculateTotal() {
    const price = parseFloat(productPrice.value) || 0;
    const taxes = parseFloat(productTaxes.value) || 0;
    const ads = parseFloat(productAds.value) || 0;
    const discount = parseFloat(productDiscount.value) || 0;
    
    const total = (price + taxes + ads) - discount;
    totalValue.textContent = total.toFixed(2);
    
    if (price > 0) {
        totalValue.parentElement.style.background = "#4CAF50";
    } else {
        totalValue.parentElement.style.background = "#f44336";
    }
}

// مسح حقول الإدخال
function clearInputs() {
    productTitle.value = '';
    productPrice.value = '';
    productTaxes.value = '';
    productAds.value = '';
    productDiscount.value = '';
    productCount.value = '';
    productCategory.value = '';
    totalValue.textContent = '0';
    totalValue.parentElement.style.background = "#f44336";
    
    // العودة إلى وضع الإنشاء
    currentMode = 'create';
    createBtn.disabled = false;
    updateBtn.disabled = true;
    currentProductId = null;
}

// إنشاء منتج جديد
function createProduct() {
    if (validateInputs()) {
        const product = {
            id: generateId(),
            title: productTitle.value.trim(),
            price: parseFloat(productPrice.value),
            taxes: parseFloat(productTaxes.value) || 0,
            ads: parseFloat(productAds.value) || 0,
            discount: parseFloat(productDiscount.value) || 0,
            total: parseFloat(totalValue.textContent),
            count: parseInt(productCount.value) || 1,
            category: productCategory.value.trim()
        };
        
        products.push(product);
        saveProductsToLocalStorage();
        displayProducts();
        updateProductsCount();
        clearInputs();
        
        showNotification('تم إضافة المنتج بنجاح', 'success');
    }
}

// تحديث منتج موجود
function updateProduct() {
    if (validateInputs() && currentProductId !== null) {
        const index = products.findIndex(product => product.id === currentProductId);
        
        if (index !== -1) {
            products[index] = {
                id: currentProductId,
                title: productTitle.value.trim(),
                price: parseFloat(productPrice.value),
                taxes: parseFloat(productTaxes.value) || 0,
                ads: parseFloat(productAds.value) || 0,
                discount: parseFloat(productDiscount.value) || 0,
                total: parseFloat(totalValue.textContent),
                count: parseInt(productCount.value) || 1,
                category: productCategory.value.trim()
            };
            
            saveProductsToLocalStorage();
            displayProducts();
            clearInputs();
            
            showNotification('تم تحديث المنتج بنجاح', 'success');
        }
    }
}

// حذف منتج
function deleteProduct(id) {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذا المنتج؟')) {
        products = products.filter(product => product.id !== id);
        saveProductsToLocalStorage();
        displayProducts();
        updateProductsCount();
        
        showNotification('تم حذف المنتج بنجاح', 'success');
    }
}

// حذف جميع المنتجات
function deleteAllProducts() {
    if (products.length === 0) {
        showNotification('لا توجد منتجات لحذفها', 'info');
        return;
    }
    
    if (confirm('هل أنت متأكد من أنك تريد حذف جميع المنتجات؟ لا يمكن التراجع عن هذا الإجراء.')) {
        products = [];
        saveProductsToLocalStorage();
        displayProducts();
        updateProductsCount();
        
        showNotification('تم حذف جميع المنتجات بنجاح', 'success');
    }
}

// البحث عن المنتجات
function searchProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayProducts();
        return;
    }
    
    let filteredProducts = [];
    
    if (searchMode === 'title') {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredProducts = products.filter(product => 
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filteredProducts);
}

// عرض المنتجات في الجدول
function displayProducts(productsToDisplay = products) {
    productsTableBody.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 20px;">
                    لا توجد منتجات لعرضها
                </td>
            </tr>
        `;
        return;
    }
    
    productsToDisplay.forEach((product, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.title}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.taxes.toFixed(2)}</td>
            <td>${product.ads.toFixed(2)}</td>
            <td>${product.discount.toFixed(2)}</td>
            <td>${product.total.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.count}</td>
            <td>
                <button class="update" onclick="prepareUpdate(${product.id})">
                    <i class="fas fa-edit"></i> تحديث
                </button>
            </td>
            <td>
                <button class="delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        
        productsTableBody.appendChild(row);
    });
}

// تحضير المنتج للتحديث
function prepareUpdate(id) {
    const product = products.find(p => p.id === id);
    
    if (product) {
        productTitle.value = product.title;
        productPrice.value = product.price;
        productTaxes.value = product.taxes;
        productAds.value = product.ads;
        productDiscount.value = product.discount;
        productCount.value = product.count;
        productCategory.value = product.category;
        
        calculateTotal();
        
        // الانتقال إلى وضع التحديث
        currentMode = 'update';
        currentProductId = id;
        createBtn.disabled = true;
        updateBtn.disabled = false;
        
        // التمرير إلى أعلى النموذج
        document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== دوال المساعدة =====

// التحقق من صحة المدخلات
function validateInputs() {
    if (productTitle.value.trim() === '') {
        showNotification('يرجى إدخال اسم المنتج', 'error');
        productTitle.focus();
        return false;
    }
    
    if (productPrice.value === '' || parseFloat(productPrice.value) <= 0) {
        showNotification('يرجى إدخال سعر صحيح للمنتج', 'error');
        productPrice.focus();
        return false;
    }
    
    if (productCategory.value.trim() === '') {
        showNotification('يرجى إدخال فئة المنتج', 'error');
        productCategory.focus();
        return false;
    }
    
    return true;
}

// إنشاء معرف فريد للمنتج
function generateId() {
    return Date.now();
}

// حفظ المنتجات في LocalStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// تحميل المنتجات من LocalStorage
function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}

// تحديث عدد المنتجات
function updateProductsCount() {
    productsCount.textContent = products.length;
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار إذا لم يكن موجودًا
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // إضافة أنماط للإشعار
        const style = document.createElement('style');
        style.textContent = `
            #notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s, transform 0.3s;
            }
            
            #notification.success {
                background: #4CAF50;
            }
            
            #notification.error {
                background: #f44336;
            }
            
            #notification.info {
                background: #2196F3;
            }
            
            #notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // تعيين المحتوى والنوع
    notification.textContent = message;
    notification.className = type;
    notification.classList.add('show');
    
    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== إضافة معالجات الأحداث =====

// معالجة النقر على زر الإنشاء
createBtn.addEventListener('click', createProduct);

// معالجة النقر على زر التحديث
updateBtn.addEventListener('click', updateProduct);

// معالجة النقر على زر حذف الكل
deleteAllBtn.addEventListener('click', deleteAllProducts);

// معالجة البحث أثناء الكتابة
searchInput.addEventListener('input', searchProducts);

// تغيير وضع البحث
searchTitleBtn.addEventListener('click', () => {
    searchMode = 'title';
    searchTitleBtn.classList.add('active');
    searchCategoryBtn.classList.remove('active');
    searchProducts();
});

searchCategoryBtn.addEventListener('click', () => {
    searchMode = 'category';
    searchCategoryBtn.classList.add('active');
    searchTitleBtn.classList.remove('active');
    searchProducts();
});

// السماح باستخدام زر Enter للإضافة
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (currentMode === 'create') {
            createProduct();
        } else {
            updateProduct();
        }
    }
});