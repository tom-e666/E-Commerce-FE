'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, ChevronDown, ChevronUp, Users, Truck, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Showroom location data
const showrooms = [
    {
        id: 1,
        name: 'Showroom Quận 10',
        address: '129/1T Lạc Long Quân, Phường 1, Quận 11, TP.HCM',
        phone: '0899 888 999',
        email: 'q11@ecommercelaptop.com',
        hours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
        mapUrl: 'https://www.google.com/maps?q=10.758142236592212,106.63786218934307&z=16&output=embed',
        image: '/showroom1.svg',
        featured: true
    },
    {
        id: 2,
        name: 'Showroom Quận 1',
        address: '24 Lý Tự Trọng, Phường Bến Nghé, Quận 1, TP.HCM',
        phone: '0899 777 888',
        email: 'q1@ecommercelaptop.com',
        hours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
        mapUrl: 'https://www.google.com/maps?q=10.773465,106.699260&z=16&output=embed',
        image: '/showroom2.svg'
    },
    {
        id: 3,
        name: 'Showroom Quận 7',
        address: '105 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM',
        phone: '0899 666 777',
        email: 'q7@ecommercelaptop.com',
        hours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
        mapUrl: 'https://www.google.com/maps?q=10.735919,106.702309&z=16&output=embed',
        image: '/showroom3.svg'
    }
];

// Benefits data
const benefits = [
    {
        icon: <Users className="h-8 w-8" />,
        title: 'Tư vấn chuyên sâu',
        description: 'Đội ngũ tư vấn viên có kiến thức chuyên sâu về gaming và laptop'
    },
    {
        icon: <Award className="h-8 w-8" />,
        title: 'Trải nghiệm sản phẩm',
        description: 'Trực tiếp trải nghiệm sản phẩm trước khi đưa ra quyết định mua hàng'
    },
    {
        icon: <Truck className="h-8 w-8" />,
        title: 'Nhận hàng tại chỗ',
        description: 'Mua hàng và nhận ngay, không cần chờ đợi thời gian vận chuyển'
    },
    {
        icon: <Shield className="h-8 w-8" />,
        title: 'Hỗ trợ kỹ thuật',
        description: 'Đội ngũ kỹ thuật viên hỗ trợ giải đáp và xử lý sự cố'
    }
];

