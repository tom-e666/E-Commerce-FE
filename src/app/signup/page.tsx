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
    const { signup, login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const success = await signup(email, phone, password, full_name);
            toast.success(success);

            // After successful signup, try to log in automatically
            const loginResult = await login(email, password);
            console.log("Auto login after signup successful:", loginResult);

            // Kiểm tra role để chuyển hướng đúng
            if (loginResult.user && (loginResult.user.role === 'admin' || loginResult.user.role === 'staff')) {
                console.log("Admin/staff user detected after signup, redirecting to admin dashboard");
                router.push('/admin');
            } else {
                console.log("Regular user detected after signup, redirecting to home page");
                router.push('/');
            }
        } catch (error) {
            // @ts-expect-error any
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
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