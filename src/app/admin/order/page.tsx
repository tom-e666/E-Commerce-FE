'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
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
import { Check, Package, Truck, X, Clock, AlertCircle } from "lucide-react";

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
    const statusColors = new Map([
        ["pending", "bg-yellow-100 text-yellow-800"],
        ["confirmed", "bg-blue-100 text-blue-800"],
        ["shipped", "bg-purple-100 text-purple-800"],
        ["delivered", "bg-green-100 text-green-800"],
        ["cancelled", "bg-red-100 text-red-800"]
    ]
    );

    const statusIcons = {
        pending: <Clock className="h-4 w-4 mr-1" />,
        confirmed: <Check className="h-4 w-4 mr-1" />,
        shipped: <Truck className="h-4 w-4 mr-1" />,
        delivered: <Package className="h-4 w-4 mr-1" />,
        cancelled: <X className="h-4 w-4 mr-1" />
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
                const displayText = status.charAt(0).toUpperCase() + status.slice(1);

                return (
                    <div className={`flex items-center justify-center px-2 py-1 rounded-full ${statusClass}`}>
                        {icon}
                        <span>{displayText}</span>
                    </div>
                );
            }
        },
        {
            field: "payment_status",
            headerName: "Thanh toán",
            flex: 1.5,
            minWidth: 120,
            // @ts-expect-error any
            valueFormatter: (params) => {
                if (params.value === "paid") return "Đã thanh toán";
                if (params.value === "pending") return "Chưa thanh toán";
                return params.value;
            }
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
        const filteredOrders = filter === "all"
            ? orders
            : orders.filter(order => order.status === filter);
        // @ts-expect-error any
        setGridData(filteredOrders);
        forceUpdate();
    }, [orders, filter]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            await toast.promise(
                getOrders(),
                {
                    loading: "Đang tải danh sách đơn hàng...",
                    success: "Tải danh sách đơn hàng thành công",
                    error: "Không thể tải danh sách đơn hàng"
                }
            );
            forceUpdate();
        } catch (error) {
            toast.error("Không thể tải danh sách đơn hàng");
            console.error(error);
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
        <div className="w-full min-h-screen p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="outline"
                    className="text-2xl font-bold py-6 px-6 cursor-default"
                >
                    Quản lý đơn hàng
                </Button>
                <div className="flex items-center space-x-4">
                    <Label>Lọc theo trạng thái:</Label>
                    <Select
                        value={filter}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tất cả đơn hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                            <SelectItem value="pending">Chờ xác nhận</SelectItem>
                            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                            <SelectItem value="shipped">Đang giao hàng</SelectItem>
                            <SelectItem value="delivered">Đã giao hàng</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={loadOrders}>Làm mới</Button>
                </div>
            </div>

            <div className="ag-theme-alpine w-full h-[600px] rounded-md overflow-hidden mb-6">
                <AgGridReact
                    key={`orders-${forceUpdateKey}`}
                    rowData={gridData}
                    // @ts-expect-error any
                    columnDefs={colDefs}
                    onRowClicked={handleRowClick}
                    pagination={true}
                    paginationAutoPageSize={true}
                    animateRows={true}
                    domLayout="autoHeight"
                    suppessCellClick={true}
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    autoSizeColumns={true}
                    suppressColumnVirtualisation={true}
                />
            </div>

            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                        <DialogDescription>

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
                                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Thanh toán:</span>
                                                    <span>{selectedOrder.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Phương thức thanh toán:</span>
                                                    <span>{selectedOrder.payment_method === "cod" ? "Thanh toán khi nhận hàng" : selectedOrder.payment_method || "N/A"}</span>
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
                                                    <Image
                                                        src={item.product?.image || "/laptop.png"}
                                                        alt={item.product?.name || "Sản phẩm"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium">{item.product?.name || "Sản phẩm"}</h4>
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
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleStatusChange('cancel', selectedOrder.id)}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Hủy đơn hàng
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={() => handleStatusChange('confirm', selectedOrder.id)}
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Xác nhận
                                    </Button>
                                </>
                            )}

                            {selectedOrder && selectedOrder.status === 'confirmed' && (
                                <Button
                                    variant="default"
                                    onClick={() => handleStatusChange('ship', selectedOrder.id)}
                                >
                                    <Truck className="mr-2 h-4 w-4" />
                                    Giao hàng
                                </Button>
                            )}

                            {selectedOrder && selectedOrder.status === 'shipped' && (
                                <Button
                                    variant="default"
                                    onClick={() => handleStatusChange('deliver', selectedOrder.id)}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Đã giao hàng
                                </Button>
                            )}
                        </div>

                        <Button variant="outline" onClick={handleCloseDetail}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}