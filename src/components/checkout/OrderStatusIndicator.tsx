import React from "react";
import { CheckCircle2 } from "lucide-react";
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
    );
});

OrderStatusIndicator.displayName = "OrderStatusIndicator";
export default OrderStatusIndicator;