import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    discount: '',
    hasDiscount: false
  });
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // New states for editing
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.getOrders(),
          API.getProducts()
        ]);
        setOrders(ordersRes);
        setProducts(productsRes);
      } catch (err) {
        console.error('Dashboard data error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        discount: newProduct.hasDiscount ? parseFloat(newProduct.discount) : 0
      };
      
      await API.createProduct(productData);
      
      // Refresh products list
      const res = await API.getProducts();
      setProducts(res);
      
      // Reset form
      setNewProduct({ name: '', description: '', price: '', image: '', stock: '', discount: '', hasDiscount: false });
      setShowAddForm(false);
      
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await API.deleteProduct(productId);
        
        // Refresh products list
        const res = await API.getProducts();
        setProducts(res);
        
      } catch (err) {
        setError('فشل في حذف المنتج');
      }
    }
  };

  // Function to handle product update
  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!user || !user.isAdmin) {
      setError('Access denied. Admin privileges required.');
      return;
    }
    const productId = editingProduct.id;
    if (!productId || productId === 'undefined' || productId === 'null') {
      setError('Invalid product ID');
      return;
    }
    
    // Additional validation for MongoDB ObjectId format
    if (typeof productId === 'string' && !/^[0-9a-fA-F]{24}$/.test(productId)) {
      console.warn('Product ID might not be in valid MongoDB ObjectId format:', productId);
    }
    
    try {
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        image: editingProduct.image,
        stock: parseInt(editingProduct.stock),
        discount: editingProduct.hasDiscount ? parseFloat(editingProduct.discount) : 0
      };
      console.log('Updating product:', productId);
      console.log('Product data:', productData);
      console.log('User token:', localStorage.getItem('token'));
      const response = await API.updateProduct(productId, productData);
      console.log('Update response:', response);
      const res = await API.getProducts();
      setProducts(res);
      setEditingProduct(null);
      setShowEditForm(false);
    } catch (err) {
      console.error('Error updating product:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (err.response?.status === 404) {
        setError('Product not found. The product may have been deleted or the ID is invalid.');
      } else {
        setError(`Failed to update product: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // Function to start editing a product
  const handleStartEdit = (product) => {
    console.log('Starting edit for product:', product);
    console.log('Product ID:', product._id || product.id);
    console.log('Product ID type:', typeof (product._id || product.id));
    console.log('Full product object:', JSON.stringify(product, null, 2));
    
    const productId = product.id;
    if (!productId || productId === 'undefined' || productId === 'null') {
      console.error('Invalid product ID detected:', productId);
      setError('Invalid product ID detected. Please refresh the page and try again.');
      return;
    }
    
    setEditingProduct({
      id: productId,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image || '',
      stock: product.stock.toString(),
      discount: product.discount ? product.discount.toString() : '',
      hasDiscount: product.discount > 0
    });
    setShowEditForm(true);
    setShowAddForm(false); // Hide add form when editing
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', orderId, newStatus);
      const response = await API.updateOrder(orderId, { status: newStatus });
      console.log('Update response:', response);
      
      // Refresh orders list
      const res = await API.getOrders();
      setOrders(res);
      
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(`Failed to update order status: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب المكتمل؟')) {
      try {
        console.log('Deleting order with ID:', orderId);
        console.log('ID type:', typeof orderId);
        console.log('ID value:', orderId);
        
        if (!orderId || orderId === 'undefined' || orderId === 'null') {
          setError('Invalid order ID');
          return;
        }
        
        const response = await API.deleteOrder(orderId);
        console.log('Delete response:', response);
        
        // Refresh orders list
        const res = await API.getOrders();
        setOrders(res);
        
      } catch (err) {
        console.error('Error deleting order:', err);
        setError(`Failed to delete order: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // Don't render anything if not admin (will redirect)
  if (!user || !user.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-card">
          <h3>⚠️ خطأ</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🛍️ لوحة تحكم المدير</h1>
          <p>مرحباً، {user.name}! إدارة المتجر والطلبات</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            🏠 العودة للصفحة الرئيسية
          </button>
        </div>
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{products.length}</h3>
              <p>المنتجات</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{orders.length}</h3>
              <p>الطلبات</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{totalRevenue.toFixed(2)}</h3>
              <p>إجمالي المبيعات</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{pendingOrders}</h3>
                              <p>طلبات بانتظار الدفع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 نظرة عامة
        </button>
        <button 
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 المنتجات
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 الطلبات
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📦 إدارة المنتجات</h3>
                <p>إضافة وتعديل وحذف المنتجات</p>
                <button onClick={() => setActiveTab('products')} className="action-button">
                  إدارة المنتجات
                </button>
              </div>
              <div className="overview-card">
                <h3>📋 إدارة الطلبات</h3>
                <p>متابعة وتحديث حالة الطلبات</p>
                <button onClick={() => setActiveTab('orders')} className="action-button">
                  إدارة الطلبات
                </button>
              </div>
              <div className="overview-card">
                <h3>💰 الإحصائيات</h3>
                <div className="stats-mini">
                  <div className="stat-mini">
                    <span className="stat-number">{completedOrders}</span>
                    <span className="stat-label">طلبات مكتملة</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-number">{pendingOrders}</span>
                    <span className="stat-label">طلبات بانتظار الدفع</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>📦 إدارة المنتجات</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="add-button"
              >
                {showAddForm ? '❌ إلغاء' : '➕ إضافة منتج جديد'}
              </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <div className="form-card">
                <h3>إضافة منتج جديد</h3>
                <form onSubmit={handleAddProduct} className="product-form">
                  <div className="form-group">
                    <label>اسم المنتج</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم المنتج"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>وصف المنتج</label>
                    <textarea
                      placeholder="أدخل وصف المنتج"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>السعر</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>الكمية المتوفرة</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Discount Section */}
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <input
                        type="checkbox"
                        id="hasDiscount"
                        checked={newProduct.hasDiscount}
                        onChange={(e) => setNewProduct({...newProduct, hasDiscount: e.target.checked})}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="hasDiscount" style={{ margin: '0', cursor: 'pointer', fontWeight: 'bold', color: '#667eea' }}>
                        🎯 إضافة خصم للمنتج
                      </label>
                    </div>
                    {newProduct.hasDiscount && (
                      <div className="form-group">
                        <label>نسبة الخصم (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="10"
                          value={newProduct.discount}
                          onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                          style={{ 
                            border: '2px solid #667eea',
                            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
                          }}
                        />
                        <small style={{ color: '#667eea', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                          💡 مثال: 10% خصم = سعر أقل بـ 10% من السعر الأصلي
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>رابط الصورة (اختياري)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    />
                    <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                      💡 توصية: استخدم صور بحجم 400×400 بكسل أو 600×600 بكسل للحصول على أفضل جودة
                    </small>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button">➕ إضافة المنتج</button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="cancel-button"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Product Form */}
            {showEditForm && editingProduct && (
              <div className="form-card">
                <h3>تعديل المنتج</h3>
                <form onSubmit={handleEditProduct} className="product-form">
                  <div className="form-group">
                    <label>اسم المنتج</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم المنتج"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>وصف المنتج</label>
                    <textarea
                      placeholder="أدخل وصف المنتج"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>السعر</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>الكمية المتوفرة</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Discount Section */}
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <input
                        type="checkbox"
                        id="editHasDiscount"
                        checked={editingProduct.hasDiscount || editingProduct.discount > 0}
                        onChange={(e) => setEditingProduct({...editingProduct, hasDiscount: e.target.checked})}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="editHasDiscount" style={{ margin: '0', cursor: 'pointer', fontWeight: 'bold', color: '#667eea' }}>
                        🎯 إضافة خصم للمنتج
                      </label>
                    </div>
                    {(editingProduct.hasDiscount || editingProduct.discount > 0) && (
                      <div className="form-group">
                        <label>نسبة الخصم (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="10"
                          value={editingProduct.discount || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, discount: e.target.value})}
                          style={{ 
                            border: '2px solid #667eea',
                            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'
                          }}
                        />
                        <small style={{ color: '#667eea', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                          💡 مثال: 10% خصم = سعر أقل بـ 10% من السعر الأصلي
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>رابط الصورة (اختياري)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                    />
                    <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                      💡 توصية: استخدم صور بحجم 400×400 بكسل أو 600×600 بكسل للحصول على أفضل جودة
                    </small>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button">💾 حفظ التغييرات</button>
                    <button 
                      type="button" 
                      onClick={() => { setShowEditForm(false); setEditingProduct(null); }}
                      className="cancel-button"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="products-grid">
              {products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>لا توجد منتجات</h3>
                  <p>ابدأ بإضافة منتجات جديدة للمتجر</p>
                </div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="no-image" style={{ display: product.image ? 'none' : 'flex' }}>
                        📦
                      </div>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-meta">
                        <div className="product-price">
                          <span>{product.price}</span>
                          <img src="/price-icon.png" alt="price" />
                        </div>
                        <div className="product-stock">
                          <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? `${product.stock} في المخزون` : 'إنتهى المخزون'}
                          </span>
                        </div>
                        {product.discount > 0 && (
                          <div style={{
                            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem'
                          }}>
                            🎯 خصم {product.discount}%
                          </div>
                        )}
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={() => handleStartEdit(product)}
                          className="edit-button"
                        >
                          ✏️ تعديل
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="delete-button"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header">
              <h2>📋 إدارة الطلبات</h2>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>لا توجد طلبات</h3>
                <p>ستظهر الطلبات هنا عندما يبدأ العملاء بالشراء</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3>طلب #{order.id}</h3>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status === 'pending' && '⏳ بانتظار الدفع'}
                        {order.status === 'verifying' && '🔍 جاري التحقق من البيانات'}
                        {order.status === 'processing' && '⚙️ قيد المعالجة'}
                        {order.status === 'completed' && '✅ مكتمل'}
                      </span>
                    </div>
                    
                    <div className="order-details">
                      <div className="order-info">
                        <p><strong>العميل:</strong> {order.user?.name || order.user?.email || 'غير معروف'}</p>
                        <p><strong>التاريخ:</strong> {new Date(order.createdAt || order.date).toLocaleDateString('ar-SA')}</p>
                        <p><strong>المصرف:</strong> {
                          order.bankDetails?.selectedBank === 'gulf' ? 'بنك الخليج (الخيار الأول)' :
                          order.bankDetails?.selectedBank === 'rajh' ? 'بنك الراجحي (الخيار الثاني)' :
                          order.bankDetails?.bankName || 'غير محدد'
                        }</p>
                        <p><strong>الحساب:</strong> {order.bankDetails?.accountName || 'غير محدد'}</p>
                      </div>
                      
                      <div className="order-total">
                        <span className="total-label">المجموع:</span>
                        <span className="total-amount">
                          {order.total}
                          <img src="/price-icon.png" alt="price" />
                        </span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <div className="status-update">
                        <select 
                          value={selectedStatuses[order.id] || order.status} 
                          onChange={(e) => {
                            setSelectedStatuses(prev => ({
                              ...prev,
                              [order.id]: e.target.value
                            }));
                          }}
                          className="status-select"
                        >
                          <option value="pending">⏳ بانتظار الدفع</option>
                          <option value="verifying">🔍 جاري التحقق من البيانات</option>
                          <option value="processing">⚙️ قيد المعالجة</option>
                          <option value="completed">✅ مكتمل</option>
                        </select>
                        <button 
                          onClick={() => {
                            const newStatus = selectedStatuses[order.id] || order.status;
                            handleUpdateOrderStatus(order.id, newStatus);
                          }}
                          className="update-button"
                        >
                          تحديث الحالة
                        </button>
                      </div>
                      
                      {order.status === 'completed' && (
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="delete-order-button"
                        >
                          🗑️ حذف الطلب
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;