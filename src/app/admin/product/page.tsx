'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect, useRef } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import { useBrand } from "@/hooks/useBrand";
import { useProduct } from "@/hooks/useProduct";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Plus, X, Edit, Trash2, Search, RefreshCw, Package, DollarSign, TrendingUp, Archive } from "lucide-react";
import ProductImagesManager from "./ProductImagesManager";

import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({
    theme: "legacy",
});

const productFormSchema = z.object({
    name: z.string().min(2, {
        message: "Tên sản phẩm phải có ít nhất 2 ký tự.",
    }),
    price: z.coerce.number().min(0, {
        message: "Giá sản phẩm phải lớn hơn hoặc bằng 0.",
    }),
    stock: z.coerce.number().int().min(0, {
        message: "Số lượng tồn kho phải là số nguyên không âm.",
    }),
    status: z.boolean().default(true),
    brand_id: z.string().min(1, {
        message: "Vui lòng chọn thương hiệu.",
    }),
    description: z.string().min(10, {
        message: "Mô tả sản phẩm phải có ít nhất 10 ký tự.",
    }),
    images: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    specifications: z.array(
        z.object({
            name: z.string().min(1, {
                message: "Tên thông số không được để trống.",
            }),
            value: z.string().min(1, {
                message: "Giá trị thông số không được để trống.",
            })
        })
    ).default([]),
});

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: boolean;
    brand_id: string;
    details: {
        description: string;
        images: string[];
        keywords: string[];
        specifications: {
            name: string;
            value: string;
        }[];
    };
}

