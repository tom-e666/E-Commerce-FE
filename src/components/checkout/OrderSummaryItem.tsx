import React from 'react';
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { OrderItem as OrderItemInterface } from '@/hooks/useOrder';
interface OrderSummaryItemProps {
    item: OrderItemInterface;
}

const OrderSummaryItem = React.memo(({ item }: OrderSummaryItemProps) => (
    <div className="flex items-center space-x-3">
        <div className="h-12 w-12 relative rounded overflow-hidden flex-shrink-0">
            <Image
                src={item.image}
                alt={item.name || "Sản phẩm"}
                width={48}
                height={48}
                className="object-cover"
                loading="lazy"
            />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
        </div>
        <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
    </div>
));

OrderSummaryItem.displayName = "OrderSummaryItem";
export default OrderSummaryItem;