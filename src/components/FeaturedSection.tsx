import { ProductCard, Product } from './ProductCard';
import { TrendingUp, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Currency } from '../utils/currencyService';

interface FeaturedSectionProps {
  bestsellers: Product[];
  onSaleItems: Product[];
  isLoggedIn: boolean;
  selectedCurrency?: Currency;
  onAddToCart: (productId: string) => void;
  onLoginPrompt: () => void;
  onProductClick: (productId: string) => void;
  isInWishlist?: (productId: string) => boolean;
  onToggleWishlist?: (productId: string) => void;
}

export function FeaturedSection({
  bestsellers,
  onSaleItems,
  isLoggedIn,
  selectedCurrency = 'USD',
  onAddToCart,
  onLoginPrompt,
  onProductClick,
  isInWishlist,
  onToggleWishlist,
}: FeaturedSectionProps) {
  // Carousel state for best sellers
  const [bestSellerCarouselIndex, setBestSellerCarouselIndex] = useState(0);
  const [onSaleCarouselIndex, setOnSaleCarouselIndex] = useState(0);

  // Get carousel items for bestsellers
  const getBestSellerItems = () => {
    if (bestsellers.length === 0) return [];
    if (bestsellers.length <= 4) return bestsellers;
    
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push(bestsellers[(bestSellerCarouselIndex + i) % bestsellers.length]);
    }
    return items;
  };

  // Get carousel items for on-sale products
  const getOnSaleItems = () => {
    if (onSaleItems.length === 0) return [];
    if (onSaleItems.length <= 4) return onSaleItems;
    
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push(onSaleItems[(onSaleCarouselIndex + i) % onSaleItems.length]);
    }
    return items;
  };

  const bestSellerItems = getBestSellerItems();
  const saleItems = getOnSaleItems();

  const handlePreviousBestSellers = () => {
    setBestSellerCarouselIndex((prev) => 
      prev === 0 ? bestsellers.length - 1 : prev - 1
    );
  };

  const handleNextBestSellers = () => {
    setBestSellerCarouselIndex((prev) => 
      (prev + 1) % bestsellers.length
    );
  };

  const handlePreviousOnSale = () => {
    setOnSaleCarouselIndex((prev) => 
      prev === 0 ? onSaleItems.length - 1 : prev - 1
    );
  };

  const handleNextOnSale = () => {
    setOnSaleCarouselIndex((prev) => 
      (prev + 1) % onSaleItems.length
    );
  };

  return (
    <div className="space-y-8 mb-8">
      {/* Best Sellers Carousel */}
      {bestsellers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#DC143C] w-10 h-10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-[#003366]">Best Sellers</h2>
              <p className="text-sm text-gray-600">Most popular products this month</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellerItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                  selectedCurrency={selectedCurrency}
                  onAddToCart={onAddToCart}
                  onLoginPrompt={onLoginPrompt}
                  onProductClick={onProductClick}
                  isInWishlist={isInWishlist?.(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>

            {/* Carousel Controls */}
            {bestsellers.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePreviousBestSellers}
                  className="p-2 rounded-full bg-[#003366] hover:bg-[#0055AA] text-white transition-all duration-200 hover:scale-110"
                  aria-label="Previous best sellers"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-sm text-gray-600 text-center">
                  Showing {bestSellerCarouselIndex + 1}-{Math.min(bestSellerCarouselIndex + 4, bestsellers.length)} of {bestsellers.length}
                </div>

                <button
                  onClick={handleNextBestSellers}
                  className="p-2 rounded-full bg-[#003366] hover:bg-[#0055AA] text-white transition-all duration-200 hover:scale-110"
                  aria-label="Next best sellers"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* On Sale Carousel */}
      {onSaleItems.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-sm p-4 md:p-6 border-2 border-[#FF9900]">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#FF9900] w-10 h-10 rounded-full flex items-center justify-center">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-[#003366]">Special Offers</h2>
              <p className="text-sm text-gray-600">Limited time deals - Save up to 30%</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {saleItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                  selectedCurrency={selectedCurrency}
                  onAddToCart={onAddToCart}
                  onLoginPrompt={onLoginPrompt}
                  onProductClick={onProductClick}
                  isInWishlist={isInWishlist?.(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>

            {/* Carousel Controls */}
            {onSaleItems.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePreviousOnSale}
                  className="p-2 rounded-full bg-[#FF9900] hover:bg-[#E68900] text-white transition-all duration-200 hover:scale-110"
                  aria-label="Previous sale items"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-sm text-gray-600 text-center">
                  Showing {onSaleCarouselIndex + 1}-{Math.min(onSaleCarouselIndex + 4, onSaleItems.length)} of {onSaleItems.length}
                </div>

                <button
                  onClick={handleNextOnSale}
                  className="p-2 rounded-full bg-[#FF9900] hover:bg-[#E68900] text-white transition-all duration-200 hover:scale-110"
                  aria-label="Next sale items"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
