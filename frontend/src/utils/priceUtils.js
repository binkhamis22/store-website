// Utility functions for price calculations

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) {
    return originalPrice;
  }
  
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
};

export const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

export const getPriceDisplay = (product) => {
  const originalPrice = parseFloat(product.price);
  const discount = product.discount || 0;
  
  if (discount > 0) {
    const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
    return {
      originalPrice: formatPrice(originalPrice),
      discountedPrice: formatPrice(discountedPrice),
      discount: discount,
      hasDiscount: true
    };
  }
  
  return {
    originalPrice: formatPrice(originalPrice),
    discountedPrice: formatPrice(originalPrice),
    discount: 0,
    hasDiscount: false
  };
}; 