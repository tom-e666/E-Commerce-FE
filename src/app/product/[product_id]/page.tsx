// src/app/product/[product_id]/page.tsx

import { type Metadata } from "next";
import { getProduct } from "@/services/product/endpoint";
import ProductDetailPageClient from "./ProductDetailPageClient";

type Props = {
    params: { product_id: string };
};

/**
 * 🚀 Hàm này chạy trên SERVER để tạo các thẻ <meta> động cho SEO.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // URL có dạng "ten-san-pham-slug-123" -> tách lấy ID
    const id = params.product_id?.split("-").pop() || "";

    if (!id) return { title: "Sản phẩm không tồn tại" };

    try {
        const response = await getProduct(id);
        const product = response.product;

        if (!product) return { title: "Sản phẩm không tồn tại" };

        // Lấy ảnh đầu tiên của sản phẩm làm ảnh đại diện khi chia sẻ
        const imageUrl = product.details.images?.[0] || "https://your-domain.com/default-image.png";

        // Tạo cấu trúc thẻ Meta hoàn chỉnh
        return {
            title: `${product.name} | Tên Cửa Hàng`,
            description: `Mua ngay ${product.name} giá tốt. Cam kết hàng chính hãng, bảo hành uy tín.`,
            openGraph: {
                title: product.name,
                description: "Sản phẩm chất lượng cao với giá ưu đãi đặc biệt.",
                url: `https://your-domain.com/product/${params.product_id}`, // <-- Thay tên miền của bạn
                siteName: "Tên Cửa Hàng",
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: `Ảnh sản phẩm ${product.name}`,
                    },
                ],
                locale: "vi_VN",
                type: "website",
            },
        };
    } catch (error) {
        console.error("Lỗi khi tạo metadata:", error);
        return { title: "Lỗi", description: "Không thể tải dữ liệu trang." };
    }
}

/**
 * Component Page chính (Server Component).
 * Nhiệm vụ duy nhất là render Client Component và truyền params xuống.
 */
export default function Page({ params }: Props) {
    return <ProductDetailPageClient params={params} />;
}
