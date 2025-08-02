import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập",
  description: "Đăng nhập vào tài khoản EMS Electronics để trải nghiệm mua sắm laptop gaming và máy tính với nhiều ưu đãi đặc biệt. Đăng nhập an toàn và bảo mật.",
  keywords: ["đăng nhập", "tài khoản", "login", "thành viên", "ưu đãi thành viên"],
  openGraph: {
    title: "Đăng Nhập - EMS Electronics",
    description: "Đăng nhập vào tài khoản EMS Electronics để nhận nhiều ưu đãi đặc biệt",
    images: ['/user.png'],
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
