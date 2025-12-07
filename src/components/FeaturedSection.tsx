import { ProductCard, Product } from './ProductCard';
import { TrendingUp, Tag } from 'lucide-react';

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
  const bestSellers = products.filter((p) => p.badge === 'Best Seller').slice(0, 4);
  const onSale = products.filter((p) => p.originalPrice).slice(0, 4);

  return (
    <div className="space-y-8 mb-8">
      {/* Best Sellers */}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
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
