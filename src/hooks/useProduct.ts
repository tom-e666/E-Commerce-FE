import { useState } from 'react';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
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
      const response = await getProducts(status);
      const { code, products } = response.data.getProducts;
      
      if (code === 200) {
        setProducts(products);
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
      const response = await getProduct(id);
      const { code, product } = response.data.getProduct;
      
      if (code === 200) {
        setCurrentProduct(product);
        return product;
      } else {
        throw new Error("Không thể lấy thông tin sản phẩm");
      }
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
      const response = await createProduct(name, price, stock, status, brand_id, details);
      const { code, product } = response.data.createProduct;
      
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
    data: {
      name?: string;
      price?: number;
      stock?: number;
      status?: boolean;
      brand_id?: string;
      details?: Partial<ProductDetails>;
    }
  ) => {
    setLoading(true);
    try {
      const response = await updateProduct(id, data);
      const { code, product } = response.data.updateProduct;
      
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
      const response = await deleteProduct(id);
      const { code } = response.data.deleteProduct;
      
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