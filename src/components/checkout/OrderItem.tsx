import React from 'react';
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { OrderItem as OrderItemInterface } from '@/hooks/useOrder';
interface OrderItemProps {
    item: OrderItemInterface;
}

const OrderItem = React.memo(({ item }: OrderItemProps) => (
    <div className="flex items-center p-2 border-b">
        <div className="h-16 w-16 relative rounded overflow-hidden flex-shrink-0 mr-4">
            <Image
                src={"/gaming.png"}
                alt={item.name || "Sản phẩm"}
                width={64}
                height={64}
                className="object-cover"
                loading="lazy"
            />
        </div>
        <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <div className="flex justify-between mt-1">
                <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
            </div>
        </div>
    </div>
));

OrderItem.displayName = "OrderItem";
export default OrderItem;