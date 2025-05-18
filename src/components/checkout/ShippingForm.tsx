import React from "react";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ShippingFormProps {
    shippingInfo: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        notes: string;
    };
    loadingStates: {
        provinces: boolean;
        districts: boolean;
        wards: boolean;
    };
    provinces: any[];
    districts: any[];
    wards: any[];
    isSubmitting: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string, value: string) => void;
    onBack: () => void;
    onSubmit: () => void;
    debouncedSetNotes: (value: string) => void;
}

const ShippingForm = React.memo(({
    shippingInfo,
    loadingStates,
    provinces,
    districts,
    wards,
    isSubmitting,
    onInputChange,
    onSelectChange,
    onBack,
    onSubmit,
    debouncedSetNotes
}: ShippingFormProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Thông tin giao hàng</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên người nhận *</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={shippingInfo.fullName}
                            onChange={onInputChange}
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={onInputChange}
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={onInputChange}
                        placeholder="Số nhà, tên đường"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                        {loadingStates.provinces ? (
                            <div className="flex items-center space-x-2 p-2 border rounded-md">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Đang tải...</span>
                            </div>
                        ) : (
                            <Select
                                name="city"
                                value={shippingInfo.city}
                                onValueChange={(value) => onSelectChange("city", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem
                                            key={province.province_id}
                                            value={province.province_name}
                                        >
                                            {province.province_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        {!shippingInfo.city ? (
                            <div className="text-sm text-muted-foreground p-2 border rounded-md">
                                Vui lòng chọn Tỉnh/Thành phố trước
                            </div>
                        ) : loadingStates.districts ? (
                            <div className="flex items-center space-x-2 p-2 border rounded-md">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Đang tải...</span>
                            </div>
                        ) : (
                            <Select
                                name="district"
                                value={shippingInfo.district}
                                onValueChange={(value) => onSelectChange("district", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn Quận/Huyện" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem
                                            key={district.district_id}
                                            value={district.district_name}
                                        >
                                            {district.district_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ward">Phường/Xã *</Label>
                        {!shippingInfo.district ? (
                            <div className="text-sm text-muted-foreground p-2 border rounded-md">
                                Vui lòng chọn Quận/Huyện trước
                            </div>
                        ) : loadingStates.wards ? (
                            <div className="flex items-center space-x-2 p-2 border rounded-md">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Đang tải...</span>
                            </div>
                        ) : (
                            <Select
                                name="ward"
                                value={shippingInfo.ward}
                                onValueChange={(value) => onSelectChange("ward", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn Phường/Xã" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wards.map((ward) => (
                                        <SelectItem
                                            key={ward.ward_id}
                                            value={ward.ward_name}
                                        >
                                            {ward.ward_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        defaultValue={shippingInfo.notes}
                        onChange={(e) => {
                            e.currentTarget.value = e.currentTarget.value;
                            debouncedSetNotes(e.currentTarget.value);
                        }}
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                        className="h-24"
                    />
                </div>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý
                        </>
                    ) : (
                        "Hoàn tất đặt hàng"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
});

ShippingForm.displayName = "ShippingForm";
export default ShippingForm;