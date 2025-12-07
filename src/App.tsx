import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard, Product } from './components/ProductCard';
import { LoginDialog } from './components/LoginDialog';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { FeaturedSection } from './components/FeaturedSection';
import { CategoryBrowser, PRODUCT_CATEGORIES } from './components/CategoryBrowser';
import { CategoryBreadcrumb } from './components/CategoryBreadcrumb';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { ReturnPolicyPage } from './components/ReturnPolicyPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { OrdersPage } from './components/OrdersPage';
import { WishlistPage } from './components/WishlistPage';
import { AccountPage } from './components/AccountPage';
import { AdminPage } from './components/AdminPage';
import { Dialog, DialogContent, DialogTitle } from './components/ui/dialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { productsService } from './utils/productsService';
import { authService } from './utils/authService';
import { config } from './utils/config';
import logoImage from './assets/nexgen-logo-new.png';
import benadrylImage from 'figma:asset/f5fcd53fa40e8e1ada6fc6ba6cdf6cf4c0b3b67e.png';
import benadrylTabletsImage from 'figma:asset/aad74bcf3080943c101c2cefe49a6919d71529cc.png';
import dayquilImage from 'figma:asset/6d0559379d9c2c4facdbb9679dab6a38b661b49a.png';
import dayquilLiquicapsImage from 'figma:asset/1274f8cffa84f62263f79c12f8a14e66756c4c6d.png';
import dayquil8ozImage from 'figma:asset/eeb07de085674ec82934af1339dc7e684d737784.png';
import nyquilGreenImage from 'figma:asset/120245a748c6e9c1f57b7f4588019a9f7a3038cc.png';
import nyquilRedImage from 'figma:asset/6b6764bf08e820b8b61d7e58d3d8142f0f1790dd.png';
import robitussinImage from 'figma:asset/b9594807f77ec5a8ec8ae727f457cabb611df519.png';
import therafluImage from 'figma:asset/e9b68023a5c48f326a40775d2b6b9ba300bd66c2.png';
import therafluOrangeImage from 'figma:asset/03d77e5e58ab613f4c41160cecd311d27b98b894.png';
import tylenolChildrenImage from 'figma:asset/407864ea57f3cc5592dbb53cbb83014b2360ce0b.png';
import benadrylChildrenImage from 'figma:asset/b0b213ee753d620ff0fbb6436dfa4bd51c5cb8b0.png';
import babyJeansImage from 'figma:asset/1ca322440c531606319c7a60caf219e16a7a423a.png';
import babyJeans2Image from 'figma:asset/937982d33adc5b3bdb9a98fef136fa424c6a06c0.png';
import babyBoySetImage from 'figma:asset/90c52f96c23487df2e1920efd61340a77e7774ef.png';
import babyPoloTopImage from 'figma:asset/f9612a4a2f847a83c97f026a6addc24e1ec064f2.png';
import girlShortsImage from 'figma:asset/b938a16a6d13c2ec8be3083fe34a02eb3a81afb2.png';
import girlSetsImage from 'figma:asset/ce88cf0e8ae3904dc3824211cb2b3ee3f0b5660e.png';
import girlJeansShortsImage from 'figma:asset/635b35ac7f63702daafda43da1d72d6507cdbcaf.png';
import girlDressImage from 'figma:asset/974f52e7f6a3d171bc315f35d9bf968d55106b58.png';
import babyBoyShortsImage from 'figma:asset/93e311d341a7c58921f604eb2dee331012bab249.png';
import babyBoyShirtImage from 'figma:asset/e0cf2454d9977ac53a3b06963b2cec368ba3f98d.png';

