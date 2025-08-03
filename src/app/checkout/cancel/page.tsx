"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Thanh toán đã bị hủy</CardTitle>
          <CardDescription>
            Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn vẫn được lưu và bạn có thể tiếp tục thanh toán bất cứ lúc nào.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Nếu bạn gặp vấn đề với thanh toán, vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button asChild>
            <Link href="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Quay lại giỏ hàng
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
