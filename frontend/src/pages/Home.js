import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { getPriceDisplay } from '../utils/priceUtils';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    fetchProducts();
  }, []);

  // Listen for storage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === (product._id || product.id));
    const priceInfo = getPriceDisplay(product);
    
    if (existingItem) {
      const updatedCart = cart.map(item => 
        item.id === (product._id || product.id) 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newCart = [...cart, {
        id: product._id || product.id,
        name: product.name,
        price: parseFloat(priceInfo.discountedPrice), // Use discounted price
        originalPrice: parseFloat(priceInfo.originalPrice),
        discount: priceInfo.discount,
        image: product.image,
        quantity: 1
      }];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="container">
      {/* Floating bubbles */}
      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      <div className="card" style={{ padding: '1.5rem' }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.5rem',
          direction: 'rtl'
        }}>
          <div style={{ 
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            letterSpacing: '2px'
          }}>
            🛍️ المتجر
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            {user ? (
              <>
                {user.isAdmin && <button 
                  onClick={() => navigate('/admin')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px'
                  }}
                >
                  لوحة الإدارة
                </button>}
                <button 
                  onClick={() => navigate('/orders')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px'
                  }}
                >
                  طلباتي
                </button>
                <button 
                  onClick={() => navigate('/bank-details')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px'
                  }}
                >
                  تأكيد الدفع
                </button>
                <button 
                  onClick={() => navigate('/cart')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px',
                    position: 'relative'
                  }}
                >
                  السلة 
                  <span style={{
                    backgroundColor: '#ffffff',
                    color: '#ff0000',
                    borderRadius: '50%',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.8rem',
                    marginRight: '1.6rem',
                    minWidth: '20px',
                    display: 'inline-block',
                    textAlign: 'center',
                    boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff',
                    border: '2px solid #ffffff',
                    animation: 'neonGlowWhite 2s ease-in-out infinite alternate',
                    fontWeight: 'bold'
                  }}>
                    {getCartItemCount()}
                  </span>
                </button>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    marginRight: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px'
                  }}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px'
                  }}
                >
                  تسجيل الدخول
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px'
                  }}
                >
                  إنشاء حساب
                </button>
                <button 
                  onClick={() => navigate('/cart')}
                  style={{ 
                    margin: '0 0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1.1rem',
                    borderRadius: '25px',
                    width: '200px',
                    height: '40px',
                    position: 'relative'
                  }}
                >
                  السلة 
                  <span style={{
                    backgroundColor: '#ffffff',
                    color: '#ff0000',
                    borderRadius: '50%',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.8rem',
                    marginRight: '1.6rem',
                    minWidth: '20px',
                    display: 'inline-block',
                    textAlign: 'center',
                    boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff',
                    border: '2px solid #ffffff',
                    animation: 'neonGlowWhite 2s ease-in-out infinite alternate',
                    fontWeight: 'bold'
                  }}>
                    {getCartItemCount()}
                  </span>
                </button>
              </>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {user && <span style={{ color: '#000000', fontWeight: '500' }}>مرحباً، {user.name}!</span>}
          </div>
        </nav>
      </div>

      {/* Products Section */}
      <div className="card">
        <h2 style={{ 
          color: '#fff',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          fontFamily: 'Syncopate, sans-serif'
        }}>
          منتجاتنا
        </h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
            لا توجد منتجات متوفرة بعد.
          </p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id || product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{ 
                    display: product.image ? 'none' : 'flex',
                    width: '100%', 
                    height: '100%', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: '#667eea'
                  }}>
                    🛍️
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                      {(() => {
                        const priceInfo = getPriceDisplay(product);
                        return (
                          <>
                            {priceInfo.hasDiscount ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ 
                                    textDecoration: 'line-through', 
                                    color: '#999', 
                                    fontSize: '0.9rem' 
                                  }}>
                                    {priceInfo.originalPrice}
                                  </span>
                                  <span style={{ 
                                    color: '#e53e3e', 
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                  }}>
                                    {priceInfo.discountedPrice}
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
                                  🎯 خصم {priceInfo.discount}%
                                </div>
                              </>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span>{priceInfo.discountedPrice}</span>
                                <img src="/price-icon.png" alt="price" style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <div className="product-stock" style={{ 
                      fontSize: '0.9rem', 
                      color: product.stock > 10 ? '#006400' : product.stock > 0 ? '#ff0000' : '#000000'
                    }}>
                      {product.stock > 0 ? `${product.stock} في المخزون` : 'إنتهى المخزون'}
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    style={{ 
                      width: '100%', 
                      marginTop: '0.8rem',
                      padding: '0.6rem 1rem',
                      fontSize: '1.1rem',
                      background: product.stock > 0 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'linear-gradient(45deg, #666, #999)',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      letterSpacing: '1px'
                    }}
                  >
                    {product.stock > 0 ? 'إضافة للسلة' : 'إنتهى المخزون'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 