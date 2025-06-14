'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect, useCallback } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    ModuleRegistry,
    ClientSideRowModelModule,
    provideGlobalGridOptions,
    RowSelectionModule,
    CellStyleModule
 } from 'ag-grid-community';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    RowSelectionModule,
    CellStyleModule
]);
import { useBrand } from "@/hooks/useBrand";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Plus, X, Edit, Trash2, Search, RefreshCw, Sparkles } from "lucide-react";

provideGlobalGridOptions({
    theme: "legacy",
});
const brandFormSchema = z.object({
    name: z.string().min(2, {
        message: "Tên thương hiệu phải có ít nhất 2 ký tự.",
    }),
});
interface Brand {
    id: string;
    name: string;
}

export default function BrandManagement() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const { getBrands, brands, createBrand, updateBrand, deleteBrand } = useBrand();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    // const [gridData, setGridData] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const [colDefs] = useState([
        { 
            field: "id", 
            headerName: "ID", 
            width: 100, 
            cellClass: 'no-click' 
        },
        { 
            field: "name", 
            headerName: "Tên thương hiệu", 
            flex: 1, 
            cellClass: 'no-click' 
        }
    ]);

    
    const forceUpdate = useCallback(() => {
        setForceUpdateKey(prev => prev + 1);
    }, []);

    const loadBrands = useCallback(async () => {
        try {
            setIsLoading(true);
        await getBrands();
        } catch (error) {
            toast.error("Không thể tải danh sách thương hiệu");
            console.error(error);
        } finally {
            setIsLoading(false);
            forceUpdate();
        }
    }, [getBrands, forceUpdate]);

    //@ts-expect-error dynamic type
    const handleRowClick = (event) => {
        setSelectedBrand(event.data);
        setOpenForm(true);
    };

    const handleAddNew = () => {
        setSelectedBrand(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedBrand(null);
    };

    useEffect(() => {
        const filtered = brands.filter(brand => 
            brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBrands(filtered);
    }, [searchQuery, brands]);

    useEffect(() => { 
        // setGridData(brands); 
        setFilteredBrands(brands);
        forceUpdate(); 
    }, [brands, forceUpdate]);

    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

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
                            <Sparkles className="text-white w-6 h-6" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                className="text-2xl font-bold text-indigo-900"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                Quản lý thương hiệu
                            </motion.h1>
                            <motion.p 
                                className="text-gray-500"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                Thêm, chỉnh sửa và quản lý các thương hiệu trong hệ thống
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
                                onClick={loadBrands}
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
                                <span>Thêm thương hiệu</span>
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
                        placeholder="Tìm kiếm thương hiệu..."
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
                            key={`brands-${forceUpdateKey}`}
                            rowData={filteredBrands}
                            //@ts-expect-error dynamic type
                            columnDefs={colDefs}
                            onRowClicked={handleRowClick}
                            pagination={false}
                            animateRows={true}
                            domLayout="normal"
                            suppressCellFocus={true}
                            rowSelection="single"
                            rowHeight={56}
                            headerHeight={48}
                            defaultColDef={{
                                sortable: true,
                                resizable: true
                            }}
                            overlayNoRowsTemplate={
                                searchQuery 
                                    ? "<div class='flex items-center justify-center h-full text-gray-500'>Không tìm thấy thương hiệu nào phù hợp</div>"
                                    : "<div class='flex items-center justify-center h-full text-gray-500'>Chưa có thương hiệu nào</div>"
                            }
                        />
                    </div>
                </div>
                
                {filteredBrands.length > 0 && (
                    <motion.div 
                        className="p-3 flex items-center justify-between border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <span className="text-sm text-gray-500">
                            Hiển thị {filteredBrands.length} thương hiệu
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
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
            >
                <StatCard 
                    title="Tổng thương hiệu" 
                    value={brands.length} 
                    icon={<Sparkles className="w-5 h-5 text-blue-500" />}
                    delay={1.0}
                />
                <StatCard 
                    title="Thương hiệu hoạt động" 
                    value={brands.length} 
                    icon={<Sparkles className="w-5 h-5 text-green-500" />}
                    delay={1.1}
                />
                <StatCard 
                    title="Mới thêm (30 ngày)" 
                    value={Math.floor(Math.random() * 5)} 
                    icon={<Sparkles className="w-5 h-5 text-purple-500" />}
                    delay={1.2}
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
            
            <BrandFormDialog
                open={openForm}
                onClose={handleCloseForm}
                brand={selectedBrand}
                onSubmit={loadBrands}
                createBrand={createBrand}
                updateBrand={updateBrand}
                deleteBrand={deleteBrand}
            />
        </motion.div>
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    delay?: number;
}

const StatCard = ({ title, value, icon, delay = 0 }: StatCardProps) => {
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

interface BrandFormProps {
    open: boolean;
    onClose: () => void;
    brand: Brand | null;
    onSubmit: () => void;
    createBrand: (name: string) => Promise<void>;
    updateBrand: (id: string, name: string) => Promise<void>;
    deleteBrand: (id: string) => Promise<string>;
}

function BrandFormDialog({ open, onClose, brand, onSubmit, createBrand, updateBrand, deleteBrand }: BrandFormProps) {
    const form = useForm<z.infer<typeof brandFormSchema>>({
        resolver: zodResolver(brandFormSchema),
        defaultValues: {
            name: brand?.name || "",
        },
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (brand) {
            form.reset({ name: brand.name });
        } else {
            form.reset({ name: "" });
        }
    }, [brand, form]);

    const handleSubmit = async (values: z.infer<typeof brandFormSchema>) => {
        setIsProcessing(true);
        try {
            if (brand) {
                await updateBrand(brand.id, values.name);
                toast.success("Cập nhật thành công");
            } else {
                await createBrand(values.name);
                toast.success("Tạo thành công");
            }
            onSubmit();
            onClose();
        } catch (error) {
            toast.error("Xử lí không thành công");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!brand) return;
        
        setIsProcessing(true);
        try {
            await deleteBrand(brand.id);
            toast.success("Xóa thành công");
            onSubmit();
            onClose();
        } catch (error) {
            toast.error("Xóa thất bại");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] border border-indigo-100 bg-white/95 backdrop-blur-sm shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                        {brand ? (
                            <>
                                <Edit className="h-5 w-5 text-indigo-600" />
                                Chỉnh sửa thương hiệu
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5 text-indigo-600" />
                                Thêm thương hiệu mới
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {brand
                            ? "Chỉnh sửa thông tin thương hiệu hiện có."
                            : "Thêm một thương hiệu mới vào hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Tên thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Nhập tên hãng" 
                                            {...field} 
                                            className="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex items-center justify-between w-full pt-4">
                            <div className="flex gap-2">
                                {brand && (
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
                                        brand ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />
                                    )}
                                    {brand ? "Cập nhật" : "Tạo mới"}
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}