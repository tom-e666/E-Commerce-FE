import { useState, useCallback } from 'react';
import {
  getProducts as apiGetProducts,
  getProduct as apiGetProduct,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  Product,
  ProductDetails
} from '@/services/product/endpoint';
export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Use the cached version for better performance
      const result = await apiGetProducts();
      if (result.code === 200) {
        setProducts(result.products);
        // Store in localStorage for offline access & quick initial render on next visit
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

  const handleGetProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiGetProduct(id);
      const { code, product } = response;

      if (code === 200 && product) {
        setCurrentProduct(product);
        return product;
      } else {
        // Trả về response thay vì throw error để component có thể xử lý lỗi
        return response;
      }
    } catch (error) {
      // Trả về một đối tượng lỗi có cấu trúc giống response
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Không thể lấy thông tin sản phẩm",
        product: null
      };
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (
    name: string,
    price: number,
    stock: number,
    status: boolean,
    brand_id: string,
    details: ProductDetails
  ) => {
    setLoading(true);
    try {
      // Create a single object parameter matching the endpoint function signature
      const productData = {
        name,
        price,
        stock,
        status,
        brand_id,
        details,
        weight: 0 // Default weight since it's required but not in the original function signature
      };

      const response = await apiCreateProduct(productData);
      const { code, product } = response;

      if (code === 200) {
        setProducts(prev => [...prev, product]);
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

  // Delete a product
  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiDeleteProduct(id);
      const { code } = response;

      if (code === 200) {
        setProducts(prev => prev.filter(item => item.id !== id));
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

  return {
    loading,
    products,
    currentProduct,
    getProducts,
    getProduct: handleGetProduct,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };
};