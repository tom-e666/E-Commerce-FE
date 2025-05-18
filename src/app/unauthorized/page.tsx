'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h1>
            <p className="mb-6 text-center max-w-md">
                Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu đây là một sự nhầm lẫn.
            </p>
            <Button asChild>
                <Link href="/">Quay lại trang chủ</Link>
            </Button>
        </div>
    );
}