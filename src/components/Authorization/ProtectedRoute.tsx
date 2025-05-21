'use client'

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/unauthorized'
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, isLoading } = useAuthContext();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Chỉ thực hiện kiểm tra khi đã tải xong thông tin xác thực
    if (!isLoading) {
      if (!isAuthenticated) {
        // Chưa đăng nhập, chuyển hướng đến trang login
        // KHÔNG thêm redirect parameter để tránh vòng lặp chuyển hướng
        console.log("ProtectedRoute - User not authenticated, redirecting to login");

        // Kiểm tra nếu đang ở trang admin, không thêm redirect
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          router.push('/login');
        } else {
          // Cho các trang khác, có thể thêm redirect
          router.push(`/login?redirect=${currentPath}`);
        }

        setIsAuthorized(false);
        return;
      }

      // Đã đăng nhập, kiểm tra quyền nếu có
      if (allowedRoles.length > 0) {
        const authorized = hasRole(allowedRoles);
        setIsAuthorized(authorized);

        if (!authorized) {
          console.log("User doesn't have required roles, redirecting");
          router.push(redirectTo);
          return;
        }
      } else {
        // Không cần quyền cụ thể, chỉ cần đăng nhập
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, hasRole, allowedRoles, router, redirectTo]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang xác thực...</span>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;