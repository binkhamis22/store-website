import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
// Cart component

function Cart() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    console.log('handleCheckout called');
    setLoading(true);
    setError('');
    
    try {
    if (!user) {
        alert('الرجاء تسجيل الدخول لإتمام الطلب');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
        alert('سلة التسوق فارغة');
      return;
    }

      console.log('Making API call...');
      const orderData = {
        products: cart,
        total: getTotal(),
        user: user._id || user.id
      };

      await API.post('/orders', orderData);
      console.log('API call successful');
      
      // Clear cart
      setCart([]);
      localStorage.removeItem('cart');
      
      setAlertMessage('تم إتمام الطلب بنجاح!');
      setShowAlert(true);
      console.log('Alert should show:', alertMessage, showAlert);
      setTimeout(() => {
        setShowAlert(false);
      navigate('/');
      }, 3000);
      
    } catch (err) {
      console.error('Error in checkout:', err);
      setError('فشل إتمام الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        {/* Custom Alert */}
        {showAlert && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            animation: 'slideDown 0.5s ease-out',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            minWidth: '300px'
          }}>
            ✅ {alertMessage}
          </div>
        )}
        
        <div className="card">
          <h2>سلة التسوق</h2>
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
            سلة التسوق فارغة. <button 
              onClick={() => navigate('/')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#667eea', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '1.2rem'
              }}
            >
              استمرار التسوق
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Custom Alert */}
      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          animation: 'slideDown 0.5s ease-out',
          textAlign: 'center',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          minWidth: '300px'
        }}>
          ✅ {alertMessage}
        </div>
      )}
      
      <div className="card">
        <h2>سلة التسوق</h2>
        
        {/* Cart Items */}
        <div style={{ marginBottom: '2rem' }}>
          {cart.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem', 
              border: '1px solid #e1e5e9', 
              borderRadius: '10px', 
              marginBottom: '1rem' 
            }}>
              <div style={{ width: '80px', height: '80px', marginRight: '1rem' }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#667eea', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    🛍️
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ padding: '0.25rem 0.5rem', border: '1px solid #667eea', background: 'white', borderRadius: '4px' }}
                  >
                    -
                  </button>
                  <span>الكمية: {item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: '0.25rem 0.5rem', border: '1px solid #667eea', background: 'white', borderRadius: '4px' }}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      border: '1px solid #e53e3e', 
                      background: 'white', 
                      color: '#e53e3e',
                      borderRadius: '4px',
                      marginLeft: '1rem'
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0', fontWeight: 'bold', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                  {item.discount > 0 ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          textDecoration: 'line-through', 
                          color: '#999', 
                          fontSize: '0.9rem' 
                        }}>
                          {(item.originalPrice * item.quantity).toFixed(2)}
                        </span>
                        <span style={{ 
                          color: '#e53e3e', 
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}>
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <img src="/price-icon.png" alt="price" style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        🎯 خصم {item.discount}%
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{(item.price * item.quantity).toFixed(2)}</span>
                      <img src="/price-icon.png" alt="price" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
                    </div>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ 
          borderTop: '2px solid #e1e5e9', 
          paddingTop: '1rem', 
          marginBottom: '2rem',
          textAlign: 'right'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            <span>المجموع: {getTotal().toFixed(2)}</span>
            <img src="/price-icon.png" alt="price" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
          </h3>
        </div>

        {/* Checkout Button */}
        {!showCheckout ? (
          <button 
            onClick={() => setShowCheckout(true)}
            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
          >
            إتمام الطلب
          </button>
        ) : (
          <div>
            <h3>تأكيد الطلب</h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
              هل أنت متأكد من إتمام الطلب؟ الرجاء تحويل المبلغ الى رقم الحساب الظاهر في صفحة تأكيد الدفع واكمال البيانات المطلوبة.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                onClick={handleCheckout}
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
                {loading ? 'جاري إتمام الطلب...' : 'تأكيد الطلب'}
                </button>
                <button 
                  onClick={() => setShowCheckout(false)}
                  style={{ 
                    flex: 1, 
                    padding: '1rem',
                  fontSize: '1.2rem',
                    background: '#718096',
                    color: 'white',
                    border: 'none',
                  borderRadius: '8px'
                  }}
                >
                إلغاء
                </button>
              </div>
          </div>
        )}

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

export default Cart; 