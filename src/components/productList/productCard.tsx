import React, { useState } from 'react';
import { Product } from '../../types/product';
import { Star, Eye, MessageCircle, Palette, ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  cartQuantity 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden min-w-[280px] flex-shrink-0">
      <div className="relative flex items-center justify-center ">
        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-sm">Image not available</span>
            </div>
          ) : (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-contain hover:scale-105 transition-transform duration-300 ${
                !imageLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          )}
        </div>
        
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
        
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-gray-500" />
            <div className="flex space-x-2">
              {product.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                />
              ))}
              {product.colors.length > 5 && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{product.colors.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={() => onAddToCart(product.productId)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mb-4 active:scale-95"
        >
          Add to Cart {cartQuantity > 0 && `(${cartQuantity})`}
        </button>
        
        <div className="flex justify-between text-sm text-gray-600">
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
            Details
          </button>
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Reviews
          </button>
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Palette className="w-4 h-4" />
            Outfits
          </button>
        </div>
      </div>
    </div>
  );
};