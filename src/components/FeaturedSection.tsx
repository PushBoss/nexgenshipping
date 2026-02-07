import { ProductCard, Product } from './ProductCard';
import { TrendingUp, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface FeaturedSectionProps {
  products: Product[];
  isLoggedIn: boolean;
  onAddToCart: (productId: string) => void;
  onLoginPrompt: () => void;
  onProductClick: (productId: string) => void;
}

export function FeaturedSection({
  products,
  isLoggedIn,
  onAddToCart,
  onLoginPrompt,
  onProductClick,
}: FeaturedSectionProps) {
  const bestSellers = products.filter((p) => p.badge === 'Best Seller');
  const onSale = products.filter((p) => p.originalPrice).slice(0, 4);

  // Carousel state for best sellers
  const [bestSellerCarouselIndex, setBestSellerCarouselIndex] = useState(0);

  // Get 4 visible items for carousel display (or fewer if less than 4 unique items)
  const getCarouselItems = () => {
    if (bestSellers.length === 0) return [];
    
    // If we have fewer than 4 items, just show what we have without repeating
    if (bestSellers.length <= 4) {
      return bestSellers;
    }
    
    // If we have more than 4, show 4 in rotation
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push(bestSellers[(bestSellerCarouselIndex + i) % bestSellers.length]);
    }
    return items;
  };

  const carouselItems = getCarouselItems();

  const handlePreviousBestSellers = () => {
    setBestSellerCarouselIndex((prev) => 
      prev === 0 ? bestSellers.length - 1 : prev - 1
    );
  };

  const handleNextBestSellers = () => {
    setBestSellerCarouselIndex((prev) => 
      (prev + 1) % bestSellers.length
    );
  };

  return (
    <div className="space-y-8 mb-8">
      {/* Best Sellers Carousel */}
      {bestSellers.length > 0 && (
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
              {carouselItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                  onAddToCart={onAddToCart}
                  onLoginPrompt={onLoginPrompt}
                  onProductClick={onProductClick}
                />
              ))}
            </div>

            {/* Carousel Controls */}
            {bestSellers.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePreviousBestSellers}
                  className="p-2 rounded-full bg-[#003366] hover:bg-[#0055AA] text-white transition-all duration-200 hover:scale-110"
                  aria-label="Previous best sellers"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="text-sm text-gray-600 text-center">
                  Showing {bestSellerCarouselIndex + 1}-{Math.min(bestSellerCarouselIndex + 4, bestSellers.length)} of {bestSellers.length}
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

      {/* On Sale */}
      {onSale.length > 0 && (
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {onSale.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoggedIn={isLoggedIn}
                onAddToCart={onAddToCart}
                onLoginPrompt={onLoginPrompt}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
