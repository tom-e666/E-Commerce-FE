"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, KeyRound, User } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCredential } from '@/hooks/useCredential';
import { changePassword } from '@/services/credential/endpoints';

interface UserCredentials {
    id?: string;
    email?: string;
    fullName?: string;
    phone?: string;
    createdAt?: string;
    role?: string;
}

export default function CredentialPage() {
    const { userCredential, updateUserInformation, fetchUserCredential } = useCredential();
    const router = useRouter();
    const [credentials, setCredentials] = useState<UserCredentials | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const loadUserCredential = useCallback(async () => {
        try {
            setIsLoading(true);
            await fetchUserCredential();
        } catch {
            toast.error("Lỗi. Không thể lấy thông tin người dùng");
        } finally {
            setIsLoading(false);
        }
    }, [fetchUserCredential]);

    useEffect(() => {
        loadUserCredential();
    }, []);

    useEffect(() => {
        if (userCredential) {
            setCredentials({
                id: userCredential.id,
                email: userCredential.email,
                fullName: userCredential.full_name,
                phone: userCredential.phone,
                createdAt: '2025-01-01',
                role: 'User',
            });
            setFullName(userCredential.full_name || '');
            setPhone(userCredential.phone || '');
            setIsLoading(false);
        }
    }, [userCredential]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userCredential) return;

        setIsUpdating(true);
        try {
            await updateUserInformation(fullName, phone);
            toast.success("Cập nhật thông tin tài khoản thành công");
        } catch (error) {
            toast.error("Không thể cập nhật thông tin tài khoản");
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    };
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userCredential) return;
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }
        setIsUpdating(true);
        try {
            await changePassword(currentPassword, newPassword);
            toast.success("Đổi mật khẩu thành công");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (error) {
            toast.error("Không thể đổi mật khẩu");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };
    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Đang tải thông tin tài khoản...</p>
                </div>
            </div>
        );
    }

    if (!credentials) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Thông tin tài khoản</CardTitle>
                        <CardDescription>Không tìm thấy thông tin tài khoản</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pt-6 pb-8">
                        <User className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="mb-6 text-muted-foreground">
                            Bạn chưa đăng nhập hoặc có lỗi xảy ra
                        </p>
                        <Button asChild>
                            <a href="/login">Đăng nhập</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Thông tin tài khoản</CardTitle>
                                <CardDescription>Xem và cập nhật thông tin cá nhân của bạn</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Account Info */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Chi tiết tài khoản</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={credentials.email || ''} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>ID Người dùng</Label>
                                    <Input value={credentials.id || ''} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ngày tham gia</Label>
                                    <Input
                                        value={credentials.createdAt ? new Date(credentials.createdAt).toLocaleDateString('vi-VN') : ''}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vai trò</Label>
                                    <Input value={credentials.role || 'User'} disabled className="bg-muted" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Update Profile Form */}
                        <form onSubmit={handleUpdateProfile}>
                            <h3 className="text-lg font-medium mb-4">Cập nhật thông tin</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Họ và tên</Label>
                                    <Input
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={isUpdating} className="w-full md:w-auto">
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang cập nhật
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </form>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-4">Bảo mật</h3>
                            {!showPasswordForm ? (
                                <Button
                                    onClick={() => setShowPasswordForm(true)}
                                    variant="outline"
                                    className="w-full md:w-auto"
                                >
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Đổi mật khẩu
                                </Button>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang cập nhật
                                                </>
                                            ) : (
                                                "Đổi mật khẩu"
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowPasswordForm(false)}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Về trang chủ
                        </Button>
                        <Button variant="destructive" onClick={() => {
                            toast("Chức năng đang phát triển", {
                                description: "Tính năng xóa tài khoản sẽ được cập nhật trong thời gian tới"
                            });
                        }}>
                            Xóa tài khoản
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}