import { useState } from "react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/services/brand/endpoints";

export interface Brand {
  id: string;
  name: string;
}

export const useBrand = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const handleGetBrands = async () => {
    setLoading(true);
    try {
      const response = await getBrands();
      const { code, brands } = response.data.getBrands;
      
      if (code === 200) {
        setBrands(brands);
        return brands;
      } else {
        throw new Error("Không thể lấy danh sách thương hiệu");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBrand = async (name: string) => {
    setLoading(true);
    try {
      const response = await createBrand(name);
      const { code, brand } = response.data.createBrand;
      
      if (code === 200) {
        setBrands(prevBrands => {
          const newBrands = [...prevBrands, brand];
          return newBrands;
        });        
        return brand;
      } else {
        throw new Error("Tạo thương hiệu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateBrand = async (id: string, name: string) => {
    setLoading(true);
    try {
      const response = await updateBrand(id, name);
      const { code, brand } = response.data.updateBrand;
      
      if (code === 200) {
        setBrands(prev => prev.map(item => item.id === id ? brand : item));
        return brand;
      } else {
        throw new Error("Cập nhật thương hiệu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteBrand = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteBrand(id);
      const { code } = response.data.deleteBrand;
      
      if (code === 200) {
        setBrands(prevBrands => {
          const newBrands =prevBrands.filter(item => item.id !== id);
          return newBrands;
});
        return "Xóa thương hiệu thành công";
      } else {
        throw new Error("Xóa thương hiệu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    brands,
    getBrands: handleGetBrands,
    createBrand: handleCreateBrand,
    updateBrand: handleUpdateBrand,
    deleteBrand: handleDeleteBrand,
  };
};