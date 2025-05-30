'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useSearch } from "@/hooks/useSearch";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

const Menubar = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { logout } = useAuth();
    const { query, setQuery, handleSubmit } = useSearch();

    // Thêm state để kiểm tra đã mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

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
            {/* Desktop & Tablet View */}
            <div className="w-full h-20 top-0 bg-gray-900 text-white font-semibold">
                {/* Desktop Menu - Large screens */}
                <div className="hidden lg:flex items-center justify-between h-full px-6">
                    {/* Left Section - Logo + Search */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <Image
                                    src="/gaming.png"
                                    alt="logo"
                                    width={80}
                                    height={40}
                                    className="cursor-pointer"
                                />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-shrink-0 mx-6">
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 37 }}
                                onSubmit={handleSearchSubmit}
                            >
                                <IconButton sx={{ p: '10px' }} aria-label="menu">
                                    <MenuIcon />
                                </IconButton>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="tìm kiếm với Gemini AI"
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
                        </div>
                    </div>

                    {/* Center Section - Navigation Menu */}
                    <nav className="flex items-center space-x-2 min-w-0 flex-1 justify-center">
                        <div className="flex items-center space-x-2">
                            <Link href="/product" passHref>
                                <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap">
                                    Sản phẩm
                                </Button>
                            </Link>

                            <Link href="/support" passHref>
                                <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap">
                                    Hỗ trợ
                                </Button>
                            </Link>

                            <Link href="/hotline" passHref>
                                <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap">
                                    Hotline
                                </Button>
                            </Link>

                            <Link href="/news" passHref>
                                <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap">
                                    Bản tin
                                </Button>
                            </Link>

                            <Link href="/showroom" passHref>
                                <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap">
                                    Showroom
                                </Button>
                            </Link>

                            {/* Quản trị viên - placeholder để tránh nhảy */}
                            <div className="min-w-[120px]">
                                {mounted && user && user.role === "admin" && (
                                    <Link href="/admin" passHref>
                                        <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap w-full">
                                            Quản trị viên
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Right Section - Cart + User Menu */}
                    <div className="flex items-center space-x-2 min-w-[160px] justify-end">
                        {/* Giỏ hàng - placeholder để tránh nhảy */}
                        <div className="min-w-[80px]">
                            {mounted && user && user.role === "user" && (
                                <Link href="/cart" passHref>
                                    <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap w-full">
                                        Giỏ hàng
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* User Menu - placeholder để tránh nhảy */}
                        <div className="min-w-[100px]">
                            {!mounted ? (
                                <div className="w-20 h-8"></div> // Placeholder để tránh layout shift
                            ) : !user ? (
                                <Link href="/login" passHref>
                                    <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap w-full">
                                        Đăng nhập
                                    </Button>
                                </Link>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={"outline"} className="bg-transparent border-0 text-white hover:bg-white hover:text-black whitespace-nowrap w-full">
                                            {user && user.full_name ? (
                                              <>Xin chào, {user.full_name.split(" ").pop()}</>
                                            ) : "Tài khoản"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <Link href="/credential" passHref style={{ textDecoration: 'none' }}>
                                            <DropdownMenuItem>
                                                Trang cá nhân
                                            </DropdownMenuItem>
                                        </Link>
                                        {mounted && user && user.role === "user" && (
                                        <Link href="/Order" passHref style={{ textDecoration: 'none' }}>
                                            <DropdownMenuItem>
                                                Đơn hàng của tôi
                                            </DropdownMenuItem>
                                        </Link>
                                        )}
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

                {/* Mobile & Tablet Menu - Medium and small screens */}
                <div className="lg:hidden flex justify-between items-center h-full px-4">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/gaming.png"
                                alt="logo"
                                width={60}
                                height={30}
                                className="cursor-pointer"
                            />
                        </Link>
                    </div>

                    <div className="flex-1 mx-4">
                        <Paper
                            component="form"
                            sx={{ 
                                p: '2px 4px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                width: '100%', 
                                height: 37 
                            }}
                            onSubmit={handleSearchSubmit}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="tìm kiếm với Gemini AI"
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
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="bg-transparent border-0 text-white">
                                <MenuIcon />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-gray-900 text-white">
                            <div className="mt-8 flex flex-col gap-4">
                                {/* Các menu khác */}
                                <Link href="/product" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                        Sản phẩm
                                    </Button>
                                </Link>
                                <Link href="/support" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                        Hỗ trợ
                                    </Button>
                                </Link>
                                <Link href="/hotline" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                        Hotline
                                    </Button>
                                </Link>
                                <Link href="/news" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                        Bản tin
                                    </Button>
                                </Link>
                                <Link href="/showroom" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                        Showroom
                                    </Button>
                                </Link>

                                {/* Quản trị viên - chỉ hiện khi là admin */}
                                {mounted && user && user.role === "admin" && (
                                    <Link href="/admin" passHref>
                                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                            Quản trị viên
                                        </Button>
                                    </Link>
                                )}

                                {/* Giỏ hàng - chỉ hiện khi là user */}
                                {mounted && user && user.role === "user" && (
                                    <Link href="/cart" passHref>
                                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                            Giỏ hàng
                                        </Button>
                                    </Link>
                                )}

                                <div className="border-t border-gray-600 pt-4 mt-4">
                                    {/* Đăng nhập/User menu */}
                                    {!mounted ? null : !user ? (
                                        <Link href="/login" passHref>
                                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                                Đăng nhập
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <div className="px-4 py-2 text-white font-medium border-b border-gray-600 mb-4">
                                                {user && user.full_name ? (
                                                    <>Xin chào, {user.full_name.split(" ").pop()}</>
                                                ) : "Tài khoản"}
                                            </div>
                                            <Link href="/credential" passHref>
                                                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                                    Trang cá nhân
                                                </Button>
                                            </Link>
                                            {mounted && user && user.role === "user" && (
                                            <Link href="/Order" passHref>
                                                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:text-black">
                                                    Đơn hàng của tôi
                                                </Button>
                                            </Link>
                                            )}
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-white hover:bg-white hover:text-black"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};

export default Menubar;