import React from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import OrderItem from "./OrderItem";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/hooks/useOrder";

interface OrderInformationProps {
    currentOrder: Order;
    shippingCost: number;
    orderId: string | null;
    totalPrice: number;
    onProceed: () => void;
}

const OrderInformation = React.memo(({
    currentOrder,
    shippingCost,
    orderId,
    totalPrice,
    onProceed
}: OrderInformationProps) => {
    return (
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
                    {currentOrder?.items?.map((item) => (
                        <OrderItem key={item.id} item={item} />
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
                        <span>{formatCurrency(totalPrice)}</span>
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
                    onClick={onProceed}
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
    );
});

OrderInformation.displayName = "OrderInformation";
export default OrderInformation;