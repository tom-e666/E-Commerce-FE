import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  description: "Xem và quản lý giỏ hàng của bạn tại EMS Electronics. Kiểm tra các sản phẩm đã chọn, điều chỉnh số lượng và tiến hành thanh toán an toàn.",
  keywords: ["giỏ hàng", "thanh toán", "đặt hàng", "laptop gaming", "mua sắm trực tuyến", "checkout"],
  openGraph: {
    title: "Giỏ Hàng - EMS Electronics",
    description: "Xem và quản lý giỏ hàng của bạn tại EMS Electronics. Kiểm tra sản phẩm và tiến hành thanh toán.",
    images: ['/order.png'],
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/cart',
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
