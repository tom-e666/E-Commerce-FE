"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Send, CalendarDays} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Hotline() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    // Sample image URLs for the carousel
    const urlImg = [
        { img: "https://res.cloudinary.com/dwbcqjupj/image/upload/v1747736506/blocks-0-1690355547-1690355547_svc9n7.jpg", alt: "Store Image 1" },
        { img: "https://res.cloudinary.com/dwbcqjupj/image/upload/v1747736506/Su-dung-cay-xanh-trong-thiet-ke-showroom-may-tinh-nhu-mot-diem-nhan-cho-khong-gian_ebyim6.jpg", alt: "Store Image 2" },
        { img: "https://res.cloudinary.com/dwbcqjupj/image/upload/v1747736506/cua-hang-may-tinh-tone-mau-noi-bat_1_elveog.jpg", alt: "Store Image 3" },
    ];

    // Slider settings
    const sliderSettings = {
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Gửi biểu mẫu thành công!", {
            description: "Cảm ơn sự đóng góp của bạn. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất."
        });
        // Reset form
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="container mx-auto px-4 py-10">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-4">
                <motion.div
                    className="max-w-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Đội ngũ hỗ trợ của EcommerceLaptop luôn sẵn sàng hỗ trợ bạn 24/7, giải đáp mọi thắc mắc và cung cấp tư vấn chuyên sâu về sản phẩm.
                    </p>
                </motion.div>

                <motion.div
                    className="w-full max-w-md lg:max-w-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Image
                        src="/Contact-Us-Vector-Illustration.jpg"
                        width={500}
                        height={400}
                        alt="Contact Illustration"
                        priority
                        className="w-full h-auto rounded-lg"
                    />
                </motion.div>
            </div>

            <div className="flex flex-col lg:flex-col gap-4">
                {/* New Target Section */}
                <motion.div
                    id='target-section'
                    className='w-full'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='mt-10 flex w-full flex-col gap-6 p-6 lg:flex-row'>
                        <div className='w-full rounded-lg bg-white p-6 shadow-lg lg:w-1/2'>
                            <h2 className='mb-3 text-2xl font-medium text-black'>
                                THINK5
                            </h2>
                            <p className='mb-4 text-5xl font-semibold text-black'>
                                LẠC LONG QUÂN
                            </p>
                            <hr className='w-40 border-t-5 p-2' />
                            <div className='space-y-3 text-gray-700'>
                                <p className='flex items-center font-semibold'>
                                    <Phone className='mr-2 size-5 text-black' />
                                    09779796975
                                </p>

                                <p className='flex items-center font-semibold'>
                                    <CalendarDays className='mr-2 size-5 text-black' />
                                    Thời gian làm việc: 8:00 - 21:00 | Thứ 2 - Chủ Nhật
                                </p>
                                <p className='flex items-center font-semibold'>
                                    <Mail className='mr-2 size-5 text-black' />
                                    q11@ecommercelaptop.com
                                </p>
                            </div>

                            {/* Google Maps */}
                            <div className='mt-4'>
                                <iframe
                                    className='h-64 w-full rounded-lg shadow-md'
                                    src='https://www.google.com/maps?q=10.758142236592212,106.63786218934307&z=16&output=embed'
                                    allowFullScreen
                                    loading='lazy'
                                    referrerPolicy='no-referrer-when-downgrade'
                                ></iframe>
                            </div>
                        </div>
                        <div className='flex w-full flex-col items-center rounded-lg bg-black p-6 shadow-lg lg:w-1/2'>
                            <div className='mt-6 max-w-full rounded-sm border-6 border-white'>
                                <Slider {...sliderSettings}>
                                    {urlImg.map((item, index) => (
                                        <div key={index}>
                                            <img
                                                src={item.img}
                                                alt={item.alt}
                                                className='h-85 w-full object-cover'
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            <div className='mt-3 w-full'>
                                <div className='flex items-center font-semibold text-white'>
                                    <MapPin className='mr-2 size-15 text-white' />
                                    <div className='mt-5 flex flex-col'>
                                        <span className='text-2xl'>129/1T Lạc Long Quân</span>
                                        <span className='text-xl'>
                                            Phường 1, Quận 11, Thành phố Hồ Chí Minh
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form liên hệ */}
                <motion.div
                    className="w-full lg:w-2/3 m-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Gửi Tin Nhắn</h2>
                            <p className="text-muted-foreground mb-6">
                                Hãy để lại thông tin của bạn, chúng tôi sẽ liên hệ trong thời gian sớm nhất
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Họ và tên</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Nhập họ tên của bạn"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Nội dung tin nhắn</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Nhập nội dung tin nhắn"
                                        className="min-h-[120px]"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    <Send className="w-4 h-4 mr-2" />
                                    Gửi Tin Nhắn
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* FAQ Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Câu hỏi thường gặp</h3>
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div className="border-b pb-3">
                                    <h4 className="font-medium mb-1">Thời gian phản hồi các yêu cầu hỗ trợ?</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Chúng tôi sẽ phản hồi trong vòng 24 giờ đối với tin nhắn, và ngay lập tức đối với các cuộc gọi trong giờ làm việc.
                                    </p>
                                </div>
                                <div className="border-b pb-3">
                                    <h4 className="font-medium mb-1">Tôi cần hỗ trợ kỹ thuật khẩn cấp?</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Vui lòng gọi trực tiếp qua hotline 0899 888 999 để được hỗ trợ ngay lập tức bởi đội ngũ kỹ thuật viên.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Chính sách đổi trả và bảo hành?</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Quý khách có thể liên hệ tổng đài để được hướng dẫn quy trình đổi trả và bảo hành sản phẩm chi tiết.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>

            {/* CTA Section */}
            <motion.section
                className="bg-primary/5 rounded-2xl p-8 text-center mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <h2 className="text-2xl font-bold mb-4">Tư Vấn Trực Tiếp Tại Showroom</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Ghé thăm showroom của chúng tôi để được trải nghiệm sản phẩm và nhận tư vấn chuyên sâu từ đội ngũ nhân viên chuyên nghiệp.
                </p>
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => window.location.href="/showroom"}
                >
                    <MapPin className="mr-2 h-4 w-4" />
                    Tìm Showroom Gần Nhất
                </Button>
            </motion.section>
        </div>
    );
}