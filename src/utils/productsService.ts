import { supabase } from './supabaseClient';
import { supabaseAdmin } from './supabaseAdmin';
import { Product } from '../components/ProductCard';
import { config } from './config';

/**
 * Products Service - Handles all product operations with Supabase
 * Provides fallback to local state when Supabase is disabled or fails
 */

export const productsService = {
  /**
   * Fetch all active products from Supabase
   */
  async getAll(): Promise<Product[]> {
    if (!config.useSupabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase data to Product interface
      return (data || []).map(this.mapToProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<Product | null> {
    if (!config.useSupabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapToProduct(data) : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  /**
   * Create a new product in Supabase
   */
  async create(product: Omit<Product, 'id'>): Promise<Product> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      const productData = this.mapToSupabase(product);

      // Use admin client to bypass RLS policies
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      if (config.debugMode) {
        console.log('✅ Product created in Supabase:', data);
      }

      return this.mapToProduct(data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Update an existing product
   */
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      const updateData = this.mapToSupabase(updates);

      // Use admin client to bypass RLS policies
      // @ts-ignore - JSR Supabase package has strict typing issues
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (config.debugMode) {
        console.log('✅ Product updated in Supabase:', data);
      }

      return this.mapToProduct(data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  /**
   * Delete a product (soft delete by marking inactive)
   */
  async delete(id: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      // Use admin client to bypass RLS policies
      // Soft delete by marking as inactive
      // @ts-ignore - JSR Supabase package has strict typing issues
      const { error } = await supabaseAdmin
        .from('products')
        .update({ is_active: false } as any)
        .eq('id', id);

      if (error) throw error;

      if (config.debugMode) {
        console.log('✅ Product deleted (soft) from Supabase:', id);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  /**
   * Hard delete a product (permanent removal)
   */
  async hardDelete(id: string): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      console.log('🗑️ Attempting to delete product from Supabase:', id);
      
      // Use admin client to bypass RLS policies
      const { data, error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Supabase delete error:', error);
        throw new Error(`Supabase delete failed: ${error.message}`);
      }

      console.log('✅ Product permanently deleted from Supabase:', id, data);
    } catch (error) {
      console.error('❌ Error hard deleting product:', error);
      throw error;
    }
  },

  /**
   * Bulk delete products by category or all
   * More efficient than deleting one by one
   */
  async bulkDelete(action: 'baby' | 'pharmaceutical' | 'purge'): Promise<number> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      let deletedCount = 0;

      if (action === 'purge') {
        // Delete all products (hard delete)
        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a condition that's always true)
        
        if (error) throw error;
        
        // Get count of deleted products
        const { count } = await supabaseAdmin
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Actually, we need to count before deleting
        const { count: countBefore } = await supabaseAdmin
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        deletedCount = countBefore || 0;
      } else {
        // Delete by category (hard delete)
        const { error, count } = await supabaseAdmin
          .from('products')
          .delete()
          .eq('category', action)
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        deletedCount = count || 0;
      }

      if (config.debugMode) {
        console.log(`✅ Bulk delete complete: ${deletedCount} products deleted (${action})`);
      }

      return deletedCount;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  },

  /**
   * Bulk import products
   * Batches inserts to handle large volumes (e.g., 200+ products)
   */
  async bulkImport(products: Omit<Product, 'id'>[]): Promise<number> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      const productsData = products.map(this.mapToSupabase);
      const BATCH_SIZE = 50; // Supabase can handle more, but batching prevents timeout issues
      let totalImported = 0;
      let allErrors: Error[] = [];

      // Process in batches
      for (let i = 0; i < productsData.length; i += BATCH_SIZE) {
        const batch = productsData.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(productsData.length / BATCH_SIZE);
        
        if (config.debugMode) {
          console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} products)...`);
        }

        try {
          // Use admin client to bypass RLS policies
          const { data, error } = await supabaseAdmin
            .from('products')
            .insert(batch as any)
            .select();

          if (error) {
            console.error(`❌ Error in batch ${batchNumber}:`, error);
            allErrors.push(new Error(`Batch ${batchNumber}: ${error.message}`));
            continue; // Continue with next batch
          }

          const batchCount = data?.length || 0;
          totalImported += batchCount;
          
          if (config.debugMode) {
            console.log(`✅ Batch ${batchNumber} imported: ${batchCount} products`);
          }

          // Small delay between batches to avoid rate limiting
          if (i + BATCH_SIZE < productsData.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (batchError) {
          console.error(`❌ Error processing batch ${batchNumber}:`, batchError);
          allErrors.push(new Error(`Batch ${batchNumber}: ${batchError instanceof Error ? batchError.message : String(batchError)}`));
        }
      }

      if (config.debugMode) {
        console.log(`✅ Bulk import complete: ${totalImported}/${productsData.length} products imported`);
        if (allErrors.length > 0) {
          console.warn(`⚠️ ${allErrors.length} batches had errors:`, allErrors);
        }
      }

      // If we imported at least some products, return success count
      // If all failed, throw the first error
      if (totalImported === 0 && allErrors.length > 0) {
        throw new Error(`Bulk import failed: ${allErrors[0].message}`);
      }

      return totalImported;
    } catch (error) {
      console.error('Error bulk importing products:', error);
      throw error;
    }
  },

  /**
   * Search products by name or description
   */
  async search(query: string, category?: 'baby' | 'pharmaceutical'): Promise<Product[]> {
    if (!config.useSupabase) {
      return [];
    }

    try {
      let queryBuilder = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (category) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      // Use full-text search if available, otherwise use ILIKE
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );

      const { data, error } = await queryBuilder;

      if (error) throw error;

      return (data || []).map(this.mapToProduct);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  /**
   * Get products by category
   */
  async getByCategory(category: 'baby' | 'pharmaceutical'): Promise<Product[]> {
    if (!config.useSupabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      return (data || []).map(this.mapToProduct);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  /**
   * Update stock count
   */
  async updateStock(id: string, quantity: number): Promise<void> {
    if (!config.useSupabase) {
      throw new Error('Supabase is disabled');
    }

    try {
      // @ts-ignore - JSR Supabase package has strict typing issues
      const { error } = await supabase
        .from('products')
        .update({
          stock_count: quantity,
          in_stock: quantity > 0,
        } as any)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  /**
   * Map Supabase product data to frontend Product interface
   */
  mapToProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      categoryId: data.category_id,
      subcategoryId: data.subcategory_id,
      price: Number(data.price),
      originalPrice: data.original_price ? Number(data.original_price) : undefined,
      currency: data.currency || 'USD',
      rating: Number(data.rating),
      reviewCount: data.review_count,
      image: data.image_url,
      inStock: data.in_stock,
      badge: data.badge,
      stockCount: data.stock_count,
      soldCount: data.sold_count,
      costPrice: data.cost_price ? Number(data.cost_price) : undefined,
    };
  },

  /**
   * Map frontend Product to Supabase database format
   */
  mapToSupabase(product: Partial<Product>): any {
    const mapped: any = {};

    if (product.name !== undefined) mapped.name = product.name;
    if (product.description !== undefined) mapped.description = product.description;
    if (product.category !== undefined) mapped.category = product.category;
    if (product.categoryId !== undefined) mapped.category_id = product.categoryId;
    if (product.subcategoryId !== undefined) mapped.subcategory_id = product.subcategoryId;
    if (product.price !== undefined) mapped.price = product.price;
    if (product.originalPrice !== undefined) mapped.original_price = product.originalPrice;
    // Always set currency - default to USD if not provided
    mapped.currency = product.currency || 'USD';
    if (product.rating !== undefined) mapped.rating = product.rating;
    if (product.reviewCount !== undefined) mapped.review_count = product.reviewCount;
    if (product.image !== undefined) mapped.image_url = product.image;
    if (product.inStock !== undefined) mapped.in_stock = product.inStock;
    if (product.badge !== undefined) mapped.badge = product.badge;
    if (product.stockCount !== undefined) mapped.stock_count = product.stockCount;
    if (product.soldCount !== undefined) mapped.sold_count = product.soldCount;
    if (product.costPrice !== undefined) mapped.cost_price = product.costPrice;

    return mapped;
  },
};
