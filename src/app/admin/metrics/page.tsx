'use client'

import React, { useState, useEffect } from 'react';
import {
    getAdminDashboardMetrics,
    getSalesMetrics,
    getProductMetrics,
    getSupportMetrics,
    DashboardMetrics,
    SalesMetricsResponse,
    ProductMetricsResponse,
    SupportMetricsResponse
} from '@/services/metric/endpoints';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/customUI/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";

// Import custom components
import { AdminDashboardMetrics } from "./components/AdminDashboardMetrics";
import { SupportMetrics } from "./components/SupportMetrics";
import { SalesMetrics } from "./components/SalesMetrics";
import { ProductMetrics } from "./components/ProductMetrics";

export default function MetricsPage() {
    const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
    const [salesMetrics, setSalesMetrics] = useState<SalesMetricsResponse | null>(null);
    const [productMetrics, setProductMetrics] = useState<ProductMetricsResponse | null>(null);
    const [supportMetrics, setSupportMetrics] = useState<SupportMetricsResponse | null>(null);
    const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
    });
    const [loading, setLoading] = useState({
        dashboard: true,
        sales: true,
        products: true,
        support: true,
    });

    // Fetch dashboard metrics
    useEffect(() => {
        const fetchDashboardMetrics = async () => {
            setLoading(prev => ({ ...prev, dashboard: true }));
            try {
                const data = await getAdminDashboardMetrics();
                if (data.code === 200) {
                    setDashboardMetrics(data);
                }
            } catch (error) {
                console.error("Error fetching dashboard metrics:", error);
            } finally {
                setLoading(prev => ({ ...prev, dashboard: false }));
            }
        };

        fetchDashboardMetrics();
    }, []);

    // Fetch sales metrics when timeframe or date range changes
    useEffect(() => {
        const fetchSalesMetrics = async () => {
            if (!dateRange?.from || !dateRange?.to) return;

            setLoading(prev => ({ ...prev, sales: true }));
            try {
                const startDate = dateRange.from.toISOString().split('T')[0];
                const endDate = dateRange.to.toISOString().split('T')[0];

                const data = await getSalesMetrics(
                    timeframe,
                    startDate,
                    endDate
                );

                if (data.code === 200) {
                    setSalesMetrics(data);
                }
            } catch (error) {
                console.error("Error fetching sales metrics:", error);
            } finally {
                setLoading(prev => ({ ...prev, sales: false }));
            }
        };

        fetchSalesMetrics();
    }, [timeframe, dateRange]);

    // Fetch product metrics
    useEffect(() => {
        const fetchProductMetrics = async () => {
            setLoading(prev => ({ ...prev, products: true }));
            try {
                const data = await getProductMetrics(10);
                if (data.code === 200) {
                    setProductMetrics(data);
                }
            } catch (error) {
                console.error("Error fetching product metrics:", error);
            } finally {
                setLoading(prev => ({ ...prev, products: false }));
            }
        };

        fetchProductMetrics();
    }, []);

    // Fetch support metrics
    useEffect(() => {
        const fetchSupportMetrics = async () => {
            setLoading(prev => ({ ...prev, support: true }));
            try {
                const data = await getSupportMetrics();
                if (data.code === 200) {
                    setSupportMetrics(data);
                }
            } catch (error) {
                console.error("Error fetching support metrics:", error);
            } finally {
                setLoading(prev => ({ ...prev, support: false }));
            }
        };

        fetchSupportMetrics();
    }, []);

    const handleTimeframeChange = (newTimeframe: 'daily' | 'weekly' | 'monthly') => {
        setTimeframe(newTimeframe);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Thống kê kinh doanh</h1>
                <div className="flex items-center space-x-2">
                    <DatePickerWithRange
                        date={dateRange}
                        onDateChange={setDateRange}
                    />
                </div>
            </div>

            {/* Overview Cards */}
            {loading.dashboard ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <AdminDashboardMetrics dashboardMetrics={dashboardMetrics} />
            )}

            {/* Main Tabs */}
            <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid grid-cols-3 max-w-md">
                    <TabsTrigger value="sales">Doanh số</TabsTrigger>
                    <TabsTrigger value="products">Sản phẩm</TabsTrigger>
                    <TabsTrigger value="support">Hỗ trợ</TabsTrigger>
                </TabsList>

                {/* Sales Tab Content */}
                <TabsContent value="sales">
                    <SalesMetrics
                        salesMetrics={salesMetrics}
                        loading={loading.sales}
                        timeframe={timeframe}
                        onTimeframeChange={handleTimeframeChange}
                    />
                </TabsContent>

                {/* Products Tab Content */}
                <TabsContent value="products">
                    <ProductMetrics
                        productMetrics={productMetrics}
                        loading={loading.products}
                    />
                </TabsContent>

                {/* Support Tab Content */}
                <TabsContent value="support">
                    <SupportMetrics
                        supportMetrics={supportMetrics}
                        loading={loading.support}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}