export default function ShowroomPage() {
    const [selectedShowroom, setSelectedShowroom] = useState(showrooms[0]);
    const [expandedItem, setExpandedItem] = useState<number | null>(1);

    const handleShowroomSelect = (showroom: typeof showrooms[0]) => {
        setSelectedShowroom(showroom);
    };

    const toggleExpanded = (id: number) => {
        setExpandedItem(expandedItem === id ? null : id);
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
                    <h1 className="text-4xl font-bold mb-4">Showroom EcommerceLaptop</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Ghé thăm showroom của chúng tôi để trải nghiệm trực tiếp các sản phẩm laptop gaming cao cấp cùng đội ngũ tư vấn chuyên nghiệp.
                    </p>
                    <Button size="lg" className="mt-2" onClick={() => toast.info("Chức năng đặt lịch chưa khả dụng")}>
                        Đặt lịch tư vấn
                    </Button>
                </motion.div>

                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Image
                        src="/vector_ilus_store.jpg"
                        width={800}
                        height={600}
                        alt="Showroom Illustration"
                        priority
                        className="w-full h-auto"
                    />
                </motion.div>
            </div>

            {/* Benefits */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Lợi ích khi đến showroom</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className="mb-4 text-primary">{benefit.icon}</div>
                            <h3 className="font-semibold mb-2">{benefit.title}</h3>
                            <p className="text-muted-foreground text-sm">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Showroom Locations */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Các showroom của chúng tôi</h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* List of Locations */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        {showrooms.map((showroom) => (
                            <div
                                key={showroom.id}
                                className={`cursor-pointer rounded-lg p-4 transition-all ${selectedShowroom.id === showroom.id
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'bg-card hover:bg-muted'}`}
                                onClick={() => handleShowroomSelect(showroom)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{showroom.name}</h3>
                                        <p className={`text-sm ${selectedShowroom.id === showroom.id ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                                            {showroom.address}
                                        </p>
                                    </div>
                                    {showroom.featured && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                                            Nổi bật
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Location Details */}
                    <div className="w-full lg:w-2/3">
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <iframe
                                    src={selectedShowroom.mapUrl}
                                    width="100%"
                                    height="300"
                                    className="border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Map of ${selectedShowroom.name}`}
                                ></iframe>

                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{selectedShowroom.name}</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span>{selectedShowroom.address}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span>{selectedShowroom.hours}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span>{selectedShowroom.phone}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span>{selectedShowroom.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block max-w-[120px]">
                                            <Image
                                                src={selectedShowroom.image}
                                                width={120}
                                                height={120}
                                                alt={selectedShowroom.name}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Câu hỏi thường gặp</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqItems.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg overflow-hidden"
                        >
                            <button
                                className="w-full flex items-center justify-between p-4 text-left font-medium"
                                onClick={() => toggleExpanded(item.id)}
                            >
                                {item.question}
                                {expandedItem === item.id ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>
                            {expandedItem === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 pt-0 text-muted-foreground"
                                >
                                    {item.answer}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            {/* Contact CTA */}
            <section className="bg-primary/5 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Cần thêm thông tin?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn. Gọi ngay đến tổng đài hỗ trợ hoặc đặt lịch để được tư vấn trực tiếp tại showroom.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="default" size="lg" >
                        <Phone className="mr-2 h-4 w-4" />
                        Gọi ngay: 0899 888 999
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => toast.info("Chức năng đặt lịch chưa khả dụng")}>
                        <Clock className="mr-2 h-4 w-4" />
                        Đặt lịch tư vấn
                    </Button>
                </div>
            </section>
        </div>
    );
}

// FAQ items
const faqItems = [
    {
        id: 1,
        question: "Showroom có mở cửa vào Chủ nhật và ngày lễ không?",
        answer: "Có, tất cả showroom của EcommerceLaptop đều mở cửa từ 8:00 đến 21:00 tất cả các ngày trong tuần, kể cả Chủ nhật và ngày lễ để phục vụ khách hàng."
    },
    {
        id: 2,
        question: "Tôi có thể trực tiếp mua và nhận hàng tại showroom không?",
        answer: "Có, bạn có thể trực tiếp mua và nhận hàng ngay tại showroom. Chúng tôi luôn có sẵn các sản phẩm phổ biến và bán chạy. Với những sản phẩm đặc biệt, bạn có thể đặt trước và nhận hàng sau 1-3 ngày."
    },
    {
        id: 3,
        question: "Showroom có dịch vụ bảo hành và sửa chữa không?",
        answer: "Có, tất cả showroom đều có khu vực tiếp nhận bảo hành và sửa chữa. Đối với các sản phẩm được mua tại EcommerceLaptop, chúng tôi có đội ngũ kỹ thuật viên chuyên nghiệp hỗ trợ kiểm tra, tư vấn và xử lý các vấn đề kỹ thuật."
    },
    {
        id: 4,
        question: "Tôi có cần đặt lịch trước khi đến showroom không?",
        answer: "Bạn không cần đặt lịch trước khi đến tham quan showroom. Tuy nhiên, nếu muốn được tư vấn kỹ hơn về một sản phẩm cụ thể hoặc có nhu cầu đặc biệt, chúng tôi khuyến khích bạn đặt lịch trước để được phục vụ tốt nhất."
    },
    {
        id: 5,
        question: "Có khác biệt về giá giữa mua hàng online và mua tại showroom không?",
        answer: "Không, EcommerceLaptop áp dụng chính sách giá đồng nhất giữa kênh online và offline. Bạn sẽ được hưởng cùng một mức giá, khuyến mãi và chính sách bảo hành khi mua hàng trực tuyến hoặc tại showroom."
    }
];