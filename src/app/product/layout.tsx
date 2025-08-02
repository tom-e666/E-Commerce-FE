import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản Phẩm",
  description: "Khám phá bộ sưu tập laptop gaming và máy tính đa dạng tại EMS Electronics. Tìm kiếm và lọc theo thương hiệu, giá cả, cấu hình. Laptop MSI, Acer, ASUS, Dell, HP với giá tốt nhất.",
  keywords: ["danh sách laptop", "tìm kiếm laptop", "laptop gaming", "máy tính văn phòng", "laptop MSI", "laptop Acer", "laptop ASUS", "laptop Dell", "laptop HP", "bộ lọc laptop", "so sánh laptop"],
  openGraph: {
    title: "Sản Phẩm - EMS Electronics",
    description: "Khám phá bộ sưu tập laptop gaming và máy tính đa dạng tại EMS Electronics. Tìm kiếm và lọc theo thương hiệu, giá cả, cấu hình.",
    images: [
      {
        url: '/laptop.png',
        width: 1200,
        height: 630,
        alt: 'Danh sách sản phẩm laptop gaming',
      },
    ],
  },
  alternates: {
    canonical: '/product',
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
