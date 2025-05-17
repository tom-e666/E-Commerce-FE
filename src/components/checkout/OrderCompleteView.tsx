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
                        <Link href={`/order`}>
                            <Package className="mr-2 h-4 w-4" />
                            Xem chi tiết đơn hàng
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
});

OrderCompletedView.displayName = "OrderCompletedView";
export default OrderCompletedView;