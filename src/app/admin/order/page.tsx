'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    ClientSideRowModelModule,
    provideGlobalGridOptions,
    ModuleRegistry
 } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import { OrderFilter, useOrder } from "@/hooks/useOrder";
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
import {Search, RefreshCw, ShoppingCart, Clock, Check, Truck, Package, X, AlertCircle, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {Loader2} from "lucide-react";
import React from 'react';
import { OrderInterface } from '@/services/order/endpoints';
import { ColDef, ValueFormatterParams, ICellRendererParams } from 'ag-grid-community';
import { useShipping } from '@/hooks/useShipping';
import { Shipping } from '@/services/shipping/endpoints';
import { usePayment } from '@/hooks/usePayment';
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

provideGlobalGridOptions({
    theme: "legacy",
});

const OrderManagement = () => {
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(null);
    const [filter, setFilter] = useState("all");
    const [shipInfor, setShipInfor] = useState<Shipping | null>(null);
    
    const { 
        orders, 
        pagination,
        getOrder, 
        confirmOrder, 
        processingOrder, 
        shipOrder, 
        completeDelivery, 
        cancelOrder, 
        getPaginatedOrders,
        resetAndLoadOrders,
        loadMoreOrders,
        isLoadingMore,
        canLoadMore,
        markOrderFailed
    } = useOrder();

    const { handleFetchShippingByOrderId } = useShipping();
    const { paymentData, fetchPayment } = usePayment();

    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    
    // Add sort state
    const [sortField, setSortField] = useState("created_at");
    const [sortDirection, setSortDirection] = useState("desc");
    
    // Add date filter states
    const [dateFilter, setDateFilter] = useState("all");
    const [customDateFrom, setCustomDateFrom] = useState("");
    const [customDateTo, setCustomDateTo] = useState("");
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    // const loadingToastRef = useRef<string | number | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    // Add status normalization function
    const normalizeStatus = (status: string) => {
        if (!status) return 'pending';
        return status.toLowerCase();
    };

    const statusColors = new Map([
        ["pending", "bg-yellow-100 text-yellow-800"],
        ["confirmed", "bg-blue-100 text-blue-800"],
        ["processing", "bg-orange-100 text-orange-800"],
        ["shipping", "bg-purple-100 text-purple-800"],
        ["completed", "bg-green-100 text-green-800"],
        ["cancelled", "bg-red-100 text-red-800"],
        ["failed", "bg-gray-100 text-gray-800"],
        ["delivery_failed", "bg-red-200 text-red-900"]
    ]);

    const statusIcons = {
        pending: <Clock className="h-4 w-4" />,
        confirmed: <Check className="h-4 w-4" />,
        processing: <Loader2 className="h-4 w-4" />,
        shipping: <Truck className="h-4 w-4" />,
        completed: <Package className="h-4 w-4" />,
        cancelled: <X className="h-4 w-4" />,
        failed: <AlertCircle className="h-4 w-4" />
    };

    const getStatusDisplayText = (status: string) => {
        switch(status) {
            case 'pending': return "Chờ xác nhận";
            case 'confirmed': return "Đã xác nhận";
            case 'processing': return "Đang xử lý";
            case 'shipping': return "Đang giao hàng";
            case 'completed': return "Hoàn thành";
            case 'cancelled': return "Đã hủy";
            case 'failed': return "Thất bại";
            case 'delivery_failed': return "Giao hàng không thành công";
            default: return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getAvailableActions = (status: string) => {
        switch(status) {
            case 'pending':
                return [
                    { action: 'confirm', label: 'Xác nhận đơn hàng', icon: <Check className="mr-2 h-4 w-4" />, variant: 'default' },
                    { action: 'cancel', label: 'Hủy đơn hàng', icon: <X className="mr-2 h-4 w-4" />, variant: 'destructive' }
                ];
            case 'confirmed':
                return [
                    { action: 'process', label: 'Bắt đầu xử lý', icon: <Loader2 className="mr-2 h-4 w-4" />, variant: 'default' },
                    { action: 'cancel', label: 'Hủy đơn hàng', icon: <X className="mr-2 h-4 w-4" />, variant: 'destructive' }
                ];
            case 'processing':
                return [
                    { action: 'ship', label: 'Giao hàng', icon: <Truck className="mr-2 h-4 w-4" />, variant: 'default' },
                    { action: 'cancel', label: 'Hủy đơn hàng', icon: <X className="mr-2 h-4 w-4" />, variant: 'destructive' }
                ];
            case 'shipping':
                return [
                    { action: 'complete', label: 'Hoàn thành giao hàng', icon: <Package className="mr-2 h-4 w-4" />, variant: 'default' },
                    { action: 'delivery_failed', label: 'Giao hàng không thành công', icon: <X className="mr-2 h-4 w-4" />, variant: 'destructive' }
                ];
            default:
                return [];
        }
    };

    // Properly type your column definitions
    const colDefs = useMemo<ColDef<OrderInterface>[]>(() => [
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
            valueFormatter: (params: ValueFormatterParams<OrderInterface>) => {
                return new Date(params.value).toLocaleDateString('vi-VN');
            }
        },
        {
            field: "total_price",
            headerName: "Tổng tiền",
            flex: 1.5,
            minWidth: 120,
            valueFormatter: (params: ValueFormatterParams<OrderInterface>) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(params.value);
            }
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1.5,
            minWidth: 130,
            cellRenderer: (params: ICellRendererParams<OrderInterface>) => {
                return <StatusBadge status={params.value} />;
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
            valueFormatter: (params: ValueFormatterParams<OrderInterface>) => {
                return Array.isArray(params.value) ? params.value.length.toString() : '0';
            }
        }
    ], []);

    const itemsPerPage = 10;

    const currentFilters = useMemo<OrderFilter>(() => {
        // Move getDateRange inside useMemo
        const getDateRange = (filterType: string) => {
            const now = new Date();
            const vietnamOffset = 7 * 60;
            const vietnamTime = new Date(now.getTime() + (vietnamOffset * 60 * 1000));
            
            const today = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth(), vietnamTime.getDate());
            
            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            switch (filterType) {
                case 'today':
                    return {
                        from: formatDate(today),
                        to: formatDate(today)
                    };
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return {
                        from: formatDate(yesterday),
                        to: formatDate(yesterday)
                    };
                case 'last7days':
                    const last7days = new Date(today);
                    last7days.setDate(last7days.getDate() - 7);
                    return {
                        from: formatDate(last7days),
                        to: formatDate(today)
                    };
                case 'last30days':
                    const last30days = new Date(today);
                    last30days.setDate(last30days.getDate() - 30);
                    return {
                        from: formatDate(last30days),
                        to: formatDate(today)
                    };
                case 'thisMonth':
                    const thisMonthStart = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth(), 1);
                    return {
                        from: formatDate(thisMonthStart),
                        to: formatDate(today)
                    };
                case 'lastMonth':
                    const lastMonthStart = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth() - 1, 1);
                    const lastMonthEnd = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth(), 0);
                    return {
                        from: formatDate(lastMonthStart),
                        to: formatDate(lastMonthEnd)
                    };
                case 'custom':
                    return {
                        from: customDateFrom,
                        to: customDateTo
                    };
                default:
                    return null;
            }
        };

        const dateRange = getDateRange(dateFilter);
            
        return {
            status: filter !== "all" ? filter : undefined,
            sortField,
            sortDirection,
            search: searchQuery || undefined,
            createdAfter: dateRange?.from || undefined,
            createdBefore: dateRange?.to || undefined
        };
    }, [dateFilter, filter, searchQuery, sortDirection, sortField, customDateFrom, customDateTo]);

    const forceUpdate = useCallback(() => {
        setForceUpdateKey(prev => prev + 1);
    }, []);
    
    // Load initial orders (reset data)
    const loadInitialOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            
            const filters = {
                status: filter !== "all" ? filter : undefined,
                sortField,
                sortDirection
            };
            
            await toast.promise(
                getPaginatedOrders(1, itemsPerPage, filters, true), // true = reset data
                {
                    loading: "Đang tải đơn hàng...",
                    success: "Tải danh sách đơn hàng thành công",
                    error: "Không thể tải đơn hàng"
                }
            );
        } catch (error) {
            toast.error("Không thể tải đơn hàng");
            console.error("Error loading orders:", error);
        } finally {
            setIsLoading(false);
            forceUpdate();
        }
    }, [filter, sortField, sortDirection, getPaginatedOrders, itemsPerPage, forceUpdate]);

    // Load initial data on component mount
    useEffect(() => {
        loadInitialOrders();
    }, [loadInitialOrders]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            resetAndLoadOrders(currentFilters, 10);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [currentFilters, loadInitialOrders, resetAndLoadOrders]);


    // @ts-expect-error any
    const handleRowClick = async (event) => {
        try {
            const orderId = event.data.id;
            const order = await getOrder(orderId);
            setSelectedOrder(order);
            getShipInfo(orderId);
            getPaymentInfo(orderId);
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

    // Updated status change handler to refresh current page
    const handleStatusChange = async (action: 'confirm' | 'process' | 'ship' | 'complete' | 'cancel' | 'delivery_failed', orderId: string) => {
        setIsUpdatingStatus(true);
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
                case 'process':
                    await toast.promise(
                        processingOrder(orderId),
                        {
                            loading: "Đang chuyển đơn hàng sang xử lý...",
                            success: "Đơn hàng đã chuyển sang trạng thái xử lý",
                            error: "Không thể chuyển đơn hàng sang xử lý"
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
                case 'complete':
                    await toast.promise(
                        completeDelivery(orderId),
                        {
                            loading: "Đang hoàn thành giao hàng...",
                            success: "Đơn hàng đã được giao thành công",
                            error: "Không thể hoàn thành giao hàng"
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
                case 'delivery_failed':
                    await toast.promise(
                        markOrderFailed(orderId),
                        {
                            loading: "Đang cập nhật trạng thái giao hàng không thành công...",
                            success: "Đơn hàng đã được cập nhật trạng thái giao hàng không thành công",
                            error: "Không thể cập nhật trạng thái giao hàng không thành công"
                        }
                    );
                    break;
                default:
                    break;
            }

            // Update selected order if viewing detail
            if (selectedOrder) {
                const updatedOrder = await getOrder(orderId);
                setSelectedOrder(updatedOrder);
            }

        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setIsUpdatingStatus(false);
        }
    };
    // @ts-expect-error any
    const handleFilterChange = (value) => {
        setFilter(value);
    };

    // Handle sort change
    const handleSortChange = (value: string) => {
        const [field, direction] = value.split('-');
        console.log("Sorting by:", field, direction);
        setSortField(field);
        setSortDirection(direction);
    };

    // Handle date filter change
    const handleDateFilterChange = (value: string) => {
        setDateFilter(value);
        // Reset custom dates if not custom filter
        if (value !== 'custom') {
            setCustomDateFrom("");
            setCustomDateTo("");
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilter("all");
        setDateFilter("all");
        setSearchQuery("");
        setCustomDateFrom("");
        setCustomDateTo("");
        setSortField("created_at");
        setSortDirection("desc");
    };

    const getShipInfo = async (orderId: string) => {
        try {
            const shippingInfo = await handleFetchShippingByOrderId(orderId);
            setShipInfor(shippingInfo);
        } catch (error) {
            toast.error("Không thể tải thông tin vận chuyển");
            console.error("Error fetching shipping info:", error);
        }
    }

    const getPaymentInfo = async (orderId: string) => {
        try {
            const paymentInfo = await fetchPayment(orderId);
            return paymentInfo;
        } catch (error) {
            toast.error("Không thể tải thông tin thanh toán");
            console.error("Error fetching payment info:", error);
        }
    }

    // Thêm function helper để lấy trạng thái thanh toán
    const getPaymentStatusConfig = (status: string) => {
        const configs = {
            pending: { 
                label: 'Chờ thanh toán', 
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <Clock className="w-3 h-3" />,
                color: 'yellow'
            },
            completed: { 
                label: 'Đã thanh toán', 
                className: 'bg-green-100 text-green-800 border-green-200',
                icon: <CheckCircle className="w-3 h-3" />,
                color: 'green'
            },
            failed: { 
                label: 'Thanh toán thất bại', 
                className: 'bg-red-100 text-red-800 border-red-200',
                icon: <XCircle className="w-3 h-3" />,
                color: 'red'
            }
        };
        
        return configs[status as keyof typeof configs] || {
            label: 'Không xác định',
            className: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: <AlertTriangle className="w-3 h-3" />,
            color: 'gray'
        };
    };

    // Component PaymentStatusBadge
    const PaymentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const config = getPaymentStatusConfig(status || 'pending');
        
        return (
            <motion.span 
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-default ${config.className}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                {config.icon}
                {config.label}
            </motion.span>
        );
    };

    return (
        <motion.div 
            className="w-full min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onMouseMove={handleMouseMove}
        >
            {/* Header with filters */}
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
                
                <div className="relative z-10">
                    {/* Header title */}
                    <div className="flex justify-between items-center mb-6">
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
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    variant="outline" 
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Xóa bộ lọc</span>
                                </Button>
                            </motion.div>
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    variant="outline" 
                                    onClick={() => resetAndLoadOrders()}
                                    className="flex items-center gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                                    disabled={isLoading}
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    <span>Làm mới</span>
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Filters row */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Status filter */}
                        <div className="flex flex-col space-y-2">
                            <Label className="text-indigo-700 font-medium text-sm">Trạng thái:</Label>
                            <Select
                                value={filter}
                                onValueChange={handleFilterChange}
                            >
                                <SelectTrigger className="border-indigo-200 focus:border-indigo-300">
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
                                    <SelectItem value="delivery_failed">Giao hàng không thành công</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date filter */}
                        <div className="flex flex-col space-y-2">
                            <Label className="text-indigo-700 font-medium text-sm">Thời gian:</Label>
                            <Select
                                value={dateFilter}
                                onValueChange={handleDateFilterChange}
                            >
                                <SelectTrigger className="border-indigo-200 focus:border-indigo-300">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Tất cả thời gian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                                    <SelectItem value="today">Hôm nay</SelectItem>
                                    <SelectItem value="yesterday">Hôm qua</SelectItem>
                                    <SelectItem value="last7days">7 ngày qua</SelectItem>
                                    <SelectItem value="last30days">30 ngày qua</SelectItem>
                                    <SelectItem value="thisMonth">Tháng này</SelectItem>
                                    <SelectItem value="lastMonth">Tháng trước</SelectItem>
                                    <SelectItem value="custom">Tùy chọn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort options */}
                        <div className="flex flex-col space-y-2">
                            <Label className="text-indigo-700 font-medium text-sm">Sắp xếp:</Label>
                            <Select
                                value={`${sortField}-${sortDirection}`}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="border-indigo-200 focus:border-indigo-300">
                                    <SelectValue placeholder="Sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at-desc">📅 Mới nhất</SelectItem>
                                    <SelectItem value="created_at-asc">📅 Cũ nhất</SelectItem>
                                    <SelectItem value="total_price-desc">💰 Giá trị cao</SelectItem>
                                    <SelectItem value="total_price-asc">💰 Giá trị thấp</SelectItem>
                                    <SelectItem value="status-asc">📊 Trạng thái A-Z</SelectItem>
                                    <SelectItem value="status-desc">📊 Trạng thái Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active filters indicator */}
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-wrap gap-1">
                                {filter !== "all" && (
                                    <Badge variant="secondary" className="text-xs">
                                        {filter}
                                        <X 
                                            className="h-3 w-3 ml-1 cursor-pointer" 
                                            onClick={() => setFilter("all")}
                                        />
                                    </Badge>
                                )}
                                {searchQuery && (
                                    <Badge variant="secondary" className="text-xs">
                                        {'\u201C' + searchQuery + '\u201D'}
                                        <X 
                                            className="h-3 w-3 ml-1 cursor-pointer" 
                                            onClick={() => setSearchQuery("")}
                                        />
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Custom date range inputs */}
                    {dateFilter === 'custom' && (
                        <motion.div 
                            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col space-y-2">
                                <Label className="text-indigo-700 font-medium text-sm">Từ ngày:</Label>
                                <Input
                                    type="date"
                                    value={customDateFrom}
                                    onChange={(e) => setCustomDateFrom(e.target.value)}
                                    className="border-indigo-200 focus:border-indigo-300"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label className="text-indigo-700 font-medium text-sm">Đến ngày:</Label>
                                <Input
                                    type="date"
                                    value={customDateTo}
                                    onChange={(e) => setCustomDateTo(e.target.value)}
                                    className="border-indigo-200 focus:border-indigo-300"
                                />
                            </div>
                        </motion.div>
                    )}
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
                        placeholder="Tìm kiếm theo mã đơn hàng hoặc mã khách hàng..."
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

            {/* Data grid */}
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
                            rowData={orders}
                            columnDefs={colDefs}
                            onRowClicked={handleRowClick}
                            pagination={false}
                            animateRows={true}
                            domLayout="normal"
                            loading={isLoading}
                            suppressCellFocus={true}
                            defaultColDef={{
                                resizable: true,
                                sortable: false
                            }}
                            rowHeight={56}
                            headerHeight={48}
                        />
                    </div>
                </div>
                
                <motion.div className="p-3 flex items-center justify-between border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm">
                    <span className="text-sm text-gray-500">
                        Hiển thị {orders.length} / {pagination?.total || 0} đơn hàng
                        {pagination && ` (Trang ${pagination.current_page}/${pagination.last_page})`}
                        {(filter !== "all" || dateFilter !== "all" || searchQuery) && (
                            <span className="ml-2 text-blue-600 font-medium">
                                (Đã lọc)
                            </span>
                        )}
                    </span>
                    
                    {canLoadMore && (
                        <Button 
                            variant="outline"
                            size="sm"
                            onClick={loadMoreOrders}
                            disabled={isLoadingMore}
                            className="text-indigo-600"
                        >
                            {isLoadingMore ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải...
                                </>
                            ) : (
                                <>
                                    Tải thêm (
                                    {pagination?.total !== undefined
                                        ? pagination.total - orders.length
                                        : 0}
                                    )
                                </>
                            )}
                        </Button>
                    )}
                </motion.div>
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
                <DialogContent className="max-w-5xl border border-indigo-100 bg-white/95 backdrop-blur-sm shadow-xl">
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
                            {/* Status Update Section */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Badge className={`${statusColors.get(normalizeStatus(selectedOrder.status))} text-sm px-3 py-1`}>
                                            {statusIcons[normalizeStatus(selectedOrder.status) as keyof typeof statusIcons]}
                                            {getStatusDisplayText(normalizeStatus(selectedOrder.status))}
                                        </Badge>
                                        <span className="text-sm text-gray-600">
                                            Cập nhật lúc: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        {getAvailableActions(normalizeStatus(selectedOrder.status)).map((actionItem) => (
                                            <motion.div key={actionItem.action} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    // @ts-expect-error variant
                                                    variant={actionItem.variant}
                                                    size="sm"
                                                    onClick={() => handleStatusChange(actionItem.action as 'confirm' | 'process' | 'ship' | 'complete' | 'cancel' | 'delivery_failed', selectedOrder.id.toString())}
                                                    disabled={isUpdatingStatus}
                                                    className={actionItem.variant === 'default' ? 
                                                        "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700" : 
                                                        ""
                                                    }
                                                >
                                                    {isUpdatingStatus ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        actionItem.icon
                                                    )}
                                                    {actionItem.label}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Status Timeline */}
                                <div className="mt-4 pt-4 border-t border-indigo-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Tiến trình đơn hàng</h4>
                                    <div className="flex items-center space-x-2">
                                        {{
                                            pending: "Chờ xác nhận",
                                            confirmed: "Đã xác nhận",
                                            processing: "Đang xử lý",
                                            shipping: "Đang giao hàng",
                                            completed: "Hoàn thành",
                                            cancelled: "Đã hủy",
                                            failed: "Thất bại",
                                            delivery_failed: "Giao hàng không thành công"
                                        }[selectedOrder.status]}
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="details">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Thông tin đơn hàng</TabsTrigger>
                                    <TabsTrigger value="items">Sản phẩm ({selectedOrder.items.length})</TabsTrigger>
                                    <TabsTrigger value="history">Lịch sử</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-medium text-gray-900 mb-3">Thông tin chung</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                                                        <span className="font-mono text-sm">{selectedOrder.id}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Ngày đặt hàng:</span>
                                                        <span className="text-sm">{new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Mã khách hàng:</span>
                                                        <span className="text-sm">{selectedOrder.user_id || "N/A"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Phương thức thanh toán:</span>
                                                        <span className="text-sm">{paymentData?.payment_method.toUpperCase() || "N/A"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Trạng thái thanh toán:</span>
                                                        <PaymentStatusBadge status={paymentData?.payment_status || 'pending'} />
                                                    </div>    
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Tổng tiền:</span>
                                                        <span className="font-medium text-lg text-indigo-600">{formatCurrency(selectedOrder.total_price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-medium text-gray-900 mb-3">Thông tin giao hàng</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Người nhận:</span>
                                                        <span className="text-sm">{shipInfor?.recipient_name || "N/A"}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Số điện thoại:</span>
                                                        <span className="text-sm">{shipInfor?.recipient_phone || "N/A"}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-sm text-gray-600">Địa chỉ:</span>
                                                        <p className="text-sm bg-white p-2 rounded border">
                                                            {shipInfor ? 
                                                                [
                                                                    shipInfor.address,
                                                                    shipInfor.ward_name,
                                                                    shipInfor.district_name,
                                                                    shipInfor.province_name
                                                                ].filter(Boolean).join(', ') 
                                                                : (selectedOrder.shipping_address || "N/A")
                                                            }
                                                        </p>
                                                    </div>
                                                    {selectedOrder.notes && (
                                                        <div className="space-y-1">
                                                            <span className="text-sm text-gray-600">Ghi chú:</span>
                                                            <p className="text-sm bg-white p-2 rounded border">{selectedOrder.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="items">
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item) => (
                                            <motion.div 
                                                key={item.id} 
                                                className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="h-16 w-16 relative rounded overflow-hidden flex-shrink-0 mr-4 bg-gray-100">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <Package className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <span className="text-lg font-semibold text-indigo-600">{formatCurrency(item.price)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-sm text-gray-600">Số lượng: <span className="font-medium">{item.quantity}</span></span>
                                                            <span className="text-sm text-gray-600">Mã SP: <span className="font-mono text-xs">{item.product_id}</span></span>
                                                        </div>
                                                        <span className="text-lg font-bold text-gray-900">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Tạm tính:</span>
                                                    <span>{formatCurrency(selectedOrder.total_price)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-green-600">
                                                    <span>Phí vận chuyển:</span>
                                                    <span>Miễn phí</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between text-lg font-bold text-indigo-900">
                                                    <span>Tổng cộng:</span>
                                                    <span>{formatCurrency(selectedOrder.total_price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="history">
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-3">Lịch sử trạng thái</h3>
                                            <div className="space-y-3">
                                                {/* Always show order creation */}
                                                <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-blue-400">
                                                    <Clock className="h-5 w-5 text-blue-500" />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium">Đơn hàng được tạo</span>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">Đơn hàng đã được tạo trong hệ thống</p>
                                                    </div>
                                                </div>

                                                {/* Show confirmed status if not pending or cancelled */}
                                                {!['pending', 'cancelled', 'failed'].includes(normalizeStatus(selectedOrder.status)) && (
                                                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-green-400">
                                                        <Check className="h-5 w-5 text-green-500" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Đơn hàng đã xác nhận</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {/* Thời gian xác nhận sẽ có từ API sau */}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Đơn hàng đã được xác nhận và chuyển sang xử lý</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show processing status */}
                                                {['processing', 'shipping', 'completed'].includes(normalizeStatus(selectedOrder.status)) && (
                                                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-orange-400">
                                                        <Loader2 className="h-5 w-5 text-orange-500" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Đang xử lý đơn hàng</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {/* Thời gian bắt đầu xử lý sẽ có từ API sau */}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Đơn hàng đang được chuẩn bị và đóng gói</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show shipping status */}
                                                {['shipping', 'completed'].includes(normalizeStatus(selectedOrder.status)) && (
                                                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-purple-400">
                                                        <Truck className="h-5 w-5 text-purple-500" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Đang giao hàng</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {/* Thời gian bắt đầu giao hàng sẽ có từ API sau */}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Đơn hàng đang được vận chuyển đến địa chỉ giao hàng</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show completed status */}
                                                {normalizeStatus(selectedOrder.status) === 'completed' && (
                                                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-green-500">
                                                        <Package className="h-5 w-5 text-green-600" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Giao hàng thành công</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {/* Thời gian hoàn thành sẽ có từ API sau */}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Đơn hàng đã được giao thành công đến khách hàng</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show cancelled status */}
                                                {normalizeStatus(selectedOrder.status) === 'cancelled' && (
                                                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-red-400">
                                                        <X className="h-5 w-5 text-red-500" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Đơn hàng đã bị hủy</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {/* Thời gian hủy sẽ có từ API sau */}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Đơn hàng đã được hủy theo yêu cầu</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Show failed status */}
                                                {normalizeStatus(selectedOrder.status) === 'failed' && (
                                                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-gray-400">
                                                        <AlertCircle className="h-5 w-5 text-gray-500" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Đơn hàng thất bại</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {/* Thời gian thất bại sẽ có từ API sau */}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Đơn hàng không thể hoàn thành do lỗi xử lý</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action logs would go here in the future */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-3">Nhật ký thao tác</h3>
                                            <div className="text-sm text-gray-500 text-center py-4">
                                                Nhật ký chi tiết sẽ được cập nhật trong phiên bản tương lai
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    <DialogFooter className="flex justify-end">
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

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   delay?: number;
// }

// const StatCard = ({ title, value, icon, delay = 0 }: StatCardProps) => {
//   return (
//     <motion.div 
//       className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/30 relative overflow-hidden"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay }}
//       whileHover={{ 
//         boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//         y: -5
//       }}
//     >
//       <motion.div 
//         className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-indigo-100/50"
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 0.5, delay: delay + 0.2 }}
//       />
      
//       <div className="relative z-10">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-gray-600 font-medium">{title}</h3>
//           <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
//             {icon}
//           </div>
//         </div>
//         <div>
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: delay + 0.3 }}
//           >
//             <span className="text-3xl font-bold text-indigo-900">{value}</span>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// StatusBadge component với animation và hover effects
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        const configs = {
            pending: { 
                label: 'Chờ xác nhận', 
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
                icon: <Clock className="w-3 h-3" />,
                color: 'yellow'
            },
            confirmed: { 
                label: 'Đã xác nhận', 
                className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                icon: <Check className="w-3 h-3" />,
                color: 'blue'
            },
            processing: { 
                label: 'Đang xử lý', 
                className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                icon: <Loader2 className="w-3 h-3 animate-spin" />,
                color: 'orange'
            },
            shipping: { 
                label: 'Đang giao hàng', 
                className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
                icon: <Truck className="w-3 h-3" />,
                color: 'purple'
            },
            completed: { 
                label: 'Hoàn thành', 
                className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                icon: <Package className="w-3 h-3" />,
                color: 'green'
            },
            cancelled: { 
                label: 'Đã hủy', 
                className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                icon: <X className="w-3 h-3" />,
                color: 'red'
            },
            failed: { 
                label: 'Thất bại', 
                className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                icon: <AlertCircle className="w-3 h-3" />,
                color: 'gray'
            },
            delivery_failed: {
                label: 'Giao hàng không thành công', 
                className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                icon: <AlertCircle className="w-3 h-3" />,
                color: 'gray'
            }
        };
        
        return configs[status as keyof typeof configs] || {
            label: status,
            className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
            icon: <AlertCircle className="w-3 h-3" />,
            color: 'gray'
        };
    };
    
    const config = getStatusConfig(status || '');
    
    return (
        <motion.span 
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-default ${config.className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ 
                    rotate: config.color === 'orange' ? 360 : 0 
                }}
                transition={{ 
                    duration: config.color === 'orange' ? 2 : 0,
                    repeat: config.color === 'orange' ? Infinity : 0,
                    ease: "linear"
                }}
            >
                {config.icon}
            </motion.div>
            {config.label}
        </motion.span>
    );
};

export default OrderManagement;