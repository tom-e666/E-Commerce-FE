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
                            <span className={`${orderId ? 'font-medium' : 'text-muted-foreground'}`}>
                                Tạo đơn hàng
                            </span>
                            {orderId && (
                                <p className="text-xs text-muted-foreground">Đơn hàng #{orderId.slice(-8)}</p>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Shipping Information */}
                    <div className="relative">
                        <div className="absolute left-4 top-0 -ml-px h-full w-0.5 bg-muted"></div>
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary' : 'bg-muted'} z-10`}>
                                {step >= 1 ? (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                    <Truck className="h-4 w-4 text-white" />
                                )}
                            </div>
                            <div>
                                <span className={`${step >= 1 ? 'font-medium' : 'text-muted-foreground'}`}>
                                    Thông tin giao hàng
                                </span>
                                {step >= 1 && (
                                    <p className="text-xs text-muted-foreground">Địa chỉ đã xác nhận</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Payment */}
                    <div className="relative">
                        <div className="absolute left-4 top-0 -ml-px h-full w-0.5 bg-muted"></div>
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary' : 'bg-muted'} z-10`}>
                                {step >= 2 ? (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                    <CreditCard className="h-4 w-4 text-white" />
                                )}
                            </div>
                            <div>
                                <span className={`${step >= 2 ? 'font-medium' : 'text-muted-foreground'}`}>
                                    Thanh toán
                                </span>
                                {step >= 2 && !orderCompleted && (
                                    <p className="text-xs text-muted-foreground">Chọn phương thức thanh toán</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Order Completed */}
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderCompleted ? 'bg-green-600' : 'bg-muted'}`}>
                            {orderCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                                <Package className="h-4 w-4 text-white" />
                            )}
                        </div>
                        <div>
                            <span className={`${orderCompleted ? 'font-medium text-green-600' : 'text-muted-foreground'}`}>
                                Hoàn tất đơn hàng
                            </span>
                            {orderCompleted && (
                                <p className="text-xs text-green-600">Đặt hàng thành công</p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

OrderStatusIndicator.displayName = "OrderStatusIndicator";
export default OrderStatusIndicator;