interface CartItem extends Product {
  quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
  // Pharmaceutical Products
  {
    id: '1',
    name: "Benadryl 24's Liquid Gels - Allergy Relief",
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 83.75,
    rating: 4.7,
    reviewCount: 1892,
    image: benadrylImage,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '2',
    name: "Benadryl 24's Tablets - Fast Acting Allergy Relief",
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 63.95,
    rating: 4.6,
    reviewCount: 1654,
    image: benadrylTabletsImage,
    inStock: true,
  },
  {
    id: '3',
    name: 'DayQuil 4oz Cold & Flu Relief - 16pc/case',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 85.00,
    rating: 4.8,
    reviewCount: 2341,
    image: dayquilImage,
    inStock: true,
    badge: 'Top Rated',
  },
  {
    id: '4',
    name: 'DayQuil 16 Liquicaps - Severe Cold & Flu',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 89.00,
    rating: 4.7,
    reviewCount: 1987,
    image: dayquilLiquicapsImage,
    inStock: true,
  },
  {
    id: '5',
    name: 'DayQuil 8oz Cold & Flu Relief Liquid',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 92.00,
    rating: 4.8,
    reviewCount: 2156,
    image: dayquil8ozImage,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '6',
    name: 'NyQuil Green 8oz - Nighttime Cold & Flu Relief',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 92.00,
    rating: 4.7,
    reviewCount: 2089,
    image: nyquilGreenImage,
    inStock: true,
  },
  {
    id: '7',
    name: 'NyQuil Red 4oz Cold & Flu Relief - 16pc/case',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 85.00,
    rating: 4.6,
    reviewCount: 1876,
    image: nyquilRedImage,
    inStock: true,
  },
  {
    id: '8',
    name: 'Robitussin DM Cough & Chest Congestion 4oz',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 71.00,
    rating: 4.5,
    reviewCount: 1654,
    image: robitussinImage,
    inStock: true,
  },
  {
    id: '9',
    name: 'TheraFlu Green Severe Cold Cough Night Time 6\'s',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 77.50,
    rating: 4.6,
    reviewCount: 1432,
    image: therafluImage,
    inStock: true,
  },
  {
    id: '10',
    name: 'TheraFlu Orange Severe Cold Cough Daytime 6\'s',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 77.50,
    rating: 4.6,
    reviewCount: 1389,
    image: therafluOrangeImage,
    inStock: true,
    badge: 'New',
  },
  {
    id: '11',
    name: 'Tylenol Children\'s Elixir Cold+Flu',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 102.00,
    rating: 4.8,
    reviewCount: 2234,
    image: tylenolChildrenImage,
    inStock: true,
  },
  {
    id: '12',
    name: 'Benadryl Children Allergy 4oz Cherry',
    category: 'pharmaceutical',
    categoryId: 'cold-cough-allergy-sinus',
    price: 87.95,
    rating: 4.7,
    reviewCount: 1987,
    image: benadrylChildrenImage,
    inStock: true,
  },
  {
    id: '13',
    name: 'Baby Boy Jeans Pants 6-24 Months',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 14.50,
    rating: 4.7,
    reviewCount: 543,
    image: babyJeansImage,
    inStock: true,
  },
  {
    id: '14',
    name: 'Baby Boy Jeans Pants 6-24 Months',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 15.50,
    rating: 4.8,
    reviewCount: 621,
    image: babyJeans2Image,
    inStock: true,
  },
  {
    id: '15',
    name: 'Baby Boy Set',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 6.80,
    rating: 4.9,
    reviewCount: 892,
    image: babyBoySetImage,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '16',
    name: 'Baby Boy Polo Top 6-24 Months',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 8.50,
    rating: 4.6,
    reviewCount: 734,
    image: babyPoloTopImage,
    inStock: true,
  },
  {
    id: '17',
    name: 'Girl Shorts 2-6 3PCS',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 10.50,
    rating: 4.8,
    reviewCount: 1156,
    image: girlShortsImage,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '18',
    name: 'Girl Sets 2-8 Years',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 13.50,
    rating: 4.9,
    reviewCount: 1423,
    image: girlSetsImage,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '19',
    name: 'Girl Jeans Shorts 2-8 Years',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 15.50,
    rating: 4.7,
    reviewCount: 982,
    image: girlJeansShortsImage,
    inStock: true,
  },
  {
    id: '20',
    name: 'Girl Dress 2-8 Years',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 25.00,
    rating: 4.9,
    reviewCount: 1678,
    image: girlDressImage,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: '21',
    name: 'Baby Boy Shorts',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 6.50,
    rating: 4.7,
    reviewCount: 892,
    image: babyBoyShortsImage,
    inStock: true,
  },
  {
    id: '22',
    name: 'Baby Boy Shirt',
    category: 'baby',
    categoryId: 'apparel-accessories',
    price: 8.50,
    rating: 4.8,
    reviewCount: 1045,
    image: babyBoyShirtImage,
    inStock: true,
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'baby' | 'pharmaceutical'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'cart' | 'checkout' | 'privacy' | 'returns' | 'product-detail' | 'orders' | 'wishlist' | 'account' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Check for existing auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user) {
          const isAdmin = await authService.isAdmin();
          setIsLoggedIn(true);
          setUserEmail(user.email);
          setIsAdmin(isAdmin);
          if (config.debugMode) {
            console.log('✅ Session restored:', user.email);
          }
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    if (config.useSupabase) {
      const subscription = authService.onAuthStateChange(async (user) => {
        if (user) {
          const isAdmin = await authService.isAdmin();
          setIsLoggedIn(true);
          setUserEmail(user.email);
          setIsAdmin(isAdmin);
        } else {
          setIsLoggedIn(false);
          setUserEmail('');
          setIsAdmin(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Load products from Supabase on app startup
  useEffect(() => {
    const loadProducts = async () => {
      if (config.useSupabase && !productsLoaded) {
        try {
          const supabaseProducts = await productsService.getAll();
          if (supabaseProducts.length > 0) {
            setProducts(supabaseProducts);
            if (config.debugMode) {
              console.log(`✅ Loaded ${supabaseProducts.length} products from Supabase`);
            }
          } else {
            // No products in database, use MOCK_PRODUCTS as initial data
            if (config.debugMode) {
              console.log('ℹ️ No products in Supabase, using mock data');
            }
          }
        } catch (error) {
          console.error('Failed to load products from Supabase:', error);
          toast.error('Failed to load products from database, using local data');
        } finally {
          setProductsLoaded(true);
        }
      }
    };

    loadProducts();
  }, [productsLoaded]);

  const handleLogin = (email: string, isAdminUser: boolean) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setIsAdmin(isAdminUser);
    
    if (isAdminUser) {
      setCurrentPage('admin');
      toast.success('Welcome Admin!');
    } else {
      toast.success('Successfully signed in!');
    }
  };

  const handleLogout = async () => {
    if (config.useSupabase) {
      await authService.signOut();
    }
    
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserEmail('');
    setCartItems([]);
    setCurrentPage('home');
    toast.success('Successfully signed out!');
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      if (config.useSupabase) {
        // Save to Supabase backend
        const newProduct = await productsService.create(product);
        setProducts((prev) => [...prev, newProduct]);
        toast.success('Product added successfully!');
      } else {
        // Fallback to local state only
        const newId = (Math.max(...products.map(p => parseInt(p.id)), 0) + 1).toString();
        const newProduct = { ...product, id: newId };
        setProducts((prev) => {
          // Recalculate ID based on current state to avoid duplicates
          const maxId = Math.max(...prev.map(p => parseInt(p.id)), 0);
          const safeId = (maxId + 1).toString();
          return [...prev, { ...product, id: safeId }];
        });
        toast.success('Product added to local state');
      }
    } catch (error) {
      console.error('Failed to add product to backend:', error);
      // Fallback to local state
      const newId = (Math.max(...products.map(p => parseInt(p.id)), 0) + 1).toString();
      const newProduct = { ...product, id: newId };
      setProducts((prev) => [...prev, newProduct]);
      toast.warning('Product added locally (backend sync failed)');
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      if (config.useSupabase) {
        // Update in Supabase backend
        await productsService.update(id, updates);
        setProducts((prev) =>
          prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
        );
        toast.success('Product updated successfully!');
      } else {
        // Fallback to local state only
        setProducts((prev) =>
          prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
        );
      }
    } catch (error) {
      console.error('Failed to update product in backend:', error);
      // Fallback to local state
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
      );
      toast.warning('Product updated locally (backend sync failed)');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      if (config.useSupabase) {
        console.log('🗑️ Deleting product from backend:', id);
        // Hard delete from Supabase backend (permanent removal)
        await productsService.hardDelete(id);
        setProducts((prev) => prev.filter((product) => product.id !== id));
        toast.success('Product deleted successfully from backend!');
      } else {
        // Fallback to local state only
        setProducts((prev) => prev.filter((product) => product.id !== id));
        toast.success('Product deleted locally!');
      }
    } catch (error) {
      console.error('❌ Failed to delete product from backend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // Still remove from local state
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast.error(`Backend sync failed: ${errorMessage}. Product deleted locally only.`);
    }
  };

  const handleCreateSale = (productId: string, discountPercent: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === productId) {
          const originalPrice = product.originalPrice || product.price;
          const newPrice = originalPrice * (1 - discountPercent / 100);
          return { ...product, originalPrice, price: newPrice };
        }
        return product;
      })
    );
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    const product = cartItems.find((item) => item.id === productId);
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    toast.success(`${product?.name} removed from cart`);
  };

