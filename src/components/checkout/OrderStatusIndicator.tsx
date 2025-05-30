import React from "react";
import { CheckCircle2, ShoppingCart, Truck, CreditCard, Package } from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface OrderStatusIndicatorProps {
    orderId: string | null;
    step: number;
    orderCompleted: boolean;
}

const OrderStatusIndicator = React.memo(({ orderId, step, orderCompleted }: OrderStatusIndicatorProps) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <h3 className="font-medium">Trạng thái đơn hàng</h3>

                    {/* Step 1: Create Order */}
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderId ? 'bg-primary' : 'bg-muted'}`}>
                            {orderId ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                                <ShoppingCart className="h-4 w-4 text-white" />
                            )}
                        </div>
                        <div>
                            <p className={`font-medium ${orderId ? 'text-gray-900' : 'text-gray-400'}`}>
                                Tạo đơn hàng
                            </p>
                            <p className="text-sm text-gray-500">
                                {orderId ? 'Đơn hàng đã được tạo thành công' : 'Chờ tạo đơn hàng'}
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Payment */}
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}>
                            {step >= 2 ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                                <CreditCard className="h-4 w-4 text-white" />
                            )}
                        </div>
                        <div>
                            <p className={`font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                                Thanh toán
                            </p>
                            <p className="text-sm text-gray-500">
                                {step >= 2 ? 'Đang xử lý thanh toán' : 'Chờ thanh toán'}
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Order Complete */}
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderCompleted ? 'bg-primary' : 'bg-muted'}`}>
                            {orderCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                                <Package className="h-4 w-4 text-white" />
                            )}
                        </div>
                        <div>
                            <p className={`font-medium ${orderCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                Hoàn thành
                            </p>
                            <p className="text-sm text-gray-500">
                                {orderCompleted ? 'Đơn hàng đã hoàn thành' : 'Chờ hoàn thành'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

OrderStatusIndicator.displayName = "OrderStatusIndicator";
export default OrderStatusIndicator;