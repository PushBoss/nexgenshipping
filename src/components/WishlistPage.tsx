import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star } from 'lucide-react';
import { Product } from './ProductCard';

interface WishlistPageProps {
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onProductClick: (productId: string) => void;
}

export function WishlistPage({
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onProductClick,
}: WishlistPageProps) {
  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-[#003366] mb-2">Your Wishlist</h1>
          <p className="text-gray-600">Save items you love for later</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding products you love to keep track of them
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#003366] mb-2">Your Wishlist</h1>
            <p className="text-gray-600">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Heart className="h-8 w-8 text-[#DC143C] fill-[#DC143C]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 p-4 flex flex-col"
          >
            {/* Image */}
            <div 
              className="relative mb-3 overflow-hidden rounded cursor-pointer group"
              onClick={() => onProductClick(product.id)}
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromWishlist(product.id);
                }}
                className="absolute top-2 right-2 bg-white hover:bg-red-50 rounded-full p-2 shadow-md transition-colors"
                title="Remove from wishlist"
              >
                <Heart className="h-5 w-5 text-[#DC143C] fill-[#DC143C]" />
              </button>
            </div>

            {/* Product info */}
            <div className="flex-1 flex flex-col">
              <h3 
                className="mb-2 line-clamp-2 hover:text-[#003366] cursor-pointer transition-colors text-gray-900"
                onClick={() => onProductClick(product.id)}
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
                        i < Math.floor(product.rating)
                          ? 'fill-[#FF9900] text-[#FF9900]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-600">
                  {product.reviewCount}
                </span>
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#DC143C] text-xl">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock status */}
              <div className="mb-3">
                {product.inStock ? (
                  <span className="text-sm text-green-700">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-auto space-y-2">
                <Button
                  onClick={() => onAddToCart(product.id)}
                  disabled={!product.inStock}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => onRemoveFromWishlist(product.id)}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
