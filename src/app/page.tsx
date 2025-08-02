import MainPageComponent from "@/app/MainPageComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang Chủ",
  description: "EMS Electronics - Cửa hàng laptop gaming, máy tính và phụ kiện công nghệ hàng đầu Việt Nam. Khám phá bộ sưu tập laptop gaming MSI, Acer, ASUS, Dell, HP với giá tốt nhất. Miễn phí giao hàng toàn quốc.",
  keywords: ["laptop gaming", "máy tính gaming", "laptop MSI", "laptop Acer", "laptop ASUS", "laptop Dell", "laptop HP", "phụ kiện gaming", "cửa hàng laptop", "mua laptop"],
  openGraph: {
    title: "EMS Electronics - Laptop Gaming & Máy Tính Chất Lượng Cao",
    description: "Khám phá bộ sưu tập laptop gaming và máy tính chất lượng cao tại EMS Electronics. Sản phẩm chính hãng, giá tốt, bảo hành uy tín.",
    images: [
      {
        url: '/vector_ilus_store.jpg',
        width: 1200,
        height: 630,
        alt: 'EMS Electronics Store',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
      <>
    <MainPageComponent/>
      </>
  )
}
