'use client'

import { useState, useEffect } from 'react';
import { useOrder } from "@/hooks/useOrder";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { 
    Check, 
    Package, 
    Truck, 
    X, 
    Clock, 
    ArrowRight, 
    AlarmClock, 
    Search,
    ShoppingBag,
    Loader2
} from "lucide-react";

export default function UserOrders() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { 
        loading, 
        orders, 
        getUserOrders, 
        getOrder,
        cancelOrder 
    } = useOrder();
    
    const [filter, setFilter] = useState("all");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [processingOrder, setProcessingOrder] = useState(null);

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800"
    };

    const statusIcons = {
        pending: <Clock className="h-4 w-4 mr-1" />,
        confirmed: <Check className="h-4 w-4 mr-1" />,
        shipped: <Truck className="h-4 w-4 mr-1" />,
        delivered: <Package className="h-4 w-4 mr-1" />,
        cancelled: <X className="h-4 w-4 mr-1" />
    };

    const statusLabels = {
        pending: "Chờ xác nhận",
        confirmed: "Đã xác nhận",
        shipped: "Đang giao hàng",
        delivered: "Đã giao hàng",
        cancelled: "Đã hủy"
    };

    // Tải danh sách đơn hàng khi component được mount
    useEffect(() => {
        const loadOrders = async () => {
            try {
                if (isAuthenticated) {
                    await toast.promise(getUserOrders(), {
                        loading: "Đang tải danh sách đơn hàng...",
                        success: "Đã tải danh sách đơn hàng",
                        error: "Không thể tải danh sách đơn hàng"
                    });
                }
            } catch (error) {
                console.error("Error loading orders:", error);
            }
        };

        loadOrders();
    }, [isAuthenticated, getUserOrders]);

    // Lọc đơn hàng khi filter hoặc orders thay đổi
    useEffect(() => {
        if (filter === "all") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === filter));
        }
    }, [orders, filter]);

    // Chuyển hướng nếu người dùng chưa đăng nhập
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.error("Vui lòng đăng nhập để xem đơn hàng");
            router.push("/login");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleViewDetail = async (orderId) => {
        try {
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

    const handleCancelOrder = async (orderId) => {
        try {
            setProcessingOrder(orderId);
            await toast.promise(cancelOrder(orderId), {
                loading: "Đang hủy đơn hàng...",
                success: "Đơn hàng đã được hủy thành công",
                error: "Không thể hủy đơn hàng"
            });
            
            // Cập nhật lại thông tin đơn hàng hiện tại
            if (selectedOrder && selectedOrder.id === orderId) {
                const updatedOrder = await getOrder(orderId);
                setSelectedOrder(updatedOrder);
            }
            
        } catch (error) {
            console.error("Error cancelling order:", error);
        } finally {
            setProcessingOrder(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
                    <p className="text-muted-foreground">Quản lý và theo dõi các đơn hàng của bạn</p>
                </div>

                <div className="mt-4 md:mt-0">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Lọc theo trạng thái" />
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
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Không tìm thấy đơn hàng nào</CardTitle>
                        <CardDescription>
                            {filter === "all" 
                                ? "Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!"
                                : `Không tìm thấy đơn hàng nào có trạng thái "${statusLabels[filter] || filter}"`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pt-6 pb-8">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                        <Button onClick={() => router.push("/")}>
                            Khám phá sản phẩm
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/50">
                                <div className="flex flex-col sm:flex-row gap-2 justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                                        <CardDescription>
                                            Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                        </CardDescription>
                                    </div>
                                    <Badge className={`${statusColors[order.status]} self-start sm:self-center px-3 py-1`}>
                                        {statusIcons[order.status]}
                                        {statusLabels[order.status] || order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Số sản phẩm:</span>
                                            <span className="font-medium">{order.items ? order.items.length : 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                                            <span className="font-medium">{formatCurrency(order.total_price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Phương thức thanh toán:</span>
                                            <span className="font-medium">{order.payment_method === "cod" ? "Thanh toán khi nhận hàng" : order.payment_method || "N/A"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        {order.items && order.items.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <div className="h-12 w-12 relative bg-muted rounded overflow-hidden flex-shrink-0">
                                                    {item.product?.image && (
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.product?.name}</p>
                                                    <div className="flex justify-between mt-1">
                                                        <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                                                        <p className="text-xs font-medium">{formatCurrency(item.price)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {order.items && order.items.length > 2 && (
                                            <p className="text-sm text-muted-foreground text-center mt-2">
                                                +{order.items.length - 2} sản phẩm khác
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/30 pt-4">
                                <Button 
                                    variant="secondary" 
                                    className="flex-1"
                                    onClick={() => handleViewDetail(order.id)}
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                </Button>
                                
                                {order.status === "pending" && (
                                    <Button 
                                        variant="destructive" 
                                        className="flex-1"
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={processingOrder === order.id}
                                    >
                                        {processingOrder === order.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4 mr-2" />
                                        )}
                                        Hủy đơn hàng
                                    </Button>
                                )}
                                
                                {order.status === "delivered" && (
                                    <Button 
                                        variant="outline" 
                                        className="flex-1"
                                        onClick={() => router.push(`/review/${order.id}`)}
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Đánh giá
                                    </Button>
                                )}
                                
                                {(order.status === "confirmed" || order.status === "shipped") && (
                                    <Button 
                                        variant="outline" 
                                        className="flex-1"
                                        disabled
                                    >
                                        <AlarmClock className="h-4 w-4 mr-2" />
                                        Đang xử lý
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Chi tiết đơn hàng Dialog */}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-medium">Thông tin chung</h3>
                                            <div className="space-y-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Ngày đặt hàng:</span>
                                                    <span>{new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Trạng thái:</span>
                                                    <Badge className={statusColors[selectedOrder.status]}>
                                                        {statusIcons[selectedOrder.status]}
                                                        {statusLabels[selectedOrder.status] || selectedOrder.status}
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
                                        <h3 className="font-medium mb-2">Trạng thái đơn hàng</h3>
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
                                                        {/* Thời gian xác nhận (nếu có) */}
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
                                                        {/* Thời gian bắt đầu giao hàng (nếu có) */}
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
                                                        {/* Thời gian giao hàng thành công (nếu có) */}
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
                                                        {/* Thời gian hủy đơn hàng (nếu có) */}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="items">
                                    <Table>
                                        <TableCaption>Danh sách sản phẩm trong đơn hàng</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sản phẩm</TableHead>
                                                <TableHead>Đơn giá</TableHead>
                                                <TableHead>Số lượng</TableHead>
                                                <TableHead className="text-right">Thành tiền</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedOrder.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-12 w-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
                                                                {item.product?.image && (
                                                                    <Image
                                                                        src={item.product.image}
                                                                        alt={item.product.name || "Sản phẩm"}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{item.product?.name || "Sản phẩm"}</div>
                                                                {item.product?.product_id && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        Mã: {item.product.product_id}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <div className="pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Tạm tính:</span>
                                            <span>{formatCurrency(selectedOrder.total_price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí vận chuyển:</span>
                                            <span>Miễn phí</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-bold">
                                            <span>Tổng cộng:</span>
                                            <span>{formatCurrency(selectedOrder.total_price)}</span>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    <DialogFooter className="flex justify-between">
                        <div>
                            {selectedOrder && selectedOrder.status === "pending" && (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleCancelOrder(selectedOrder.id)}
                                    disabled={processingOrder === selectedOrder.id}
                                >
                                    {processingOrder === selectedOrder.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="mr-2 h-4 w-4" />
                                    )}
                                    Hủy đơn hàng
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