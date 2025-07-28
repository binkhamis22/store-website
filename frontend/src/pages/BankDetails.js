import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function BankDetails() {
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    bankName: '',
    selectedBank: '', // Added for bank selection
    orderNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setOrdersLoading(true);
        console.log('Fetching user orders...');
        const response = await API.getMyOrders(user.id || user._id);
        console.log('Orders response:', response);
        console.log('First order structure:', response[0]);
        
        // Debug: Log all orders and their statuses
        response.forEach((order, index) => {
          console.log(`Order ${index}:`, {
            id: order._id || order.id,
            status: order.status,
            hasBankDetails: !!order.bankDetails,
            total: order.total
          });
        });
        
        setUserOrders(response);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setError('فشل في تحميل الطلبات. الرجاء المحاولة مرة أخرى.');
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user && (user.id || user._id)) {
      fetchUserOrders();
    } else {
      setOrdersLoading(false);
    }
  }, [user]); // Add user dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        alert('الرجاء تسجيل الدخول لإتمام الطلب');
        navigate('/login');
        return;
      }

      if (!bankDetails.selectedBank) {
        setError('الرجاء اختيار البنك');
        return;
      }

      if (!bankDetails.orderNumber) {
        setError('الرجاء اختيار رقم الطلب');
        return;
      }

      if (!bankDetails.accountName) {
        setError('الرجاء إدخال اسم صاحب الحساب');
        return;
      }

      // Update the order with bank details and change status
      const updateData = {
        bankDetails: {
          accountName: bankDetails.accountName,
          bankName: bankDetails.bankName,
          selectedBank: bankDetails.selectedBank
        },
        status: 'verifying' // Change status to "جاري التحقق من البيانات"
      };

      console.log('Updating order with bank details and status:', updateData);
      
      // Update the order
      await API.updateOrder(bankDetails.orderNumber, updateData);
      
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/');
      }, 3000);
      
    } catch (err) {
      console.error('Error updating order:', err);
      setError('فشل حفظ تفاصيل البنك. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Custom Success Alert */}
      {showSuccessAlert && (
        <div className="success-alert">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div className="success-alert-icon">
              ✅
            </div>
            <div>
              <h3 style={{ margin: '0', fontSize: '1.3rem', fontWeight: 'bold' }}>
                تم بنجاح!
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
                تم حفظ تفاصيل البنك وتغيير حالة الطلب
              </p>
            </div>
          </div>
          <div className="success-alert-content">
            <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              🔍 جاري التحقق من البيانات
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
              سيتم التواصل معك قريباً لتأكيد الطلب
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h2>تأكيد الدفع</h2>
        
        {/* First Bank Information */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '2px solid #fed7d7'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #fed7d7',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>اسم صاحب الحساب</span>
              </div>
              <div style={{ 
                color: '#e53e3e', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(229, 62, 62, 0.1)',
                borderRadius: '8px'
              }}>
                شركة المتجر
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #fed7d7',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🏦</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>اسم البنك</span>
              </div>
              <div style={{ 
                color: '#e53e3e', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(229, 62, 62, 0.1)',
                borderRadius: '8px'
              }}>
                بنك الخليج
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #fed7d7',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>رقم الحساب</span>
              </div>
              <div style={{ 
                color: '#e53e3e', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(229, 62, 62, 0.1)',
                borderRadius: '8px',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                9876-5432-1098-7654
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #fed7d7',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>رمز البنك</span>
              </div>
              <div style={{ 
                color: '#e53e3e', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(229, 62, 62, 0.1)',
                borderRadius: '8px'
              }}>
                GULF
              </div>
            </div>
          </div>
        </div>

        {/* Second Bank Information */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%)',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '2px solid #86efac'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>اسم صاحب الحساب</span>
              </div>
              <div style={{ 
                color: '#059669', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(5, 150, 105, 0.1)',
                borderRadius: '8px'
              }}>
                شركة المتجر
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🏦</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>اسم البنك</span>
              </div>
              <div style={{ 
                color: '#059669', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(5, 150, 105, 0.1)',
                borderRadius: '8px'
              }}>
                بنك الراجحي
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>رقم الحساب</span>
              </div>
              <div style={{ 
                color: '#059669', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(5, 150, 105, 0.1)',
                borderRadius: '8px',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                5555-6666-7777-8888
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <span style={{ fontWeight: 'bold', color: '#2d3748' }}>رمز البنك</span>
              </div>
              <div style={{ 
                color: '#059669', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '0.5rem',
                background: 'rgba(5, 150, 105, 0.1)',
                borderRadius: '8px'
              }}>
                RAJH
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 193, 7, 0.1)',
          border: '2px solid #ffc107',
          borderRadius: '10px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            color: '#856404',
            fontWeight: 'bold'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span>تعليمات مهمة</span>
          </div>
          <ul style={{ 
            margin: '0', 
            color: '#856404',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            textAlign: 'center',
            listStyle: 'none',
            paddingLeft: '0'
          }}>
            <li>قم بتحويل المبلغ المطلوب إلى الحساب المذكور أعلاه</li>
            <li>احتفظ بإيصال التحويل كدليل على الدفع</li>
            <li>أكمل البيانات أدناه بعد التحويل</li>
            <li>سيتم التواصل معك لتأكيد الطلب</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'center' }}>
              اختر البنك الذي تريد التحويل إليه
            </label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.8rem',
                border: '2px solid #fed7d7',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap'
              }}>
                <input
                  type="radio"
                  name="bankSelection"
                  value="gulf"
                  checked={bankDetails.selectedBank === 'gulf'}
                  onChange={(e) => setBankDetails({...bankDetails, selectedBank: e.target.value})}
                  required
                />
                <span>بنك الخليج - 9876-5432-1098-7654</span>
              </label>
              
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.8rem',
                border: '2px solid #86efac',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%)',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap'
              }}>
                <input
                  type="radio"
                  name="bankSelection"
                  value="rajh"
                  checked={bankDetails.selectedBank === 'rajh'}
                  onChange={(e) => setBankDetails({...bankDetails, selectedBank: e.target.value})}
                  required
                />
                <span>بنك الراجحي - 5555-6666-7777-8888</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              اسم صاحب الحساب
            </label>
            <input
              type="text"
              placeholder="اسم صاحب الحساب"
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              اسم البنك
            </label>
            <input
              type="text"
              placeholder="اسم البنك"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              رقم الطلب
            </label>
            {!ordersLoading && userOrders.length > 0 && (
              <small style={{ color: '#667eea', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                متاح {userOrders.filter(order => !order.bankDetails && order.status === 'pending').length} من {userOrders.length} طلب يحتاج تفاصيل البنك
              </small>
            )}
            <select
              value={bankDetails.orderNumber}
              onChange={(e) => setBankDetails({...bankDetails, orderNumber: e.target.value})}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="">اختر رقم الطلب</option>
              {ordersLoading ? (
                <option value="" disabled>جاري التحميل...</option>
              ) : userOrders.filter(order => !order.bankDetails && order.status === 'pending').length === 0 ? (
                <option value="" disabled>لا توجد طلبات تحتاج تفاصيل البنك</option>
              ) : (
                userOrders
                  .filter(order => !order.bankDetails && order.status === 'pending') // Only show orders without bank details and with pending status
                  .map((order, index) => {
                    console.log(`Order ${index}:`, order);
                    const orderId = order._id || order.id || order.orderId || `order-${index + 1}`;
                    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-SA') : 'تاريخ غير معروف';
                    return (
                      <option key={orderId} value={orderId}>
                        طلب #{orderId.toString().slice(-6)} - {orderDate} - {order.total} ريال
                      </option>
                    );
                  })
              )}
            </select>
            {!ordersLoading && userOrders.filter(order => !order.bankDetails && order.status === 'pending').length === 0 && (
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                لا توجد طلبات بانتظار الدفع تحتاج تفاصيل البنك. جميع الطلبات إما تم دفعها أو تم إدخال تفاصيل البنك لها.
              </small>
            )}
          </div>

          {error && (
            <div style={{ color: '#e53e3e', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                flex: 1, 
                padding: '1rem', 
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التفاصيل'}
            </button>
            <Link 
              to="/"
              style={{ 
                flex: 1, 
                padding: '1rem', 
                fontSize: '1.2rem',
                background: '#718096',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              إلغاء
            </Link>
          </div>
        </form>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BankDetails; 