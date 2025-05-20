'use client'

import { ReactNode, useEffect } from 'react';
import ProtectedRoute from '@/components/Authorization/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, hasRole, isLoading } = useAuthContext();

    // Thêm bảo vệ kép để đảm bảo chỉ admin/staff mới có thể truy cập
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            if (!hasRole(['admin', 'staff'])) {
                console.log("Redirecting non-admin user from admin area");
                router.push('/unauthorized');
            }
        } else if (!isLoading && !isAuthenticated) {
            // Nếu chưa đăng nhập, chuyển đến trang login với redirect về admin
            router.push('/login?redirect=/admin');
        }
    }, [isAuthenticated, hasRole, isLoading, router]);

    return (
        <ProtectedRoute allowedRoles={['admin', 'staff']}>
            {children}
        </ProtectedRoute>
    );
}