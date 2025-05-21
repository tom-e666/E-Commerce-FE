"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Icons
import { ShoppingCart, ChevronRight, Star, Truck, Check, Package, Shield, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        .filter(p => p.brand_id === product.brand_id && p.id !== product.id)
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
    const brand = brands.find(b => b.id === brandId);
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
            Rất tiếc, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm. Sản phẩm có thể đã bị xóa hoặc không tồn tại.
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
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-1" />
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/product">Sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden bg-white border">
            <Image
              src={selectedImage || product.details.images?.[0] || "/laptop.png"}
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
                    ${selectedImage === img ? 'ring-2 ring-primary' : ''}`}
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
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(25 đánh giá)</span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
              <p className="text-sm text-muted-foreground mt-1">
                Đã bao gồm thuế và phí vận chuyển
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p>{product.details.description}</p>
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
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >-</Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                >+</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span>Giao hàng miễn phí</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Bảo hành 24 tháng</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-primary" />
              <span>Đổi trả trong 30 ngày</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
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
                <h3 className="text-lg font-medium mb-4">Thông số kỹ thuật</h3>
                <div className="space-y-1">
                  {product.details.specifications && product.details.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {product.details.specifications.map((spec, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-1/3 font-medium text-muted-foreground">{spec.name}</div>
                          <div className="w-2/3">{spec.value}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Không có thông tin thông số kỹ thuật.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Mô tả sản phẩm</h3>
                <div className="prose prose-sm max-w-none">
                  <p>{product.details.description || "Không có mô tả chi tiết cho sản phẩm này."}</p>

                  {/* Keywords/tags if available */}
                  {product.details.keywords && product.details.keywords.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.details.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">
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
                <h3 className="text-lg font-medium mb-4">Đánh giá sản phẩm</h3>
                <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
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
            <Link href="/product" className="text-primary hover:underline flex items-center">
              Xem tất cả
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={relatedProduct.details.images?.[0] || "/laptop.png"}
                    alt={relatedProduct.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 min-h-[2.5rem]">
                    <Link href={`/product/${relatedProduct.id}`} className="hover:underline">
                      {relatedProduct.name}
                    </Link>
                  </h3>
                  <div className="mt-2 font-bold text-primary">
                    {formatCurrency(relatedProduct.price)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (isAuthenticated) {
                        toast.promise(
                          addToCart(relatedProduct.id),
                          {
                            loading: "Đang thêm vào giỏ hàng...",
                            success: "Đã thêm vào giỏ hàng",
                            error: "Không thể thêm vào giỏ hàng"
                          }
                        );
                      } else {
                        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}