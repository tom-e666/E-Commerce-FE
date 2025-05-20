import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, WalletCards, Smartphone, Loader2, BanknoteIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { usePayment } from '@/hooks/usePayment';

interface PaymentFormProps {
    orderId: string | null;
    totalAmount: number;
    onBack: () => void;
    onComplete: (method: string) => void;
}

const PaymentForm = React.memo(({ orderId, totalAmount, onBack, onComplete }: PaymentFormProps) => {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<string | null>('cod');
    const [isLoading, setIsLoading] = useState(false);
    const { createCODPayment } = usePayment();

    const handlePayment = async () => {
        if (!selectedMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán");
            return;
        }

        if (!orderId) {
            toast.error("Không có thông tin đơn hàng");
            return;
        }

        setIsLoading(true);

        try {
            switch (selectedMethod) {
                case 'cod':
                    const response = await createCODPayment(orderId);
                    if (response.code === 200) {
                        toast.success("Đặt hàng thành công!");
                        onComplete('cod');

                        setTimeout(() => {
                            router.push(`/checkout/success?orderId=${orderId}&method=cod`);
                        }, 1000);
                    } else {
                        toast.error(response.message || "Có lỗi xảy ra khi xử lý thanh toán COD");
                    }
                    break;

                case 'cc':
                    toast.info("Chức năng thanh toán qua thẻ quốc tế đang được phát triển");
                    toast.success("Đang xử lý thanh toán demo...");

                    onComplete('cc');

                    setTimeout(() => {
                        router.push(`/checkout/success?orderId=${orderId}&demo=true&method=cc`);
                    }, 5000);
                    break;

                case 'atm':
                    toast.info("Chức năng thanh toán qua thẻ ATM đang được phát triển");
                    toast.success("Đang xử lý thanh toán demo...");

                    onComplete('atm');

                    setTimeout(() => {
                        router.push(`/checkout/success?orderId=${orderId}&demo=true&method=atm`);
                    }, 5000);
                    break;

                case 'mbanking':
                    toast.info("Chức năng thanh toán qua Mobile Banking đang được phát triển");
                    toast.success("Đang xử lý thanh toán demo...");

                    onComplete('mbanking');

                    setTimeout(() => {
                        router.push(`/checkout/success?orderId=${orderId}&demo=true&method=mbanking`);
                    }, 5000);
                    break;

                default:
                    toast.error("Phương thức thanh toán không được hỗ trợ");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Có lỗi xảy ra khi xử lý thanh toán");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Thanh toán</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-3">Chọn phương thức thanh toán</h3>

                    {/* COD Payment Option */}
                    <div
                        className={`flex items-center p-4 border rounded-md mb-3 cursor-pointer ${selectedMethod === 'cod' ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setSelectedMethod('cod')}
                    >
                        <div className="w-12 h-12 flex-shrink-0 mr-4 flex justify-center items-center">
                            <BanknoteIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Thanh toán khi nhận hàng (COD)</h4>
                            <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận được hàng</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0">
                            {selectedMethod === 'cod' && (
                                <div className="w-full h-full bg-primary rounded-full"></div>
                            )}
                        </div>
                    </div>

                    {/* ZaloPay App - Disabled */}
                    <div
                        className="flex items-center p-4 border rounded-md mb-3 cursor-not-allowed bg-gray-50"
                    >
                        <div className="w-12 h-12 flex-shrink-0 mr-4 opacity-50">
                            <Image
                                src="https://stc-zalopay.zdn.vn/zf/p/zalopay-identity/images/logo_zalopay.svg"
                                alt="ZaloPay"
                                width={48}
                                height={48}
                                className="rounded"
                            />
                        </div>
                        <div className="flex-1 opacity-50">
                            <h4 className="font-medium">Ứng dụng ZaloPay</h4>
                            <p className="text-sm text-muted-foreground">Quét mã QR để thanh toán (Tạm thời không khả dụng)</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0 opacity-50"></div>
                    </div>

                    {/* Credit Cards */}
                    <div
                        className={`flex items-center p-4 border rounded-md mb-3 cursor-pointer ${selectedMethod === 'cc' ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setSelectedMethod('cc')}
                    >
                        <div className="w-12 h-12 flex-shrink-0 mr-4 flex justify-center items-center">
                            <WalletCards className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Thẻ quốc tế (Visa/Mastercard/JCB)</h4>
                            <p className="text-sm text-muted-foreground">Thanh toán qua thẻ quốc tế</p>
                            <div className="flex gap-1 mt-1">
                                <Image src="/visa.png" alt="Visa" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/mastercard.png" alt="Mastercard" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/jcb.png" alt="JCB" width={32} height={20} className="h-5 object-contain" />
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0">
                            {selectedMethod === 'cc' && (
                                <div className="w-full h-full bg-primary rounded-full"></div>
                            )}
                        </div>
                    </div>

                    {/* ATM cards */}
                    <div
                        className={`flex items-center p-4 border rounded-md mb-3 cursor-pointer ${selectedMethod === 'atm' ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setSelectedMethod('atm')}
                    >
                        <div className="w-12 h-12 flex-shrink-0 mr-4 flex justify-center items-center">
                            <CreditCard className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Thẻ ATM nội địa</h4>
                            <p className="text-sm text-muted-foreground">Thẻ ngân hàng nội địa (có đăng ký Internet Banking)</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                <Image src="/bank-vietcombank.png" alt="Vietcombank" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/bank-agribank.png" alt="Agribank" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/bank-vietinbank.png" alt="Vietinbank" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/bank-bidv.png" alt="BIDV" width={32} height={20} className="h-5 object-contain" />
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0">
                            {selectedMethod === 'atm' && (
                                <div className="w-full h-full bg-primary rounded-full"></div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Banking */}
                    <div
                        className={`flex items-center p-4 border rounded-md cursor-pointer ${selectedMethod === 'mbanking' ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setSelectedMethod('mbanking')}
                    >
                        <div className="w-12 h-12 flex-shrink-0 mr-4 flex justify-center items-center">
                            <Smartphone className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Ứng dụng Mobile Banking</h4>
                            <p className="text-sm text-muted-foreground">Thanh toán qua ứng dụng ngân hàng</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                <Image src="/mbank-vietcombank.png" alt="Vietcombank" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/mbank-acb.png" alt="ACB" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/mbank-vpbank.png" alt="VPBank" width={32} height={20} className="h-5 object-contain" />
                                <Image src="/mbank-mbbank.png" alt="MB Bank" width={32} height={20} className="h-5 object-contain" />
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0">
                            {selectedMethod === 'mbanking' && (
                                <div className="w-full h-full bg-primary rounded-full"></div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm">Mã đơn hàng:</span>
                        <span className="text-sm font-medium">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm">Số tiền thanh toán:</span>
                        <span className="text-sm font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="text-xs text-muted-foreground">
                        Bằng việc nhấn &quot;Thanh toán&quot;, bạn đồng ý với Điều khoản dịch vụ của chúng tôi
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack} disabled={isLoading}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
                <Button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý
                        </>
                    ) : (
                        "Thanh toán"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
});

PaymentForm.displayName = "PaymentForm";

export default PaymentForm;