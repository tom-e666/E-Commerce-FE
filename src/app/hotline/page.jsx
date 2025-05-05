"use client";

import { useState } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Image from "next/image";
import { toast } from "sonner";

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
        
        toast.success("Gửi biểu mẫu thành công! \n Cảm ơn sự đóng góp của bạn");
    };

    return (
        <div className="relative w-full min-h-screen">
            
            <div className="absolute inset-0 -z-10">
                <Image 
                    src="/background.jpg" 
                    alt="Background" 
                    fill 
                    className="object-cover"
                    priority
                />
            </div>
            
            <div className="relative z-10 w-full flex flex-col lg:flex-row gap-6 p-6">
                {/* Thông tin liên hệ */}
                <div className="w-full lg:w-1/3 p-6 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-medium mb-3">Liên Hệ Với Chúng Tôi</h2>
                    <p className="text-gray-600 mb-4">Luôn có mặt vì bạn!</p>
                    <div className="space-y-3 text-gray-700">
                        <p className="flex items-center">
                            <LocalPhoneIcon className="mr-2 text-blue-500" />
                            <a href="tel:0899888999" className="hover:underline">0899888999</a>
                        </p>
                        <p className="flex items-center">
                            <EmailIcon className="mr-2 text-red-500" />
                            <a href="mailto:Thinh@gmail.com" className="hover:underline">Thinh@gmail.com</a>
                        </p>
                        <p className="flex items-center">
                            <LocationOnIcon className="mr-2 text-green-500" />
                            <a className="hover:underline" href="https://www.google.com/maps/place/G%C3%A0+R%C3%A1n+Otok%C3%A9/@10.765666,106.6325774,2583m/data=!3m1!1e3!4m10!1m2!2m1!1zMTI5LzFUIEzhuqFjIExvbmcgUXXDom4sIFAuMSwgUS4xMSwgVFAuSENN!3m6!1s0x31752f82f0dc9097:0x252de226269e0ded!8m2!3d10.7663306!4d106.6425822!15sCioxMjkvMVQgTOG6oWMgTG9uZyBRdcOibiwgUC4xLCBRLjExLCBUUC5IQ01aKSInMTI5IDF0IGzhuqFjIGxvbmcgcXXDom4gcCAxIHEgMTEgdHAgaGNtkgEKcmVzdGF1cmFudKoBWhABKgciA3AgMShCMiAQASIcVUD4PgHo3sgfA5O9nkWYzWVmwaEozy2mIdrFQjIrEAIiJzEyOSAxdCBs4bqhYyBsb25nIHF1w6JuIHAgMSBxIDExIHRwIGhjbeABAA!16s%2Fg%2F11kd5xt2zh?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D">129/1T Lạc Long Quân, P.1, Q.11, TP.HCM</a>                            
                        </p>
                    </div>

                    {/* Google Maps */}
                    <div className="mt-4">
                        <iframe
                            className="w-full h-64 rounded-lg shadow-md"
                            src="https://www.google.com/maps?q=10.758142236592212,106.63786218934307&z=16&output=embed"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
                
                {/* Form liên hệ */}
                <div className="w-full lg:w-2/3 p-6 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-medium mb-3">Gửi Tin Nhắn</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full p-2 border rounded"
                                placeholder="Nhập họ tên của bạn"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full p-2 border rounded"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Nội dung</label>
                            <textarea
                                name="message"
                                className="w-full p-2 border rounded h-20 max-h-[160px]"
                                placeholder="Nhập nội dung tin nhắn"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Gửi Tin Nhắn
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}