"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Hotline() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

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
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
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
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Thông tin liên hệ */}
                <motion.div 
                    className="w-full lg:w-1/3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Thông Tin Liên Hệ</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Hotline</p>
                                        <a href="tel:0899888999" className="font-medium hover:text-primary">0899 888 999</a>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <a href="mailto:support@ecommercelaptop.com" className="font-medium hover:text-primary">support@ecommercelaptop.com</a>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                                        <a 
                                            href="https://www.google.com/maps?q=10.758142236592212,106.63786218934307&z=16" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-medium hover:text-primary"
                                        >
                                            129/1T Lạc Long Quân, P.1, Q.11, TP.HCM
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Giờ làm việc</h3>
                                <p className="text-muted-foreground">Thứ 2 - Chủ Nhật: 8:00 - 21:00</p>
                                <p className="text-muted-foreground">Hỗ trợ kỹ thuật: 24/7</p>
                            </div>

                            {/* Google Maps */}
                            <div className="mt-6 rounded-lg overflow-hidden border">
                                <iframe
                                    className="w-full h-64"
                                    src="https://www.google.com/maps?q=10.758142236592212,106.63786218934307&z=16&output=embed"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="EcommerceLaptop Location"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* Form liên hệ */}
                <motion.div 
                    className="w-full lg:w-2/3"
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