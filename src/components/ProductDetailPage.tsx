import { Star, ShoppingCart, ChevronLeft, Package, Truck, Shield, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from './ProductCard';
import { useState } from 'react';
import { Currency, convertCurrency, formatCurrency } from '../utils/currencyService';

interface ProductDetailPageProps {
  product: Product;
  isLoggedIn: boolean;
  onAddToCart: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  onBack: () => void;
  onLoginPrompt: () => void;
  selectedCurrency?: Currency;
}

export function ProductDetailPage({
  product,
  isLoggedIn,
  onAddToCart,
  onBuyNow,
  onBack,
  onLoginPrompt,
  selectedCurrency = 'USD',
}: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Convert prices to selected currency
  const productCurrency = product.currency || 'USD';
  const displayPrice = convertCurrency(product.price, productCurrency, selectedCurrency);
  const displayOriginalPrice = product.originalPrice 
    ? convertCurrency(product.originalPrice, productCurrency, selectedCurrency)
    : undefined;
  const savings = displayOriginalPrice ? displayOriginalPrice - displayPrice : 0;

  // Generate additional product images (using the same image for demo)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product.id);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product.id);
    }
    onBuyNow(product.id);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#003366] hover:text-[#0055AA] mb-6 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back to Products</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white rounded-lg border border-gray-200 p-4">
            <ImageWithFallback
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-96 md:h-[500px] object-contain"
            />
            {product.badge && (
              <Badge className="absolute top-6 left-6 bg-[#DC143C] hover:bg-[#B01030] transition-colors text-white border-0">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`bg-white rounded border-2 p-2 transition-all ${
                  selectedImage === index
                    ? 'border-[#FF9900]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-20 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#FF9900] text-[#FF9900]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#003366]">{product.rating} out of 5</span>
              <span className="text-sm text-blue-600 hover:text-[#C7511F] cursor-pointer">
                {product.reviewCount} ratings
              </span>
            </div>

            <div className="h-px bg-gray-200 mb-4" />

            {/* Price */}
            <div className="mb-6">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    {displayOriginalPrice && (
                      <span className="text-sm text-gray-500">
                        List Price: <span className="line-through">{formatCurrency(displayOriginalPrice, selectedCurrency)}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-700">Price:</span>
                    <span className="text-[#DC143C] text-3xl">
                      {formatCurrency(displayPrice, selectedCurrency)}
                    </span>
                  </div>
                  {displayOriginalPrice && savings > 0 && (
                    <div className="text-sm text-green-700">
                      You Save: {formatCurrency(savings, selectedCurrency)} (
                      {Math.round((savings / displayOriginalPrice) * 100)}%)
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 border border-gray-200 rounded p-4">
                  <Lock className="h-5 w-5" />
                  <span>Sign in to see price and purchase this item</span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-200 mb-6" />

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-700">
                  <Package className="h-5 w-5" />
                  <span className="text-lg">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Package className="h-5 w-5" />
                  <span className="text-lg">Currently Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {isLoggedIn && product.inStock && (
              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              {isLoggedIn ? (
                <>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="w-full bg-[#FF9900] hover:bg-[#F08000] text-white h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onLoginPrompt}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 h-12 transition-colors"
                >
                  Sign in to purchase
                </Button>
              )}
            </div>

            <div className="h-px bg-gray-200 mb-6" />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Truck className="h-5 w-5 text-[#007600]" />
                <span>Fast, reliable worldwide shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="h-5 w-5 text-[#003366]" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Package className="h-5 w-5 text-[#DC143C]" />
                <span>Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-8">
        <h2 className="text-[#003366] mb-4">Product Details</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="text-[#003366] mb-2">About This Item</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>High-quality {product.category === 'baby' ? 'baby' : 'pharmaceutical'} product</li>
              <li>Trusted brand with excellent customer reviews</li>
              <li>Safe and reliable for everyday use</li>
              <li>Meets all regulatory standards and quality requirements</li>
              <li>Fast shipping available to customers worldwide</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#003366] mb-2">Product Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2 capitalize">{product.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Product ID:</span>
                <span className="ml-2">{product.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Availability:</span>
                <span className="ml-2">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <div>
                <span className="text-gray-600">Rating:</span>
                <span className="ml-2">{product.rating} / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <h2 className="text-[#003366] mb-6">Customer Reviews</h2>
        
        {/* Review Summary */}
        <div className="flex items-center gap-8 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="text-5xl text-gray-900 mb-1">{product.rating}</div>
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#FF9900] text-[#FF9900]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">{product.reviewCount} ratings</div>
          </div>
        </div>

        {/* Sample Reviews */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#FF9900] text-[#FF9900]"
                />
              ))}
              <span className="text-sm ml-2">Excellent Product</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Reviewed on October 15, 2025</p>
            <p className="text-gray-700">
              Great quality product! Exactly as described and arrived quickly. Highly recommend to anyone looking for reliable {product.category} products.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#FF9900] text-[#FF9900]"
                />
              ))}
              <Star className="h-4 w-4 text-gray-300" />
              <span className="text-sm ml-2">Very Good</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Reviewed on October 10, 2025</p>
            <p className="text-gray-700">
              Good value for money. The product quality is solid and delivery was fast. Would purchase again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
