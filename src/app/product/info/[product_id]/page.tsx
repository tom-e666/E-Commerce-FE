"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
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
import { ThumbnailGallery } from "@/components/ui/thumbnail-gallery";

// Icons
import { ShoppingCart, ChevronRight, Star, Truck, Check, Package, Shield, Home, Sparkles, Award, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const fadeInStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Pulse highlight animation for special features
const Highlight = ({ children }) => {
  return (
    <motion.span
      className="relative inline-block"
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true }}
    >
      {children}
      <motion.span
        className="absolute -inset-1 rounded-md bg-primary/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: [0, 0.4, 0], 
          scale: [0.9, 1.05, 0.9] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.span>
  );
};

// Animated badge with particle effects
const AnimatedBadge = ({ children, variant = "outline", className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Badge variant={variant} className={className}>
        {children}
      </Badge>
      <AnimatePresence>
        <motion.div
          className="absolute -inset-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              initial={{ 
                opacity: 0.7,
                x: 0, 
                y: 0,
                scale: 0.5
              }}
              animate={{ 
                opacity: 0,
                x: Math.random() * 30 - 15, 
                y: Math.random() * 30 - 15,
                scale: 0
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
                ease: "easeOut"
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default function ProductDetailPage() {
  const params = useParams();
  const product_id = params.product_id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { isAuthenticated } = useAuthContext();
  const { brands, getBrands } = useBrand();
  const { products, getProducts } = useProduct();

  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi component re-render
  const fetchProductDetails = useCallback(async (id: string) => {
    if (!id) return false;

    try {
      // Gọi API product/{id} - không cần log để tránh spam console
      const response = await getProduct(id);

      if (response.code === 200 && response.product) {
        // Cập nhật state với thông tin sản phẩm
        const productData = response.product;

        // Đảm bảo hình ảnh được tải trước khi hiển thị
        if (productData.details.images && productData.details.images.length > 0) {
          // Tạo một mảng Promise để tải trước tất cả hình ảnh
          const imagePromises = productData.details.images.map(imgUrl => {
            return new Promise<boolean>((resolve) => {
              const img = new window.Image();
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              img.src = imgUrl;
            });
          });

          // Chờ tất cả hình ảnh tải xong hoặc timeout sau 3 giây
          await Promise.race([
            Promise.all(imagePromises),
            new Promise(resolve => setTimeout(resolve, 3000))
          ]);
        }

        setProduct(productData);
        setSelectedImage(productData.details.images?.[0] || null);
        document.title = `${productData.name} | Chi tiết sản phẩm`;

        setLoading(false);
        return true;
      } else {
        toast.error(response.message || "Không thể tải thông tin sản phẩm");
        setLoading(false);
        return false;
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm");
      setLoading(false);
      return false;
    }
  }, []);

  // Sử dụng useMemo để tránh tính toán lại không cần thiết
  const loadBrandsAndProducts = useMemo(() => {
    return async () => {
      try {
        // Tải brands và products song song để tăng tốc
        await Promise.all([
          brands.length === 0 ? getBrands() : Promise.resolve(),
          products.length === 0 ? getProducts() : Promise.resolve()
        ]);
        return true;
      } catch (error) {
        return false;
      }
    };
  }, [brands.length, products.length, getBrands, getProducts]);

  // Tạo ref ở cấp cao nhất của component để lưu product_id đã xử lý
  const productFetchedRef = useRef<string | null>(null);

  // Effect để tải thông tin sản phẩm - chỉ chạy khi product_id thay đổi
  useEffect(() => {
    // Kiểm tra nếu product_id đã được xử lý rồi thì không xử lý lại
    if (productFetchedRef.current === product_id) return;

    // Đánh dấu đang xử lý product_id này
    productFetchedRef.current = product_id;

    // Chỉ hiển thị loading khi chưa có dữ liệu sản phẩm
    if (!product) {
      setLoading(true);
    }

    async function loadData() {
      if (product_id) {
        const success = await fetchProductDetails(product_id);

        // Chỉ tải brands và related products nếu tải sản phẩm thành công
        if (success) {
          await loadBrandsAndProducts();
        }
      } else {
        setLoading(false);
      }
    }

    loadData();

    // Cleanup function không cần reset productFetchedRef vì chúng ta muốn nhớ product_id đã xử lý
  }, [product_id, fetchProductDetails, loadBrandsAndProducts]); // Thêm các dependencies cần thiết

  // When products are loaded, filter for related products (same brand)
  // Sử dụng useCallback để tránh tạo lại hàm mỗi khi component re-render
  const updateRelatedProducts = useCallback(() => {
    if (product && products.length > 0) {
      // Find products from the same brand, excluding the current product
      const sameBrandProducts = products
        .filter(p => p.brand_id === product.brand_id && p.id !== product.id)
        .slice(0, 4); // Limit to 4 related products
      setRelatedProducts(sameBrandProducts);
    }
  }, [product, products]);

  // Effect để cập nhật sản phẩm liên quan khi product hoặc products thay đổi
  useEffect(() => {
    updateRelatedProducts();
  }, [updateRelatedProducts]);

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

  const { scrollYProgress } = useScroll();
  const productRef = useRef(null);
  const isProductInView = useInView(productRef);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef);
  const benefitsRef = useRef(null);
  const isBenefitsInView = useInView(benefitsRef);
  const tabsRef = useRef(null);
  const isTabsInView = useInView(tabsRef);
  
  // Parallax effect for images
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Spring animations for smooth UI
  const titleSpring = useSpring(0, { stiffness: 100, damping: 20 });
  const priceSpring = useSpring(0, { stiffness: 100, damping: 20 });
  
  useEffect(() => {
    if (isTitleInView) {
      titleSpring.set(1);
    }
  }, [isTitleInView, titleSpring]);

  useEffect(() => {
    if (product) {
      priceSpring.set(1);
    }
  }, [product, priceSpring]);

  // Loading state UI
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Skeleton className="h-8 w-64" />
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={fadeInStagger}
          initial="hidden"
          animate="visible"
        >
          {/* Image skeleton */}
          <motion.div variants={itemFadeIn}>
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
            </div>
          </motion.div>
          <motion.div className="space-y-6" variants={itemFadeIn}>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Not found state UI
  if (!product) {
    return (
      <motion.div 
        className="container mx-auto p-4 md:p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <motion.h1 
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Không tìm thấy sản phẩm
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Rất tiếc, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm. Sản phẩm có thể đã bị xóa hoặc không tồn tại.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild>
              <Link href="/product">Trở lại trang sản phẩm</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Main product detail UI
  return (
    <div className="container mx-auto p-4 md:p-8 overflow-hidden">
      {/* Breadcrumb navigation with animation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Breadcrumb>
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
              <BreadcrumbLink href="/product" className="text-black">Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-black">{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Floating highlight effect */}
      <motion.div
        className="fixed bottom-10 right-10 z-50 bg-primary/80 text-white p-3 rounded-full shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          delay: 2,
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images with parallax */}
        <motion.div
          ref={productRef}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ y: imageY }}
        >
          {/* Main Product Image */}
          {product.details.images && product.details.images.length > 0 ? (
            <>
              <motion.div 
                className="relative rounded-xl overflow-hidden bg-white border mb-4 shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-[4/3]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage || product.details.images[0]}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={selectedImage || product.details.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        priority
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      
                      {/* Glare effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0"
                        animate={{ 
                          opacity: [0, 0.5, 0],
                          left: ["0%", "100%", "100%"]
                        }}
                        transition={{
                          duration: 2,
                          repeatDelay: 5,
                          repeat: Infinity
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* "HOT DEAL" badge if there's a price reduction */}
                {product.old_price && product.old_price > product.price && (
                  <motion.div
                    className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg z-10"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 10,
                      delay: 0.5
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="flex items-center gap-1"
                    >
                      <Zap className="h-3 w-3" />
                      <span>GIẢM GIÁ {Math.round(((product.old_price - product.price) / product.old_price) * 100)}%</span>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Thumbnail Slider with animations */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                <ThumbnailGallery
                  images={product.details.images}
                  currentIndex={product.details.images.indexOf(selectedImage || product.details.images[0])}
                  onSelect={(index: number) => setSelectedImage(product.details.images[index])}
                  productName={product.name}
                />
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="relative rounded-lg overflow-hidden bg-white border shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-[4/3]">
                <Image
                  src="/laptop.png"
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Product Information */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div>
            <motion.div 
              className="flex flex-wrap items-center gap-2 mb-3"
              variants={fadeInStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemFadeIn}>
                <AnimatedBadge variant="outline" className="px-3 py-1 text-sm font-medium">
                  {getBrandName(product.brand_id)}
                </AnimatedBadge>
              </motion.div>
              {product.status ? (
                <motion.div variants={itemFadeIn}>
                  <AnimatedBadge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-sm">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Còn hàng
                  </AnimatedBadge>
                </motion.div>
              ) : (
                <motion.div variants={itemFadeIn}>
                  <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-sm">
                    Hết hàng
                  </Badge>
                </motion.div>
              )}
              
              {/* Award badge for premium products */}
              <motion.div
                variants={itemFadeIn}
                transition={{ delay: 0.3 }}
              >
                <AnimatedBadge variant="outline" className="px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Sản phẩm cao cấp
                </AnimatedBadge>
              </motion.div>
            </motion.div>

            <motion.h1 
              ref={titleRef}
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ opacity: titleSpring }}
            >
              {product.name}
            </motion.h1>

            <motion.div 
              className="inline-flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + star * 0.1 }}
                  >
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm text-gray-600">(25 đánh giá)</span>
            </motion.div>

            <motion.div 
              className="mt-4 bg-primary/5 p-4 rounded-lg border border-primary/10 shadow-inner"
              style={{ opacity: priceSpring }}
              whileHover={{ boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}
            >
              <motion.div className="flex items-baseline">
                <motion.span 
                  className="text-3xl font-bold text-primary"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 10,
                    delay: 0.6
                  }}
                >
                  {formatCurrency(product.price)}
                </motion.span>
                {product.old_price && product.old_price > product.price && (
                  <motion.span 
                    className="ml-2 text-lg text-gray-500 line-through"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {formatCurrency(product.old_price)}
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-col space-y-4 mt-6"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Quantity selector */}
            <motion.div 
              className="flex items-center bg-white p-3 rounded-md border"
              whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <span className="mr-4 font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-md shadow-sm">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-lg font-bold"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  >-</Button>
                </motion.div>
                
                <motion.span 
                  className="w-12 text-center font-medium"
                  key={quantity}
                  initial={{ scale: 1.2, color: "#4F46E5" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.3 }}
                >
                  {quantity}
                </motion.span>
                
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-lg font-bold"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  >+</Button>
                </motion.div>
              </div>
              <div className="ml-4 text-sm bg-gray-50 px-2 py-1 rounded-md flex items-center">
                <Package className="h-4 w-4 mr-1 text-primary" />
                <span>{product.stock} sản phẩm có sẵn</span>
              </div>
            </motion.div>

            {/* Add to cart button with effect */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/80"
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
              >
                {isAddingToCart ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang thêm...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                    </motion.div>
                    <span>Thêm vào giỏ hàng</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Benefits */}
          <motion.div 
            ref={benefitsRef}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mt-6 border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h3 
              className="text-lg font-medium mb-3 text-gray-800 flex items-center"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full mr-2"></span>
              <Highlight>Quyền lợi khách hàng</Highlight>
            </motion.h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={fadeInStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center gap-3 text-base font-medium bg-white p-3 rounded-md shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div 
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Truck className="h-5 w-5 text-primary" />
                  </motion.div>
                </motion.div>
                <span>Giao hàng miễn phí</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 text-base font-medium bg-white p-3 rounded-md shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div 
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Shield className="h-5 w-5 text-primary" />
                  </motion.div>
                </motion.div>
                <span>Bảo hành 24 tháng</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 text-base font-medium bg-white p-3 rounded-md shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div 
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Package className="h-5 w-5 text-primary" />
                  </motion.div>
                </motion.div>
                <span>Đổi trả trong 30 ngày</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 text-base font-medium bg-white p-3 rounded-md shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div 
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Check className="h-5 w-5 text-primary" />
                  </motion.div>
                </motion.div>
                <span>Sản phẩm chính hãng</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Technical highlights section */}
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.h3
              className="text-lg font-medium mb-3 text-indigo-900 flex items-center"
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Zap className="mr-2 h-5 w-5 text-indigo-600" />
              Điểm nổi bật
            </motion.h3>
            
            <motion.ul className="space-y-2">
              {product.details.specifications && product.details.specifications.slice(0, 3).map((spec, index) => (
                <motion.li 
                  key={spec.name}
                  className="flex items-center gap-2 bg-white p-2 rounded-lg"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-2 w-2 bg-indigo-600 rounded-full"
                  />
                  <span className="font-medium text-gray-800">{spec.name}:</span>
                  <span className="text-indigo-700">{spec.value}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        ref={tabsRef}
        className="mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="specifications">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <motion.h3 
                    className="text-xl font-semibold mb-4 text-gray-800 flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="w-1 h-6 bg-primary rounded-full mr-2"></span>
                    Thông số kỹ thuật
                  </motion.h3>
                  <div>
                    {product.details.specifications && product.details.specifications.length > 0 ? (
                      <motion.div 
                        className="overflow-hidden rounded-lg border shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <table className="w-full border-collapse">
                          <thead className="bg-primary/10">
                            <tr>
                              <th className="p-3 text-left font-semibold text-primary border-r">Thông số</th>
                              <th className="p-3 text-left font-semibold text-primary border-r">Giá trị</th>
                              <th className="p-3 text-left font-semibold text-primary border-r">Thông số</th>
                              <th className="p-3 text-left font-semibold text-primary">Giá trị</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Chia thông số thành các cặp để hiển thị theo hàng */}
                            {Array.from({ length: Math.ceil(product.details.specifications.length / 2) }).map((_, rowIndex) => {
                              // Lấy 2 thông số cho mỗi hàng
                              const startIdx = rowIndex * 2;
                              return (
                                <motion.tr
                                  key={rowIndex}
                                  className={`${rowIndex % 2 === 0 ? 'bg-blue-50' : 'bg-gray-100'}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 + rowIndex * 0.05 }}
                                  whileHover={{ backgroundColor: "rgba(219, 234, 254, 0.7)" }}
                                >
                                  {/* Cột 1: Thông số đầu tiên trong hàng */}
                                  {startIdx < product.details.specifications.length && (
                                    <>
                                      <td className="p-3 w-1/6 font-medium text-gray-700 border-r">
                                        {product.details.specifications[startIdx].name}
                                      </td>
                                      <td className="p-3 w-1/3 border-r">
                                        {product.details.specifications[startIdx].value}
                                      </td>
                                    </>
                                  )}

                                  {/* Cột 2: Thông số thứ hai trong hàng (nếu có) */}
                                  {startIdx + 1 < product.details.specifications.length ? (
                                    <>
                                      <td className="p-3 w-1/6 font-medium text-gray-700 border-r">
                                        {product.details.specifications[startIdx + 1].name}
                                      </td>
                                      <td className="p-3 w-1/3">
                                        {product.details.specifications[startIdx + 1].value}
                                      </td>
                                    </>
                                  ) : (
                                    // Nếu không có thông số thứ hai, thêm ô trống
                                    <>
                                      <td className="p-3 border-r"></td>
                                      <td className="p-3"></td>
                                    </>
                                  )}
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </motion.div>
                    ) : (
                      <p className="text-muted-foreground">Không có thông tin thông số kỹ thuật.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                      {product.details.description.split('\n\n').map((paragraph, idx) => (
                        <div key={idx} className="text-gray-700 bg-white rounded-lg">
                          {paragraph.split('\n').map((line, lineIdx) => {
                            // Kiểm tra xem dòng có bắt đầu bằng dấu • hay không
                            if (line.trim().startsWith('•')) {
                              // Nếu là bullet point, hiển thị với padding bên trái
                              return (
                                <div key={lineIdx} className="flex items-start mb-3 bg-gray-50 p-2 rounded-md">
                                  <span className="text-primary mr-2 font-bold">•</span>
                                  <span className="text-gray-800">{line.trim().substring(1).trim()}</span>
                                </div>
                              );
                            } else if (line.includes('•')) {
                              // Nếu dòng chứa dấu • ở giữa, tách thành nhiều phần
                              const parts = line.split('•').map(part => part.trim()).filter(Boolean);

                              if (parts.length > 0) {
                                return (
                                  <div key={lineIdx} className="space-y-3 mb-3">
                                    {parts.map((part, partIdx) => (
                                      partIdx === 0 ? (
                                        // Phần đầu tiên hiển thị như văn bản thông thường
                                        <p key={`${lineIdx}-${partIdx}`} className="font-medium text-gray-800">{part}</p>
                                      ) : (
                                        // Các phần sau hiển thị như bullet points
                                        <div key={`${lineIdx}-${partIdx}`} className="flex items-start ml-4 bg-gray-50 p-2 rounded-md">
                                          <span className="text-primary mr-2 font-bold">•</span>
                                          <span className="text-gray-800">{part}</span>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                );
                              }
                            }

                            // Dòng thông thường
                            return (
                              <React.Fragment key={lineIdx}>
                                <span className="text-gray-800">{line}</span>
                                {lineIdx < paragraph.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-700">Không có mô tả chi tiết cho sản phẩm này.</p>
                    </div>
                  )}

                  {/* Keywords/tags if available */}
                  {product.details.keywords && product.details.keywords.length > 0 && (
                    <div className="mt-8 bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <h4 className="text-base font-medium mb-3 text-gray-800 flex items-center">
                        <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                        Từ khóa liên quan
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.details.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="px-3 py-1 text-sm bg-white border-primary/20 text-primary hover:bg-primary/5">
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
                <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
            <Link href="/product" className="text-primary hover:underline flex items-center">
              <span className="text-sm font-medium">Tất cả sản phẩm</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={fadeInStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                variants={itemFadeIn}
                custom={index}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl border border-gray-200">
                  <Link href={`/product/${relatedProduct.id}`} className="block">
                    <div className="aspect-square relative bg-white">
                      <Image
                        src={relatedProduct.details.images?.[0] || "/laptop.png"}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
      
      {/* Floating "Back to top" button that appears when scrolling */}
      <AnimatePresence>
        {scrollYProgress.get() > 0.3 && (
          <motion.button
            className="fixed bottom-5 right-5 bg-primary text-white p-3 rounded-full shadow-lg z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}