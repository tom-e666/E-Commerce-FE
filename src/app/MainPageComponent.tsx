'use client'
import ParallaxProductGrid from "@/components/ui/Parallax";
import { useProduct } from "@/hooks/useProduct"
import { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { addToCart as addToCartAPI } from "@/services/cart/endpoint";

import { useAuthContext } from "@/contexts/AuthContext";

// Fisher-Yates shuffle algorithm for randomizing products
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const throttle = (callback: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            callback(...args);
        }
    };
};

export default function MainPageComponent() {
    const { products, getProducts } = useProduct();
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }); // Default to center
    const { isAuthenticated } = useAuthContext();
    const [shuffleKey, setShuffleKey] = useState(0);
    const [isMouseMovementEnabled, setIsMouseMovementEnabled] = useState(true);

    // Memoize the shuffled products to prevent unnecessary re-shuffling
    const shuffledProducts = useMemo(() => {
        return shuffleArray(products);
    }, [products, shuffleKey]);

    const handleShuffleClick = () => {
        setShuffleKey(prev => prev + 1);
        toast.success("Đã trộn lại sản phẩm!");
    };

    // Use a reference to track if the component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        // Detect if device is likely touch-only (mobile)
        const isTouchOnly = window.matchMedia('(pointer: coarse)').matches &&
            !window.matchMedia('(pointer: fine)').matches;

        if (isTouchOnly) {
            setIsMouseMovementEnabled(false);
            return;
        }

        // Create a throttled handler that only updates at most every 30ms
        const throttledMouseMoveHandler = throttle((e: MouseEvent) => {
            if (!isMounted.current) return;

            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        }, 30);

        window.addEventListener('mousemove', throttledMouseMoveHandler);

        // Create a backup method using device orientation for mobile
        const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
            if (!isMounted.current || !e.beta || !e.gamma) return;

            // Convert orientation to an approximate mouse position
            const x = ((e.gamma || 0) + 90) / 180 * 100;
            const y = ((e.beta || 0) + 90) / 180 * 100;
            setMousePosition({
                x: Math.min(Math.max(x, 0), 100),
                y: Math.min(Math.max(y, 0), 100)
            });
        };

        // Add device orientation as fallback
        window.addEventListener('deviceorientation', handleDeviceOrientation);

        return () => {
            window.removeEventListener('mousemove', throttledMouseMoveHandler);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
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
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            return;
        }
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-tight">
                        Laptop Gaming
                    </h1>

                    
                </div>

                <p className="text-lg text-gray-200 text-center max-w-2xl mx-auto mb-12 opacity-90">
                    Khám phá bộ sưu tập laptop gaming cao cấp với hiệu năng mạnh mẽ,
                    thiết kế độc đáo và công nghệ tiên tiến
                </p>

                <ParallaxProductGrid
                    products={shuffledProducts.map((product) => {
                        return {
                            id: product.id,
                            image: product.details.images[0] || "/laptop.png",
                            title: product.name,
                            price: product.price,
                            description: product.details.description || "Laptop gaming cao cấp với hiệu năng vượt trội"
                        }
                    })}
                    onAddToCart={addToCart}
                    randomize={true}
                    pageSize={15}
                />
            </div>
        </div>
    );
}