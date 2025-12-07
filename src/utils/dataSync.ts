import { Product } from '../components/ProductCard';
import { productsApi } from './api';
import { config } from './config';

export const dataSync = {
  /**
   * Migrate local products to Supabase
   * Call this once to move your existing products to the database
   */
  migrateToSupabase: async (localProducts: Product[]) => {
    if (!config.useSupabase) {
      throw new Error('Supabase is not enabled. Set useSupabase: true in /utils/config.ts');
    }

    try {
      console.log(`Starting migration of ${localProducts.length} products...`);
      
      // Check if products already exist in database
      const existingProducts = await productsApi.getAll();
      
      if (existingProducts.length > 0) {
        console.warn(`Database already contains ${existingProducts.length} products.`);
        console.warn('Migration cancelled to prevent duplicates.');
        return {
          success: false,
          message: 'Database already has products. Clear it first or skip migration.',
          existingCount: existingProducts.length,
        };
      }

      // Bulk import all local products
      const result = await productsApi.bulkImport(localProducts);
      
      console.log(`✅ Successfully migrated ${result.count} products to Supabase`);
      
      return {
        success: true,
        message: `Successfully migrated ${result.count} products`,
        count: result.count,
      };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        message: `Migration failed: ${error}`,
        error,
      };
    }
  },

  /**
   * Export all products from Supabase to downloadable CSV
   */
  exportToCSV: async () => {
    try {
      const products = await productsApi.getAll();
      
      if (products.length === 0) {
        return {
          success: false,
          message: 'No products to export',
        };
      }

      // Create CSV content
      const headers = [
        'name', 'description', 'category', 'categoryId', 'price',
        'costPrice', 'stockCount', 'soldCount', 'rating', 'reviewCount',
        'image', 'inStock', 'badge'
      ];

      const rows = products.map(p => [
        `"${p.name || ''}"`,
        `"${p.description || ''}"`,
        p.category,
        p.categoryId,
        p.price,
        p.costPrice || '',
        p.stockCount || '',
        p.soldCount || 0,
        p.rating,
        p.reviewCount,
        `"${p.image || ''}"`,
        p.inStock ? 'true' : 'false',
        p.badge || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: `Exported ${products.length} products`,
        count: products.length,
      };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        message: `Export failed: ${error}`,
        error,
      };
    }
  },

  /**
   * Check if Supabase is available and responding
   */
  checkSupabaseHealth: async () => {
    if (!config.useSupabase) {
      return {
        available: false,
        message: 'Supabase is disabled in config',
      };
    }

    try {
      const products = await productsApi.getAll();
      return {
        available: true,
        message: 'Supabase is connected and responding',
        productCount: products.length,
      };
    } catch (error) {
      return {
        available: false,
        message: `Supabase is not responding: ${error}`,
        error,
      };
    }
  },

  /**
   * Sync local state with Supabase
   * Useful for keeping data in sync
   */
  syncWithSupabase: async (localProducts: Product[]) => {
    if (!config.useSupabase) {
      return {
        success: false,
        message: 'Supabase not enabled',
      };
    }

    try {
      const remoteProducts = await productsApi.getAll();
      
      return {
        success: true,
        local: localProducts.length,
        remote: remoteProducts.length,
        inSync: localProducts.length === remoteProducts.length,
        products: remoteProducts,
      };
    } catch (error) {
      return {
        success: false,
        message: `Sync failed: ${error}`,
        error,
      };
    }
  },
};

/**
 * Helper to determine data source
 */
export function getDataSource(): 'supabase' | 'local' {
  return config.useSupabase ? 'supabase' : 'local';
}

/**
 * Log current data storage configuration
 */
export function logDataConfig() {
  console.log('═══════════════════════════════════════');
  console.log('  Nex-Gen Shipping - Data Configuration');
  console.log('═══════════════════════════════════════');
  console.log(`Data Source: ${getDataSource().toUpperCase()}`);
  console.log(`Supabase Enabled: ${config.useSupabase}`);
  console.log(`Debug Mode: ${config.debugMode}`);
  console.log('═══════════════════════════════════════');
  
  if (config.useSupabase) {
    console.log('✅ Using Supabase backend for persistent storage');
    console.log('📊 Data will persist across sessions and devices');
  } else {
    console.log('💻 Using local state only');
    console.log('⚠️  Data will be lost on page refresh');
  }
  console.log('═══════════════════════════════════════');
}
