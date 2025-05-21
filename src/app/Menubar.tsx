'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useSearch } from "@/hooks/useSearch";
import { toast } from "sonner";
const Menubar = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { logout } = useAuth();
    const { query, setQuery, handleSubmit } = useSearch();

    const handleLogout = async () => {
        try {
            const result = await logout();
            toast.success(result.message);
            
            // Use router.replace instead of push to prevent back navigation to protected pages
            router.replace("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Có lỗi xảy ra khi đăng xuất");
            
            // Still try to redirect even if there was an error
            router.replace("/login");
        }
    }

    // Hàm xử lý tìm kiếm
    const handleSearchSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        try {
            // Thực hiện tìm kiếm và đợi kết quả
            await handleSubmit(e, false);

            // Chuyển hướng đến trang kết quả tìm kiếm
            if (query.trim()) {
                router.push(`/smartSearch?q=${encodeURIComponent(query)}`);
            }
        } catch (error) {
            console.error('Error in handleSearchSubmit:', error);
            toast.error('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
        }
    }

    return (
        <div className="flex flex-col w-full h-fit">
            <div className="w-screen h-20 top-0 bg-gray-900 text-white font-semibold flex justify-center items-center gap-6">
                <Link href="/">
                    <Image
                        src="/gaming.png"
                        alt="logo"
                        width={80}
                        height={40}
                        className="mr-2 cursor-pointer"
                    />
                </Link>

                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 37 }}
                    className="mr-3"
                    onSubmit={handleSearchSubmit}
                >
                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Tìm kiếm sản phẩm"
                        inputProps={{ 'aria-label': 'search products' }}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchSubmit();
                            }
                        }}
                    />
                    <IconButton
                        type="submit"
                        sx={{ p: '10px' }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/hotline" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Hotline
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/news" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Bản tin
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/showroom" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Showroom
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/Order" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Đơn hàng
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/cart" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Giỏ hàng
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    {!user ? (
                        <Link href="/login" passHref>
                            <Button variant={"outline"} className="bg-transparent border-0">
                                Đăng nhập
                            </Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className="bg-transparent border-0">
                                    Xin chào, {user.full_name.split(" ").pop()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link href="/profile" passHref style={{ textDecoration: 'none' }}>
                                    <DropdownMenuItem>
                                        Trang cá nhân
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/orders" passHref style={{ textDecoration: 'none' }}>
                                    <DropdownMenuItem>
                                        Đơn hàng của tôi
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menubar;