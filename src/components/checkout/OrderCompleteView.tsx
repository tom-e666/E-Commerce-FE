import React from "react";
import Link from "next/link";
import { ArrowLeft, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface OrderCompletedViewProps {
    orderId: string | null;
    shippingInfo: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        notes: string;
    };
    paymentMethod: string;
}

const OrderCompletedView = React.memo(({ orderId, shippingInfo, paymentMethod }: OrderCompletedViewProps) => {
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
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Thông tin đơn hàng</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                                <span className="font-medium">{orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Phương thức thanh toán:</span>
                                <span className="font-medium">{paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Thông tin giao hàng</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Người nhận:</span>
                                <span className="font-medium">{shippingInfo.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Số điện thoại:</span>
                                <span className="font-medium">{shippingInfo.phone}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Địa chỉ:</span>
                                <p className="mt-1">{`${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`}</p>
                            </div>
                            {shippingInfo.notes && (
                                <div>
                                    <span className="text-sm text-gray-600">Ghi chú:</span>
                                    <p className="mt-1">{shippingInfo.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
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
});

OrderCompletedView.displayName = "OrderCompletedView";
export default OrderCompletedView;