export default function ProductManagement() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { getProducts, products, createProduct, updateProduct, deleteProduct } = useProduct();
    const { getBrands, brands } = useBrand();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    // const [setGridData] = useState<Product[]>([]);
    const loadingToastRef = useRef<string | number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const [colDefs] = useState([
        { field: "id", headerName: "ID", width: 100, suppressCellFlash: true, cellClass: 'no-click' },
        { field: "name", headerName: "Tên sản phẩm", flex: 1, suppressCellFlash: true, cellClass: 'no-click' },
        {
            field: "price",
            headerName: "Giá (VNĐ)",
            width: 150,
            suppressCellFlash: true,
            cellClass: 'no-click',
            // @ts-expect-error any
            valueFormatter: (params) => {
                return new Intl.NumberFormat('vi-VN').format(params.value);
            }
        },
        { field: "stock", headerName: "Tồn kho", width: 120, suppressCellFlash: true, cellClass: 'no-click' },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            suppressCellFlash: true,
            cellClass: 'no-click',
            // @ts-expect-error any
            cellRenderer: (params) => {
                return params.value ?
                    'Đang bán' : 'Ngừng bán';
            }
        },
        {
            field: "brand_id",
            headerName: "Thương hiệu",
            width: 150,
            suppressCellFlash: true,
            cellClass: 'no-click',
            // @ts-expect-error any
            valueFormatter: (params) => {
                const brand = brands.find(b => b.id === params.value);
                return brand ? brand.name : params.value;
            }
        }
    ]);

    useEffect(() => {
        setGridData(products);
        setFilteredProducts(products);
        forceUpdate();
    }, [products]);

    useEffect(() => {
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brands.find(b => b.id === product.brand_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products, brands]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            await getProducts();
        } catch (error) {
            toast.error("Không thể tải danh sách sản phẩm");
            console.error("Error loading products:", error);
        } finally {
            setIsLoading(false);
            forceUpdate();
        }
    };

    useEffect(() => {
        loadProducts();
        getBrands();
    }, []);

    // Cleanup any loading toasts on unmount
    useEffect(() => {
        return () => {
            if (loadingToastRef.current) {
                toast.dismiss(loadingToastRef.current);
            }
        };
    }, []);

    // @ts-expect-error any
    const handleRowClick = (event) => {
        // Check that this is a row click event, not a cell click
        if (event.event && event.event.target) {
            // Only process if this is an actual row click, not on a cell
            setSelectedProduct(event.data);
            setOpenForm(true);
        }
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedProduct(null);
    };

    return (
        <motion.div 
            className="w-full min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onMouseMove={handleMouseMove}
        >
            {/* Glossy header */}
            <motion.div 
                className="relative p-6 mb-8 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-xl overflow-hidden"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"
                    style={{
                        background: `radial-gradient(
                            circle at ${mouseX}px ${mouseY}px,
                            rgba(79, 70, 229, 0.15) 0%,
                            rgba(79, 70, 229, 0.05) 40%,
                            transparent 60%
                        )`
                    }}
                />
                
                <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg"
                        >
                            <Package className="text-white w-6 h-6" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                className="text-2xl font-bold text-indigo-900"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                Quản lý sản phẩm
                            </motion.h1>
                            <motion.p 
                                className="text-gray-500"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                Thêm, chỉnh sửa và quản lý sản phẩm trong hệ thống
                            </motion.p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                variant="outline" 
                                onClick={loadProducts}
                                className="flex items-center gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Làm mới</span>
                            </Button>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                onClick={handleAddNew} 
                                className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none flex items-center gap-2 shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Thêm sản phẩm</span>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            
            {/* Search bar */}
            <motion.div 
                className="mb-6 relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-full border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {searchQuery && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <RefreshCw className="h-8 w-8 text-indigo-600" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Data grid with glossy effect */}
            <motion.div 
                className="relative overflow-hidden rounded-xl shadow-xl bg-white/80 backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-indigo-100/30 via-transparent to-purple-100/30 pointer-events-none"
                    style={{
                        background: `radial-gradient(
                            circle at ${mouseX}px ${mouseY}px,
                            rgba(99, 102, 241, 0.1) 0%,
                            rgba(168, 85, 247, 0.05) 25%,
                            transparent 50%
                        )`
                    }}
                />
                
                <div className="relative z-10 p-0.5">
                    <div className="ag-theme-alpine w-full h-[500px] rounded-lg overflow-hidden">
                        <AgGridReact
                            key={`products-${forceUpdateKey}`}
                            rowData={filteredProducts}
                            // @ts-expect-error any
                            columnDefs={colDefs}
                            onRowClicked={handleRowClick}
                            pagination={false}
                            animateRows={true}
                            domLayout="normal"
                            suppressCellFocus={true}
                            suppressRowClickSelection={false}
                            rowSelection="single"
                            rowHeight={56}
                            headerHeight={48}
                            defaultColDef={{
                                sortable: true,
                                resizable: true
                            }}
                            overlayNoRowsTemplate={
                                searchQuery 
                                    ? "<div class='flex items-center justify-center h-full text-gray-500'>Không tìm thấy sản phẩm nào phù hợp</div>"
                                    : "<div class='flex items-center justify-center h-full text-gray-500'>Chưa có sản phẩm nào</div>"
                            }
                        />
                    </div>
                </div>
                
                {filteredProducts.length > 0 && (
                    <motion.div 
                        className="p-3 flex items-center justify-between border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <span className="text-sm text-gray-500">
                            Hiển thị {filteredProducts.length} sản phẩm
                        </span>
                        
                        <div className="flex items-center space-x-1">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-xs h-8 px-3 text-indigo-600"
                                disabled
                            >
                                Xem tất cả
                            </Button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
            
            {/* Statistics cards */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
            >
                <StatCard 
                    title="Tổng sản phẩm" 
                    value={products.length} 
                    icon={<Package className="w-5 h-5 text-blue-500" />}
                    delay={1.0}
                />
                <StatCard 
                    title="Đang bán" 
                    value={products.filter(p => p.status).length} 
                    icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                    delay={1.1}
                />
                <StatCard 
                    title="Hết hàng" 
                    value={products.filter(p => p.stock === 0).length} 
                    icon={<Archive className="w-5 h-5 text-red-500" />}
                    delay={1.2}
                />
                <StatCard 
                    title="Tổng giá trị" 
                    value={`${(products.reduce((sum, p) => sum + (p.price * p.stock), 0) / 1000000).toFixed(1)}M`} 
                    icon={<DollarSign className="w-5 h-5 text-purple-500" />}
                    delay={1.3}
                />
            </motion.div>
            
            <style jsx global>{`
                .ag-theme-alpine {
                    --ag-background-color: transparent;
                    --ag-odd-row-background-color: rgba(240, 245, 255, 0.5);
                    --ag-header-background-color: rgba(224, 231, 255, 0.7);
                    --ag-row-hover-color: rgba(224, 231, 255, 0.7);
                    --ag-selected-row-background-color: rgba(199, 210, 254, 0.5);
                    --ag-font-family: 'Inter', sans-serif;
                    --ag-border-color: rgba(199, 210, 254, 0.5);
                }
                
                .ag-theme-alpine .ag-header {
                    font-weight: 600;
                    color: #4F46E5;
                }
                
                .ag-theme-alpine .ag-row {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid rgba(224, 231, 255, 0.7);
                }
                
                .ag-theme-alpine .no-click {
                    pointer-events: none;
                }
                
                .ag-theme-alpine .ag-row:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    z-index: 2;
                }
                
                /* Custom scrollbar for modern browsers */
                .ag-theme-alpine ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .ag-theme-alpine ::-webkit-scrollbar-track {
                    background: rgba(240, 245, 255, 0.5);
                    border-radius: 8px;
                }
                
                .ag-theme-alpine ::-webkit-scrollbar-thumb {
                    background-color: rgba(99, 102, 241, 0.3);
                    border-radius: 8px;
                    transition: background-color 0.2s;
                }
                
                .ag-theme-alpine ::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(99, 102, 241, 0.5);
                }
            `}</style>
            
            <ProductFormDialog
                open={openForm}
                onClose={handleCloseForm}
                product={selectedProduct}
                onSubmit={() => { loadProducts() }}
                createProduct={createProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                brands={brands}
            />
        </motion.div>
    );
}

// Stat Card Component
const StatCard = ({ title, value, icon, delay = 0 }) => {
    return (
        <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/30 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
            }}
        >
            <motion.div 
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-indigo-100/50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
            />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">{title}</h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: delay + 0.3 }}
                    >
                        <span className="text-3xl font-bold text-indigo-900">{value}</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: () => void;
    createProduct: (name: string, price: number, stock: number, status: boolean, brand_id: string, details: any) => Promise<any>;
    updateProduct: (id: string, data: any) => Promise<any>;
    deleteProduct: (id: string) => Promise<any>;
    brands: { id: string; name: string }[];
}

function ProductFormDialog({
    open,
    onClose,
    product,
    onSubmit,
    createProduct,
    updateProduct,
    deleteProduct,
    brands
}: ProductFormProps) {
    const [specifications, setSpecifications] = useState<{ name: string, value: string }[]>([]);
    const [newSpecName, setNewSpecName] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keyword, setKeyword] = useState("");
    const loadingToastRef = useRef<string | number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<z.infer<typeof productFormSchema>>({
        // @ts-expect-error any
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
            status: true,
            brand_id: "",
            description: "",
            images: [],
            keywords: [],
            specifications: [],
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                price: product.price,
                stock: product.stock,
                status: product.status,
                brand_id: product.brand_id,
                description: product.details.description,
                images: product.details.images,
                keywords: product.details.keywords,
                specifications: product.details.specifications,
            });
            setSpecifications(product.details.specifications);
            setImages(product.details.images);
            setKeywords(product.details.keywords);
        } else {
            form.reset({
                name: "",
                price: 0,
                stock: 0,
                status: true,
                brand_id: "",
                description: "",
                images: [],
                keywords: [],
                specifications: [],
            });
            setSpecifications([]);
            setImages([]);
            setKeywords([]);
        }
    }, [product, form]);

    const addSpecification = () => {
        if (newSpecName && newSpecValue) {
            const newSpec = { name: newSpecName, value: newSpecValue };
            const newSpecs = [...specifications, newSpec];
            setSpecifications(newSpecs);
            form.setValue('specifications', newSpecs);
            setNewSpecName("");
            setNewSpecValue("");
        }
    };

    const removeSpecification = (index: number) => {
        const newSpecs = [...specifications];
        newSpecs.splice(index, 1);
        setSpecifications(newSpecs);
        form.setValue('specifications', newSpecs);
    };

    // const addImage = () => {
    //     if (imageUrl && !images.includes(imageUrl)) {
    //         const newImages = [...images, imageUrl];
    //         setImages(newImages);
    //         form.setValue('images', newImages);
    //         setImageUrl("");
    //     }
    // };

    // const removeImage = (index: number) => {
    //     const newImages = [...images];
    //     newImages.splice(index, 1);
    //     setImages(newImages);
    //     form.setValue('images', newImages);
    // };

    const addKeyword = () => {
        if (keyword && !keywords.includes(keyword)) {
            const newKeywords = [...keywords, keyword];
            setKeywords(newKeywords);
            form.setValue('keywords', newKeywords);
            setKeyword("");
        }
    };

    const removeKeyword = (index: number) => {
        const newKeywords = [...keywords];
        newKeywords.splice(index, 1);
        setKeywords(newKeywords);
        // Cập nhật giá trị trong form
        form.setValue('keywords', newKeywords);
    };

    // Cleanup loading toast on unmount
    useEffect(() => {
        return () => {
            if (loadingToastRef.current) {
                toast.dismiss(loadingToastRef.current);
            }
        };
    }, []);

    const handleSubmit = async (values: z.infer<typeof productFormSchema>) => {
        setIsProcessing(true);
        const details = {
            description: values.description,
            images: images,
            keywords: keywords,
            specifications: specifications.map(({ __typename, ...rest }) => rest)
        };

        try {
            if (product) {
                console.log("Updating product:", product.id, details.specifications);
                await toast.promise(
                    updateProduct(product.id, {
                        name: values.name,
                        price: values.price,
                        stock: values.stock,
                        status: values.status,
                        brand_id: values.brand_id,
                        details: details
                    }),
                    {
                        loading: "Đang cập nhật sản phẩm...",
                        success: "Cập nhật sản phẩm thành công",
                        error: "Cập nhật sản phẩm thất bại"
                    }
                );
            } else {
                await toast.promise(
                    createProduct(
                        values.name,
                        values.price,
                        values.stock,
                        values.status,
                        values.brand_id,
                        details
                    ),
                    {
                        loading: "Đang tạo sản phẩm mới...",
                        success: "Tạo sản phẩm thành công",
                        error: "Tạo sản phẩm thất bại"
                    }
                );
            }

            onClose();
            onSubmit();
        } catch (error) {
            console.error("Error submitting product:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!product) return;

        setIsProcessing(true);
        try {
            await toast.promise(
                deleteProduct(product.id),
                {
                    loading: "Đang xóa sản phẩm...",
                    success: "Xóa sản phẩm thành công",
                    error: "Xóa sản phẩm thất bại"
                }
            );
            
            onClose();
            onSubmit();
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border border-indigo-100 bg-white/95 backdrop-blur-sm shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                        {product ? (
                            <>
                                <Edit className="h-5 w-5 text-indigo-600" />
                                Chỉnh sửa sản phẩm
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5 text-indigo-600" />
                                Thêm sản phẩm mới
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {product
                            ? "Chỉnh sửa thông tin sản phẩm hiện có."
                            : "Thêm một sản phẩm mới vào hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên sản phẩm</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên sản phẩm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="brand_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thương hiệu</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn thương hiệu" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá (VNĐ)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập giá sản phẩm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng tồn kho</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập số lượng tồn kho"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Đang bán
                                            </FormLabel>
                                            <FormDescription>
                                                Sản phẩm sẽ được hiển thị trên trang web nếu được đánh dấu.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả sản phẩm</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập mô tả chi tiết về sản phẩm"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div>
                                <FormLabel>Hình ảnh sản phẩm</FormLabel>
                                <ProductImagesManager images={images} setImages={setImages} productName={form.watch("name")}/>
                                {/* <div className="flex space-x-2 mt-2">
                                    <Input
                                        placeholder="Nhập URL hình ảnh"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                    <Button type="button" onClick={addImage}>Thêm</Button>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group h-24 w-full">
                                            <img
                                                src={img}
                                                alt={`Product image ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-md"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/laptop.png";
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div> */}
                                {form.formState.errors.images && (
                                    <p className="text-sm font-medium text-destructive mt-1">
                                        {form.formState.errors.images.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <FormLabel>Từ khóa tìm kiếm</FormLabel>
                                <div className="flex space-x-2 mt-2">
                                    <Input
                                        placeholder="Nhập từ khóa"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <Button type="button" onClick={addKeyword}>Thêm</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {keywords.map((kw, idx) => (
                                        <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1">
                                            <span>{kw}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeKeyword(idx)}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <FormLabel>Thông số kỹ thuật</FormLabel>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Input
                                        placeholder="Tên thông số"
                                        value={newSpecName}
                                        onChange={(e) => setNewSpecName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Giá trị"
                                        value={newSpecValue}
                                        onChange={(e) => setNewSpecValue(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={addSpecification} className="mt-2">
                                    Thêm thông số
                                </Button>
                                <div className="mt-2 border rounded-md divide-y">
                                    {specifications.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-2">
                                            <div>
                                                <span className="font-medium">{spec.name}: </span>
                                                <span>{spec.value}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(idx)}
                                                className="text-red-500"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    {specifications.length === 0 && (
                                        <p className="p-2 text-gray-500 italic">Chưa có thông số nào</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex items-center justify-between w-full pt-4">
                            <div className="flex gap-2">
                                {product && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isProcessing}
                                            className="flex items-center gap-1"
                                        >
                                            {isProcessing ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            Xóa
                                        </Button>
                                    </motion.div>
                                )}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                        variant="outline" 
                                        type="button" 
                                        onClick={onClose}
                                        className="border-gray-200"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Hủy
                                    </Button>
                                </motion.div>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                >
                                    {isProcessing ? (
                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        product ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />
                                    )}
                                    {product ? "Cập nhật" : "Tạo mới"}
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}