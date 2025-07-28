import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('الرجاء تسجيل الدخول');
          return;
        }
        
        const res = await API.getMyOrders(user.id || user._id);
        setOrders(res);
      } catch (err) {
        console.error('Orders loading error:', err);
        setError('فشل في تحميل الطلبات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'verifying':
        return '🔍';
      case 'processing':
        return '⚙️';
      case 'completed':
        return '✅';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f6ad55';
      case 'verifying':
        return '#9f7aea';
      case 'processing':
        return '#4299e1';
      case 'completed':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'بانتظار الدفع';
      case 'verifying':
        return 'جاري التحقق من البيانات';
      case 'processing':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#667eea' }}>جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>❌ خطأ في التحميل</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ 
              margin: '0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              📋 طلباتي
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#718096', fontSize: '1.1rem' }}>
              تتبع جميع طلباتك ومراحل معالجتها
            </p>
          </div>
          <Link to="/" style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'transform 0.3s ease'
          }}>
            🏠 العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* Orders Section */}
      <div className="card">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>لا توجد طلبات</h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '2rem' }}>
              لم تقم بإنشاء أي طلبات بعد. ابدأ بالتسوق الآن!
            </p>
            <Link to="/" style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'transform 0.3s ease'
            }}>
              🛍️ ابدأ بالتسوق
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order._id || order.id} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              >
                {/* Order Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: '0', 
                      color: '#2d3748',
                      fontSize: '1.3rem',
                      fontWeight: 'bold'
                    }}>
                      طلب #{order._id ? order._id.toString().slice(-6) : order.id}
                    </h3>
                    <p style={{ 
                      margin: '0.5rem 0 0 0', 
                      color: '#718096',
                      fontSize: '0.9rem'
                    }}>
                      {new Date(order.createdAt || order.date).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: `${getStatusColor(order.status)}20`,
                    border: `2px solid ${getStatusColor(order.status)}`
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{getStatusIcon(order.status)}</span>
                    <span style={{ 
                      color: getStatusColor(order.status),
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                    borderRadius: '15px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>💰</span>
                      <span style={{ fontWeight: 'bold', color: '#2d3748' }}>المجموع</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: '#667eea'
                    }}>
                      <span>{order.total}</span>
                      <img src="/price-icon.png" alt="price" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
                    </div>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                    borderRadius: '15px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>🏦</span>
                      <span style={{ fontWeight: 'bold', color: '#2d3748' }}>البنك</span>
                    </div>
                    <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                      {order.bankDetails?.bankName || 'غير محدد'}
                    </div>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                    borderRadius: '15px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>👤</span>
                      <span style={{ fontWeight: 'bold', color: '#2d3748' }}>صاحب الحساب</span>
                    </div>
                    <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                      {order.bankDetails?.accountName || 'غير محدد'}
                    </div>
                  </div>
                </div>

                {/* Products List */}
                {order.products && order.products.length > 0 && (
                  <div style={{
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '15px',
                    padding: '1rem',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 1rem 0', 
                      color: '#2d3748',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      📦 المنتجات المطلوبة
                    </h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {order.products.map((product, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          background: 'white',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{ color: '#4a5568' }}>
                            {product.name} × {product.quantity}
                          </span>
                          <span style={{ 
                            color: '#667eea', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {(product.price * product.quantity).toFixed(2)}
                            <img src="/price-icon.png" alt="price" style={{ width: '16px', height: '16px' }} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders; 