import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm Kiếm Thông Minh",
  description: "Tìm kiếm laptop gaming và máy tính với công nghệ AI thông minh. Mô tả nhu cầu bằng ngôn ngữ tự nhiên và nhận được kết quả chính xác nhất.",
  keywords: ["tìm kiếm thông minh", "AI search", "tìm laptop", "tìm máy tính", "smart search", "artificial intelligence"],
  openGraph: {
    title: "Tìm Kiếm Thông Minh - EMS Electronics",
    description: "Tìm kiếm laptop gaming với công nghệ AI thông minh. Mô tả nhu cầu và nhận kết quả chính xác",
    images: ['/laptop.png'],
  },
  alternates: {
    canonical: '/smartSearch',
  },
};

export default function SmartSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
