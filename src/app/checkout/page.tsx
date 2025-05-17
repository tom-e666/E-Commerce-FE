"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from "sonner";
import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrder";
import { useShipping } from "@/hooks/useShipping";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

import { getDistricts, getProvinces, getWards } from '@/services/address/endpoints';

// Import components
import OrderInformation from "@/components/checkout/OrderInfomation";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import OrderStatusIndicator from "@/components/checkout/OrderStatusIndicator";
import OrderCompletedView from "@/components/checkout/OrderCompleteView";

// Main component
export default function CheckoutPage() {
    const [loading, setLoading] = useState(true);
    const { loading: orderLoading, currentOrder, setCurrentOrder } = useOrder();
    const { handleCreateShipping, loading: shippingLoading } = useShipping();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingCost] = useState(0);

    // Use form state object to reduce rerenders
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        notes: "",
    });
    interface Province {
        province_id: number;
        province_name: string;
    }
    interface District {
        district_id: number;
        district_name: string;
    }
    interface Ward {
        ward_id: number;
        ward_name: string;
    }

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false);

    const [loadingStates, setLoadingStates] = useState({
        provinces: false,
        districts: false,
        wards: false
    });

    const debouncedSetNotes = useCallback((value: string) => {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            (window).requestIdleCallback(() => {
                setShippingInfo(prev => ({ ...prev, notes: value }));
            });
        } else {
            setTimeout(() => {
                setShippingInfo(prev => ({ ...prev, notes: value }));
            }, 300);
        }
    }, []);

    useEffect(() => {
        async function loadProvinces() {
            if (provinces.length === 0 && !loadingStates.provinces) {
                setLoadingStates(prev => ({ ...prev, provinces: true }));
                try {
                    const data = await getProvinces();
                    setProvinces(data);
                } catch (error) {
                    console.error("Failed to load provinces:", error);
                } finally {
                    setLoadingStates(prev => ({ ...prev, provinces: false }));
                }
            }
        }
        loadProvinces();
    }, []);

    useEffect(() => {
        async function loadDistricts() {
            if (!shippingInfo.city || loadingStates.districts) return;

            setLoadingStates(prev => ({ ...prev, districts: true }));
            try {
                const selectedProvince = provinces.find(p => p.province_name === shippingInfo.city);
                if (selectedProvince) {
                    const data = await getDistricts(selectedProvince.province_id.toString());
                    setDistricts(data);
                    setShippingInfo(prev => ({ ...prev, district: "", ward: "" }));
                    setWards([]);
                }
            } catch (error) {
                console.error("Failed to load districts:", error);
            } finally {
                setLoadingStates(prev => ({ ...prev, districts: false }));
            }
        }

        loadDistricts();
    }, [shippingInfo.city, provinces]);

    useEffect(() => {
        async function loadWards() {
            if (!shippingInfo.district || loadingStates.wards) return;

            setLoadingStates(prev => ({ ...prev, wards: true }));
            try {
                const selectedDistrict = districts.find(d => d.district_name === shippingInfo.district);
                if (selectedDistrict) {
                    const data = await getWards(selectedDistrict.district_id.toString());
                    setWards(data);
                    setShippingInfo(prev => ({ ...prev, ward: "" }));
                }
            } catch (error) {
                console.error("Failed to load wards:", error);
            } finally {
                setLoadingStates(prev => ({ ...prev, wards: false }));
            }
        }

        loadWards();
    }, [shippingInfo.district, districts]);

    useEffect(() => {
        const initializeOrder = async () => {
            try {
                setLoading(true);
                if (typeof window !== 'undefined') {
                    const storedOrderJson = sessionStorage.getItem("newOrder");
                    if (!storedOrderJson) {
                        toast.error("Không tìm thấy thông tin đơn hàng");
                        return;
                    }

                    const storedOrder = JSON.parse(storedOrderJson);
                    setCurrentOrder(storedOrder);
                    setOrderId(storedOrder.id);
                    toast.success("Đơn hàng đã được tạo từ giỏ hàng của bạn");
                }
            } catch (error) {
                console.error("Order initialization error:", error);
                toast.error("Không thể tạo giỏ hàng");
            } finally {
                setLoading(false);
            }
        };

        initializeOrder();
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'notes') {
            debouncedSetNotes(value);
            return;
        }

        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }, [debouncedSetNotes]);

    const handleSelectChange = useCallback((name: string, value: string) => {
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handlePaymentMethodChange = useCallback((method: string) => {
        setPaymentMethod(method);
    }, []);

    const validateShippingInfo = useCallback(() => {
        const { fullName, phone, address, city, district, ward } = shippingInfo;
        if (!fullName || !phone || !address || !city || !district || !ward) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
            return false;
        }

        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            toast.error("Số điện thoại không hợp lệ");
            return false;
        }

        return true;
    }, [shippingInfo]);

    const handleProceedToShipping = useCallback(() => {
        if (!orderId) {
            toast.error("Không tìm thấy đơn hàng. Vui lòng thử lại sau.");
            return;
        }
        setStep(1);
    }, [orderId]);

    const handleBackToOrderView = useCallback(() => {
        setStep(0);
    }, []);

    const handleShippingSubmit = useCallback(async () => {
        if (!validateShippingInfo() || !orderId) {
            return;
        }

        setIsSubmitting(true);
        try {
            const shippingAddress = `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;
            const trackingCode = `TRK-${Date.now().toString().slice(-8)}`;
            const carrier = "Viettel Post";
            const estimatedDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const status = "received";

            await handleCreateShipping(
                orderId,
                trackingCode,
                carrier,
                estimatedDate,
                status,
                shippingAddress,
                shippingInfo.fullName,
                shippingInfo.phone,
                shippingInfo.notes
            );

            setOrderCompleted(true);
            toast.success("Đặt hàng thành công");
        } catch (error) {
            console.error("Order submission error:", error);
            toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    }, [orderId, shippingInfo, validateShippingInfo, handleCreateShipping]);

    const totalPrice = useMemo(() => {
        return currentOrder ? currentOrder.total_price + shippingCost : 0;
    }, [currentOrder, shippingCost]);

    if (loading || orderLoading || shippingLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (orderCompleted) {
        return <OrderCompletedView
            orderId={orderId}
            shippingInfo={shippingInfo}
            paymentMethod={paymentMethod}
        />;
    }
    if (!currentOrder) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground mb-4" />
                    <p>Không tìm thấy thông tin đơn hàng</p>
                    <Button variant="outline" className="mt-4" asChild>
                        <Link href="/cart">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại giỏ hàng
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs value={`step-${step}`} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="step-0">Xem đơn hàng</TabsTrigger>
                            <TabsTrigger value="step-1">Thông tin giao hàng</TabsTrigger>
                        </TabsList>

                        <TabsContent value="step-0" className="space-y-6">
                            <OrderInformation
                                currentOrder={currentOrder}
                                shippingCost={shippingCost}
                                orderId={orderId}
                                totalPrice={totalPrice}
                                onProceed={handleProceedToShipping}
                            />
                        </TabsContent>

                        <TabsContent value="step-1" className="space-y-6">
                            <ShippingForm
                                shippingInfo={shippingInfo}
                                loadingStates={loadingStates}
                                provinces={provinces}
                                districts={districts}
                                wards={wards}
                                isSubmitting={isSubmitting}
                                paymentMethod={paymentMethod}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                                onPaymentMethodChange={handlePaymentMethodChange}
                                onBack={handleBackToOrderView}
                                onSubmit={handleShippingSubmit}
                                debouncedSetNotes={debouncedSetNotes}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <OrderSummary
                        currentOrder={currentOrder}
                        shippingCost={shippingCost}
                        totalPrice={totalPrice}
                    />

                    <OrderStatusIndicator
                        orderId={orderId}
                        step={step}
                        orderCompleted={orderCompleted}
                    />
                </div>
            </div>
        </div>
    );
}