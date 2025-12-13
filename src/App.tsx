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
import { toast } from 'sonner';
import { productsService } from './utils/productsService';
import { cartService } from './utils/cartService';
import { wishlistService } from './utils/wishlistService';
import { config } from './utils/config';
import { Currency, getUserCurrency, setUserCurrency, convertCurrency, formatCurrency, updateExchangeRates } from './utils/currencyService';
import { authService } from './utils/authService';
import logoImage from './assets/nexgen-logo-new.png';

// Unused image imports - kept for reference only
/* 
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
import babyBoyShirtImage from 'figma:asset/71e60a7df11f5c5e9d9fd1d2e0e7a0df7eb6e55d.png';
*/

interface CartItem extends Product {
  quantity: number;
}

/* Unused - kept for reference
const _MOCK_PRODUCTS: Product[] = [
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
*/

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [_userEmail, setUserEmail] = useState<string>('');
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'baby' | 'pharmaceutical'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'cart' | 'checkout' | 'privacy' | 'returns' | 'product-detail' | 'orders' | 'wishlist' | 'account' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(getUserCurrency());

  // Handle currency change
  const handleCurrencyChange = (currency: Currency) => {
    setUserCurrency(currency);
    setSelectedCurrencyState(currency);
  };

  // Initialize exchange rates on app load
  useEffect(() => {
    updateExchangeRates().catch(console.error);
  }, []);

  // Check for existing auth session on mount and listen for changes
  useEffect(() => {
    const checkSession = async () => {
      if (!config.useSupabase) return;

      const user = await authService.getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
        
        // Check admin status
        const isAdmin = await authService.isAdmin();
        setIsAdmin(isAdmin);
        
        // Load user's first name from profile
        try {
          const { supabase } = await import('./utils/supabaseClient');
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.first_name) {
            setUserFirstName(profile.first_name);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
        
        // Load user's cart and wishlist from database
        await loadUserCartAndWishlist(user.id);
        
        if (config.debugMode) {
          console.log('✅ Session restored:', user.email);
        }
      }
    };

    checkSession();

    // Listen for Supabase auth state changes
    const subscription = authService.onAuthStateChange(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
        
        // Check admin status
        const isAdmin = await authService.isAdmin();
        setIsAdmin(isAdmin);
        
        // Load user's first name
        try {
          const { supabase } = await import('./utils/supabaseClient');
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.first_name) {
            setUserFirstName(profile.first_name);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
        
        // Load cart and wishlist when user logs in
        await loadUserCartAndWishlist(user.id);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserFirstName('');
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load products from Supabase on app startup
  useEffect(() => {
    const loadProducts = async () => {
      if (!productsLoaded) {
        try {
          const supabaseProducts = await productsService.getAll();
          // Always set products from Supabase, even if empty array
          setProducts(supabaseProducts);
          if (config.debugMode) {
            console.log(`✅ Loaded ${supabaseProducts.length} products from Supabase`);
          }
          if (supabaseProducts.length === 0) {
            console.log('ℹ️ No products in Supabase database');
          }
        } catch (error) {
          console.error('Failed to load products from Supabase:', error);
          toast.error('Failed to load products from database');
          // Set empty array on error instead of falling back to mock data
          setProducts([]);
        } finally {
          setProductsLoaded(true);
        }
      }
    };

    loadProducts();
  }, [productsLoaded]);

  // Load cart and wishlist from database
  const loadUserCartAndWishlist = async (userId: string) => {
    try {
      console.log('🛒 Loading cart and wishlist from database...');
      
      // Load cart items
      const cartData = await cartService.getAll(userId);
      const mappedCart: CartItem[] = cartData.map(item => ({
        id: item.product_id,
        name: item.product?.name || 'Unknown Product',
        price: item.product?.price || 0,
        image: item.product?.image_url || '',
        category: (item.product?.category as 'baby' | 'pharmaceutical') || 'pharmaceutical',
        rating: 0,
        reviewCount: 0,
        inStock: true,
        quantity: item.quantity
      }));
      setCartItems(mappedCart);

      // Load wishlist items
      const wishlistData = await wishlistService.getAll(userId);
      const mappedWishlist = wishlistData.map(item => ({
        id: item.product_id,
        name: item.product?.name || 'Unknown Product',
        price: item.product?.price || 0,
        image: item.product?.image_url || '',
        category: item.product?.category as 'baby' | 'pharmaceutical' || 'pharmaceutical',
        rating: item.product?.rating || 0,
        reviewCount: item.product?.review_count || 0,
        inStock: item.product?.in_stock ?? true
      }));
      setWishlistItems(mappedWishlist);

      console.log(`✅ Loaded ${mappedCart.length} cart items and ${mappedWishlist.length} wishlist items`);
    } catch (error) {
      console.error('❌ Failed to load cart/wishlist:', error);
      toast.error('Failed to load your cart and wishlist');
    }
  };

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
    setUserFirstName('');
    setCartItems([]);
    setWishlistItems([]);
    setCurrentPage('home');
    toast.success('Successfully signed out!');
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      console.log('➕ Adding product to backend...');
      const newProduct = await productsService.create(product);
      setProducts((prev) => [...prev, newProduct]);
      toast.success('Product added successfully!');
      console.log('✅ Product added:', newProduct.id);
    } catch (error) {
      console.error('❌ Failed to add product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to add product: ${errorMessage}`);
    }
  };

  const handleBulkImport = async (products: Omit<Product, 'id'>[]) => {
    try {
      console.log(`📦 Bulk importing ${products.length} products...`);
      const count = await productsService.bulkImport(products);
      
      // Reload all products from backend to ensure sync
      const updatedProducts = await productsService.getAll();
      setProducts(updatedProducts);
      
      toast.success(`Successfully imported ${count} products!`);
      console.log(`✅ Bulk imported ${count} products`);
      return count;
    } catch (error) {
      console.error('❌ Failed to bulk import products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to bulk import: ${errorMessage}`);
      throw error;
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      console.log('📝 Updating product in backend:', id);
      await productsService.update(id, updates);
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
      );
      toast.success('Product updated successfully!');
      console.log('✅ Product updated:', id);
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update product: ${errorMessage}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      console.log('🗑️ Deleting product from backend:', id);
      await productsService.hardDelete(id);
      
      // Reload products from backend to ensure sync
      console.log('🔄 Reloading products from backend...');
      const updatedProducts = await productsService.getAll();
      setProducts(updatedProducts);
      
      toast.success('Product deleted successfully!');
      console.log(`✅ Products reloaded: ${updatedProducts.length} items in database`);
      
      if (updatedProducts.length === 0) {
        console.log('ℹ️ No products left in database');
      }
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete product: ${errorMessage}`);
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

  const handleAddToCart = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
      // If logged in, save to database
      if (isLoggedIn && config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          await cartService.addItem(user.id, productId, 1);
          console.log('✅ Cart item synced to database');
        }
      }

      // Update local state
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
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      // If logged in, update in database
      if (isLoggedIn && config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          const cartData = await cartService.getAll(user.id);
          const cartItem = cartData.find(item => item.product_id === productId);
          if (cartItem) {
            await cartService.updateQuantity(cartItem.id, quantity);
            console.log('✅ Cart quantity synced to database');
          }
        }
      }

      // Update local state
      setCartItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error('❌ Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const product = cartItems.find((item) => item.id === productId);
    
    try {
      // If logged in, remove from database
      if (isLoggedIn && config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          const cartData = await cartService.getAll(user.id);
          const cartItem = cartData.find(item => item.product_id === productId);
          if (cartItem) {
            await cartService.removeItem(cartItem.id);
            console.log('✅ Cart item removed from database');
          }
        }
      }

      // Update local state
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      toast.success(`${product?.name} removed from cart`);
    } catch (error) {
      console.error('❌ Failed to remove item:', error);
      toast.error('Failed to remove item from cart');
    }
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

  const handleBuyNow = (_productId: string) => {
    setCurrentPage('checkout');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setCurrentPage('home');
  };

  /* Unused - wishlist handled elsewhere
  const _handleAddToWishlist = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    if (wishlistItems.find((item) => item.id === productId)) {
      toast.info('Item already in wishlist');
      return;
    }

    try {
      // If logged in, save to database
      if (isLoggedIn && config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          await wishlistService.addItem(user.id, productId);
          console.log('✅ Wishlist item synced to database');
        }
      }

      // Update local state
      setWishlistItems((prev) => [...prev, product]);
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      console.error('❌ Failed to add to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };
  */

  const handleRemoveFromWishlist = async (productId: string) => {
    const product = wishlistItems.find((item) => item.id === productId);
    
    try {
      // If logged in, remove from database
      if (isLoggedIn && config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          await wishlistService.removeByProductId(user.id, productId);
          console.log('✅ Wishlist item removed from database');
        }
      }

      // Update local state
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      if (product) {
        toast.success(`${product.name} removed from wishlist`);
      }
    } catch (error) {
      console.error('❌ Failed to remove from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleOrderComplete = async () => {
    try {
      // If logged in, clear cart from database
      if (isLoggedIn && config.useSupabase) {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          await cartService.clearCart(user.id);
          console.log('✅ Cart cleared from database after order');
        }
      }

      // Clear local state
      setCartItems([]);
      toast.success('Thank you for your order!');
    } catch (error) {
      console.error('❌ Failed to clear cart:', error);
      // Still clear local cart even if database clear fails
      setCartItems([]);
      toast.success('Thank you for your order!');
    }
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
        userFirstName={userFirstName}
        onLoginClick={() => setShowLoginDialog(true)}
        onLogout={handleLogout}
        cartCount={cartCount}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => handleCategoryChange(category as 'all' | 'baby' | 'pharmaceutical')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCategoryBrowser={() => setShowCategoryBrowser(true)}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
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
            onBulkImport={handleBulkImport}
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
          selectedCurrency={selectedCurrency}
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage
          cartItems={cartItems}
          onNavigate={handleNavigate}
          onOrderComplete={handleOrderComplete}
          selectedCurrency={selectedCurrency}
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
          selectedCurrency={selectedCurrency}
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
                selectedCurrency={selectedCurrency}
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