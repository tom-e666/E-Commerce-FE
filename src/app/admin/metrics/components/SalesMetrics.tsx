'use client'

import React from 'react';
import { SalesMetricsResponse } from '@/services/metric/endpoints';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import {
    SalesRevenueChart,
    AverageOrderValueChart,
    RevenueOrdersBarChart
} from './ChartComponents';

interface SalesMetricsProps {
    salesMetrics: SalesMetricsResponse | null;
    loading: boolean;
    timeframe: 'daily' | 'weekly' | 'monthly';
    onTimeframeChange: (timeframe: 'daily' | 'weekly' | 'monthly') => void;
}

export function SalesMetrics({
    salesMetrics,
    loading,
    timeframe,
    onTimeframeChange
}: SalesMetricsProps) {
    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-4">
                <Select
                    value={timeframe}
                    onValueChange={(v) => onTimeframeChange(v as 'daily' | 'weekly' | 'monthly')}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <SalesRevenueChart
                salesMetrics={salesMetrics}
                loading={loading}
                timeframe={timeframe}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <AverageOrderValueChart
                    salesMetrics={salesMetrics}
                    loading={loading}
                    timeframe={timeframe}
                />

                <RevenueOrdersBarChart
                    salesMetrics={salesMetrics}
                    loading={loading}
                    timeframe={timeframe}
                />
            </div>
        </motion.div>
    );
}

export default SalesMetrics;
