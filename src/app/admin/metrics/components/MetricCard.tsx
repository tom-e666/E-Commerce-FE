'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
    title: string;
    value: number;
    description: string;
    percentChange: number;
    icon: React.ReactNode;
    format?: (value: number) => string;
    showPercentage?: boolean;
    className?: string;
}

export function MetricCard({
    title,
    value,
    description,
    percentChange,
    icon,
    format = (v) => v.toString(),
    showPercentage = true,
    className = ""
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className="bg-primary/10 p-2 rounded-full text-primary">{icon}</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{format(value)}</div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                    {showPercentage && (
                        <div className={`mt-2 flex items-center text-xs ${percentChange > 0 ? 'text-success' : percentChange < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {percentChange > 0 ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                            ) : percentChange < 0 ? (
                                <ArrowDown className="h-3 w-3 mr-1" />
                            ) : null}
                            <span>{Math.abs(percentChange).toFixed(1)}% so với trung bình</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default MetricCard;
