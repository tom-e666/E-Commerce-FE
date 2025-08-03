"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Package, ArrowLeft } from "lucide-react";
import { useOrder } from "@/hooks/useOrder";
import { useShipping } from "@/hooks/useShipping";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderItem from "@/components/checkout/OrderItem";
import { purchase } from "@/lib/gtag";

interface OrderData {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    product_id?: string;
  }[];
}

interface ShippingData {
  recipient_name: string;
  recipient_phone: string;
  address: string;
  ward_name: string;
  district_name: string;
  province_name: string;
  note?: string;
}

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);
  
  // Extract parameters from URL
  const sessionId = searchParams.get("session_id");
  const transactionId = searchParams.get("transaction_id");
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  // Local state for data
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getOrderByTransaction, getOrder } = useOrder();
  const { handleFetchShippingByOrderId } = useShipping();

  useEffect(() => {
    // Prevent multiple calls
    if (hasInitialized.current) return;
    
    async function loadOrderData() {
      try {
        console.log("Params:", { sessionId, transactionId, orderId, method });
        
        if (!sessionId && !orderId && !transactionId) {
          console.log("No valid parameters found, redirecting to home");
          router.push("/");
          return;
        }

        hasInitialized.current = true;
        setLoading(true);
        setError(null);

        let fetchedOrder: OrderData | null = null;

        // If we have orderId directly, use it
        if (orderId) {
          console.log("Fetching order by ID:", orderId);
          fetchedOrder = await getOrder(orderId);
        } 
        // If we have transaction ID, get order by transaction
        else if (transactionId) {
          console.log("Fetching order by transaction ID:", transactionId);
          const response = await getOrderByTransaction(transactionId);
          if (response && response.code === 200 && response.order) {
            fetchedOrder = response.order;
          }
        }

        if (!fetchedOrder) {
          throw new Error("Order not found");
        }

        console.log("Order fetched successfully:", fetchedOrder);
        setOrderData(fetchedOrder);

        // Fetch shipping data
        const shipping = await handleFetchShippingByOrderId(fetchedOrder.id);
        console.log("Shipping data fetched:", shipping);
        setShippingData(shipping);

        // Track purchase for analytics
        if (fetchedOrder) {
          purchase({
            transaction_id: transactionId || fetchedOrder.id,
            value: fetchedOrder.total_price,
            currency: "VND",
          });
        }

      } catch (error) {
        console.error("Error loading order data:", error);
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    }

    loadOrderData();
  }, []); // Empty dependency array - only run once

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Không tìm thấy đơn hàng</CardTitle>
            <CardDescription>
              {error || "Rất tiếc, chúng tôi không thể tìm thấy thông tin đơn hàng của bạn."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getPaymentMethodText = () => {
    if (method === "stripe" || transactionId?.startsWith("STRIPE")) {
      return "Thanh toán qua Stripe";
    }
    if (method === "cod") {
      return "Thanh toán khi nhận hàng (COD)";
    }
    if (method === "vnpay") {
      return "Thanh toán qua VNPAY";
    }
    return "Thanh toán trực tuyến";
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Đặt hàng thành công!</CardTitle>
          <CardDescription>
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất
            có thể.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-3">Thông tin đơn hàng</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Mã đơn hàng:
                </span>
                <span className="font-medium">{orderData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ngày đặt:</span>
                <span className="font-medium">
                  {new Date(orderData.created_at).toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Trạng thái:
                </span>
                <span className="font-medium capitalize">
                  {orderData.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Phương thức thanh toán:
                </span>
                <span className="font-medium">{getPaymentMethodText()}</span>
              </div>
              {sessionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Mã phiên thanh toán:
                  </span>
                  <span className="font-mono text-xs">{sessionId}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Mã giao dịch:
                  </span>
                  <span className="font-mono text-xs">{transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {shippingData && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-3">Thông tin giao hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Người nhận:
                  </span>
                  <span className="font-medium">
                    {shippingData.recipient_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Số điện thoại:
                  </span>
                  <span className="font-medium">
                    {shippingData.recipient_phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Địa chỉ:
                  </span>
                  <span className="font-medium text-right">{`${shippingData.address}, ${shippingData.ward_name}, ${shippingData.district_name}, ${shippingData.province_name}`}</span>
                </div>
                {shippingData.note && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ghi chú:
                    </span>
                    <span className="font-medium text-right">
                      {shippingData.note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-3">Chi tiết đơn hàng</h3>
            <div className="border rounded-lg overflow-hidden">
              {orderData.items.map((item, index) => {
                // Ensure image is either a valid string or null
                const itemWithValidImage = {
                  ...item,
                  image: item.image && item.image.trim() !== '' ? item.image : null
                };
                
                return (
                  <OrderItem key={item.id || `item-${index}`} item={itemWithValidImage} />
                );
              })}
              <div className="p-4 bg-muted">
                <div className="flex justify-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(orderData.total_price)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(orderData.total_price)}</span>
                </div>
              </div>
            </div>
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
            <Link href="/order">
              <Package className="mr-2 h-4 w-4" />
              Xem đơn hàng của tôi
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg">Đang tải trang thành công...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
