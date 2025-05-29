'use client'

import { ReactNode, useEffect } from 'react';
import ProtectedRoute from '@/components/Authorization/ProtectedRoute';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, hasRole, isLoading } = useAuthContext();

    // Thêm bảo vệ kép để đảm bảo chỉ admin/staff mới có thể truy cập
    useEffect(() => {
        if (!isLoading) {
            console.log("Admin layout - Auth state:", { isAuthenticated, isAdmin: hasRole(['admin', 'staff']) });

            if (isAuthenticated) {
                // Đã đăng nhập, kiểm tra quyền
                if (!hasRole(['admin', 'staff'])) {
                    console.log("Redirecting non-admin user from admin area");
                    router.push('/not-found');
                } else {
                    console.log("Admin user confirmed, staying on admin page");
                }
            } else {
                // Nếu chưa đăng nhập, chuyển đến trang login
                // KHÔNG thêm redirect parameter để tránh vòng lặp chuyển hướng
                console.log("User not authenticated, redirecting to login page");
                router.push('/login');
            }
        }
    }, [isAuthenticated, hasRole, isLoading, router]);

    return (
        <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <div className="relative">
                {pathname !== '/admin' && (
                    <div className="mb-2 mt-2">
                        <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                            <ChevronLeft className="h-6 w-6" />
                            <span className="text-sm">Admin</span>
                        </Link>
                    </div>
                )}
                {children}
            </div>
        </ProtectedRoute>
    );
}