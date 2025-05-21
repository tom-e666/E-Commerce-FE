'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SmartSearchResponse } from '@/services/search/endpoints';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, ChevronRight, Home } from 'lucide-react';

export default function SmartSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SmartSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy kết quả tìm kiếm từ localStorage
    const storedResults = localStorage.getItem('searchResults');
    const storedQuery = localStorage.getItem('searchQuery');

    console.log('Current query:', query);
    console.log('Stored query:', storedQuery);
    console.log('Has stored results:', !!storedResults);

    // Luôn hiển thị kết quả từ localStorage nếu có
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        console.log('Parsed search results from localStorage:', parsedResults);
        console.log('Products found:', parsedResults.products?.length || 0);
        console.log('Search result code:', parsedResults.code);
        console.log('Search result message:', parsedResults.message);

        // Kiểm tra xem kết quả có hợp lệ không
        if (parsedResults && typeof parsedResults === 'object') {
          // Đảm bảo rằng products là một mảng
          if (!Array.isArray(parsedResults.products)) {
            parsedResults.products = [];
          }

          // Log chi tiết về sản phẩm đầu tiên nếu có
          if (parsedResults.products && parsedResults.products.length > 0) {
            console.log('First product details:', parsedResults.products[0]);
          }

          setSearchResults(parsedResults);
        } else {
          throw new Error('Invalid search results format');
        }
      } catch (error) {
        console.error('Error parsing search results:', error);
        // Tạo kết quả tìm kiếm mặc định trong trường hợp lỗi
        setSearchResults({
          code: 500,
          message: 'Có lỗi xảy ra khi tìm kiếm',
          products: [],
          total: 0,
          filters: {
            brands: [],
            categories: [],
            price_range: { min: 0, max: 0 }
          },
          metadata: {
            original_query: query,
            interpreted_query: query,
            processing_time_ms: 0
          }
        });
      }
    } else if (query) {
      // Nếu không có kết quả trong localStorage nhưng có query, hiển thị thông báo
      console.log('No stored results for query:', query);
      setSearchResults({
        code: 404,
        message: 'Không tìm thấy kết quả',
        products: [],
        total: 0,
        filters: {
          brands: [],
          categories: [],
          price_range: { min: 0, max: 0 }
        },
        metadata: {
          original_query: query,
          interpreted_query: query,
          processing_time_ms: 0
        }
      });
    }

    setLoading(false);
  }, [query]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className='flex text-black'>
              <Home className="h-5 w-5 mr-1" />
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4 text-black" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/smartSearch" className='text-black'>Tìm kiếm</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tiêu đề trang */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Kết quả tìm kiếm</h1>
        <p className="text-gray-600">
          {query ? (
            <>
              Kết quả tìm kiếm cho <span className="font-semibold">"{query}"</span>
            </>
          ) : (
            'Vui lòng nhập từ khóa tìm kiếm'
          )}
        </p>
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {!searchResults ? (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không có kết quả tìm kiếm</AlertTitle>
              <AlertDescription>
                Không tìm thấy kết quả tìm kiếm. Vui lòng thử lại với từ khóa khác.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Debug log */}
              {/* Hiển thị metadata */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Tìm thấy {searchResults.total} kết quả cho "{query}"
                  {searchResults.metadata && searchResults.metadata.interpreted_query !== searchResults.metadata.original_query && (
                    <> (đã hiểu là "{searchResults.metadata.interpreted_query}")</>
                  )}
                  {searchResults.metadata && searchResults.metadata.processing_time_ms && (
                    <> trong {searchResults.metadata.processing_time_ms}ms</>
                  )}
                </p>
              </div>

              {/* Hiển thị bộ lọc nếu có */}
              {searchResults.filters.brands && searchResults.filters.brands.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Thương hiệu</h2>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.filters.brands.map(brand => (
                      <Badge key={brand.id} variant="outline" className="px-3 py-1">
                        {brand.name} ({brand.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiển thị sản phẩm */}
              {/* Kiểm tra xem searchResults.products có phải là mảng không */}
              {Array.isArray(searchResults.products) && searchResults.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {searchResults.products.map(product => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                      <div className="relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <Image
                            src={product.details?.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-product.jpg";
                            }}
                          />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-blue-600 z-10">
                          {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors text-lg">
                          <Link href={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 flex-grow">
                        <p className="text-red-600 font-semibold text-lg">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-3 mt-2">
                          {product.details?.description || 'Không có mô tả'}
                        </p>

                        {/* Hiển thị thông tin thêm */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          {product.brand_id && (
                            <p className="text-xs text-gray-500 mb-1">
                              <span className="font-medium">Thương hiệu:</span> {product.brand_id}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mb-1">
                            <span className="font-medium">Tình trạng:</span> {product.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Kho:</span> {product.stock} sản phẩm
                          </p>
                        </div>

                        {/* Hiển thị specifications nếu có */}
                        {product.details?.specifications && product.details.specifications.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-700 mb-1">Thông số kỹ thuật:</p>
                            <ul className="text-xs text-gray-500">
                              {product.details.specifications.slice(0, 3).map((spec, index) => (
                                <li key={index} className="mb-0.5">
                                  <span className="font-medium">{spec.name}:</span> {spec.value}
                                </li>
                              ))}
                              {product.details.specifications.length > 3 && (
                                <li className="text-blue-500">+ {product.details.specifications.length - 3} thông số khác</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 mt-auto">
                        <Button asChild variant="default" size="sm" className="w-full">
                          <Link href={`/product/${product.id}`} className="flex items-center justify-center">
                            Xem chi tiết <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Không tìm thấy sản phẩm</AlertTitle>
                  <AlertDescription>
                    Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}". Vui lòng thử lại với từ khóa khác.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </>
      )}

      {/* Debug: Hiển thị dữ liệu JSON */}
    
    </div>
  );
}