  const handleLoginPrompt = () => {
    setShowLoginDialog(true);
  };

  const handleNavigate = (page: 'home' | 'about' | 'contact' | 'cart' | 'checkout' | 'privacy' | 'returns' | 'orders' | 'wishlist' | 'account' | 'admin') => {
    setCurrentPage(page);
  };

  const handleProductClick = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setCurrentPage('product-detail');
    }
  };

  const handleBuyNow = (productId: string) => {
    setCurrentPage('checkout');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setCurrentPage('home');
  };

  const handleAddToWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && !wishlistItems.find((item) => item.id === productId)) {
      setWishlistItems((prev) => [...prev, product]);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    const product = wishlistItems.find((item) => item.id === productId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    if (product) {
      toast.success(`${product.name} removed from wishlist`);
    }
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    toast.success('Thank you for your order!');
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setCurrentPage('home');
      toast.info(`Searching for "${searchQuery}"`);
    }
  };

  const handleCategoryChange = (category: 'all' | 'baby' | 'pharmaceutical') => {
    setSelectedCategory(category);
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setCurrentPage('home');
  };

  const handleCategorySelect = (categoryId: string, subcategoryId?: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(subcategoryId || null);
    
    // Determine main category based on categoryId
    const category = PRODUCT_CATEGORIES.find(pc => 
      pc.categories.some(c => c.id === categoryId)
    );
    
    if (category) {
      setSelectedCategory(category.id as 'baby' | 'pharmaceutical');
    }
    
    setCurrentPage('home');
    toast.success(`Browsing ${subcategoryId ? 'subcategory' : 'category'}`);
  };

  const handleBreadcrumbNavigate = (
    category: 'all' | 'baby' | 'pharmaceutical',
    categoryId: string | null = null,
    subcategoryId: string | null = null
  ) => {
    setSelectedCategory(category);
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(subcategoryId);
    setCurrentPage('home');
  };

  const filteredProducts = products.filter((product) => {
    // Filter by main category
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Filter by specific categoryId if set
    const matchesCategoryId = !selectedCategoryId || product.categoryId === selectedCategoryId;
    
    // Filter by subcategoryId if set
    const matchesSubcategoryId = !selectedSubcategoryId || product.subcategoryId === selectedSubcategoryId;
    
    // Filter by search query
    const matchesSearch = !searchQuery.trim() || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesCategoryId && matchesSubcategoryId && matchesSearch;
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginDialog(true)}
        onLogout={handleLogout}
        cartCount={cartCount}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCategoryBrowser={() => setShowCategoryBrowser(true)}
      />

      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'privacy' && <PrivacyPolicyPage />}
      {currentPage === 'returns' && <ReturnPolicyPage />}
      {currentPage === 'orders' && (
        isLoggedIn ? (
          <OrdersPage onProductClick={handleProductClick} />
        ) : (
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-[#003366] mb-2">Sign in to view your orders</h2>
              <p className="text-gray-600 mb-6">You must be signed in to access this page</p>
              <button
                onClick={handleLoginPrompt}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-6 py-2 rounded transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )
      )}
      {currentPage === 'wishlist' && (
        isLoggedIn ? (
          <WishlistPage
            wishlistItems={wishlistItems}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        ) : (
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-[#003366] mb-2">Sign in to view your wishlist</h2>
              <p className="text-gray-600 mb-6">You must be signed in to access this page</p>
              <button
                onClick={handleLoginPrompt}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-6 py-2 rounded transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )
      )}
      {currentPage === 'account' && (
        isLoggedIn ? (
          <AccountPage
            onNavigateToOrders={() => handleNavigate('orders')}
            onNavigateToWishlist={() => handleNavigate('wishlist')}
            isAdmin={isAdmin}
            onNavigateToAdmin={() => handleNavigate('admin')}
          />
        ) : (
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-[#003366] mb-2">Sign in to view your account</h2>
              <p className="text-gray-600 mb-6">You must be signed in to access this page</p>
              <button
                onClick={handleLoginPrompt}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-6 py-2 rounded transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )
      )}
      {currentPage === 'admin' && (
        isAdmin ? (
          <AdminPage
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onCreateSale={handleCreateSale}
          />
        ) : (
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-[#003366] mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-6">You need admin privileges to access this page</p>
              <button
                onClick={() => handleNavigate('home')}
                className="bg-[#003366] hover:bg-[#004488] text-white px-6 py-2 rounded transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )
      )}
      {currentPage === 'cart' && (
        <CartPage
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage
          cartItems={cartItems}
          onNavigate={handleNavigate}
          onOrderComplete={handleOrderComplete}
        />
      )}
      {currentPage === 'product-detail' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          isLoggedIn={isLoggedIn}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onBack={handleBackToProducts}
          onLoginPrompt={handleLoginPrompt}
        />
      )}

      {currentPage === 'home' && (
        <main className="max-w-[1500px] mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <CategoryBreadcrumb
            selectedCategory={selectedCategory}
            selectedCategoryId={selectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            onNavigate={handleBreadcrumbNavigate}
          />

          {/* Banner */}
          <div className="bg-gradient-to-r from-[#003366] to-[#0055AA] text-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="mb-2 text-white">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Welcome to Nex-Gen Shipping'}
                </h1>
                <p className="text-blue-100 text-sm md:text-base">
                  Your trusted source for baby products and pharmaceuticals
                </p>
              </div>
              {!isLoggedIn && (
                <button
                  onClick={() => setShowLoginDialog(true)}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-4 md:px-6 py-2 rounded transition-colors font-semibold whitespace-nowrap"
                >
                  Sign in to see prices
                </button>
              )}
            </div>
          </div>

          {/* Featured Products - Only show when not searching and no specific category/subcategory */}
          {!searchQuery && selectedCategory === 'all' && !selectedCategoryId && !selectedSubcategoryId && (
            <FeaturedSection
              products={products}
              isLoggedIn={isLoggedIn}
              onAddToCart={handleAddToCart}
              onLoginPrompt={handleLoginPrompt}
              onProductClick={handleProductClick}
            />
          )}

          {/* Category indicator */}
          <div className="mb-4">
            <h2 className="text-[#003366]">
              {(() => {
                if (selectedSubcategoryId) {
                  // Find the subcategory name
                  const category = PRODUCT_CATEGORIES.flatMap(pc => pc.categories).find(c => c.id === selectedCategoryId);
                  const subcategory = category?.subcategories?.find(sc => sc.id === selectedSubcategoryId);
                  return subcategory?.name || 'Products';
                } else if (selectedCategoryId) {
                  // Find the category name
                  const category = PRODUCT_CATEGORIES.flatMap(pc => pc.categories).find(c => c.id === selectedCategoryId);
                  return category?.name || 'Products';
                } else if (selectedCategory === 'all') {
                  return 'All Products';
                } else if (selectedCategory === 'baby') {
                  return 'Baby Products';
                } else if (selectedCategory === 'pharmaceutical') {
                  return 'Pharmaceuticals';
                }
                return 'Products';
              })()}
              <span className="text-gray-600 ml-2">
                ({filteredProducts.length} items)
              </span>
            </h2>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoggedIn={isLoggedIn}
                onAddToCart={handleAddToCart}
                onLoginPrompt={handleLoginPrompt}
                onProductClick={handleProductClick}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600 mb-2">No products found matching your search.</p>
              <p className="text-sm text-gray-500">Try a different search term or browse all products.</p>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#003366] text-white mt-12">
        <div className="max-w-[1500px] mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="mb-4">
                <img 
                  src={logoImage} 
                  alt="NEX-GEN Shipping Company" 
                  className="h-16 w-auto mb-3"
                />
                <p className="text-sm text-blue-200 italic">
                  Your trusted partner in health and wellness
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li 
                  onClick={() => {
                    setSelectedCategory('baby');
                    setCurrentPage('home');
                  }}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  Baby Products
                </li>
                <li 
                  onClick={() => {
                    setSelectedCategory('pharmaceutical');
                    setCurrentPage('home');
                  }}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  Pharmaceuticals
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li 
                  onClick={() => handleNavigate('contact')}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  Contact Us
                </li>
                <li 
                  onClick={() => handleNavigate('about')}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  About Us
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Legal & Policies</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li 
                  onClick={() => handleNavigate('privacy')}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  Privacy Policy
                </li>
                <li 
                  onClick={() => handleNavigate('returns')}
                  className="hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  Return Policy
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-6">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-blue-200 mb-4">
              <span 
                onClick={() => handleNavigate('privacy')}
                className="hover:underline cursor-pointer hover:text-white transition-colors"
              >
                Privacy Policy
              </span>
              <span 
                onClick={() => handleNavigate('returns')}
                className="hover:underline cursor-pointer hover:text-white transition-colors"
              >
                Return Policy
              </span>
            </div>
            <p className="text-center text-xs md:text-sm text-blue-200">&copy; 2025 Nex-Gen Shipping Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />

      {/* Category Browser Dialog */}
      <Dialog open={showCategoryBrowser} onOpenChange={setShowCategoryBrowser}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Shop by Category</DialogTitle>
          <CategoryBrowser
            onCategorySelect={handleCategorySelect}
            onClose={() => setShowCategoryBrowser(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Toaster position="top-right" />
    </div>
  );
}