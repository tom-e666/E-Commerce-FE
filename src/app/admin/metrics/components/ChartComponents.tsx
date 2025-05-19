'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { vi as viVN } from 'date-fns/locale';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { SalesMetricsResponse, ProductMetricsResponse } from '@/services/metric/endpoints';

// Format currency values
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
};

// Format date based on timeframe
const formatDate = (date: string, timeframe: 'daily' | 'weekly' | 'monthly') => {
    if (!date) return '';

    const dateObj = new Date(date);

    if (timeframe === 'daily') {
        return format(dateObj, 'dd/MM', { locale: viVN });
    } else if (timeframe === 'weekly') {
        return format(dateObj, "'Tuần' w, MM/yyyy", { locale: viVN });
    } else {
        return format(dateObj, 'MM/yyyy', { locale: viVN });
    }
};

interface SalesChartProps {
    salesMetrics: SalesMetricsResponse | null;
    loading: boolean;
    timeframe: 'daily' | 'weekly' | 'monthly';
}

export function SalesRevenueChart({ salesMetrics, loading, timeframe }: SalesChartProps) {
    const getSalesData = () => {
        if (!salesMetrics) return [];

        if (timeframe === 'daily' && salesMetrics.daily_metrics) {
            return salesMetrics.daily_metrics;
        } else if (timeframe === 'weekly' && salesMetrics.weekly_metrics) {
            return salesMetrics.weekly_metrics;
        } else if (timeframe === 'monthly' && salesMetrics.monthly_metrics) {
            return salesMetrics.monthly_metrics;
        }

        return [];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Doanh số bán hàng</CardTitle>
                <CardDescription>Thống kê doanh số theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-0 sm:p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={getSalesData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            className="w-full [&_.recharts-cartesian-grid-horizontal]:stroke-border [&_.recharts-cartesian-grid-vertical]:stroke-border"
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => formatDate(value, timeframe)}
                                className="text-muted-foreground text-xs"
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                className="text-muted-foreground text-xs"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                className="text-muted-foreground text-xs"
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => {
                                    if (name === "revenue") return [formatCurrency(value), "Doanh thu"];
                                    if (name === "orders_count") return [value, "Số đơn hàng"];
                                    if (name === "average_order_value") return [formatCurrency(value), "Giá trị trung bình"];
                                    return [value, name];
                                }}
                                labelFormatter={(value) => formatDate(value, timeframe)}
                                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend
                                payload={[
                                    { value: 'Doanh thu', type: 'line', color: 'hsl(var(--primary))' },
                                    { value: 'Số đơn hàng', type: 'line', color: 'hsl(var(--secondary))' }
                                ]}
                                wrapperStyle={{ paddingTop: 10 }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(var(--primary))"
                                name="revenue"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="orders_count"
                                stroke="hsl(var(--secondary))"
                                name="orders_count"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function AverageOrderValueChart({ salesMetrics, loading, timeframe }: SalesChartProps) {
    const getSalesData = () => {
        if (!salesMetrics) return [];

        if (timeframe === 'daily' && salesMetrics.daily_metrics) {
            return salesMetrics.daily_metrics;
        } else if (timeframe === 'weekly' && salesMetrics.weekly_metrics) {
            return salesMetrics.weekly_metrics;
        } else if (timeframe === 'monthly' && salesMetrics.monthly_metrics) {
            return salesMetrics.monthly_metrics;
        }

        return [];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Giá trị đơn hàng trung bình</CardTitle>
                <CardDescription>Theo {timeframe === 'daily' ? 'ngày' : timeframe === 'weekly' ? 'tuần' : 'tháng'}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-0 sm:p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={getSalesData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            className="w-full [&_.recharts-cartesian-grid-horizontal]:stroke-border [&_.recharts-cartesian-grid-vertical]:stroke-border"
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => formatDate(value, timeframe)}
                                className="text-muted-foreground text-xs"
                            />
                            <YAxis
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                className="text-muted-foreground text-xs"
                            />
                            <Tooltip
                                formatter={(value: number) => [formatCurrency(value), "Giá trị trung bình"]}
                                labelFormatter={(value) => formatDate(value, timeframe)}
                                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="average_order_value"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function RevenueOrdersBarChart({ salesMetrics, loading, timeframe }: SalesChartProps) {
    const getSalesData = () => {
        if (!salesMetrics) return [];

        if (timeframe === 'daily' && salesMetrics.daily_metrics) {
            return salesMetrics.daily_metrics;
        } else if (timeframe === 'weekly' && salesMetrics.weekly_metrics) {
            return salesMetrics.weekly_metrics;
        } else if (timeframe === 'monthly' && salesMetrics.monthly_metrics) {
            return salesMetrics.monthly_metrics;
        }

        return [];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Đơn hàng và doanh thu</CardTitle>
                <CardDescription>Mối quan hệ giữa số đơn hàng và doanh thu</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] p-0 sm:p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={getSalesData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            className="w-full [&_.recharts-cartesian-grid-horizontal]:stroke-border [&_.recharts-cartesian-grid-vertical]:stroke-border"
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => formatDate(value, timeframe)}
                                className="text-muted-foreground text-xs"
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                className="text-muted-foreground text-xs"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                className="text-muted-foreground text-xs"
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => {
                                    if (name === "revenue") return [formatCurrency(value), "Doanh thu"];
                                    if (name === "orders_count") return [value, "Số đơn hàng"];
                                    return [value, name];
                                }}
                                labelFormatter={(value) => formatDate(value, timeframe)}
                                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend
                                payload={[
                                    { value: 'Doanh thu', type: 'rect', color: 'hsl(var(--primary))' },
                                    { value: 'Số đơn hàng', type: 'rect', color: 'hsl(var(--secondary))' }
                                ]}
                                wrapperStyle={{ paddingTop: 10 }}
                            />
                            <Bar
                                yAxisId="left"
                                dataKey="revenue"
                                fill="hsl(var(--primary))"
                                name="revenue"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="orders_count"
                                fill="hsl(var(--secondary))"
                                name="orders_count"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

interface ProductChartProps {
    productMetrics: ProductMetricsResponse | null;
    loading: boolean;
}

export function TopProductsByRevenueChart({ productMetrics, loading }: ProductChartProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Phân tích doanh số theo sản phẩm</CardTitle>
                <CardDescription>Top 10 sản phẩm theo doanh thu</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-0 sm:p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productMetrics?.top_selling_products || []}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            className="w-full [&_.recharts-cartesian-grid-horizontal]:stroke-border [&_.recharts-cartesian-grid-vertical]:stroke-border"
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                type="number"
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                className="text-muted-foreground text-xs"
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={100}
                                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                                className="text-muted-foreground text-xs"
                            />
                            <Tooltip
                                formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                            <Bar
                                dataKey="revenue"
                                name="Doanh thu"
                                fill="hsl(var(--primary))"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
