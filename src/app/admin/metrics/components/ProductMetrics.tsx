'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ProductMetricsResponse } from '@/services/metric/endpoints';
import { TopProductsByRevenueChart } from './ChartComponents';

// Format currency values
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
};

interface ProductMetricsProps {
    productMetrics: ProductMetricsResponse | null;
    loading: boolean;
}

export function ProductMetrics({ productMetrics, loading }: ProductMetricsProps) {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Top selling products */}
            <Card>
                <CardHeader>
                    <CardTitle>Top sản phẩm bán chạy</CardTitle>
                    <CardDescription>Sản phẩm có doanh số cao nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {productMetrics?.top_selling_products.slice(0, 5).map((product, index) => (
                                <div key={product.id} className="flex items-center space-x-2">
                                    <span className="font-bold w-6">{index + 1}.</span>
                                    <div className="flex-1">
                                        <p className="font-medium">{product.name}</p>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>Đã bán: {product.sales_count}</span>
                                            <span>{formatCurrency(product.revenue)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Low stock products */}
            <Card>
                <CardHeader>
                    <CardTitle>Sản phẩm sắp hết hàng</CardTitle>
                    <CardDescription>Sản phẩm cần nhập thêm hàng</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {productMetrics?.low_stock_products.slice(0, 5).map((product) => (
                                <div key={product.id} className="flex items-center space-x-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center
                                        ${product.stock_percentage <= 10 ? 'bg-destructive/20 text-destructive' :
                                            product.stock_percentage <= 30 ? 'bg-warning/20 text-warning' :
                                                'bg-primary/20 text-primary'}`}>
                                        {product.stock_percentage}%
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Còn lại: <span className="font-medium">{product.stock_remaining}</span> sản phẩm
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Products revenue chart */}
            <TopProductsByRevenueChart
                productMetrics={productMetrics}
                loading={loading}
            />
        </motion.div>
    );
}

export default ProductMetrics;
