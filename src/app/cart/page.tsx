'use client'
import { useCart } from "@/hooks/useCart";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MinusIcon, PlusIcon, ShoppingCart, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/order/endpoints";

export default function CartPage() {
    const { cartItems, loading, updateQuantity, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Tự động chọn tất cả items khi cart được load
    useEffect(() => {
        if (cartItems.length > 0 && selectedItems.length === 0) {
            setSelectedItems(cartItems.map((item) => item.product.product_id));
        }
    }, [cartItems, selectedItems.length]);

    // Hàm chọn/bỏ chọn từng sản phẩm
    const handleSelectItem = (productId: string) => {
        setSelectedItems((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    // Hàm chọn/bỏ chọn tất cả
    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            // Nếu đã chọn hết thì bỏ chọn tất cả
            setSelectedItems([]);
        } else {
            // Nếu chưa chọn hết thì chọn tất cả
            setSelectedItems(cartItems.map((item) => item.product.product_id));
        }
    };

    console.log('selectedItems:', selectedItems);

    const totalPrice = useMemo(() => {
        return selectedItems.reduce((total, productId) => {
            const cartItem = cartItems.find(item => item.product.product_id === productId);
            
            if (cartItem) {
                return total + (cartItem.product.price || 0) * cartItem.quantity;
            }
            
            return total;
        }, 0);
    }, [selectedItems, cartItems]);

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setIsUpdating(productId);
        try {
            const response = await updateQuantity(productId, newQuantity);
            toast.success(response);
        } catch (error) {
            // @ts-expect-error catch error
            toast.error(error.message);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        setIsUpdating(productId);
        try {
            const response = await removeFromCart(productId);
            // Xóa item khỏi danh sách selected
            setSelectedItems(prev => prev.filter(id => id !== productId));
            toast.success(response);
        } catch (error) {
            console.log(error);
            // @ts-expect-error catch error
            toast.error(error.message);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleClearCart = async () => {
        try {
            setIsUpdating('clearing');
            const response = await clearCart();
            // Xóa tất cả selected items
            setSelectedItems([]);
            toast.success(response);
        } catch (error) {
            console.error('Error clearing cart:', error);
            // @ts-expect-error catch error
            toast.error(error.message);
        } finally {
            setIsUpdating(null);
        }
    };
        const handleCheckout = async () => {
        try {
            const toastId = toast.loading("Đang tạo đơn hàng");
            // const response = await createOrderFromCartAPI();
            const response = await createOrder(selectedItems.map((productId) => ({
                product_id: productId,
                quantity: cartItems.find(item => item.product.product_id === productId)?.quantity || 1
            })));
            console.log(response);
            if (!response?.data) {
                throw new Error("Có lỗi! Đơn hàng không được tạo!");
            }
            sessionStorage.setItem("newOrder", JSON.stringify(response.data.createOrder.order));
            toast.dismiss(toastId);
            router.push("/checkout");
        } catch {
            toast.error("Có lỗi! Đơn hàng không được tạo!");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Giỏ hàng của bạn</CardTitle>
                        <CardDescription>Đang tải thông tin giỏ hàng...</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-20 w-20 rounded-md" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto py-10">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">Giỏ hàng của bạn</CardTitle>
                        <CardDescription>Giỏ hàng của bạn đang trống</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pt-6 pb-8">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="mb-6 text-muted-foreground">
                            Bạn chưa thêm sản phẩm nào vào giỏ hàng
                        </p>
                        <Button asChild>
                            <Link href="/">Tiếp tục mua sắm</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Giỏ hàng của bạn</CardTitle>
                        <CardDescription>
                            {cartItems.length} sản phẩm trong giỏ hàng
                            {selectedItems.length > 0 && (
                                <span className="ml-2 text-blue-600">
                                    ({selectedItems.length} đã chọn)
                                </span>
                            )}
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleClearCart}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa giỏ hàng
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Danh sách sản phẩm trong giỏ hàng của bạn.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">
                                    <input
                                        type="checkbox"
                                        checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                                        onChange={handleSelectAll}
                                        aria-label="Chọn tất cả"
                                    />
                                </TableHead>
                                <TableHead className="w-[300px]">Sản phẩm</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead className="text-right">Thành tiền</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cartItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.product.product_id)}
                                            onChange={() => handleSelectItem(item.product.product_id)}
                                            aria-label={`Chọn sản phẩm ${item.product.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-16 w-16 relative rounded overflow-hidden">
                                                <Image
                                                    src={item.product.image || "/laptop.png"}
                                                    alt={item.product.name || "Sản phẩm"}
                                                    fill
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">{item && `Sản phẩm #${item.product.name}`}</div>
                                                <div className="text-sm text-muted-foreground">Mã: {item.product.product_id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(item.product.price || 0)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity - 1)}
                                                disabled={!!isUpdating || item.quantity <= 1}
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity + 1)}
                                                disabled={!!isUpdating}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency((item.product.price || 0) * item.quantity)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => handleRemoveItem(item.product.product_id)}
                                            disabled={!!isUpdating}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">Tổng cộng</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(totalPrice)}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href="/products">
                            Tiếp tục mua sắm
                        </Link>
                    </Button>
                    <div className="flex flex-col items-end gap-2">
                        {selectedItems.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Vui lòng chọn ít nhất 1 sản phẩm để thanh toán
                            </p>
                        )}
                        <Button 
                            onClick={handleCheckout} 
                            disabled={selectedItems.length === 0}
                            className={selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            {selectedItems.length > 0 
                                ? `Thanh toán (${selectedItems.length} sản phẩm)` 
                                : "Thanh toán"
                            }
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}