import { Metadata } from "next";
import { getProduct } from "@/services/product/endpoint";

type Props = {
  params: { product_id: string };
};

interface ExtendedProduct {
  id: string;
  name: string;
  price?: number;
  stock: number;
  brand?: {
    name: string;
  };
  description?: string;
  details?: {
    images?: string[];
    processor?: string;
    ram?: string;
    storage?: string;
    graphics?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await getProduct(params.product_id);

    if (response.code === 200 && response.product) {
      const product = response.product as ExtendedProduct;
      const productImage = product.details?.images?.[0] || "/laptop.png";
      const brandName = product.brand?.name || "";
      const price = product.price
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.price)
        : "";

      return {
        title: `${product.name} - ${brandName}`,
        description: `Mua ${
          product.name
        } ${brandName} với giá ${price} tại EMS Electronics. ${
          product.description ||
          "Sản phẩm chính hãng, bảo hành uy tín, giao hàng miễn phí toàn quốc."
        }`,
        keywords: [
          product.name,
          brandName,
          "laptop gaming",
          "máy tính",
          "laptop chính hãng",
          "mua laptop",
          product.details?.processor || "",
          product.details?.ram || "",
          product.details?.storage || "",
          product.details?.graphics || "",
        ].filter(Boolean),
        openGraph: {
          title: `${product.name} - ${brandName} | EMS Electronics`,
          description: `Mua ${product.name} ${brandName} với giá ${price}. Sản phẩm chính hãng, bảo hành uy tín, giao hàng miễn phí.`,
          images: [
            {
              url: productImage,
              width: 800,
              height: 600,
              alt: `${product.name} - ${brandName}`,
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${product.name} - ${brandName}`,
          description: `Mua ${product.name} ${brandName} với giá ${price} tại EMS Electronics`,
          images: [productImage],
        },
        alternates: {
          canonical: `/product/${params.product_id}`,
        },
        other: {
          "product:price:amount": product.price?.toString() || "",
          "product:price:currency": "VND",
          "product:availability":
            product.stock > 0 ? "in stock" : "out of stock",
          "product:brand": brandName,
          "product:category": "Electronics > Computers > Laptops",
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback metadata
  return {
    title: "Chi Tiết Sản Phẩm",
    description:
      "Xem chi tiết sản phẩm laptop gaming và máy tính tại EMS Electronics. Sản phẩm chính hãng, giá tốt, bảo hành uy tín.",
    openGraph: {
      title: "Chi Tiết Sản Phẩm - EMS Electronics",
      description:
        "Xem chi tiết sản phẩm laptop gaming và máy tính tại EMS Electronics",
      images: ["/laptop.png"],
      type: "website",
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
