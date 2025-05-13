"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useOrder } from "@/hooks/useOrder";
import { useShipping } from "@/hooks/useShipping";
import {
    ArrowLeft,
    Loader2,
    MapPin,
    Package,
    Truck,
    ShoppingCart,
    CheckCircle2,
    ClipboardCheck
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
// Shipping 
// 'order_id',
// 'tracking_code',
// 'carrier', // fedex, dhl, ups
// 'estimated_date',
// 'status', // packed, shipped, delivered, cancelled
// 'address'

interface ShippingInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    notes?: string;
}

export default function CheckoutPage() {
    const [loading, setLoading] = useState(true);
    const { createOrderFromCart, loading: orderLoading, currentOrder } = useOrder();
    const { handleCreateShipping, loading: shippingLoading } = useShipping();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingCost] = useState(0);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        notes: "",
    });
    const [step, setStep] = useState(0); // 0: review, 1: shipping
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false);

    useEffect(() => {
        const initializeOrder = async () => {
            try {
                setLoading(true);
                const tempOrder = await createOrderFromCart();
                setOrderId(tempOrder.id);
                toast.success("Đơn hàng đã được tạo từ giỏ hàng của bạn");
            } catch (error) {
                console.log(error);
                toast.error("Không thể tạo giỏ hàng");
            } finally {
                setLoading(false);
            }
        };
        initializeOrder();
    }, []);
    console.log(currentOrder);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSelectChange = (name: string, value: string) => {
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const validateShippingInfo = () => {
        const { fullName, phone, address, city, district, ward } = shippingInfo;
        if (!fullName || !phone || !address || !city || !district || !ward) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
            return false;
        }
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            toast.error("Số điện thoại không hợp lệ");
            return false;
        }
        return true;
    };
    const handleProceedToShipping = () => {
        if (!orderId) {
            toast.error("Không tìm thấy đơn hàng. Vui lòng thử lại sau.");
            return;
        }
        setStep(1);
    };
    const handleShippingSubmit = async () => {
        if (!validateShippingInfo() || !orderId) {
            return;
        }
        setIsSubmitting(true);
        try {
            const shippingAddress = `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;
            const trackingCode = `TRK-${Date.now().toString().slice(-8)}`;
            const carrier = "Viettel Post";
            const estimatedDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const status = "received";
            await handleCreateShipping(orderId, trackingCode, carrier, estimatedDate, status, shippingAddress);
            setOrderCompleted(true);
            toast.success("Đặt hàng thành công");
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || orderLoading || shippingLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (orderCompleted) {
        return (
            <div className="container mx-auto py-10">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">Đặt hàng thành công!</CardTitle>
                        <CardDescription>
                            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                            <p className="text-sm">Mã đơn hàng: <span className="font-bold">{orderId}</span></p>
                            <p className="text-sm">Người nhận: {shippingInfo.fullName}</p>
                            <p className="text-sm">Số điện thoại: {shippingInfo.phone}</p>
                            <p className="text-sm">Địa chỉ: {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}</p>
                            <p className="text-sm">Phương thức thanh toán: {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Tiếp tục mua sắm
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/orders/${orderId}`}>
                                <Package className="mr-2 h-4 w-4" />
                                Xem chi tiết đơn hàng
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    if (!currentOrder) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Lỗi không xác địnhđịnh</p>
                </div>
            </div>
        );
    }
    if (currentOrder)
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs value={`step-${step}`} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="step-0">Xem đơn hàng</TabsTrigger>
                                <TabsTrigger value="step-1">Thông tin giao hàng</TabsTrigger>
                            </TabsList>

                            <TabsContent value="step-0" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <ClipboardCheck className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-xl">Thông tin đơn hàng</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="font-medium mb-2">Sản phẩm trong đơn hàng</h3>
                                            {currentOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center p-2 border-b">
                                                    <div className="h-16 w-16 relative rounded overflow-hidden flex-shrink-0 mr-4">
                                                        <Image
                                                            src={"/gaming.png"}
                                                            alt={item.product?.name || "Sản phẩm"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item!.product!.name}</p>
                                                        <div className="flex justify-between mt-1">
                                                            <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                                                            <p className="text-sm font-medium">{formatCurrency(item!.product!.price * item.quantity)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-muted p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span>Tạm tính:</span>
                                                <span>{formatCurrency(currentOrder.total_price)}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span>Phí vận chuyển:</span>
                                                <span>{shippingCost > 0 ? formatCurrency(shippingCost) : "Miễn phí"}</span>
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex justify-between font-bold">
                                                <span>Tổng cộng:</span>
                                                <span>{formatCurrency(currentOrder.total_price + shippingCost)}</span>
                                            </div>
                                        </div>

                                        {orderId && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-green-800 font-medium">Đơn hàng đã được tạo</p>
                                                <p className="text-sm text-green-700 mt-1">Mã đơn hàng: {orderId}</p>
                                                <p className="text-sm text-green-700 mt-1">Vui lòng nhập thông tin giao hàng để hoàn tất đặt hàng.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" asChild>
                                            <Link href="/cart">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Quay lại giỏ hàng
                                            </Link>
                                        </Button>
                                        <Button
                                            onClick={handleProceedToShipping}
                                            disabled={!orderId}
                                        >
                                            {!orderId ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang tạo đơn hàng
                                                </>
                                            ) : (
                                                "Tiếp tục nhập thông tin giao hàng"
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            {/* Shipping Information */}
                            <TabsContent value="step-1" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-xl">Thông tin giao hàng</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Họ và tên người nhận *</Label>
                                                <Input
                                                    id="fullName"
                                                    name="fullName"
                                                    value={shippingInfo.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập họ và tên"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Số điện thoại *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={shippingInfo.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập số điện thoại"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Địa chỉ *</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={shippingInfo.address}
                                                onChange={handleInputChange}
                                                placeholder="Số nhà, tên đường"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                                                <Select
                                                    name="city"
                                                    value={shippingInfo.city}
                                                    onValueChange={(value) => handleSelectChange("city", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                                                        <SelectItem value="hn">Hà Nội</SelectItem>
                                                        <SelectItem value="dn">Đà Nẵng</SelectItem>
                                                        <SelectItem value="ct">Cần Thơ</SelectItem>
                                                        {/* Add more cities */}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="district">Quận/Huyện *</Label>
                                                <Select
                                                    name="district"
                                                    value={shippingInfo.district}
                                                    onValueChange={(value) => handleSelectChange("district", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn Quận/Huyện" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="q1">Quận 1</SelectItem>
                                                        <SelectItem value="q2">Quận 2</SelectItem>
                                                        <SelectItem value="q3">Quận 3</SelectItem>
                                                        <SelectItem value="q4">Quận 4</SelectItem>
                                                        {/* Add more districts */}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ward">Phường/Xã *</Label>
                                                <Select
                                                    name="ward"
                                                    value={shippingInfo.ward}
                                                    onValueChange={(value) => handleSelectChange("ward", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn Phường/Xã" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="p1">Phường 1</SelectItem>
                                                        <SelectItem value="p2">Phường 2</SelectItem>
                                                        <SelectItem value="p3">Phường 3</SelectItem>
                                                        <SelectItem value="p4">Phường 4</SelectItem>
                                                        {/* Add more wards */}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                value={shippingInfo.notes}
                                                onChange={handleInputChange}
                                                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                                                className="h-24"
                                            />
                                        </div>

                                        <div className="space-y-2 pt-4">
                                            <Label>Phương thức thanh toán</Label>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                                    <input
                                                        type="radio"
                                                        id="cod"
                                                        name="paymentMethod"
                                                        value="cod"
                                                        checked={paymentMethod === 'cod'}
                                                        onChange={() => setPaymentMethod('cod')}
                                                        className="h-4 w-4"
                                                    />
                                                    <Label htmlFor="cod" className="cursor-pointer">Thanh toán khi nhận hàng (COD)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                                    <input
                                                        type="radio"
                                                        id="bank-transfer"
                                                        name="paymentMethod"
                                                        value="bank-transfer"
                                                        checked={paymentMethod === 'bank-transfer'}
                                                        onChange={() => setPaymentMethod('bank-transfer')}
                                                        className="h-4 w-4"
                                                    />
                                                    <Label htmlFor="bank-transfer" className="cursor-pointer">Chuyển khoản ngân hàng</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" onClick={() => setStep(0)}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Quay lại
                                        </Button>
                                        <Button
                                            onClick={handleShippingSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang xử lý
                                                </>
                                            ) : (
                                                "Hoàn tất đặt hàng"
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {currentOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="h-12 w-12 relative rounded overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={"/gaming.png"}
                                                    alt={item!.product!.name || "Sản phẩm"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item!.product!.name}</p>
                                                <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium">{formatCurrency(item!.product!.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span>{formatCurrency(currentOrder.total_price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span>{shippingCost > 0 ? formatCurrency(shippingCost) : "Miễn phí"}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-bold">
                                        <span>Tổng cộng:</span>
                                        <span>{formatCurrency(currentOrder.total_price + shippingCost)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Truck className="h-4 w-4 mr-2" />
                                        <span>Dự kiến giao hàng trong 3-5 ngày sau khi đặt hàng</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Order Status Indicator */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium">Trạng thái đơn hàng</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${orderId ? 'bg-primary' : 'bg-muted'}`}>
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                        <span className={orderId ? 'font-medium' : 'text-muted-foreground'}>Tạo đơn hàng</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}>
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                        <span className={step >= 1 ? 'font-medium' : 'text-muted-foreground'}>Thông tin giao hàng</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${orderCompleted ? 'bg-primary' : 'bg-muted'}`}>
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                        <span className={orderCompleted ? 'font-medium' : 'text-muted-foreground'}>Hoàn tất</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
}