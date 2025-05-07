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
            =
            =            <div className="absolute top-20 left-0 right-0">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center">
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

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center">
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

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center">
                            <h2 className="text-xl font-bold mb-2">Đơn hàng</h2>
                            <div className="flex-1  w-full flex justify-center items-center mb-3">
                                <Image
                                    src="/order.png"
                                    alt="Orders"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center mb-4">Quản lý đơn hàng</p>
                            <Link href="/admin/orders">
                                <AnimatedButton>Quản lý Đơn hàng</AnimatedButton>
                            </Link>
                        </div>

                        <div className="rounded-xl shadow-lg bg-white p-4 flex flex-col items-center">
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
                            <Link href="/admin/users">
                                <AnimatedButton>Quản lý Người dùng</AnimatedButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}