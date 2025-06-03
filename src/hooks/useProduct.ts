import { useState, useCallback } from 'react';
import {
  getProducts as apiGetProducts,
  getPaginatedProducts as apiGetPaginatedProducts,
  getProduct as apiGetProduct,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  Product,
  ProductDetails,
  PaginationInfo
} from '@/services/product/endpoint';

export interface ProductFilters {
  search?: string;
  status?: string;
  category_id?: string;
  brand_id?: string;
  price_min?: number;
  price_max?: number;
  sort_field?: string;
  sort_direction?: string;
}

export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Pagination state
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters | null>(null);

  // Original getProducts for backward compatibility (gets all products)
  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGetProducts();
      if (result.code === 200) {
        setProducts(result.products);
        localStorage.setItem('cachedProductList', JSON.stringify(result.products));
        localStorage.setItem('productsTimestamp', Date.now().toString());
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  // New paginated products function
  const getPaginatedProducts = useCallback(async (
    filters?: ProductFilters,
    page: number = 1,
    per_page: number = 12,
    append: boolean = false
  ) => {
    const loadingState = append ? setIsLoadingMore : setLoading;
    loadingState(true);
    
    try {
      const result = await apiGetPaginatedProducts({
        ...filters,
        page,
        per_page
      });

      if (result.code === 200) {
        if (append) {
          // Append new products to existing list
          setPaginatedProducts(prev => [...prev, ...result.products]);
        } else {
          // Replace products list
          setPaginatedProducts(result.products);
          setCurrentFilters(filters || null);
        }
        setPagination(result.pagination);
        
        // Cache current page data
        // const cacheKey = `paginatedProducts_${JSON.stringify(filters)}_${page}`;
        // localStorage.setItem(cacheKey, JSON.stringify({
        //   products: result.products,
        //   pagination: result.pagination,
        //   timestamp: Date.now()
        // }));
      }
      
      loadingState(false);
      return result;
    } catch (error) {
      loadingState(false);
      throw error;
    }
  }, []);

  // Load more products (next page)
  const loadMoreProducts = useCallback(async () => {
    if (!pagination?.has_more_pages || isLoadingMore) return;
    
    const nextPage = pagination.current_page + 1;
    return getPaginatedProducts(
      currentFilters || undefined,
      nextPage,
      pagination.per_page,
      true // append = true
    );
  }, [pagination, currentFilters, isLoadingMore, getPaginatedProducts]);

  // Reset pagination and load first page
  const resetAndLoadProducts = useCallback(async (
    filters?: ProductFilters,
    per_page: number = 12
  ) => {
    setPaginatedProducts([]);
    setPagination(null);
    return getPaginatedProducts(filters, 1, per_page, false);
  }, [getPaginatedProducts]);

  // Check if can load more
  const canLoadMore = pagination?.has_more_pages && !isLoadingMore;

  // Get cached products for initial load
  const getCachedProducts = useCallback((filters?: ProductFilters, page: number = 1) => {
    try {
      const cacheKey = `paginatedProducts_${JSON.stringify(filters)}_${page}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const { products, pagination, timestamp } = JSON.parse(cached);
        
        // Check if cache is still valid (1 hour)
        if (Date.now() - timestamp < 3600000) {
          setPaginatedProducts(products);
          setPagination(pagination);
          setCurrentFilters(filters || null);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const handleGetProduct = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await apiGetProduct(id);
      const { code, product } = response;

      if (code === 200 && product) {
        setCurrentProduct(product);
        return product;
      } else {
        return response;
      }
    } catch (error) {
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Không thể lấy thông tin sản phẩm",
        product: null
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateProduct = async (
    name: string,
    price: number,
    default_price: number,
    stock: number,
    status: boolean,
    brand_id: string,
    details: ProductDetails,
    weight: number
  ) => {
    setLoading(true);
    try {
      const productData = {
        name,
        price,
        default_price,
        stock,
        status,
        brand_id,
        details,
        weight
      };

      const response = await apiCreateProduct(productData);
      const { code, product } = response;

      if (code === 200) {
        setProducts(prev => [...prev, product]);
        // Add to paginated products if it matches current filters
        if (!currentFilters || shouldIncludeInCurrentView(product, currentFilters)) {
          setPaginatedProducts(prev => [product, ...prev]);
        }
        return product;
      } else {
        throw new Error("Tạo sản phẩm thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (
    id: string,
    data: Partial<Omit<Product, "id">>
  ) => {
    setLoading(true);
    try {
      const response = await apiUpdateProduct(id, data);
      const { code, product } = response;

      if (code === 200) {
        setProducts(prev => prev.map(item => item.id === id ? product : item));
        setPaginatedProducts(prev => prev.map(item => item.id === id ? product : item));
        if (currentProduct?.id === id) {
          setCurrentProduct(product);
        }
        return product;
      } else {
        throw new Error("Cập nhật sản phẩm thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiDeleteProduct(id);
      const { code } = response;

      if (code === 200) {
        setProducts(prev => prev.filter(item => item.id !== id));
        setPaginatedProducts(prev => prev.filter(item => item.id !== id));
        if (currentProduct?.id === id) {
          setCurrentProduct(null);
        }
        return "Xóa sản phẩm thành công";
      } else {
        throw new Error("Xóa sản phẩm thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if product should be included in current view
  const shouldIncludeInCurrentView = (product: Product, filters: ProductFilters): boolean => {
    if (filters.status && product.status.toString() !== filters.status) return false;
    if (filters.brand_id && product.brand_id !== filters.brand_id) return false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.price_min && product.price < filters.price_min) return false;
    if (filters.price_max && product.price > filters.price_max) return false;
    return true;
  };

  const addProductToList = useCallback((product: Product) => {
    setPaginatedProducts(prev => [product, ...prev]);
    setPagination(prev => prev ? { ...prev, total: prev.total + 1 } : null);
  }, []);

  const updateProductInList = useCallback((product: Product) => {
    setPaginatedProducts(prev =>
      prev.map(item => item.id === product.id ? product : item)
    );
  }, []);

  const deleteProductFromList = useCallback((product: Product) => {
    setPaginatedProducts(prev =>
      prev.filter(item => item.id !== product.id)
    );
    setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : null);
  }, []);


  return {
    loading,
    isLoadingMore,
    products,
    paginatedProducts,
    pagination,
    currentProduct,
    canLoadMore,
    
    // Methods
    getProducts,
    getPaginatedProducts,
    loadMoreProducts,
    resetAndLoadProducts,
    getCachedProducts,
    getProduct: handleGetProduct,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    addProductToList,
    updateProductInList,
    deleteProductFromList
  };
}