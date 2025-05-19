'use client'

import React from 'react';
import { ShoppingBag, DollarSign, Users, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardMetrics } from '@/services/metric/endpoints';
import { MetricCard } from './MetricCard';

// Format currency values
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
};

// Calculate percent change
const calculatePercentChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

interface AdminDashboardMetricsProps {
    dashboardMetrics: DashboardMetrics | null;
}

export function AdminDashboardMetrics({ dashboardMetrics }: AdminDashboardMetricsProps) {
    if (!dashboardMetrics) {
        return null;
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
            <MetricCard
                title="Đơn hàng hôm nay"
                value={dashboardMetrics.orders_today || 0}
                description={`Tuần này: ${dashboardMetrics.orders_week || 0} đơn`}
                percentChange={calculatePercentChange(
                    dashboardMetrics.orders_today || 0,
                    (dashboardMetrics.orders_week || 0) / 7 || 1
                )}
                icon={<ShoppingBag className="h-5 w-5" />}
            />

            <MetricCard
                title="Doanh thu hôm nay"
                value={dashboardMetrics.revenue_today || 0}
                description={`Tuần này: ${formatCurrency(dashboardMetrics.revenue_week || 0)}`}
                percentChange={calculatePercentChange(
                    dashboardMetrics.revenue_today || 0,
                    (dashboardMetrics.revenue_week || 0) / 7 || 1
                )}
                icon={<DollarSign className="h-5 w-5" />}
                format={formatCurrency}
            />

            <MetricCard
                title="Người dùng mới"
                value={dashboardMetrics.new_users_today || 0}
                description={`Tuần này: ${dashboardMetrics.new_users_week || 0} người dùng`}
                percentChange={calculatePercentChange(
                    dashboardMetrics.new_users_today || 0,
                    (dashboardMetrics.new_users_week || 0) / 7 || 1
                )}
                icon={<Users className="h-5 w-5" />}
            />

            <MetricCard
                title="Sản phẩm sắp hết"
                value={dashboardMetrics.low_stock_products || 0}
                description={`Hết hàng: ${dashboardMetrics.out_of_stock_products || 0} sản phẩm`}
                percentChange={0}
                icon={<AlertTriangle className="h-5 w-5" />}
                showPercentage={false}
            />
        </motion.div>
    );
}

export default AdminDashboardMetrics;
