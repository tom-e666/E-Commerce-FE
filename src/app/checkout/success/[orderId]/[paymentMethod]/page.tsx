"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, Package, ArrowLeft } from 'lucide-react';
import { useOrder } from "@/hooks/useOrder";
import { useShipping } from "@/hooks/useShipping";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderItem from "@/components/checkout/OrderItem";

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const params = useParams<{ orderId: string, paymentMethod: string }>()
    //@ts-expect-error nothing
    const paymentMethod = params.paymentMethod;
    //@ts-expect-error nothing
    const orderId = params.orderId;
    const { getOrder, loading: orderLoading, currentOrder } = useOrder();
    const { handleFetchShippingByOrderId, shippingData, loading: shippingLoading } = useShipping();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!orderId) {
                router.push('/');
                return;
            }
            try {
                setLoading(true);
                await getOrder(orderId);
                await handleFetchShippingByOrderId(orderId);
            } catch (error) {
                console.error("Error loading order data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [orderId, router, getOrder, handleFetchShippingByOrderId]);

    if (loading || orderLoading || shippingLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-lg">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Không tìm thấy đơn hàng</CardTitle>
                        <CardDescription>
                            Rất tiếc, chúng tôi không thể tìm thấy thông tin đơn hàng của bạn.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild>
                            <Link href="/">Quay về trang chủ</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    const paymentMethodText =
        paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
            paymentMethod === 'cc' ? 'Thẻ quốc tế (Visa/Mastercard/JCB)' :
                paymentMethod === 'atm' ? 'Thẻ ATM nội địa' :
                    paymentMethod === 'mbanking' ? 'Ứng dụng Mobile Banking' : 'Không xác định';

    return (
        <div className="container mx-auto py-12 px-4">
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
                        <h3 className="font-medium mb-3">Thông tin đơn hàng</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
                                <span className="font-medium">{currentOrder.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Ngày đặt:</span>
                                <span className="font-medium">
                                    {new Date(currentOrder.created_at).toLocaleString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                                <span className="font-medium capitalize">{currentOrder.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Phương thức thanh toán:</span>
                                <span className="font-medium">{paymentMethodText}</span>
                            </div>
                        </div>
                    </div>

                    {shippingData && (
                        <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-medium mb-3">Thông tin giao hàng</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Người nhận:</span>
                                    <span className="font-medium">{shippingData.recipient_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Số điện thoại:</span>
                                    <span className="font-medium">{shippingData.recipient_phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Địa chỉ:</span>
                                    <span className="font-medium text-right">{`${shippingData.address}, ${shippingData.ward_name}, ${shippingData.district_name}, ${shippingData.province_name}`}</span>
                                </div>
                                {shippingData.note && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Ghi chú:</span>
                                        <span className="font-medium text-right">{shippingData.note}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-medium mb-3">Chi tiết đơn hàng</h3>
                        <div className="border rounded-lg overflow-hidden">
                            {currentOrder.items.map((item) => (
                                <OrderItem key={item.id} item={item} />
                            ))}
                            <div className="p-4 bg-muted">
                                <div className="flex justify-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(currentOrder.total_price)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span>Miễn phí</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(currentOrder.total_price)}</span>
                                </div>
                            </div>
                        </div>
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
                        <Link href="/account/orders">
                            <Package className="mr-2 h-4 w-4" />
                            Xem đơn hàng của tôi
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
