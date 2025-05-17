import React from "react";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import OrderSummaryItem from "./OrderSummaryItem";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Order } from "@/hooks/useOrder";

interface OrderSummaryProps {
    currentOrder: Order;
    shippingCost: number;
    totalPrice: number;
}

const OrderSummary = React.memo(({ currentOrder, shippingCost, totalPrice }: OrderSummaryProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {currentOrder?.items?.map((item) => (
                        <OrderSummaryItem key={item.id} item={item} />
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
                        <span>{formatCurrency(totalPrice)}</span>
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
    );
});

OrderSummary.displayName = "OrderSummary";
export default OrderSummary;