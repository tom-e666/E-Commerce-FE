"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/services/product/endpoint";
import { Product } from "@/services/product/endpoint";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { addToCart } from "@/services/cart/endpoint";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBrand } from "@/hooks/useBrand";
import { useProduct } from "@/hooks/useProduct";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Icons
import {
  ShoppingCart,
  ChevronRight,
  Star,
  Truck,
  Check,
  Package,
  Shield,
  Home,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCartGA } from "@/lib/gtag";

export default function ProductDetailPage() {
  const params = useParams();
  // Log params to debug
  console.log("URL Params:", params);

  // In Next.js 15, params is a Promise, so we need to handle it properly
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { isAuthenticated } = useAuthContext();
  const { brands, getBrands } = useBrand();
  const { products, getProducts } = useProduct();

  // First, extract the product_id from params (which is now a Promise in Next.js 15)
  useEffect(() => {
    async function extractParams() {
      try {
        // Handle params as a Promise in Next.js 15
        if (params instanceof Promise) {
          const resolvedParams = await params;
          const id = resolvedParams.product_id as string;
          console.log("Resolved Product ID from params:", id);
          setProductId(id);
        } else {
          // Fallback for older Next.js versions or if params is not a Promise
          const id = params.product_id as string;
          console.log("Product ID from params:", id);
          setProductId(id);
        }
      } catch (error) {
        console.error("Error extracting params:", error);
        toast.error("Có lỗi xảy ra khi xử lý thông tin sản phẩm");
      }
    }

    extractParams();
  }, [params]);

  // Then, fetch the product data once we have the productId
  useEffect(() => {
    async function loadData() {
      if (!productId) return;

      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId);

        // Load the product details
        const response = await getProduct(productId);
        if (response.code === 200) {
          setProduct(response.product);
          setSelectedImage(response.product.details.images?.[0] || null);

          // Load brands for brand name display
          await getBrands();

          // Load some products for the related products section
          await getProducts();
        } else {
          toast.error("Không thể tải thông tin sản phẩm");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId, getBrands, getProducts]);

  // When products are loaded, filter for related products (same brand)
  useEffect(() => {
    if (product && products.length > 0) {
      // Find products from the same brand, excluding the current product
      const sameBrandProducts = products
        .filter((p) => p.brand_id === product.brand_id && p.id !== product.id)
        .slice(0, 4); // Limit to 4 related products
      setRelatedProducts(sameBrandProducts);
    }
  }, [product, products]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (!product) return;

    addToCartGA({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });

    try {
      setIsAddingToCart(true);
      // For simplicity, we'll add items one by one based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
      }

      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "Không xác định";
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state UI
  if (!product) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-6">
            Rất tiếc, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm.
            Sản phẩm có thể đã bị xóa hoặc không tồn tại.
          </p>
          <Button asChild>
            <Link href="/product">Trở lại trang sản phẩm</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Main product detail UI
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-black flex items-center">
              <Home className="h-4 w-4 mr-1 text-black" />
              <span>Trang chủ</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/product" className="text-black">
              Sản phẩm
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">
              {product.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden bg-white border">
            <Image
              src={
                selectedImage || product.details.images?.[0] || "/laptop.png"
              }
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          {/* Thumbnail gallery */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {product.details.images && product.details.images.length > 0 ? (
              product.details.images.map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square relative rounded-md overflow-hidden border cursor-pointer
                    ${selectedImage === img ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square relative rounded-md overflow-hidden border">
                <Image
                  src="/laptop.png"
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getBrandName(product.brand_id)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {product.status ? "Còn hàng" : "Hết hàng"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (25 đánh giá)
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-6">
            {/* Quantity selector */}
            <div className="flex items-center">
              <span className="mr-4">Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity >= product.stock}
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock, prev + 1))
                  }
                >
                  +
                </Button>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.stock} sản phẩm có sẵn
              </span>
            </div>

            {/* Add to cart button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
            >
              {isAddingToCart ? (
                <>Đang thêm...</>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Thêm vào giỏ hàng
                </>
              )}
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 text-base font-medium">
              <Truck className="h-5 w-5 text-primary" />
              <span>Giao hàng miễn phí</span>
            </div>
            <div className="flex items-center gap-3 text-base font-medium">
              <Shield className="h-5 w-5 text-primary" />
              <span>Bảo hành 24 tháng</span>
            </div>
            <div className="flex items-center gap-3 text-base font-medium">
              <Package className="h-5 w-5 text-primary" />
              <span>Đổi trả trong 30 ngày</span>
            </div>
            <div className="flex items-center gap-3 text-base font-medium">
              <Check className="h-5 w-5 text-primary" />
              <span>Sản phẩm chính hãng</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-1 h-6 bg-primary rounded-full mr-2"></span>
                  Thông số kỹ thuật
                </h3>
                <div>
                  {product.details.specifications &&
                  product.details.specifications.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                      <table className="w-full border-collapse">
                        <thead className="bg-primary/10">
                          <tr>
                            <th className="p-3 text-left font-semibold text-primary border-r">
                              Thông số
                            </th>
                            <th className="p-3 text-left font-semibold text-primary border-r">
                              Giá trị
                            </th>
                            <th className="p-3 text-left font-semibold text-primary border-r">
                              Thông số
                            </th>
                            <th className="p-3 text-left font-semibold text-primary">
                              Giá trị
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Chia thông số thành các cặp để hiển thị theo hàng */}
                          {Array.from({
                            length: Math.ceil(
                              product.details.specifications.length / 2
                            ),
                          }).map((_, rowIndex) => {
                            // Lấy 2 thông số cho mỗi hàng
                            const startIdx = rowIndex * 2;
                            return (
                              <tr
                                key={rowIndex}
                                className={`${
                                  rowIndex % 2 === 0
                                    ? "bg-blue-50"
                                    : "bg-gray-100"
                                }`}
                              >
                                {/* Cột 1: Thông số đầu tiên trong hàng */}
                                {startIdx <
                                  product.details.specifications.length && (
                                  <>
                                    <td className="p-3 w-1/6 font-medium text-gray-700 border-r">
                                      {
                                        product.details.specifications[startIdx]
                                          .name
                                      }
                                    </td>
                                    <td className="p-3 w-1/3 border-r">
                                      {
                                        product.details.specifications[startIdx]
                                          .value
                                      }
                                    </td>
                                  </>
                                )}

                                {/* Cột 2: Thông số thứ hai trong hàng (nếu có) */}
                                {startIdx + 1 <
                                product.details.specifications.length ? (
                                  <>
                                    <td className="p-3 w-1/6 font-medium text-gray-700 border-r">
                                      {
                                        product.details.specifications[
                                          startIdx + 1
                                        ].name
                                      }
                                    </td>
                                    <td className="p-3 w-1/3">
                                      {
                                        product.details.specifications[
                                          startIdx + 1
                                        ].value
                                      }
                                    </td>
                                  </>
                                ) : (
                                  // Nếu không có thông số thứ hai, thêm ô trống
                                  <>
                                    <td className="p-3 border-r"></td>
                                    <td className="p-3"></td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Không có thông tin thông số kỹ thuật.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-1 h-6 bg-primary rounded-full mr-2"></span>
                  Mô tả sản phẩm
                </h3>

                <div className="max-w-none">
                  {/* Format description with proper paragraphs and bullet points */}
                  {product.details.description ? (
                    <div className="space-y-6 text-base leading-relaxed">
                      {product.details.description
                        .split("\n\n")
                        .map((paragraph, idx) => (
                          <div
                            key={idx}
                            className="text-gray-700 bg-white rounded-lg"
                          >
                            {paragraph.split("\n").map((line, lineIdx) => {
                              // Kiểm tra xem dòng có bắt đầu bằng dấu • hay không
                              if (line.trim().startsWith("•")) {
                                // Nếu là bullet point, hiển thị với padding bên trái
                                return (
                                  <div
                                    key={lineIdx}
                                    className="flex items-start mb-3 bg-gray-50 p-2 rounded-md"
                                  >
                                    <span className="text-primary mr-2 font-bold">
                                      •
                                    </span>
                                    <span className="text-gray-800">
                                      {line.trim().substring(1).trim()}
                                    </span>
                                  </div>
                                );
                              } else if (line.includes("•")) {
                                // Nếu dòng chứa dấu • ở giữa, tách thành nhiều phần
                                const parts = line
                                  .split("•")
                                  .map((part) => part.trim())
                                  .filter(Boolean);

                                if (parts.length > 0) {
                                  return (
                                    <div
                                      key={lineIdx}
                                      className="space-y-3 mb-3"
                                    >
                                      {parts.map((part, partIdx) =>
                                        partIdx === 0 ? (
                                          // Phần đầu tiên hiển thị như văn bản thông thường
                                          <p
                                            key={`${lineIdx}-${partIdx}`}
                                            className="font-medium text-gray-800"
                                          >
                                            {part}
                                          </p>
                                        ) : (
                                          // Các phần sau hiển thị như bullet points
                                          <div
                                            key={`${lineIdx}-${partIdx}`}
                                            className="flex items-start ml-4 bg-gray-50 p-2 rounded-md"
                                          >
                                            <span className="text-primary mr-2 font-bold">
                                              •
                                            </span>
                                            <span className="text-gray-800">
                                              {part}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                }
                              }

                              // Dòng thông thường
                              return (
                                <React.Fragment key={lineIdx}>
                                  <span className="text-gray-800">{line}</span>
                                  {lineIdx <
                                    paragraph.split("\n").length - 1 && <br />}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-700">
                        Không có mô tả chi tiết cho sản phẩm này.
                      </p>
                    </div>
                  )}

                  {/* Keywords/tags if available */}
                  {product.details.keywords &&
                    product.details.keywords.length > 0 && (
                      <div className="mt-8 bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <h4 className="text-base font-medium mb-3 text-gray-800 flex items-center">
                          <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                          Từ khóa liên quan
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.details.keywords.map((keyword, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="px-3 py-1 text-sm bg-white border-primary/20 text-primary hover:bg-primary/5"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-1 h-6 bg-primary rounded-full mr-2"></span>
                  Đánh giá sản phẩm
                </h3>
                <p className="text-muted-foreground">
                  Chưa có đánh giá nào cho sản phẩm này.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
            <Link
              href="/product"
              className="text-primary hover:underline flex items-center"
            >
              <span className="text-sm font-medium">Tất cả sản phẩm</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="overflow-hidden group transition-all duration-300 hover:shadow-md"
              >
                <Link href={`/product/${relatedProduct.id}`} className="block">
                  <div className="aspect-square relative bg-white">
                    <Image
                      src={relatedProduct.details.images?.[0] || "/laptop.png"}
                      alt={relatedProduct.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium line-clamp-2 min-h-[2.5rem] text-gray-800 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-2 font-bold text-primary text-lg">
                        {formatCurrency(relatedProduct.price)}
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Badge variant="outline" className="mr-2">
                          {getBrandName(relatedProduct.brand_id)}
                        </Badge>
                        {relatedProduct.status ? (
                          <span className="text-green-600 flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Còn hàng
                          </span>
                        ) : (
                          <span className="text-red-500">Hết hàng</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (isAuthenticated) {
                        toast.promise(addToCart(relatedProduct.id), {
                          loading: "Đang thêm vào giỏ hàng...",
                          success: "Đã thêm vào giỏ hàng",
                          error: "Không thể thêm vào giỏ hàng",
                        });
                      } else {
                        toast.error(
                          "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
                        );
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
