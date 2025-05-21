'use client'
import React from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
    const [password, setPassword] = React.useState<string>('');
    const [phone, setPhone] = React.useState<string>('');
    const [full_name, setFull_name] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const { signup, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Call signup API
            const response = await signup(email, phone, password, full_name);
            
            if (response && response.data?.signup?.code === 200) {
                toast.success("Đăng ký thành công! Vui lòng kiểm tra email của bạn.", {
                    description: "Một email xác minh đã được gửi đến địa chỉ email của bạn."
                });
                
                // Redirect to check-email page with email as query parameter
                router.push(`/check-email?email=${encodeURIComponent(email)}`);
            } else {
                const errorMessage = response?.data?.signup?.message || "Đăng ký không thành công. Vui lòng thử lại.";
                toast.error(errorMessage);
            }
        } catch (error) {
            // @ts-expect-error any
            toast.error(error.message || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
            console.error("Signup error:", error);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-16"> {/* Added vertical padding */}
            <Image src="/shapelined.jpg"
                fill={true}
                className="object-cover w-full h-full -z-10"
                alt="background"
            />
            <div className="w-full max-w-md">
                <Card className="border shadow-md">
                    <CardHeader className="space-y-1 flex flex-col items-center">
                        <Image
                            alt="icon"
                            src="/gaming.png"
                            width={80}
                            height={80}
                            className="mx-auto object-contain mb-4"
                            priority
                        />
                        <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
                        <CardDescription className="text-center">
                            Tạo tài khoản để mua sắm và theo dõi đơn hàng
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Họ và tên</Label>
                                <Input
                                    id="fullname"
                                    name="full_name"
                                    type="text"
                                    required
                                    value={full_name}
                                    onChange={(e) => setFull_name(e.target.value)}
                                    placeholder="Nhập họ và tên"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    className="w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý
                                    </>
                                ) : (
                                    "Đăng ký"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                        <div className="text-center text-sm text-muted-foreground">
                            Đã có tài khoản?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Đăng nhập
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Page;