'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({
    children,
    allowedRoles
}: ProtectedRouteProps) {
    const { isAuthenticated, hasRole, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
            } else if (allowedRoles && !hasRole(allowedRoles)) {
                router.push('/unauthorized');
            }
        }
    }, [isAuthenticated, loading, router, hasRole, allowedRoles]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated || (allowedRoles && !hasRole(allowedRoles))) {
        return null;
    }

    return <>{children}</>;
}