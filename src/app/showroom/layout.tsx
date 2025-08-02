import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showroom",
  description: "Tham quan showroom EMS Electronics để trải nghiệm trực tiếp các mẫu laptop gaming và máy tính mới nhất. Địa chỉ showroom, giờ mở cửa và thông tin liên hệ.",
  keywords: ["showroom", "cửa hàng", "địa chỉ", "trải nghiệm sản phẩm", "laptop gaming", "máy tính", "tham quan"],
  openGraph: {
    title: "Showroom - EMS Electronics",
    description: "Tham quan showroom EMS Electronics để trải nghiệm trực tiếp laptop gaming và máy tính",
    images: ['/store1.jpg'],
  },
  alternates: {
    canonical: '/showroom',
  },
};

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
