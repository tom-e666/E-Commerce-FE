'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect, useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import { useBrand } from "@/hooks/useBrand";
import { useProduct } from "@/hooks/useProduct";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Plus, Search, RefreshCw, Package, DollarSign, TrendingUp, Archive } from "lucide-react";
import ProductFormDialog from "./ProductFormDialog";

import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({
    theme: "legacy",
});

interface Product {
    id: string;
    name: string;
    price: number;
    default_price: number;
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
    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Transform mouse position to background gradient
    const background = useTransform(
        [mouseX, mouseY],
        ([x, y]) => `radial-gradient(
            circle at ${x}px ${y}px,
            rgba(79, 70, 229, 0.15) 0%,
            rgba(79, 70, 229, 0.05) 40%,
            transparent 60%
        )`
    );

    const [openForm, setOpenForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { 
        getProducts,
        // products,
        resetAndLoadProducts,
        loadMoreProducts,
        paginatedProducts, 
        pagination,
        loading,
        isLoadingMore,
        canLoadMore,
        createProduct, 
        updateProduct, 
        deleteProduct 
    } = useProduct();
    const { getBrands, brands } = useBrand();
    
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [isInitialized, setIsInitialized] = useState(false);

    // Current filters
    const currentFilters = useMemo(() => ({
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort_field: sortField,
        sort_direction: sortDirection
    }), [searchQuery, statusFilter, sortField, sortDirection]);

    // Load initial data chỉ một lần
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([
                    getBrands(),
                    getProducts(),
                ]);
                await resetAndLoadProducts({}, 20);
                setIsInitialized(true);
            } catch (error) {
                toast.error("Không thể tải danh sách sản phẩm");
                console.error("Error loading initial data:", error);
            }
        };

        loadInitialData();
    }, []);

    // Reload when filters change - chỉ sau khi đã initialized
    useEffect(() => {
        if (!isInitialized) return;

        const timeoutId = setTimeout(() => {
            resetAndLoadProducts(currentFilters, 20);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [currentFilters, isInitialized]);

    const handleLoadMore = async () => {
        try {
            await loadMoreProducts();
        } catch (error) {
            toast.error("Không thể tải thêm sản phẩm");
        }
    };

    const colDefs = useMemo(() => [
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
                return params.value ? 'Đang bán' : 'Ngừng bán';
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
    ], [brands]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };

    // @ts-expect-error any
    const handleRowClick = (event) => {
        if (event.event && event.event.target) {
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

    const handleMouseMove = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
    };

    // Function to reload data after create/update/delete
    const handleFormSubmit = async () => {
        try {
            await Promise.all([
                getProducts(),
                resetAndLoadProducts(currentFilters, 20)
            ]);
            forceUpdate();
        } catch (error) {
            toast.error("Không thể làm mới danh sách sản phẩm");
        }
    };

    return (
        <motion.div className="w-full min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <motion.div 
                className="relative p-6 mb-8 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-xl overflow-hidden"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onMouseMove={handleMouseMove}
            >
                <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ background }}
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
                                onClick={handleFormSubmit}
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
            
            {/* Search and Filters */}
            <motion.div className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="true">Đang bán</SelectItem>
                            <SelectItem value="false">Ngừng bán</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={`${sortField}_${sortDirection}`} onValueChange={(value) => {
                        const [field, direction] = value.split('_');
                        setSortField(field);
                        setSortDirection(direction);
                    }}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name_asc">Tên A-Z</SelectItem>
                            <SelectItem value="name_desc">Tên Z-A</SelectItem>
                            <SelectItem value="price_asc">Giá thấp-cao</SelectItem>
                            <SelectItem value="price_desc">Giá cao-thấp</SelectItem>
                            <SelectItem value="stock_desc">Tồn kho nhiều</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            {/* Data grid */}
            <motion.div className="relative overflow-hidden rounded-xl shadow-xl bg-white/80 backdrop-blur-md">
                <div className="relative z-10 p-0.5">
                    <div className="ag-theme-alpine w-full h-[500px] rounded-lg overflow-hidden">
                        <AgGridReact
                            key={`products-${forceUpdateKey}`}
                            rowData={paginatedProducts}
                            // @ts-expect-error any
                            columnDefs={colDefs}
                            onRowClicked={handleRowClick}
                            pagination={false}
                            animateRows={false}
                            domLayout="normal"
                            loading={loading}
                            suppressCellFocus={true}
                            suppressRowClickSelection={false}
                            rowSelection="single"
                            rowHeight={56}
                            headerHeight={48}
                            suppressScrollOnNewData={true}
                            suppressRowDeselection={true}
                            defaultColDef={{
                                sortable: false,
                                resizable: true
                            }}
                        />
                    </div>
                </div>
                
                {/* Pagination Info and Load More */}
                <motion.div className="p-3 flex items-center justify-between border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm">
                    <span className="text-sm text-gray-500">
                        Hiển thị {paginatedProducts.length} / {pagination?.total || 0} sản phẩm
                        {pagination && ` (Trang ${pagination.current_page}/${pagination.last_page})`}
                    </span>
                    
                    {canLoadMore && (
                        <Button 
                            variant="outline"
                            size="sm"
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="text-indigo-600"
                        >
                            {isLoadingMore ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải...
                                </>
                            ) : (
                                <>Tải thêm ({pagination?.total! - paginatedProducts.length})</>
                            )}
                        </Button>
                    )}
                </motion.div>
            </motion.div>
            
            {/* Statistics cards */}
            {/* <motion.div 
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
            </motion.div> */}
            
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
            
            {/* Sử dụng component ProductFormDialog đã tách */}
            <ProductFormDialog
                open={openForm}
                onClose={handleCloseForm}
                product={selectedProduct}
                onSubmit={handleFormSubmit}
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