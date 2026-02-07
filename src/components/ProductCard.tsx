import { Star, ShoppingCart, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Currency, convertCurrency, formatCurrency } from '../utils/currencyService';
import { useState, useEffect } from 'react';
import { reviewsService } from '../utils/reviewsService';

export interface Product {
  id: string;
  name: string;
  description?: string;     // Product description
  category: 'baby' | 'pharmaceutical';
  categoryId?: string;
  subcategoryId?: string;
  price: number;
  originalPrice?: number;
  currency?: 'USD' | 'JMD' | 'CAD';  // Product price currency (defaults to USD)
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  badge?: string;
  stockCount?: number;      // Number of units in stock
  soldCount?: number;        // Total number of units sold (for analytics)
  costPrice?: number;        // Cost to acquire the product (for profit calculations)
}

interface ProductCardProps {
  product: Product;
  isLoggedIn: boolean;
  onAddToCart: (productId: string) => void;
  onLoginPrompt: () => void;
  onProductClick?: (productId: string) => void;
  selectedCurrency?: Currency;
}

export function ProductCard({
  product,
  isLoggedIn,
  onAddToCart,
  onLoginPrompt,
  onProductClick,
  selectedCurrency = 'USD',
}: ProductCardProps) {
  const [calculatedRating, setCalculatedRating] = useState(product.rating);
  const [reviewCount, setReviewCount] = useState(product.reviewCount);

  // Load calculated average rating from reviews
  useEffect(() => {
    const loadAverageRating = async () => {
      const { averageRating, reviewCount: count } = await reviewsService.getAverageRating(product.id);
      if (count > 0) {
        setCalculatedRating(averageRating);
        setReviewCount(count);
      }
    };
    loadAverageRating();
  }, [product.id]);

  // Convert prices to selected currency
  const productCurrency = product.currency || 'USD';
  const displayPrice = convertCurrency(product.price, productCurrency, selectedCurrency);
  const displayOriginalPrice = product.originalPrice 
    ? convertCurrency(product.originalPrice, productCurrency, selectedCurrency)
    : undefined;
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 p-4 flex flex-col h-full group">
      {/* Image */}
      <div 
        className="relative mb-3 overflow-hidden rounded cursor-pointer bg-white"
        onClick={() => onProductClick?.(product.id)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <Badge 
            className={`absolute top-2 left-2 transition-colors text-white border-0 ${
              product.badge === 'Standard' 
                ? 'bg-gray-500 hover:bg-gray-600' 
                : 'bg-[#DC143C] hover:bg-[#B01030]'
            }`}
          >
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 flex flex-col">
        <h3 
          className="mb-2 line-clamp-2 hover:text-[#003366] cursor-pointer transition-colors text-gray-900"
          onClick={() => onProductClick?.(product.id)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(calculatedRating)
                    ? 'fill-[#FF9900] text-[#FF9900]'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-blue-600 hover:text-[#C7511F] cursor-pointer">
            {reviewCount}
          </span>
        </div>

        {/* Price section */}
        <div className="mb-3">
          {isLoggedIn ? (
            <div className="flex items-baseline gap-2">
              <span className="text-[#DC143C] font-bold text-xl">
                {formatCurrency(displayPrice, selectedCurrency)}
              </span>
              {displayOriginalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(displayOriginalPrice, selectedCurrency)}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Sign in to see price</span>
            </div>
          )}
        </div>

        {/* Stock status */}
        <div className="mb-3">
          {product.inStock ? (
            <span className="text-sm text-green-700">In Stock</span>
          ) : (
            <span className="text-sm text-red-600">Out of Stock</span>
          )}
        </div>

        {/* Add to cart button */}
        <div className="mt-auto">
          {isLoggedIn ? (
            <Button
              onClick={() => onAddToCart(product.id)}
              disabled={!product.inStock}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <Button
              onClick={onLoginPrompt}
              variant="outline"
              className="w-full border-[#D5D9D9] hover:bg-gray-50 transition-colors"
            >
              Sign in to purchase
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}