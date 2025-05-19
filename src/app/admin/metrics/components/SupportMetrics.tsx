'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"
import { SupportMetricsResponse } from '@/services/metric/endpoints';

interface SupportMetricsProps {
    supportMetrics: SupportMetricsResponse | null;
    loading: boolean;
}

const getSupportChartData = (supportMetrics: SupportMetricsResponse | null) => {
    if (!supportMetrics) return [];

    return [
        { name: "Đang chờ xử lý", value: supportMetrics.open_tickets || 0 },
        { name: "Đang xử lý", value: supportMetrics.in_progress_tickets || 0 },
        { name: "Đã giải quyết", value: supportMetrics.resolved_tickets || 0 }
    ];
};

export function SupportMetrics({ supportMetrics, loading }: SupportMetricsProps) {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Tình trạng yêu cầu hỗ trợ</CardTitle>
                    <CardDescription>Phân bố theo trạng thái</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] p-0 sm:p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart className="w-full">
                                <Pie
                                    data={getSupportChartData(supportMetrics)}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={150}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    className="stroke-background"
                                >
                                    {getSupportChartData(supportMetrics).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === 0 ? 'hsl(var(--primary))' :
                                                index === 1 ? 'hsl(var(--warning))' : 'hsl(var(--success))'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [value, "Số yêu cầu"]}
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                    itemStyle={{ color: "hsl(var(--foreground))" }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span className="text-muted-foreground">{value}</span>
                                    )}
                                    wrapperStyle={{ paddingTop: 10 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tổng quan yêu cầu hỗ trợ</CardTitle>
                    <CardDescription>Thời gian xử lý trung bình: {supportMetrics?.average_resolution_time || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Đang chờ xử lý</span>
                                    <span className="font-bold text-lg">{supportMetrics?.open_tickets || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-primary h-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${supportMetrics ? (supportMetrics.open_tickets / (supportMetrics.open_tickets + supportMetrics.in_progress_tickets + supportMetrics.resolved_tickets) * 100) : 0}%`
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Đang xử lý</span>
                                    <span className="font-bold text-lg">{supportMetrics?.in_progress_tickets || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-warning h-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${supportMetrics ? (supportMetrics.in_progress_tickets / (supportMetrics.open_tickets + supportMetrics.in_progress_tickets + supportMetrics.resolved_tickets) * 100) : 0}%`
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Đã giải quyết</span>
                                    <span className="font-bold text-lg">{supportMetrics?.resolved_tickets || 0}</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-success h-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${supportMetrics ? (supportMetrics.resolved_tickets / (supportMetrics.open_tickets + supportMetrics.in_progress_tickets + supportMetrics.resolved_tickets) * 100) : 0}%`
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="font-medium mb-2">Hiệu suất xử lý yêu cầu</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Tỷ lệ giải quyết:</span>
                                    <span className="font-medium">
                                        {supportMetrics
                                            ? `${((supportMetrics.resolved_tickets / (supportMetrics.open_tickets + supportMetrics.in_progress_tickets + supportMetrics.resolved_tickets)) * 100).toFixed(1)}%`
                                            : "N/A"
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}