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

export default function MainPageComponent() {
    const { products, getProducts } = useProduct();
    const { isAuthenticated } = useAuthContext();
    const [shuffleKey, setShuffleKey] = useState(0);
    
    // Memoize the shuffled products to prevent unnecessary re-shuffling
    const shuffledProducts = useMemo(() => {
        return shuffleArray(products);
    }, [products, shuffleKey]);

    // Use a reference to track if the component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        // Use the optimized cache version instead
        getProducts()
            .then(response => {
                if (response.code !== 200) {
                    toast.error("Không thể tải danh sách sản phẩm");
                }
            })
            .catch(error => {
                toast.error("Không thể tải danh sách sản phẩm");
                console.error(error);
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

    return (
        <div className="w-screen min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 animate-gradient-xy"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
            
            {/* Content */}
            <div className="relative z-10 flex justify-center">
                <div className="py-12 w-full max-w-screen-xl mx-auto">
                    <div className="flex justify-center items-center mb-8">
                        <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-tight text-center">
                            Laptop Gaming
                        </h1>
                    </div>

                    <p className="text-lg text-gray-200 text-center max-w-2xl mx-auto mb-12 opacity-90">
                        Khám phá bộ sưu tập laptop gaming cao cấp với hiệu năng mạnh mẽ,
                        thiết kế độc đáo và công nghệ tiên tiến
                    </p>

                    <ParallaxProductGrid
                        products={shuffledProducts.map((product) => ({
                            id: product.id,
                            image: product.details.images[0] || "/laptop.png",
                            title: product.name,
                            price: product.price,
                            description: product.details.description || "Laptop gaming cao cấp với hiệu năng vượt trội"
                        }))}
                        onAddToCart={addToCart}
                    />
                </div>
            </div>
        </div>
    );
}