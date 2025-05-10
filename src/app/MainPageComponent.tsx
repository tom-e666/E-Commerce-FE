'use client'
import ParallaxProductGrid from "@/components/ui/Parallax";
import { useProduct } from "@/hooks/useProduct"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addToCart as addToCartAPI } from "@/services/cart/endpoint";
export default function MainPageComponent() {
    const { products, getProducts } = useProduct();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        toast.promise(getProducts(), {
            loading: "Đang tải sản phẩm...",
            success: "Tải danh sách sản phẩm thành công",
            error: "Không thể tải danh sách sản phẩm"
        });
    }, []);

    const addToCart = async (id: string) => {
        toast.promise(addToCartAPI(id), {
            loading: "Đang thêm sản phẩm vào giỏ hàng...",
            success: "Thêm sản phẩm vào giỏ hàng thành công",
            error: "Không thể thêm sản phẩm vào giỏ hàng"
        });
    };

    const gradientAngle = Math.round((mousePosition.x / 100) * 360);

    const purpleHue = 270 + (mousePosition.x / 10);
    const navyHue = 230 + (mousePosition.y / 10);

    const color1 = `hsl(${purpleHue}, 70%, 25%)`;
    const color2 = `hsl(${navyHue}, 80%, 20%)`;

    const lightSpot = `radial-gradient(
        circle at ${mousePosition.x}% ${mousePosition.y}%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(255, 255, 255, 0) 50%
    )`;

    const backgroundStyle = {
        background: `${lightSpot}, linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`,
        transition: 'background 0.5s ease-out',
    };

    return (
        <div
            className="w-screen min-h-screen scroll-auto flex justify-center"
            style={backgroundStyle}
        >
            <div className="py-12 w-full max-w-screen-xl mx-auto">
                <h1 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-lg tracking-tight">
                    Laptop Gaming
                </h1>
                <p className="text-lg text-gray-200 text-center max-w-2xl mx-auto mb-12 opacity-90">
                    Khám phá bộ sưu tập laptop gaming cao cấp với hiệu năng mạnh mẽ,
                    thiết kế độc đáo và công nghệ tiên tiến
                </p>

                <ParallaxProductGrid
                    products={products.map((product) => {
                        return {
                            id: product.id,
                            image: product.details.images[0] || "/laptop.png",
                            title: product.name,
                            price: product.price,
                            description: product.details.description || "Laptop gaming cao cấp với hiệu năng vượt trội"
                        }
                    })}
                    onAddToCart={addToCart}
                />
            </div>
        </div>
    );
}