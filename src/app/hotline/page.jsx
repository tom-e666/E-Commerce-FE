"use client";

import { useState } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
        alert("Form submitted!"); // Thay bằng API thực tế
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-6 p-6">
            {/* Thông tin liên hệ */}
            <div className="w-full lg:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-medium mb-3">Contact Us</h2>
                <p className="text-gray-600 mb-4">Contact us for quick and dedicated support!</p>
                <div className="space-y-3 text-gray-700">
                    <p className="flex items-center">
                        <LocalPhoneIcon className="mr-2 text-blue-500" />
                        097797969795
                    </p>
                    <p className="flex items-center">
                        <EmailIcon className="mr-2 text-red-500" />
                        Thinhloz@gmail.com
                    </p>
                    <p className="flex items-center">
                        <LocationOnIcon className="mr-2 text-green-500" />
                        129/1T Lạc Long Quân, P.1, Q.11, TP.HCM
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
            <div className="w-full lg:w-1/2 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-medium mb-3">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border rounded"
                            placeholder="Your Name"
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
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div >
                        <label className="block text-gray-700">Message</label>
                        <textarea
                            name="message"
                            className="w-full p-2 border rounded h-20 max-h-[160px] "
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
