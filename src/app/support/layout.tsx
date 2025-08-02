import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hỗ Trợ Khách Hàng",
  description: "Trung tâm hỗ trợ khách hàng EMS Electronics. Liên hệ với chúng tôi để được tư vấn về laptop gaming, bảo hành sản phẩm và các dịch vụ khác.",
  keywords: ["hỗ trợ khách hàng", "tư vấn", "bảo hành", "dịch vụ khách hàng", "liên hệ", "customer support"],
  openGraph: {
    title: "Hỗ Trợ Khách Hàng - EMS Electronics",
    description: "Trung tâm hỗ trợ khách hàng EMS Electronics. Liên hệ để được tư vấn và hỗ trợ",
    images: ['/support.jpg'],
  },
  alternates: {
    canonical: '/support',
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
