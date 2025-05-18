'use client'

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/Authorization/ProtectedRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['admin', 'staff']}>
            {children}
        </ProtectedRoute>
    );
}