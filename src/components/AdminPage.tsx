import { useState } from 'react';
import { Product } from './ProductCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Plus, Edit, Trash2, Package, Tag, TrendingUp, Percent, Search, Filter, Upload, Download, FileUp, CheckCircle2, AlertCircle, XCircle, Link2, Image, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { SupabaseStatus } from './SupabaseStatus';
import { DataManagementPanel } from './DataManagementPanel';
import { UserManagementPanel } from './UserManagementPanel';

interface AdminPageProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onCreateSale: (productId: string, discountPercent: number) => void;
}

export function AdminPage({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreateSale,
}: AdminPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saleProduct, setSaleProduct] = useState<Product | null>(null);
  const [discountPercent, setDiscountPercent] = useState('10');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'baby' | 'pharmaceutical'>('all');

  // CSV Upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvWarnings, setCsvWarnings] = useState<string[]>([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  // Bulk Delete state
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleteAction, setBulkDeleteAction] = useState<'baby' | 'pharmaceutical' | 'purge' | null>(null);

  // Image upload state
  const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
  const [editImageInputType, setEditImageInputType] = useState<'url' | 'file'>('url');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'baby' as 'baby' | 'pharmaceutical',
    categoryId: 'apparel-accessories',
    price: '',
    costPrice: '',
    stockCount: '',
    soldCount: '0',
    rating: '4.5',
    reviewCount: '100',
    image: '',
    inStock: true,
    badge: 'none' as 'none' | 'Best Seller' | 'Top Rated' | 'New' | 'Standard',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, image: dataUrl });
      } else {
        setNewProduct({ ...newProduct, image: dataUrl });
      }
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productToAdd = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      costPrice: newProduct.costPrice ? parseFloat(newProduct.costPrice) : undefined,
      stockCount: newProduct.stockCount ? parseInt(newProduct.stockCount) : undefined,
      soldCount: parseInt(newProduct.soldCount) || 0,
      rating: parseFloat(newProduct.rating),
      reviewCount: parseInt(newProduct.reviewCount),
      image: convertDropboxUrl(newProduct.image), // Auto-convert Dropbox URLs
      badge: newProduct.badge === 'none' ? undefined : newProduct.badge,
    };

    onAddProduct(productToAdd);
    toast.success('Product added successfully!');
    setIsAddDialogOpen(false);
    setImageInputType('url');
    setNewProduct({
      name: '',
      description: '',
      category: 'baby',
      categoryId: 'apparel-accessories',
      price: '',
      costPrice: '',
      stockCount: '',
      soldCount: '0',
      rating: '4.5',
      reviewCount: '100',
      image: '',
      inStock: true,
      badge: 'none',
    });
  };

  const handleUpdateBadge = (product: Product, badge: 'Best Seller' | 'Top Rated' | 'New' | 'none') => {
    onUpdateProduct(product.id, { badge: badge === 'none' ? undefined : badge });
    toast.success(`Badge updated for ${product.name}`);
  };

  const handleCreateSale = () => {
    if (!saleProduct) return;

    const discount = parseFloat(discountPercent);
    if (discount <= 0 || discount >= 100) {
      toast.error('Discount must be between 0 and 100%');
      return;
    }

    onCreateSale(saleProduct.id, discount);
    toast.success(`Sale created: ${discount}% off ${saleProduct.name}`);
    setIsSaleDialogOpen(false);
    setSaleProduct(null);
    setDiscountPercent('10');
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    if (!editingProduct.name || !editingProduct.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      onUpdateProduct(editingProduct.id, {
        name: editingProduct.name,
        category: editingProduct.category,
        categoryId: editingProduct.categoryId,
        price: editingProduct.price,
        rating: editingProduct.rating,
        reviewCount: editingProduct.reviewCount,
        image: convertDropboxUrl(editingProduct.image), // Auto-convert Dropbox URLs
        inStock: editingProduct.inStock,
        badge: editingProduct.badge,
      });

      toast.success('Product updated successfully!');
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleOpenEditDialog = (product: Product) => {
    try {
      setEditingProduct({ ...product });
      setEditImageInputType('url');
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      toast.error('Failed to open edit dialog');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDeleteProduct(product.id);
      toast.success('Product deleted successfully');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      // Baby categories
      'apparel-accessories': 'Apparel and Accessories',
      'baby-feeding': 'Baby Feeding',
      'baby-toys-entertainment': 'Baby Toys & Entertainment',
      // Pharmaceutical categories
      'cold-cough-allergy-sinus': 'Cold, Cough, Allergy & Sinus',
      'rubs-ointments': 'Rubs & Ointments',
      'medicine-eye-care-first-aid': 'Medicine, Eye Care & First Aid',
      'condom-accessories': 'Condom & Accessories',
      'energy-tabs-vitamins': 'Energy Tabs & Vitamins',
      'dental-care': 'Dental Care',
      'feminine-care': 'Feminine Care',
      'pest-control-repellant': 'Pest Control & Repellant',
      'stomach-meds': 'Stomach Meds',
      'otc-medicines': 'OTC Medicines',
      'lip-care': 'Lip Care',
    };
    return categories[categoryId] || categoryId;
  };

  // Convert Dropbox URLs to direct download format
  const convertDropboxUrl = (url: string): string => {
    if (!url || !url.includes('dropbox.com')) {
      return url;
    }
    
    // Convert preview links to direct download links
    // From: https://www.dropbox.com/scl/fi/xxx?rlkey=xxx&st=xxx&dl=0
    // To:   https://www.dropbox.com/scl/fi/xxx?rlkey=xxx&st=xxx&dl=1&raw=1
    let convertedUrl = url;
    
    // Replace any dl= value (dl=0, dl=1, dl=2, etc.) with dl=1
    if (convertedUrl.includes('dl=')) {
      convertedUrl = convertedUrl.replace(/dl=\d+/g, 'dl=1');
    } else {
      // Add dl=1 if not present
      convertedUrl += (convertedUrl.includes('?') ? '&' : '?') + 'dl=1';
    }
    
    // Add raw=1 for direct image serving
    if (!convertedUrl.includes('raw=1')) {
      convertedUrl += '&raw=1';
    }
    
    return convertedUrl;
  };

  // CSV Upload Functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    setShowCsvPreview(false);
    setCsvData([]);
    setCsvErrors([]);
    setCsvWarnings([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvData(text);
    };
    reader.readAsText(file);
  };

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    
    return result;
  };

  // Duplicate detection function
  const detectDuplicates = (csvProducts: any[], existingProducts: Product[]) => {
    const existing = existingProducts.map(p => p.name.toLowerCase().trim());
    const duplicates: string[] = [];
    const unique: any[] = [];
    const seenInCsv = new Set<string>();
    
    csvProducts.forEach((product, index) => {
      const name = product.name.toLowerCase().trim();
      const rowNum = index + 2; // Account for header row
      
      if (existing.includes(name)) {
        duplicates.push(`   Row ${rowNum}: "${product.name}" - already exists in catalog`);
      } else if (seenInCsv.has(name)) {
        duplicates.push(`   Row ${rowNum}: "${product.name}" - duplicated within this CSV`);
      } else {
        unique.push(product);
        seenInCsv.add(name);
      }
    });
    
    return { unique, duplicates };
  };

  const parseCsvData = (csvText: string) => {
    setIsProcessingCsv(true);
    const errors: string[] = [];
    const warnings: string[] = [];
    const infos: string[] = [];
    const parsedData: any[] = [];

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        errors.push('CSV file must contain a header row and at least one data row');
        setCsvErrors(errors);
        setCsvWarnings([]);
        setIsProcessingCsv(false);
        return;
      }

      const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

      // Validate ONLY the absolute minimum required header (name)
      const requiredHeaders = ['name'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        errors.push(`Missing required column: "name"`);
        errors.push('Note: Only "name" is required. All other fields (including price) will use smart defaults.');
        setCsvErrors(errors);
        setCsvWarnings([]);
        setIsProcessingCsv(false);
        return;
      }
      
      // Warn if price column is missing
      if (!headers.includes('price')) {
        warnings.push('⚠️ Price column not found - all products will use default price ($9.99)');
      }

      // Parse each data row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = parseCsvLine(line);
        const row: any = {};

        headers.forEach((header, index) => {
          let value = values[index] || '';
          // Remove surrounding quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          row[header] = value.trim();
        });

        // Validate and transform the row
        const rowErrors: string[] = [];

        // Validate name (ONLY REQUIRED FIELD)
        if (!row.name || row.name.trim() === '') {
          rowErrors.push(`Row ${i + 1}: Missing product name (required)`);
        }

        // Price with smart default
        let price = 9.99; // Default price
        if (row.price) {
          const parsedPrice = parseFloat(row.price);
          if (!isNaN(parsedPrice) && parsedPrice > 0) {
            price = parsedPrice;
          } else {
            warnings.push(`Row ${i + 1}: Invalid price '${row.price}', using default ($9.99)`);
          }
        }

        // Smart category detection with defaults
        const validCategoryIds = [
          // Baby categories
          'apparel-accessories', 'baby-feeding', 'baby-toys-entertainment',
          // Pharmaceutical categories
          'cold-cough-allergy-sinus', 'rubs-ointments', 'medicine-eye-care-first-aid',
          'condom-accessories', 'energy-tabs-vitamins', 'dental-care', 'feminine-care',
          'pest-control-repellant', 'stomach-meds', 'otc-medicines', 'lip-care'
        ];
        
        let category = 'baby'; // Default category
        let categoryId = 'apparel-accessories'; // Default subcategory
        
        // Try to use provided categoryId first
        if (row.categoryid && validCategoryIds.includes(row.categoryid.toLowerCase())) {
          categoryId = row.categoryid.toLowerCase();
          // Infer category from categoryId
          category = categoryId.startsWith('baby') ? 'baby' : 'pharmaceutical';
        }
        // Otherwise try to use provided category
        else if (row.category && ['baby', 'pharmaceutical'].includes(row.category.toLowerCase())) {
          category = row.category.toLowerCase();
          // Set default categoryId based on category
          categoryId = category === 'baby' ? 'apparel-accessories' : 'cold-cough-allergy-sinus';
          if (row.categoryid) {
            warnings.push(`Row ${i + 1}: Invalid categoryId '${row.categoryid}', using default '${categoryId}' for ${category} category`);
          }
        }
        // Use defaults and warn
        else {
          if (row.category || row.categoryid) {
            warnings.push(`Row ${i + 1}: Invalid category/categoryId values, using defaults (baby / baby-clothing-accessories)`);
          }
        }
        
        row.category = category;
        row.categoryid = categoryId;

        // Transform optional fields with smart defaults
        const description = row.description || '';
        
        // Rating with default
        let rating = 4.5;
        if (row.rating) {
          rating = parseFloat(row.rating);
          if (isNaN(rating) || rating < 0 || rating > 5) {
            warnings.push(`Row ${i + 1}: Invalid rating, using default (4.5)`);
            rating = 4.5;
          }
        }
        
        // Review count with default
        let reviewCount = 100;
        if (row.reviewcount) {
          reviewCount = parseInt(row.reviewcount);
          if (isNaN(reviewCount) || reviewCount < 0) {
            warnings.push(`Row ${i + 1}: Invalid review count, using default (100)`);
            reviewCount = 100;
          }
        }
        
        // InStock with default
        const inStock = row.instock?.toLowerCase() === 'true' || row.instock === '1' || !row.instock;
        
        // Badge with default - now includes "Standard"
        const validBadges = ['Best Seller', 'Top Rated', 'New', 'Standard'];
        let badge = 'Standard';
        
        if (row.badge) {
          if (row.badge.toLowerCase() === 'default') {
            badge = 'Standard';
          } else if (validBadges.includes(row.badge)) {
            badge = row.badge;
          } else {
            badge = 'Standard';
            warnings.push(`Row ${i + 1}: Invalid badge '${row.badge}', using 'Standard'`);
          }
        }
        
        // Transform analytics fields with validation
        let costPrice: number | undefined = undefined;
        if (row.costprice) {
          const parsed = parseFloat(row.costprice);
          if (!isNaN(parsed) && parsed >= 0) {
            costPrice = parsed;
          } else {
            warnings.push(`Row ${i + 1}: Invalid costPrice '${row.costprice}', skipping`);
          }
        }
        
        let stockCount: number | undefined = undefined;
        if (row.stockcount) {
          const parsed = parseInt(row.stockcount);
          if (!isNaN(parsed) && parsed >= 0) {
            stockCount = parsed;
          } else {
            warnings.push(`Row ${i + 1}: Invalid stockCount '${row.stockcount}', skipping`);
          }
        }
        
        let soldCount = 0;
        if (row.soldcount) {
          const parsed = parseInt(row.soldcount);
          if (!isNaN(parsed) && parsed >= 0) {
            soldCount = parsed;
          } else {
            warnings.push(`Row ${i + 1}: Invalid soldCount '${row.soldcount}', using default (0)`);
          }
        }
        
        // Image - Support Dropbox URLs and convert to direct download format
        let image = row.image || '';
        if (image) {
          image = convertDropboxUrl(image);
        }

        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
        } else {
          parsedData.push({
            name: row.name,
            description: description,
            category: row.category,
            categoryId: row.categoryid.toLowerCase(),
            price: price,
            costPrice: costPrice,
            stockCount: stockCount,
            soldCount: soldCount,
            rating: rating,
            reviewCount: reviewCount,
            image: image,
            inStock: inStock,
            badge: badge,
          });
        }
      }

      // Detect duplicates
      const duplicateInfo = detectDuplicates(parsedData, products);
      const uniqueProducts = duplicateInfo.unique;
      
      // Add duplicate warnings
      if (duplicateInfo.duplicates.length > 0) {
        warnings.push('');
        warnings.push(`⚠️ DUPLICATES DETECTED (${duplicateInfo.duplicates.length}):`);
        warnings.push(...duplicateInfo.duplicates);
        warnings.push('');
        warnings.push('Duplicate products will be SKIPPED during import.');
      }

      // Store errors and warnings separately
      setCsvData(uniqueProducts);
      setCsvErrors(errors);
      setCsvWarnings(warnings);
      
      if (uniqueProducts.length > 0 && errors.length === 0) {
        setShowCsvPreview(true);
        if (duplicateInfo.duplicates.length > 0) {
          toast.success(`Parsed ${uniqueProducts.length} products (${duplicateInfo.duplicates.length} duplicates will be skipped)`);
        } else if (warnings.length > 0) {
          toast.success(`Parsed ${uniqueProducts.length} products with ${warnings.length} warning(s)`);
        } else {
          toast.success(`Successfully parsed ${uniqueProducts.length} products`);
        }
      } else if (errors.length > 0) {
        toast.error(`Found ${errors.length} blocking error(s) - cannot import`);
      }
    } catch (error) {
      errors.push('Failed to parse CSV file. Please check the format.');
      setCsvErrors(errors);
      setCsvWarnings([]);
      toast.error('Failed to parse CSV file');
    }

    setIsProcessingCsv(false);
  };

  const handleBulkImport = () => {
    if (csvData.length === 0) {
      toast.error('No valid products to import');
      return;
    }

    let successCount = 0;
    csvData.forEach((product) => {
      try {
        onAddProduct(product);
        successCount++;
      } catch (error) {
        console.error('Error adding product:', error);
      }
    });

    toast.success(`Successfully imported ${successCount} products!`);
    setCsvFile(null);
    setCsvData([]);
    setCsvErrors([]);
    setCsvWarnings([]);
    setShowCsvPreview(false);

    // Reset file input
    const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = `name,description,category,categoryId,price,costPrice,stockCount,soldCount,rating,reviewCount,image,inStock,badge
Baby Onesie,Soft cotton onesie for newborns,baby,apparel-accessories,12.99,6.50,150,87,4.5,150,https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400,true,Best Seller
Infant Formula,Nutritious formula for babies 0-12 months,baby,baby-feeding,24.99,15.00,200,123,4.8,200,https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400,true,Standard
Cold Medicine,Fast relief for cold and flu symptoms,pharmaceutical,cold-cough-allergy-sinus,8.99,4.25,300,456,4.6,180,https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400,true,
Baby Toy Set,Colorful educational toys,baby,baby-toys-entertainment,19.99,10.00,100,45,4.7,89,https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400,true,New
Dental Floss,Mint flavored dental floss,pharmaceutical,dental-care,3.99,1.50,500,234,4.8,156,https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400,true,
Product Name Only Example - All Other Fields Optional!,,,,,,,,,,,`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const handleBulkDelete = (action: 'baby' | 'pharmaceutical' | 'purge') => {
    setBulkDeleteAction(action);
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!bulkDeleteAction) return;

    const productsToDelete = bulkDeleteAction === 'purge' 
      ? products
      : products.filter(p => p.category === bulkDeleteAction);

    if (productsToDelete.length === 0) {
      toast.error(`No ${bulkDeleteAction === 'purge' ? '' : bulkDeleteAction} products found to delete`);
      setIsBulkDeleteDialogOpen(false);
      return;
    }

    // Delete products one by one
    let successCount = 0;
    for (const product of productsToDelete) {
      try {
        await onDeleteProduct(product.id);
        successCount++;
      } catch (error) {
        console.error('Error deleting product:', product.id, error);
      }
    }

    const message = bulkDeleteAction === 'purge'
      ? `All ${successCount} products deleted`
      : `${successCount} ${bulkDeleteAction} product(s) deleted`;
    
    toast.success(message);
    setIsBulkDeleteDialogOpen(false);
    setBulkDeleteAction(null);
    
    // Force reload to ensure UI is in sync
    window.location.reload();
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#003366] mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage products, sales, and categories</p>
            </div>
            <SupabaseStatus />
          </div>
        </div>

        {/* Data Management Panel */}
        <div className="mb-6">
          <DataManagementPanel products={products} />
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-gray-100 p-2">
            <TabsTrigger value="products" className="flex-shrink-0">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex-shrink-0">
              <Tag className="h-4 w-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex-shrink-0">
              <Percent className="h-4 w-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="bulk-upload" className="flex-shrink-0">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="bulk-delete" className="flex-shrink-0">
              <Trash2 className="h-4 w-4 mr-2" />
              Bulk Delete
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-shrink-0">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Management</CardTitle>
                      <CardDescription>Add, edit, or remove products from your catalog</CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#DC143C] hover:bg-[#B01030]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Enter product description"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={newProduct.category}
                              onValueChange={(value: 'baby' | 'pharmaceutical') => {
                                setNewProduct({
                                  ...newProduct,
                                  category: value,
                                  categoryId: value === 'baby' ? 'baby-clothing-accessories' : 'cold-cough-allergy',
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="baby">Baby Products</SelectItem>
                                <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="subcategory">Subcategory *</Label>
                            <Select
                              value={newProduct.categoryId}
                              onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {newProduct.category === 'baby' ? (
                                  <>
                                    <SelectItem value="apparel-accessories">Apparel & Accessories</SelectItem>
                                    <SelectItem value="baby-feeding">Feeding</SelectItem>
                                    <SelectItem value="baby-toys-entertainment">Toys & Entertainment</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="cold-cough-allergy-sinus">Cold, Cough, Allergy & Sinus</SelectItem>
                                    <SelectItem value="rubs-ointments">Rubs & Ointments</SelectItem>
                                    <SelectItem value="medicine-eye-care-first-aid">Medicine, Eye Care & First Aid</SelectItem>
                                    <SelectItem value="condom-accessories">Condom & Accessories</SelectItem>
                                    <SelectItem value="energy-tabs-vitamins">Energy Tabs & Vitamins</SelectItem>
                                    <SelectItem value="dental-care">Dental Care</SelectItem>
                                    <SelectItem value="feminine-care">Feminine Care</SelectItem>
                                    <SelectItem value="pest-control-repellant">Pest Control & Repellant</SelectItem>
                                    <SelectItem value="stomach-meds">Stomach Meds</SelectItem>
                                    <SelectItem value="otc-medicines">OTC Medicines</SelectItem>
                                    <SelectItem value="lip-care">Lip Care</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="price">Sell Price ($) *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              placeholder="0.00"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="costPrice">Cost Price ($)</Label>
                            <Input
                              id="costPrice"
                              type="number"
                              step="0.01"
                              value={newProduct.costPrice}
                              onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                              placeholder="0.00"
                            />
                            <p className="text-xs text-gray-500">For profit tracking</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="stockCount">Stock Quantity</Label>
                            <Input
                              id="stockCount"
                              type="number"
                              value={newProduct.stockCount}
                              onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                              placeholder="0"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="soldCount">Units Sold</Label>
                            <Input
                              id="soldCount"
                              type="number"
                              value={newProduct.soldCount}
                              onChange={(e) => setNewProduct({ ...newProduct, soldCount: e.target.value })}
                              placeholder="0"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                              id="rating"
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={newProduct.rating}
                              onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="reviews">Review Count</Label>
                          <Input
                            id="reviews"
                            type="number"
                            value={newProduct.reviewCount}
                            onChange={(e) => setNewProduct({ ...newProduct, reviewCount: e.target.value })}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Product Image</Label>
                          <div className="flex gap-2 mb-2">
                            <Button
                              type="button"
                              variant={imageInputType === 'url' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setImageInputType('url')}
                              className={imageInputType === 'url' ? 'bg-[#003366]' : ''}
                            >
                              <Link2 className="h-4 w-4 mr-2" />
                              URL
                            </Button>
                            <Button
                              type="button"
                              variant={imageInputType === 'file' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setImageInputType('file')}
                              className={imageInputType === 'file' ? 'bg-[#003366]' : ''}
                            >
                              <Image className="h-4 w-4 mr-2" />
                              Upload File
                            </Button>
                          </div>
                          {imageInputType === 'url' ? (
                            <>
                              <Textarea
                                id="image"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                placeholder="Enter image URL or leave blank for placeholder"
                                rows={2}
                              />
                              <p className="text-sm text-gray-500">Use Unsplash URLs or figma:asset paths</p>
                            </>
                          ) : (
                            <>
                              <Input
                                id="image-file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, false)}
                                className="cursor-pointer"
                              />
                              <p className="text-sm text-gray-500">Upload an image from your device</p>
                            </>
                          )}
                          {newProduct.image && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 mb-2">Preview:</p>
                              <img 
                                src={newProduct.image} 
                                alt="Preview" 
                                className="h-20 w-20 object-cover rounded border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="badge">Badge (Optional)</Label>
                          <Select
                            value={newProduct.badge}
                            onValueChange={(value) => setNewProduct({ ...newProduct, badge: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="No badge" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Badge</SelectItem>
                              <SelectItem value="Best Seller">Best Seller</SelectItem>
                              <SelectItem value="Top Rated">Top Rated</SelectItem>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="inStock"
                            checked={newProduct.inStock}
                            onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="inStock" className="cursor-pointer">In Stock</Label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddProduct} className="bg-[#DC143C] hover:bg-[#B01030]">
                          Add Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Product Dialog */}
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      {editingProduct && (
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Product Name *</Label>
                            <Input
                              id="edit-name"
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              placeholder="Enter product name"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-category">Category *</Label>
                              <Select
                                value={editingProduct.category}
                                onValueChange={(value: 'baby' | 'pharmaceutical') => {
                                  setEditingProduct({
                                    ...editingProduct,
                                    category: value,
                                    categoryId: value === 'baby' ? 'baby-clothing-accessories' : 'cold-cough-allergy',
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="baby">Baby Products</SelectItem>
                                  <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="edit-subcategory">Subcategory *</Label>
                              <Select
                                value={editingProduct.categoryId}
                                onValueChange={(value) => setEditingProduct({ ...editingProduct, categoryId: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {editingProduct.category === 'baby' ? (
                                    <>
                                      <SelectItem value="apparel-accessories">Apparel & Accessories</SelectItem>
                                      <SelectItem value="baby-feeding">Feeding</SelectItem>
                                      <SelectItem value="baby-toys-entertainment">Toys & Entertainment</SelectItem>
                                    </>
                                  ) : (
                                    <>
                                      <SelectItem value="cold-cough-allergy-sinus">Cold, Cough, Allergy & Sinus</SelectItem>
                                      <SelectItem value="rubs-ointments">Rubs & Ointments</SelectItem>
                                      <SelectItem value="medicine-eye-care-first-aid">Medicine, Eye Care & First Aid</SelectItem>
                                      <SelectItem value="condom-accessories">Condom & Accessories</SelectItem>
                                      <SelectItem value="energy-tabs-vitamins">Energy Tabs & Vitamins</SelectItem>
                                      <SelectItem value="dental-care">Dental Care</SelectItem>
                                      <SelectItem value="feminine-care">Feminine Care</SelectItem>
                                      <SelectItem value="pest-control-repellant">Pest Control & Repellant</SelectItem>
                                      <SelectItem value="stomach-meds">Stomach Meds</SelectItem>
                                      <SelectItem value="otc-medicines">OTC Medicines</SelectItem>
                                      <SelectItem value="lip-care">Lip Care</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-price">Price ($) *</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="edit-rating">Rating</Label>
                              <Input
                                id="edit-rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={editingProduct.rating}
                                onChange={(e) => setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) || 0 })}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="edit-reviews">Reviews</Label>
                              <Input
                                id="edit-reviews"
                                type="number"
                                value={editingProduct.reviewCount}
                                onChange={(e) => setEditingProduct({ ...editingProduct, reviewCount: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label>Product Image</Label>
                            <div className="flex gap-2 mb-2">
                              <Button
                                type="button"
                                variant={editImageInputType === 'url' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setEditImageInputType('url')}
                                className={editImageInputType === 'url' ? 'bg-[#003366]' : ''}
                              >
                                <Link2 className="h-4 w-4 mr-2" />
                                URL
                              </Button>
                              <Button
                                type="button"
                                variant={editImageInputType === 'file' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setEditImageInputType('file')}
                                className={editImageInputType === 'file' ? 'bg-[#003366]' : ''}
                              >
                                <Image className="h-4 w-4 mr-2" />
                                Upload File
                              </Button>
                            </div>
                            {editImageInputType === 'url' ? (
                              <>
                                <Textarea
                                  id="edit-image"
                                  value={editingProduct.image}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                  placeholder="Enter image URL or leave blank for placeholder"
                                  rows={2}
                                />
                                <p className="text-sm text-gray-500">Use Unsplash URLs or figma:asset paths</p>
                              </>
                            ) : (
                              <>
                                <Input
                                  id="edit-image-file"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                  className="cursor-pointer"
                                />
                                <p className="text-sm text-gray-500">Upload an image from your device</p>
                              </>
                            )}
                            {editingProduct.image && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                                <img 
                                  src={editingProduct.image} 
                                  alt="Preview" 
                                  className="h-20 w-20 object-cover rounded border"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-badge">Badge (Optional)</Label>
                            <Select
                              value={editingProduct.badge || 'none'}
                              onValueChange={(value) => setEditingProduct({ ...editingProduct, badge: value === 'none' ? undefined : value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="No badge" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Badge</SelectItem>
                                <SelectItem value="Best Seller">Best Seller</SelectItem>
                                <SelectItem value="Top Rated">Top Rated</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="edit-inStock"
                              checked={editingProduct.inStock}
                              onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                              className="h-4 w-4"
                            />
                            <Label htmlFor="edit-inStock" className="cursor-pointer">In Stock</Label>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setIsEditDialogOpen(false);
                          setEditingProduct(null);
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditProduct} className="bg-[#003366] hover:bg-[#004488]">
                          Update Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={categoryFilter} onValueChange={(value: 'all' | 'baby' | 'pharmaceutical') => setCategoryFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="baby">Baby Products</SelectItem>
                          <SelectItem value="pharmaceutical">Pharmaceuticals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                    {searchQuery && ` matching "${searchQuery}"`}
                    {categoryFilter !== 'all' && ` in ${categoryFilter === 'baby' ? 'Baby Products' : 'Pharmaceuticals'}`}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Badge</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No products found. {searchQuery && 'Try a different search term or'} {categoryFilter !== 'all' && 'change the category filter or'} add a new product.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">
                                  {product.rating}★ ({product.reviewCount})
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="capitalize">{product.category}</div>
                              <div className="text-gray-500">{getCategoryName(product.categoryId)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.originalPrice ? (
                              <div>
                                <div className="line-through text-gray-500 text-sm">${product.originalPrice.toFixed(2)}</div>
                                <div className="text-[#DC143C]">${product.price.toFixed(2)}</div>
                              </div>
                            ) : (
                              <div>${product.price.toFixed(2)}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.inStock ? "default" : "secondary"}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.badge && (
                              <Badge variant="outline" className="bg-[#FFF3CD]">
                                {product.badge}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditDialog(product)}
                                title="Edit product"
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                title="Delete product"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div>
                    <CardTitle>Badge Management</CardTitle>
                    <CardDescription>Assign badges to products: Best Seller, Top Rated, or New</CardDescription>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={categoryFilter} onValueChange={(value: 'all' | 'baby' | 'pharmaceutical') => setCategoryFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="baby">Baby Products</SelectItem>
                          <SelectItem value="pharmaceutical">Pharmaceuticals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No products found. Try a different search term or change the category filter.
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-600 whitespace-nowrap">Badge:</Label>
                        <Select
                          value={product.badge || 'none'}
                          onValueChange={(value) => handleUpdateBadge(product, value as any)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="No badge" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Badge</SelectItem>
                            <SelectItem value="Best Seller">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Best Seller
                              </div>
                            </SelectItem>
                            <SelectItem value="Top Rated">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Top Rated
                              </div>
                            </SelectItem>
                            <SelectItem value="New">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                New
                              </div>
                            </SelectItem>
                            <SelectItem value="Standard">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Standard
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div>
                    <CardTitle>Sales & Discounts</CardTitle>
                    <CardDescription>Create special offers and discount pricing</CardDescription>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={categoryFilter} onValueChange={(value: 'all' | 'baby' | 'pharmaceutical') => setCategoryFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="baby">Baby Products</SelectItem>
                          <SelectItem value="pharmaceutical">Pharmaceuticals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Results count */}
                  <div className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No products found. Try a different search term or change the category filter.
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm">
                            {product.originalPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
                                <span className="text-[#DC143C]">${product.price.toFixed(2)}</span>
                                <Badge className="bg-green-500">
                                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-gray-600">${product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {product.originalPrice ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onUpdateProduct(product.id, {
                                price: product.originalPrice,
                                originalPrice: undefined,
                              });
                              toast.success('Sale removed');
                            }}
                          >
                            Remove Sale
                          </Button>
                        ) : (
                          <Dialog open={isSaleDialogOpen && saleProduct?.id === product.id} onOpenChange={(open) => {
                            setIsSaleDialogOpen(open);
                            if (!open) setSaleProduct(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSaleProduct(product)}
                              >
                                <Percent className="h-4 w-4 mr-2" />
                                Create Sale
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Create Sale</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-2">Product: {product.name}</p>
                                  <p className="text-sm text-gray-600">Current Price: ${product.price.toFixed(2)}</p>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="discount">Discount Percentage</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="discount"
                                      type="number"
                                      min="1"
                                      max="99"
                                      value={discountPercent}
                                      onChange={(e) => setDiscountPercent(e.target.value)}
                                    />
                                    <span className="flex items-center text-gray-600">%</span>
                                  </div>
                                  {discountPercent && (
                                    <p className="text-sm text-[#DC143C]">
                                      New Price: ${(product.price * (1 - parseFloat(discountPercent) / 100)).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => {
                                  setIsSaleDialogOpen(false);
                                  setSaleProduct(null);
                                }}>
                                  Cancel
                                </Button>
                                <Button onClick={handleCreateSale} className="bg-[#DC143C] hover:bg-[#B01030]">
                                  Apply Sale
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Upload Tab */}
          <TabsContent value="bulk-upload">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Bulk Product Upload</CardTitle>
                  <CardDescription>Upload multiple products at once using a CSV file</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">How to use Bulk Upload</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li>Download the CSV template using the button below (or use your existing CSV)</li>
                      <li>Fill in your product information following the template format</li>
                      <li>Upload the completed CSV file (supports images embedded in cells)</li>
                      <li>Review the parsed products in the preview</li>
                      <li>Click "Import Products" to add them to your catalog</li>
                    </ol>
                    <div className="mt-3 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                        className="bg-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV Template
                      </Button>
                      <p className="text-xs text-blue-700 mt-2">
                        ✓ Supports CSV files with quoted fields and embedded images
                      </p>
                    </div>
                  </div>

                  {/* CSV Format Guide */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">CSV Format Guide</h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-green-50 p-3 rounded mb-3">
                        <span className="font-medium text-green-900">✓ Required column (only 1!):</span>
                        <ul className="list-disc list-inside ml-4 mt-1 text-green-800">
                          <li><strong>name</strong> - Product name (this is all you need!)</li>
                        </ul>
                        <p className="text-xs text-green-700 mt-2">✨ Everything else is 100% optional! Missing fields automatically get smart defaults (price=$9.99, category=baby, rating=4.5, etc.)</p>
                      </div>
                      <div>
                        <span className="font-medium">Recommended columns:</span> price, category, categoryId, description
                      </div>
                      <div>
                        <span className="font-medium">Analytics columns (for sales dashboard):</span> costPrice, stockCount, soldCount
                      </div>
                      <div>
                        <span className="font-medium">Optional columns:</span> rating, reviewCount, image, inStock, badge
                      </div>
                      <div className="mt-3 bg-purple-50 p-3 rounded">
                        <span className="font-medium text-purple-900">📸 Image Column:</span>
                        <p className="text-purple-800 mt-1">
                          Paste image URLs directly from Google Sheets. Supports Unsplash URLs, direct image links, or figma:asset paths. Leave blank for placeholder.
                        </p>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded">
                        <span className="font-medium text-blue-900">Analytics Fields Explained:</span>
                        <ul className="list-disc list-inside ml-4 mt-1 text-blue-800">
                          <li><strong>costPrice:</strong> Your cost to acquire the product (for profit calculations)</li>
                          <li><strong>stockCount:</strong> Number of units currently in stock</li>
                          <li><strong>soldCount:</strong> Total units sold to date (for tracking sales performance)</li>
                        </ul>
                        <p className="mt-2 text-blue-700">These fields enable tracking of: goods sold, inventory levels, profit margins, and top-performing products.</p>
                      </div>
                      <div className="mt-3">
                        <span className="font-medium">Valid categories:</span>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>baby</li>
                          <li>pharmaceutical</li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <span className="font-medium">Valid categoryId values:</span>
                        <ul className="list-disc list-inside ml-4 mt-1 text-sm">
                          <li><strong>Baby:</strong> apparel-accessories, baby-feeding, baby-toys-entertainment</li>
                          <li><strong>Pharmaceutical:</strong> cold-cough-allergy-sinus, rubs-ointments, medicine-eye-care-first-aid, condom-accessories, energy-tabs-vitamins, dental-care, feminine-care, pest-control-repellant, stomach-meds, otc-medicines, lip-care</li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <span className="font-medium">Valid badges:</span> Best Seller, Top Rated, New
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 mb-2">
                          {csvFile ? csvFile.name : 'No file selected'}
                        </p>
                        <Input
                          id="csv-file-input"
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          onClick={() => document.getElementById('csv-file-input')?.click()}
                          className="bg-[#DC143C] hover:bg-[#B01030]"
                        >
                          <FileUp className="h-4 w-4 mr-2" />
                          Choose CSV File
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Processing Indicator */}
                  {isProcessingCsv && (
                    <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <p className="text-blue-700">Processing CSV file...</p>
                    </div>
                  )}

                  {/* Blocking Errors Display */}
                  {csvErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-red-900 mb-2">
                            🚫 {csvErrors.length} Blocking Error(s) - Cannot Import
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                            {csvErrors.slice(0, 10).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                            {csvErrors.length > 10 && (
                              <li className="text-red-600">... and {csvErrors.length - 10} more errors</li>
                            )}
                          </ul>
                          <p className="text-xs text-red-600 mt-3 font-medium">
                            Fix these errors to proceed with import.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warnings Display (Non-blocking) */}
                  {csvWarnings.length > 0 && csvErrors.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-yellow-900 mb-2">
                            ⚠️ {csvWarnings.length} Warning(s) - Import Can Proceed
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 max-h-48 overflow-y-auto">
                            {csvWarnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                          <p className="text-xs text-yellow-600 mt-3 font-medium">
                            ✓ These are informational only. Smart defaults will be applied during import.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview Section */}
                  {showCsvPreview && csvData.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <h4 className="font-medium text-green-900">
                            Successfully parsed {csvData.length} product(s)
                          </h4>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Review the products below and click "Import Products" to add them to your catalog.
                        </p>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <h4 className="font-medium">Preview</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Cost Price</TableHead>
                                <TableHead>Stock Qty</TableHead>
                                <TableHead>Sold</TableHead>
                                <TableHead>Profit/Unit</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Badge</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {csvData.map((product, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell className="font-medium">
                                    <div>{product.name}</div>
                                    {product.description && (
                                      <div className="text-xs text-gray-600 mt-1 line-clamp-2 max-w-xs">
                                        {product.description}
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-500 capitalize mt-1">
                                      {product.rating}★ ({product.reviewCount})
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div className="capitalize">{product.category}</div>
                                      <div className="text-gray-500 text-xs">{getCategoryName(product.categoryId)}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-green-700 font-medium">${product.price.toFixed(2)}</div>
                                  </TableCell>
                                  <TableCell>
                                    {product.costPrice ? (
                                      <span className="text-sm">${product.costPrice.toFixed(2)}</span>
                                    ) : (
                                      <span className="text-gray-400 text-xs">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.stockCount !== undefined ? (
                                      <Badge variant={product.stockCount > 0 ? "default" : "secondary"} className="text-xs">
                                        {product.stockCount} units
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400 text-xs">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.soldCount !== undefined ? (
                                      <span className="text-sm text-blue-700">{product.soldCount} sold</span>
                                    ) : (
                                      <span className="text-gray-400 text-xs">0</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.costPrice ? (
                                      <div className="text-sm">
                                        <span className="text-green-700 font-medium">
                                          ${(product.price - product.costPrice).toFixed(2)}
                                        </span>
                                        <div className="text-xs text-gray-500">
                                          ({(((product.price - product.costPrice) / product.costPrice) * 100).toFixed(0)}%)
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-xs">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.image ? (
                                      <div className="flex items-center gap-2">
                                        <img 
                                          src={product.image} 
                                          alt={product.name}
                                          className="w-12 h-12 object-cover rounded border"
                                          onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                          }}
                                        />
                                        <span className="text-xs text-gray-500 truncate max-w-[100px]" title={product.image}>
                                          {product.image.substring(0, 20)}...
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 text-xs">No image</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.badge ? (
                                      <Badge variant="outline" className="bg-[#FFF3CD] text-xs">
                                        {product.badge}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400 text-xs">None</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCsvFile(null);
                            setCsvData([]);
                            setCsvErrors([]);
                            setCsvWarnings([]);
                            setShowCsvPreview(false);
                            const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleBulkImport}
                          className="bg-[#003366] hover:bg-[#004488]"
                          disabled={csvData.length === 0}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Import {csvData.length} Product(s)
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Delete Tab */}
          <TabsContent value="bulk-delete">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Bulk Delete Products</CardTitle>
                  <CardDescription>Delete products by category or purge all data</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Warning Alert */}
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Warning:</strong> Bulk delete operations are permanent and cannot be undone. Please proceed with caution.
                    </AlertDescription>
                  </Alert>

                  {/* Product Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Baby Products</p>
                            <p className="text-2xl font-bold text-[#003366]">
                              {products.filter(p => p.category === 'baby').length}
                            </p>
                          </div>
                          <Package className="h-8 w-8 text-[#003366] opacity-20" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Pharmaceuticals</p>
                            <p className="text-2xl font-bold text-[#DC143C]">
                              {products.filter(p => p.category === 'pharmaceutical').length}
                            </p>
                          </div>
                          <Package className="h-8 w-8 text-[#DC143C] opacity-20" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-300">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-700">
                              {products.length}
                            </p>
                          </div>
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Delete Actions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Delete Operations</h3>
                    
                    <div className="grid gap-4">
                      {/* Delete Baby Products */}
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#003366]">Delete All Baby Products</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Remove all {products.filter(p => p.category === 'baby').length} baby product(s) from the catalog
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                            onClick={() => handleBulkDelete('baby')}
                            disabled={products.filter(p => p.category === 'baby').length === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Baby
                          </Button>
                        </div>
                      </div>

                      {/* Delete Pharmaceutical Products */}
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#DC143C]">Delete All Pharmaceutical Products</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Remove all {products.filter(p => p.category === 'pharmaceutical').length} pharmaceutical product(s) from the catalog
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white"
                            onClick={() => handleBulkDelete('pharmaceutical')}
                            disabled={products.filter(p => p.category === 'pharmaceutical').length === 0}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Pharma
                          </Button>
                        </div>
                      </div>

                      {/* Purge All Data */}
                      <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <h4 className="font-bold text-red-900">Purge All Products (Danger Zone)</h4>
                            </div>
                            <p className="text-sm text-red-700 mt-2">
                              <strong>This will delete ALL {products.length} products</strong> from both categories. This action is irreversible and will completely clear your product catalog.
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleBulkDelete('purge')}
                            disabled={products.length === 0}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Purge All
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Dialog */}
                  <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Confirm Bulk Delete
                        </DialogTitle>
                        <DialogDescription>
                          {bulkDeleteAction === 'purge' && (
                            <div className="space-y-2 mt-4">
                              <p className="font-medium text-red-900">
                                You are about to delete ALL {products.length} products!
                              </p>
                              <p className="text-sm">
                                This will permanently remove:
                              </p>
                              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                                <li>{products.filter(p => p.category === 'baby').length} Baby products</li>
                                <li>{products.filter(p => p.category === 'pharmaceutical').length} Pharmaceutical products</li>
                              </ul>
                            </div>
                          )}
                          {bulkDeleteAction === 'baby' && (
                            <div className="space-y-2 mt-4">
                              <p className="font-medium">
                                You are about to delete {products.filter(p => p.category === 'baby').length} baby product(s).
                              </p>
                              <p className="text-sm text-gray-600">
                                This will remove all products in the Baby Products category.
                              </p>
                            </div>
                          )}
                          {bulkDeleteAction === 'pharmaceutical' && (
                            <div className="space-y-2 mt-4">
                              <p className="font-medium">
                                You are about to delete {products.filter(p => p.category === 'pharmaceutical').length} pharmaceutical product(s).
                              </p>
                              <p className="text-sm text-gray-600">
                                This will remove all products in the Pharmaceutical category.
                              </p>
                            </div>
                          )}
                          <p className="text-sm text-red-600 mt-4 font-medium">
                            ⚠️ This action cannot be undone!
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsBulkDeleteDialogOpen(false);
                            setBulkDeleteAction(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={confirmBulkDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Yes, Delete {bulkDeleteAction === 'purge' ? 'All' : 
                            `${products.filter(p => bulkDeleteAction && p.category === bulkDeleteAction).length}`}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagementPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}