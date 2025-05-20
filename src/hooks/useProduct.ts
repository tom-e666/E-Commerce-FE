import { useState } from 'react';
import {
  getProducts as apiGetProducts,
  getProduct as apiGetProduct,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  Product,
  ProductDetails
} from '@/services/product/endpoint';

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleGetProducts = async (status = "1") => {
    setLoading(true);
    try {
      const response = await apiGetProducts(status);
      const { code, message, products } = response;

      if (code === 200) {
        setProducts(products);
        console.log("Products:", products);
        console.log("Message:", message);
        return products;
      } else {
        throw new Error("Không thể lấy danh sách sản phẩm");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetProduct = async (id: string) => {
    setLoading(true);
    try {
      console.log("handleGetProduct: Fetching product with ID:", id);
      const response = await apiGetProduct(id);
      console.log("handleGetProduct: API response:", response);
      const { code, product } = response;

      if (code === 200) {
        console.log("handleGetProduct: Setting current product:", product);
        setCurrentProduct(product);
        return product;
      } else {
        console.error("handleGetProduct: Failed to get product:", response);
        throw new Error("Không thể lấy thông tin sản phẩm");
      }
    } catch (error) {
      console.error("handleGetProduct: Error:", error);
      throw error;
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
    getProducts: handleGetProducts,
    getProduct: handleGetProduct,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };
};