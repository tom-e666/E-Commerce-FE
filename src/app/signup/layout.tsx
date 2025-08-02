import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký",
  description: "Tạo tài khoản EMS Electronics để nhận ưu đãi độc quyền khi mua laptop gaming và máy tính. Đăng ký nhanh chóng, an toàn và miễn phí.",
  keywords: ["đăng ký", "tạo tài khoản", "register", "thành viên mới", "ưu đãi đăng ký"],
  openGraph: {
    title: "Đăng Ký - EMS Electronics",
    description: "Tạo tài khoản EMS Electronics để nhận ưu đãi độc quyền khi mua laptop gaming",
    images: ['/user.png'],
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/signup',
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
