'use client'
import React, { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/toast-config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const { login, loading } = useAuth();
  const { isAuthenticated, user } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect') || '/';
  const redirectUrl = redirectParam.startsWith('/') ? redirectParam : '/';

  // Kiểm tra nếu người dùng đã đăng nhập và chuyển hướng phù hợp
  useEffect(() => {
    if (isAuthenticated) {
      // Kiểm tra role của người dùng
      if (user && (user.role === 'admin' || user.role === 'staff')) {
        console.log("Đã phát hiện admin/staff, chuyển hướng đến trang admin");
        router.push('/admin');
      } else {
        console.log("Chuyển hướng người dùng thường đến:", redirectUrl);
        router.push(redirectUrl !== '/login' ? redirectUrl : '/');
      }
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Show loading toast
      const loadingToast = toast.loading("Đang đăng nhập...");
      
      const response = await login(username, password);
      
      // Clear loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Đăng nhập thành công");
      
      // Wait for context to update before redirecting
      // This is important to ensure the redirect logic uses the updated auth state
      setTimeout(() => {
        if (response.user && (response.user.role === 'admin' || response.user.role === 'staff')) {
          console.log("Admin/staff user detected, redirecting to admin dashboard");
          router.replace('/admin');
        } else {
          console.log("Regular user detected, redirecting to:", redirectUrl);
          router.replace(redirectUrl !== '/login' ? redirectUrl : '/');
        }
      }, 500); // Slightly longer delay to ensure context is updated

    } catch {
      toast.error("Đăng nhập thất bại");
    }
  };

  return (
    <>
    <div className="fixed inset-0 -z-10">
      <Image src="/shapelined.jpg"
        fill={true}
        className="object-cover"
        alt="background"
        priority
      />
    </div>
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
      <div className="w-full max-w-md">
        <Card className="border shadow-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <Image
              alt="icon"
              src="/gaming.png"
              width={80}
              height={80}
              className="mx-auto object-contain mb-4"
              priority
            />
            <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập để tiếp tục
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full"
                />
                <div className="flex items-center justify-between">
                  <Link href="/forgotPassword" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Page;