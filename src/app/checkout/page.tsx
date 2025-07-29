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
import PaymentForm from "@/components/checkout/PaymentForm";

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
        shippingMethod: "SHOP"
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

    const [addressCache, setAddressCache] = useState({
        currentCity: '',
        currentDistrict: ''
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
    }, [provinces.length, loadingStates.provinces]);

    // Fix districts loading with proper cache management
    useEffect(() => {
        async function loadDistricts() {
            // Only load if city exists, not already loading, and city has changed
            if (!shippingInfo.city || 
                loadingStates.districts || 
                addressCache.currentCity === shippingInfo.city) {
                return;
            }

            console.log('Loading districts for city:', shippingInfo.city);
            setLoadingStates(prev => ({ ...prev, districts: true }));
            setAddressCache(prev => ({ ...prev, currentCity: shippingInfo.city }));

            try {
                const selectedProvince = provinces.find(p => p.province_name === shippingInfo.city);
                if (selectedProvince) {
                    const data = await getDistricts(selectedProvince.province_id.toString());
                    setDistricts(data);
                    // Clear dependent fields when city changes
                    setShippingInfo(prev => ({ ...prev, district: "", ward: "" }));
                    setWards([]);
                    setAddressCache(prev => ({ ...prev, currentDistrict: '' }));
                }
            } catch (error) {
                console.error("Failed to load districts:", error);
                toast.error("Không thể tải danh sách quận/huyện");
            } finally {
                setLoadingStates(prev => ({ ...prev, districts: false }));
            }
        }

        loadDistricts();
    }, [shippingInfo.city, provinces]); // Only depend on city and provinces

    // Fix wards loading with proper cache management
    useEffect(() => {
        async function loadWards() {
            // Only load if district exists, not already loading, and district has changed
            if (!shippingInfo.district || 
                loadingStates.wards || 
                addressCache.currentDistrict === shippingInfo.district) {
                return;
            }

            console.log('Loading wards for district:', shippingInfo.district);
            setLoadingStates(prev => ({ ...prev, wards: true }));
            setAddressCache(prev => ({ ...prev, currentDistrict: shippingInfo.district }));

            try {
                const selectedDistrict = districts.find(d => d.district_name === shippingInfo.district);
                if (selectedDistrict) {
                    const data = await getWards(selectedDistrict.district_id.toString());
                    setWards(data);
                    // Clear ward when district changes
                    setShippingInfo(prev => ({ ...prev, ward: "" }));
                }
            } catch (error) {
                console.error("Failed to load wards:", error);
                toast.error("Không thể tải danh sách phường/xã");
            } finally {
                setLoadingStates(prev => ({ ...prev, wards: false }));
            }
        }

        loadWards();
    }, [shippingInfo.district, districts]); // Only depend on district and districts

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
    }, [setCurrentOrder]);

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

    // Fix handleSelectChange to prevent unnecessary re-renders
    const handleSelectChange = useCallback((name: string, value: string) => {
        console.log(`Selecting ${name}:`, value);
        
        setShippingInfo(prev => {
            // Prevent unnecessary updates if value hasn't changed
            if (prev[name as keyof typeof prev] === value) {
                return prev;
            }

            const newInfo = { ...prev, [name]: value };

            // Clear dependent fields when parent selection changes
            if (name === 'city') {
                newInfo.district = '';
                newInfo.ward = '';
            } else if (name === 'district') {
                newInfo.ward = '';
            }

            return newInfo;
        });
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

    const handleProceedToPayment = useCallback(async () => {
        if (!validateShippingInfo() || !orderId) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Validate address information
            if (!shippingInfo.city || !shippingInfo.district || !shippingInfo.ward) {
                toast.error("Thông tin địa chỉ không hợp lệ. Vui lòng kiểm tra lại.");
                setIsSubmitting(false);
                return;
            }

            // Call the createShipping function with the correct parameters
            const response = await handleCreateShipping(
                orderId,
                shippingInfo.address,
                shippingInfo.fullName,
                shippingInfo.phone,
                shippingInfo.city,       // provinceName
                shippingInfo.district,   // districtName
                shippingInfo.ward,       // wardName
                'SHOP',                  // shippingMethod
                shippingInfo.notes || undefined // note (optional)
            );

            // Check if the shipping creation was successful
            if (response && response.code === 200) {
                // Move to payment step after successful shipping creation
                setStep(2);
                toast.success("Thông tin giao hàng đã được lưu");
            } else {
                toast.error(response?.message || "Không thể lưu thông tin giao hàng");
            }
        } catch (error) {
            console.error("Shipping submission error:", error);
            toast.error("Có lỗi xảy ra khi lưu thông tin giao hàng. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false); // Reset loading state regardless of outcome
        }
    }, [
        orderId,
        shippingInfo,
        validateShippingInfo,
        handleCreateShipping
    ]);

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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger
                                value="step-0"
                                onClick={() => setStep(0)}
                                disabled={isSubmitting}
                            >
                                Đơn hàng
                            </TabsTrigger>
                            <TabsTrigger
                                value="step-1"
                                onClick={() => orderId ? setStep(1) : null}
                                disabled={isSubmitting || !orderId}
                            >
                                Thông tin giao hàng
                            </TabsTrigger>
                            <TabsTrigger
                                value="step-2"
                                disabled={step < 2 || isSubmitting}
                            >
                                Thanh toán
                            </TabsTrigger>
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
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                                onBack={handleBackToOrderView}
                                onSubmit={handleProceedToPayment}
                                debouncedSetNotes={debouncedSetNotes}
                            />
                        </TabsContent>

                        <TabsContent value="step-2" className="space-y-6">
                            <PaymentForm
                                orderId={orderId}
                                totalAmount={totalPrice}
                                onBack={() => setStep(1)}
                                onComplete={(method) => {
                                    setPaymentMethod(method);
                                    setOrderCompleted(true);
                                    sessionStorage.setItem("paymentMethod", method);
                                }}
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