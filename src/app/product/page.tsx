"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Filter, X, Check, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { addToCart } from "@/services/cart/endpoint";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProduct } from "@/hooks/useProduct";
import { useBrand } from "@/hooks/useBrand";
import { Skeleton } from "@/components/ui/skeleton";
import { viewItemList } from "@/lib/gtag";

export default function ProductListPage() {
  const {
    resetAndLoadProducts,
    loadMoreProducts,
    paginatedProducts,
    pagination,
    loading,
    isLoadingMore,
    canLoadMore,
  } = useProduct();

  const { brands, getBrands } = useBrand();
  const { isAuthenticated } = useAuthContext();

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Display state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Thêm state cho filter giảm giá
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);

  const observerRef = useRef<IntersectionObserver>();
  // const lastProductElementRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canLoadMore) {
          loadMoreProducts();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, canLoadMore, loadMoreProducts]
  );

  // Current filters
  const currentFilters = useMemo(
    () => ({
      search: searchQuery || undefined,
      brand_id: selectedBrands.length > 0 ? selectedBrands[0] : undefined, // For simplicity
      price_min: priceRange[0] > 0 ? priceRange[0] : undefined,
      price_max: priceRange[1] < 50000000 ? priceRange[1] : undefined,
      sort_field: sortOption.includes("-") ? sortOption.split("-")[0] : "name",
      sort_direction: sortOption.includes("-")
        ? sortOption.split("-")[1]
        : "asc",
    }),
    [searchQuery, selectedBrands, priceRange, sortOption]
  );

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getBrands(),
          resetAndLoadProducts(currentFilters, 12),
        ]);
      } catch {
        toast.error("Không thể tải danh sách sản phẩm");
      }
    };

    loadData();
  }, [getBrands, resetAndLoadProducts, currentFilters]);

  // Reload when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      resetAndLoadProducts(currentFilters, 12);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentFilters, resetAndLoadProducts]);

  // Filter products based on selected filters
  const filteredProducts = paginatedProducts.filter((product) => {
    // Brand filter
    if (
      selectedBrands.length > 0 &&
      !selectedBrands.includes(product.brand_id)
    ) {
      return false;
    }

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Discount filter
    if (
      showDiscountOnly &&
      (!product.default_price || product.default_price <= product.price)
    ) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        (product.details.description &&
          product.details.description.toLowerCase().includes(query)) ||
        (product.details.keywords &&
          product.details.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query)
          ))
      );
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "discount-desc":
        // Sort by discount percentage (highest first)
        const discountA =
          a.default_price && a.default_price > a.price
            ? ((a.default_price - a.price) / a.default_price) * 100
            : 0;
        const discountB =
          b.default_price && b.default_price > b.price
            ? ((b.default_price - b.price) / b.default_price) * 100
            : 0;
        return discountB - discountA;
      default: // 'featured'
        return 0; // Keep original order
    }
  });

  useEffect(() => {
    if (sortedProducts.length === 0) return;

    viewItemList({
      item_list_name: "Danh sách sản phẩm",
      items: sortedProducts.slice(0, 12).map((product, index) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        index,
      })),
    });
  }, [sortedProducts]);

  // Handle brand filter change
  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  // Add to cart handler
  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      await toast.promise(addToCart(productId), {
        loading: "Đang thêm sản phẩm vào giỏ hàng...",
        success: "Thêm sản phẩm vào giỏ hàng thành công",
        error: "Không thể thêm sản phẩm vào giỏ hàng",
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 50000000]);
    setSearchQuery("");
    setSortOption("featured");
    setShowDiscountOnly(false);
  };

  // Format price for display
  const formatPriceRange = () => {
    return `${formatCurrency(priceRange[0])} - ${formatCurrency(
      priceRange[1]
    )}`;
  };

  // Check if any filter is active (chỉ giữ lại một định nghĩa)
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 50000000 ||
    searchQuery !== "" ||
    showDiscountOnly;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters */}
        <div className="hidden md:block w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="bg-card rounded-lg border p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Bộ lọc</h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2 text-muted-foreground"
                >
                  <X className="mr-1 h-4 w-4" /> Xóa lọc
                </Button>
              )}
            </div>

            {/* Brand filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => handleBrandChange(brand.id)}
                    />
                    <Label
                      htmlFor={`brand-${brand.id}`}
                      className="ml-2 text-sm font-normal cursor-pointer flex items-center justify-between w-full"
                    >
                      <span>{brand.name}</span>
                      {selectedBrands.includes(brand.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Price range filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Giá</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 50000000]}
                  value={[priceRange[0], priceRange[1]]}
                  max={50000000}
                  step={1000000}
                  onValueChange={handlePriceChange}
                  className="mb-4"
                  minStepsBetweenThumbs={1}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(priceRange[0])}</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </div>

              {/* Optional: Price input ranges for direct number entry */}
              <div className="flex items-center gap-2 mt-4">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0 && value < priceRange[1]) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  className="w-full h-8 text-xs"
                  placeholder="Min"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (
                      !isNaN(value) &&
                      value > priceRange[0] &&
                      value <= 50000000
                    ) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  className="w-full h-8 text-xs"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Discount filter */}
            <div className="mb-4">
              <div className="flex items-center">
                <Checkbox
                  id="discount-only"
                  checked={showDiscountOnly}
                  onCheckedChange={setShowDiscountOnly}
                />
                <Label
                  htmlFor="discount-only"
                  className="ml-2 text-sm font-normal cursor-pointer"
                >
                  Chỉ hiển thị sản phẩm giảm giá
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mb-4">
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedBrands.length +
                      (priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh]">
              <SheetHeader>
                <SheetTitle>Bộ lọc</SheetTitle>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="absolute right-4 top-4"
                  >
                    <X className="mr-1 h-4 w-4" /> Xóa lọc
                  </Button>
                )}
              </SheetHeader>

              <div className="py-4 overflow-y-auto h-[calc(100%-10rem)]">
                {/* Brand filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Thương hiệu</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center">
                        <Checkbox
                          id={`mobile-brand-${brand.id}`}
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() => handleBrandChange(brand.id)}
                        />
                        <Label
                          htmlFor={`mobile-brand-${brand.id}`}
                          className="ml-2 text-sm font-normal cursor-pointer"
                        >
                          {brand.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price range filter in mobile sheet */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">
                    Giá: {formatPriceRange()}
                  </h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 50000000]}
                      value={[priceRange[0], priceRange[1]]}
                      max={50000000}
                      step={1000000}
                      onValueChange={handlePriceChange}
                      className="mb-4"
                      minStepsBetweenThumbs={1}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>

                  {/* Direct input for mobile */}
                  <div className="flex items-center gap-2 mt-4">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (
                          !isNaN(value) &&
                          value >= 0 &&
                          value < priceRange[1]
                        ) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="w-full h-8 text-xs"
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (
                          !isNaN(value) &&
                          value > priceRange[0] &&
                          value <= 50000000
                        ) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="w-full h-8 text-xs"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Discount filter in mobile sheet */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Giảm giá</h3>
                  <div className="flex items-center">
                    <Checkbox
                      id="mobile-discount-only"
                      checked={showDiscountOnly}
                      onCheckedChange={setShowDiscountOnly}
                    />
                    <Label
                      htmlFor="mobile-discount-only"
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      Chỉ hiển thị sản phẩm giảm giá
                    </Label>
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full">Áp dụng</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                  <SelectItem value="discount-desc">
                    Giảm giá: Cao đến thấp
                  </SelectItem>
                  <SelectItem value="name-asc">Tên: A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên: Z-A</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 rounded-r-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 rounded-l-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {selectedBrands.map((brandId) => {
                  const brand = brands.find((b) => b.id === brandId);
                  return brand ? (
                    <Badge
                      variant="outline"
                      key={brand.id}
                      className="flex items-center gap-1"
                    >
                      {brand.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleBrandChange(brand.id)}
                      />
                    </Badge>
                  ) : null;
                })}

                {(priceRange[0] > 0 || priceRange[1] < 50000000) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Giá: {formatPriceRange()}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setPriceRange([0, 50000000])}
                    />
                  </Badge>
                )}

                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Tìm kiếm: {searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}

                {showDiscountOnly && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Giảm giá
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setShowDiscountOnly(false)}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={
                      viewMode === "grid"
                        ? "border rounded-lg overflow-hidden"
                        : "border rounded-lg overflow-hidden flex flex-col sm:flex-row"
                    }
                  >
                    <Skeleton
                      className={
                        viewMode === "grid"
                          ? "w-full h-48"
                          : "w-full sm:w-48 h-48"
                      }
                    />
                    <div className="p-4 flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-5 w-1/3 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="mt-4 flex gap-2">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-muted mb-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-muted-foreground mb-6">
                Không có sản phẩm nào phù hợp với bộ lọc của bạn.
              </p>
              <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {sortedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden"
                  ref={
                    index === sortedProducts.length - 1
                      ? lastProductRef
                      : undefined
                  }
                >
                  <div
                    className={
                      viewMode === "list" ? "sm:w-48 relative" : "relative"
                    }
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block"
                      prefetch={true} // Prefetch the product detail page
                    >
                      <div
                        className={
                          viewMode === "list"
                            ? "h-48 relative"
                            : "aspect-square relative"
                        }
                      >
                        <Image
                          src={product.details.images?.[0] || "/laptop.png"}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                          priority={true} // Prioritize loading this image
                        />
                      </div>
                    </Link>

                    {/* Brand badge */}
                    {brands.find((b) => b.id === product.brand_id) && (
                      <Badge
                        className="absolute top-2 left-2 bg-white text-black border"
                        variant="outline"
                      >
                        {brands.find((b) => b.id === product.brand_id)?.name}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <CardContent
                      className={viewMode === "list" ? "p-4 pb-2" : "p-4"}
                    >
                      <Link
                        href={`/product/${product.id}`}
                        className="block"
                        prefetch={true} // Prefetch the product detail page
                      >
                        <h3 className="font-medium text-lg mb-1 hover:underline line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mb-2">
                        {product.default_price &&
                        product.default_price > product.price ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-red-500 font-medium line-through text-base">
                                {formatCurrency(product.default_price)}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(product.price)}
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              Tiết kiệm:{" "}
                              {formatCurrency(
                                product.default_price - product.price
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(product.price)}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.details?.description}
                      </p>

                      {/* Product features badges (viewMode: list only) */}
                      {viewMode === "list" &&
                        product.details?.specifications && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {product.details.specifications
                              .slice(0, 3)
                              .map((spec, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {spec.name}: {spec.value}
                                </Badge>
                              ))}
                          </div>
                        )}
                    </CardContent>

                    <CardFooter
                      className={
                        viewMode === "list" ? "p-4 pt-1 mt-auto" : "p-4 pt-0"
                      }
                    >
                      <div className="w-full flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Thêm vào giỏ
                        </Button>
                        <Button variant="outline" asChild>
                          <Link
                            href={`/product/${product.id}`}
                            prefetch={true} // Prefetch the product detail page
                          >
                            Chi tiết
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Đang tải thêm sản phẩm...</p>
            </div>
          )}

          {/* Load more button (alternative to infinite scroll) */}
          {canLoadMore && !isLoadingMore && (
            <div className="text-center py-8">
              <Button onClick={loadMoreProducts} variant="outline">
                Tải thêm sản phẩm (
                {(pagination?.total || 0) - paginatedProducts.length})
              </Button>
            </div>
          )}

          {/* Results info */}
          <div className="text-center text-sm text-muted-foreground mt-6">
            Hiển thị {paginatedProducts.length} / {pagination?.total || 0} sản
            phẩm
          </div>
        </div>
      </div>
    </div>
  );
}
