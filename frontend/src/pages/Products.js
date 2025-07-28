import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { getPriceDisplay } from '../utils/priceUtils';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.getProducts();
        setProducts(res);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Our Products</h2>
        {products.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
            No products available yet.
          </p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    '🛍️'
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', gap: '0.5rem' }}>
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
                  <div className="product-stock">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products; 