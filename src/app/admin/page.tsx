'use client'
import AnimatedButton from "@/components/ui/animatedButton"
import Image from "next/image"
import Link from "next/link"

export default function AdminPage() {
    return (
        <div className="w-full min-h-screen relative">
            {/* Background image */}
            <Image
                src={"/engineer.png"}
                width={1600}
                height={900}
                className="-z-10 absolute inset-0 w-full h-full object-cover opacity-80"
                alt="engineer"
                priority
            />
            
            <div className="absolute top-20 left-0 right-0">
                <div className="container mx-auto px-4">
                    {/* Grid layout with fixed width for each card */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center w-72">
                            <h2 className="text-xl font-bold mb-2">Brand</h2>
                            <div className="flex-1 w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/msi.png"
                                    alt="Brand"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Quản lý thông tin thương hiệu</p>
                            <Link href="/admin/brand">
                                <AnimatedButton>Quản lý Brand</AnimatedButton>
                            </Link>
                        </div>

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center w-72">
                            <h2 className="text-xl font-bold mb-2">Sản phẩm</h2>
                            <div className="flex-1 w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/laptop.png"
                                    alt="Products"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Quản lý thông tin sản phẩm</p>
                            <Link href="/admin/product">
                                <AnimatedButton>Quản lý Sản phẩm</AnimatedButton>
                            </Link>
                        </div>

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center w-72">
                            <h2 className="text-xl font-bold mb-2">Đơn hàng</h2>
                            <div className="flex-1 w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/order.png"
                                    alt="Orders"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Quản lý đơn hàng</p>
                            <Link href="/admin/order">
                                <AnimatedButton>Quản lý Đơn hàng</AnimatedButton>
                            </Link>
                        </div>

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center w-72">
                            <h2 className="text-xl font-bold mb-2">Người dùng</h2>
                            <div className="flex-1 w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/user.png"
                                    alt="Users"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Quản lý thông tin người dùng</p>
                            <Link href="/admin/user">
                                <AnimatedButton>Quản lý Người dùng</AnimatedButton>
                            </Link>
                        </div>

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center w-72">
                            <h2 className="text-xl font-bold mb-2">Thống kê</h2>
                            <div className="flex-1 w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/metric.png"
                                    alt="Statistics"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Xem báo cáo và phân tích dữ liệu</p>
                            <Link href="/admin/metrics">
                                <AnimatedButton>Xem Thống kê</AnimatedButton>
                            </Link>
                        </div>

                        {/* Add a new card for Support Ticket management */}
                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center w-72">
                            <h2 className="text-xl font-bold mb-2">Hỗ trợ</h2>
                            <div className="flex-1 w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/support.jpg"
                                    alt="Support"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Quản lý yêu cầu hỗ trợ từ khách hàng</p>
                            <Link href="/admin/support">
                                <AnimatedButton>Quản lý Hỗ trợ</AnimatedButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}