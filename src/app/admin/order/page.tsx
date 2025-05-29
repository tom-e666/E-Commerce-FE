'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect, useRef } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { useOrder } from "@/hooks/useOrder";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import {Search, RefreshCw, ShoppingCart, DollarSign, Clock, Check, Truck, Package, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({
    theme: "legacy",
});

export default function OrderManagement() {
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("all");
    const { orders, getOrder, getOrders, confirmOrder, shipOrder, deliverOrder, cancelOrder } = useOrder();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [gridData, setGridData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const loadingToastRef = useRef<string | number | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const statusColors = new Map([
        ["pending", "bg-yellow-100 text-yellow-800"],
        ["confirmed", "bg-blue-100 text-blue-800"],
        ["processing", "bg-orange-100 text-orange-800"],
        ["shipping", "bg-purple-100 text-purple-800"],
        ["completed", "bg-green-100 text-green-800"],
        ["cancelled", "bg-red-100 text-red-800"],
        ["failed", "bg-gray-100 text-gray-800"]
    ]);

    const statusIcons = {
        pending: <Clock className="h-4 w-4 mr-1" />,
        confirmed: <Check className="h-4 w-4 mr-1" />,
        processing: <Loader2 className="h-4 w-4 mr-1" />,
        shipping: <Truck className="h-4 w-4 mr-1" />,
        completed: <Package className="h-4 w-4 mr-1" />,
        cancelled: <X className="h-4 w-4 mr-1" />,
        failed: <AlertCircle className="h-4 w-4 mr-1" />
    };

    const [colDefs] = useState([
        {
            field: "id",
            headerName: "Mã đơn hàng",
            flex: 2,
            minWidth: 150
        },
        {
            field: "created_at",
            headerName: "Ngày đặt",
            flex: 1.5,
            minWidth: 120,
            // @ts-expect-error any
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString('vi-VN');
            }
        },
        {
            field: "total_price",
            headerName: "Tổng tiền",
            flex: 1.5,
            minWidth: 120,
            // @ts-expect-error any
            valueFormatter: (params) => {
                return formatCurrency(params.value);
            }
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1.5,
            minWidth: 130,
            // @ts-expect-error any
            cellRenderer: (params) => {
                const status = params?.value || "unknown";
                const statusClass = statusColors.get(status) || "bg-gray-100 text-gray-800";
                // @ts-expect-error object deref
                const icon = statusIcons[status] || <AlertCircle className="h-4 w-4 mr-1" />;
                let displayText = status.charAt(0).toUpperCase() + status.slice(1);

                switch(status) {
                    case 'pending': displayText = "Chờ xác nhận"; break;
                    case 'confirmed': displayText = "Đã xác nhận"; break;
                    case 'processing': displayText = "Đang xử lý"; break;
                    case 'shipping': displayText = "Đang giao hàng"; break;
                    case 'completed': displayText = "Hoàn thành"; break;
                    case 'cancelled': displayText = "Đã hủy"; break;
                    case 'failed': displayText = "Thất bại"; break;
                }

                return (
                    <div className={`flex items-center justify-center px-2 py-1 rounded-full ${statusClass}`}>
                        {icon}
                        <span>{displayText}</span>
                    </div>
                );
            }
        },
        {
            field: "user_id",
            headerName: "Mã khách hàng",
            flex: 1.5,
            minWidth: 120,
        },
        {
            field: "items",
            headerName: "Số sản phẩm",
            flex: 1,
            minWidth: 100,
            // @ts-expect-error any
            valueFormatter: (params) => {
                return params.value ? params.value.length : 0;
            }
        }
    ]);

    useEffect(() => {
        const filtered = filter === "all"
            ? orders
            : orders.filter(order => order.status === filter);
        
        const searchFiltered = filtered.filter(order =>
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // @ts-expect-error any
        setGridData(searchFiltered);
        setFilteredOrders(searchFiltered);
        forceUpdate();
    }, [orders, filter, searchQuery]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };

    // Cleanup any loading toasts on unmount
    useEffect(() => {
        return () => {
            if (loadingToastRef.current) {
                toast.dismiss(loadingToastRef.current);
            }
        };
    }, []);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            await toast.promise(
                getOrders(),
                {
                    loading: "Đang tải danh sách đơn hàng...",
                    success: "Tải danh sách đơn hàng thành công",
                    error: "Không thể tải danh sách đơn hàng"
                }
            );
        } catch (error) {
            toast.error("Không thể tải danh sách đơn hàng");
            console.error("Error loading orders:", error);
        } finally {
            setIsLoading(false);
            forceUpdate();
        }
    };
    // @ts-expect-error any
    const handleRowClick = async (event) => {
        try {
            const orderId = event.data.id;
            const order = await getOrder(orderId);
            setSelectedOrder(order);
            setOpenDetail(true);
        } catch (error) {
            toast.error("Không thể tải thông tin đơn hàng");
            console.error(error);
        }
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedOrder(null);
    };
    // @ts-expect-error any
    const handleStatusChange = async (action, orderId) => {
        try {
            switch (action) {
                case 'confirm':
                    await toast.promise(
                        confirmOrder(orderId),
                        {
                            loading: "Đang xác nhận đơn hàng...",
                            success: "Đơn hàng đã được xác nhận",
                            error: "Không thể xác nhận đơn hàng"
                        }
                    );
                    break;
                case 'ship':
                    await toast.promise(
                        shipOrder(orderId),
                        {
                            loading: "Đang cập nhật trạng thái giao hàng...",
                            success: "Đơn hàng đã được giao cho đơn vị vận chuyển",
                            error: "Không thể cập nhật trạng thái giao hàng"
                        }
                    );
                    break;
                case 'deliver':
                    await toast.promise(
                        deliverOrder(orderId),
                        {
                            loading: "Đang cập nhật trạng thái giao hàng...",
                            success: "Đơn hàng đã được giao thành công",
                            error: "Không thể cập nhật trạng thái giao hàng"
                        }
                    );
                    break;
                case 'cancel':
                    await toast.promise(
                        cancelOrder(orderId),
                        {
                            loading: "Đang hủy đơn hàng...",
                            success: "Đơn hàng đã được hủy",
                            error: "Không thể hủy đơn hàng"
                        }
                    );
                    break;
                default:
                    break;
            }

            if (selectedOrder) {
                const updatedOrder = await getOrder(orderId);
                setSelectedOrder(updatedOrder);
            }

            await loadOrders();

        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };
    // @ts-expect-error any
    const handleFilterChange = (value) => {
        setFilter(value);
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
                            <ShoppingCart className="text-white w-6 h-6" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                className="text-2xl font-bold text-indigo-900"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                Quản lý đơn hàng
                            </motion.h1>
                            <motion.p 
                                className="text-gray-500"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                Theo dõi và quản lý tất cả đơn hàng trong hệ thống
                            </motion.p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="flex items-center space-x-2">
                            <Label className="text-indigo-700 font-medium">Lọc theo trạng thái:</Label>
                            <Select
                                value={filter}
                                onValueChange={handleFilterChange}
                            >
                                <SelectTrigger className="w-[180px] border-indigo-200 focus:border-indigo-300">
                                    <SelectValue placeholder="Tất cả đơn hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="shipping">Đang giao hàng</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                    <SelectItem value="failed">Thất bại</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                variant="outline" 
                                onClick={loadOrders}
                                className="flex items-center gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Làm mới</span>
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
                        placeholder="Tìm kiếm đơn hàng..."
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
                className="relative overflow-hidden rounded-xl shadow-xl bg-white/80 backdrop-blur-md mb-6"
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
                            key={`orders-${forceUpdateKey}`}
                            rowData={gridData}
                            // @ts-expect-error any
                            columnDefs={colDefs}
                            onRowClicked={handleRowClick}
                            pagination={false}
                            animateRows={true}
                            domLayout="normal"
                            suppessCellClick={true}
                            defaultColDef={{
                                resizable: true,
                                sortable: true
                            }}
                            rowHeight={56}
                            headerHeight={48}
                            autoSizeColumns={true}
                            suppressColumnVirtualisation={true}
                            overlayNoRowsTemplate={
                                searchQuery || filter !== "all"
                                    ? "<div class='flex items-center justify-center h-full text-gray-500'>Không tìm thấy đơn hàng nào phù hợp</div>"
                                    : "<div class='flex items-center justify-center h-full text-gray-500'>Chưa có đơn hàng nào</div>"
                            }
                        />
                    </div>
                </div>
                
                {filteredOrders.length > 0 && (
                    <motion.div 
                        className="p-3 flex items-center justify-between border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <span className="text-sm text-gray-500">
                            Hiển thị {filteredOrders.length} đơn hàng
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
                    title="Tổng đơn hàng" 
                    value={orders.length} 
                    icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
                    delay={1.0}
                />
                <StatCard 
                    title="Chờ xác nhận" 
                    value={orders.filter(o => o.status === 'pending').length} 
                    icon={<Clock className="w-5 h-5 text-yellow-500" />}
                    delay={1.1}
                />
                <StatCard 
                    title="Hoàn thành" 
                    value={orders.filter(o => o.status === 'completed').length} 
                    icon={<Package className="w-5 h-5 text-green-500" />}
                    delay={1.2}
                />
                <StatCard 
                    title="Doanh thu" 
                    value={`${(orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_price, 0) / 1000000).toFixed(1)}M`} 
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

            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-4xl border border-indigo-100 bg-white/95 backdrop-blur-sm shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-indigo-600" />
                            Chi tiết đơn hàng
                        </DialogTitle>
                        <DialogDescription className="text-gray-500">
                            Mã đơn hàng: {selectedOrder?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            <Tabs defaultValue="details">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="details">Thông tin đơn hàng</TabsTrigger>
                                    <TabsTrigger value="items">Sản phẩm ({selectedOrder.items.length})</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-medium">Thông tin chung</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Ngày đặt hàng:</span>
                                                    <span>{new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Trạng thái:</span>
                                                    <Badge className={statusColors.get(selectedOrder.status)}>
                                                        {statusIcons[selectedOrder.status]}
                                                        {selectedOrder.status === 'pending' ? 'Chờ xác nhận' :
                                                          selectedOrder.status === 'confirmed' ? 'Đã xác nhận' :
                                                          selectedOrder.status === 'processing' ? 'Đang xử lý' :
                                                          selectedOrder.status === 'shipping' ? 'Đang giao hàng' :
                                                          selectedOrder.status === 'completed' ? 'Hoàn thành' :
                                                          selectedOrder.status === 'cancelled' ? 'Đã hủy' :
                                                          selectedOrder.status === 'failed' ? 'Thất bại' :
                                                          selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Mã khách hàng:</span>
                                                    <span>{selectedOrder.user_id || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Tổng tiền:</span>
                                                    <span className="font-medium">{formatCurrency(selectedOrder.total_price)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium">Thông tin giao hàng</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Người nhận:</span>
                                                    <span>{selectedOrder.recipient_name || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Số điện thoại:</span>
                                                    <span>{selectedOrder.recipient_phone || "N/A"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Địa chỉ:</span>
                                                    <p className="mt-1">{selectedOrder.shipping_address || "N/A"}</p>
                                                </div>
                                                {selectedOrder.notes && (
                                                    <div>
                                                        <span className="text-muted-foreground">Ghi chú:</span>
                                                        <p className="mt-1">{selectedOrder.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="font-medium mb-2">Lịch sử đơn hàng</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    Đơn hàng được tạo
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                                                </span>
                                            </div>

                                            {selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled' && (
                                                <div className="flex items-center space-x-2">
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Đơn hàng đã xác nhận
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {/* This would typically come from the API */}
                                                    </span>
                                                </div>
                                            )}

                                            {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                                                <div className="flex items-center space-x-2">
                                                    <Badge className="bg-purple-100 text-purple-800">
                                                        <Truck className="h-4 w-4 mr-1" />
                                                        Đang giao hàng
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">

                                                    </span>
                                                </div>
                                            )}

                                            {selectedOrder.status === 'delivered' && (
                                                <div className="flex items-center space-x-2">
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <Package className="h-4 w-4 mr-1" />
                                                        Đã giao hàng
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {/* This would typically come from the API */}
                                                    </span>
                                                </div>
                                            )}

                                            {selectedOrder.status === 'cancelled' && (
                                                <div className="flex items-center space-x-2">
                                                    <Badge className="bg-red-100 text-red-800">
                                                        <X className="h-4 w-4 mr-1" />
                                                        Đã hủy
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {/* This would typically come from the API */}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="items">
                                    <div className="space-y-4">

                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex items-center p-3 border rounded-md">
                                                <div className="h-16 w-16 relative rounded overflow-hidden flex-shrink-0 mr-4">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                                            <Package className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium">{item.name}</h4>
                                                        <span>{formatCurrency(item.price)}</span>
                                                    </div>
                                                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                                                        <span>SL: {item.quantity}</span>
                                                        <span>Thành tiền: {formatCurrency(item.price * item.quantity)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between">
                                                <span>Tạm tính:</span>
                                                <span>{formatCurrency(selectedOrder.total_price)}</span>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span>Phí vận chuyển:</span>
                                                <span>Miễn phí</span>
                                            </div>
                                            <div className="flex justify-between mt-2 font-bold">
                                                <span>Tổng cộng:</span>
                                                <span>{formatCurrency(selectedOrder.total_price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    <DialogFooter className="flex justify-between">
                        <div className="flex space-x-2">
                            {selectedOrder && selectedOrder.status === 'pending' && (
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleStatusChange('cancel', selectedOrder.id)}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Hủy đơn hàng
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="default"
                                            onClick={() => handleStatusChange('confirm', selectedOrder.id)}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Xác nhận
                                        </Button>
                                    </motion.div>
                                </>
                            )}

                            {selectedOrder && selectedOrder.status === 'confirmed' && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="default"
                                        onClick={() => handleStatusChange('ship', selectedOrder.id)}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                    >
                                        <Truck className="mr-2 h-4 w-4" />
                                        Giao hàng
                                    </Button>
                                </motion.div>
                            )}

                            {selectedOrder && selectedOrder.status === 'shipping' && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="default"
                                        onClick={() => handleStatusChange('deliver', selectedOrder.id)}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                    >
                                        <Package className="mr-2 h-4 w-4" />
                                        Hoàn thành giao hàng
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" onClick={handleCloseDetail} className="border-gray-200">
                                <X className="h-4 w-4 mr-2" />
                                Đóng
                            </Button>
                        </motion.div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

// Stat Card Component (same as brand page)
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