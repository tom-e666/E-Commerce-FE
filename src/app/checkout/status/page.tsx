"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useOrder } from "@/hooks/useOrder";
import { Order } from "@/types/order";

function CheckoutStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { getOrderByTransaction } = useOrder();
    const vnpTxnRef = searchParams.get("vnp_TxnRef");
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");

    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setTransactionId(vnpTxnRef);

        const fetchOrder = async () => {
            if (!vnpTxnRef) return;
            try {
                const response = await getOrderByTransaction(vnpTxnRef);
                console.log("Response from getOrderByTransaction:", response);
                if (response.code === 200 && response.order && response.order.status === "confirmed") {
                    setOrder(response.order);
                    setStatus("success");
                    setIsSuccess(true);
                } else {
                    setStatus("failed");
                    setIsSuccess(false);
                }
            } catch {
                setStatus("failed");
                setIsSuccess(false);
            }
        };

        // Simulate payment verification
        setTimeout(() => {
            if (vnpResponseCode === "00" || vnpTxnRef) {
                setStatus("success");
            } else {
                setStatus("failed");
            }
        }, 2000);

        fetchOrder();
    }, [searchParams]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Đang xác minh thanh toán</h2>
                        <p className="text-muted-foreground text-center">
                            Vui lòng đợi trong giây lát...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {status === "success" ? (
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        ) : (
                            <XCircle className="h-16 w-16 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === "success" ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                    </CardTitle>
                    <CardDescription>
                        {status === "success"
                            ? "Đơn hàng của bạn đã được xử lý thành công."
                            : "Có lỗi xảy ra trong quá trình thanh toán."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {transactionId && (
                        <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Mã giao dịch:</span>
                                <span className="font-medium">{transactionId}</span>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between flex-wrap gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Về trang chủ
                        </Link>
                    </Button>
                    {status === "success" && (
                        <Button asChild>
                            <Link href="/account/orders">
                                <Package className="mr-2 h-4 w-4" />
                                Xem đơn hàng
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default function CheckoutStatusPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-12 px-4">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Đang tải...</p>
                    </CardContent>
                </Card>
            </div>
        }>
            <CheckoutStatusContent />
        </Suspense>
    );
}