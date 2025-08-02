'use client'
import { useProduct } from "@/hooks/useProduct"
import { useEffect, useState, useRef } from "react";
// import { toast } from "@/lib/toast-config";
import { HiOutlineArrowRight } from 'react-icons/hi2'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const urlImg = [
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748539875/acer_nitro_v15_xoflkj.webp',
    alt: 'Laptop Gaming Acer Nitro V15 - Hiệu năng mạnh mẽ cho game thủ',
    title: 'Laptop Gaming Acer Nitro V15',
    description: 'Trải nghiệm gaming đỉnh cao với laptop Acer Nitro V15'
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748537890/banner_maytinh_3_fp955z.jpg',
    alt: 'Bộ sưu tập máy tính gaming chất lượng cao tại EMS Electronics',
    title: 'Máy Tính Gaming Chất Lượng Cao',
    description: 'Khám phá bộ sưu tập máy tính gaming với cấu hình mạnh mẽ'
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748537889/bannermaytinh_okzxue.webp',
    alt: 'Laptop văn phòng và gaming đa dạng với giá tốt nhất',
    title: 'Laptop Đa Dạng - Giá Tốt Nhất',
    description: 'Tìm kiếm laptop phù hợp với nhu cầu và ngân sách của bạn'
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748537888/bannermatinh2_xyosjk.webp',
    alt: 'Khuyến mãi đặc biệt laptop gaming và máy tính tại EMS',
    title: 'Khuyến Mãi Đặc Biệt',
    description: 'Ưu đãi hấp dẫn cho laptop gaming và máy tính chính hãng'
  },
]

const awards = [
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_1_fe08b5b4cd.svg',
    alt: 'Giải thưởng chất lượng sản phẩm EMS Electronics',
    title: 'Chất Lượng Xuất Sắc'
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_2_959a72e121.svg',
    alt: 'Giải thưởng dịch vụ khách hàng tốt nhất',
    title: 'Dịch Vụ Tốt Nhất'
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_3_298d151332.svg',
    alt: 'Giải thưởng cửa hàng uy tín hàng đầu',
    title: 'Cửa Hàng Uy Tín'
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_4_271868f252.svg',
    alt: 'Giải thưởng sự hài lòng của khách hàng',
    title: 'Khách Hàng Hài Lòng'
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_5_83186cbade.svg',
    alt: 'Giải thưởng đổi mới và sáng tạo',
    title: 'Đổi Mới Sáng Tạo'
  },
]

const imagePairs = [
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538335/asus_g614jv_jjzvhq.jpg',
    alt: 'Laptop ASUS ROG Strix G16 - Gaming laptop cao cấp',
    title: 'ASUS ROG Strix G16',
    description: 'Laptop gaming cao cấp cho game thủ chuyên nghiệp'
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538492/asusrogstrixg16g614jv3_a5cbfh.jpg',
    alt: 'Chi tiết laptop ASUS ROG Strix G16 - Thiết kế gaming đẳng cấp',
    title: 'ASUS ROG Strix G16 - Chi Tiết',
    description: 'Khám phá thiết kế gaming đẳng cấp và hiệu năng vượt trội'
  },
]

interface ProductSpecification {
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  default_price: number;
  details?: {
    specifications?: ProductSpecification[];
    images?: string[];
  };
}

export interface BaseResponse {
  code: number;
  message: string;
}

export interface ProductResponse extends BaseResponse {
  product: Product;
}

type GetProductResponse = Product | ProductResponse | { code: number; message: string; product: null } | null | undefined;


const MainPageComponent = () => {
  const { products, getPaginatedProducts, pagination, getProduct } = useProduct();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [largeProducts, setLargeProducts] = useState<Product[]>([]);

  const extractProduct = (response: GetProductResponse): Product | null => {
    if (!response || typeof response !== 'object') return null;
    
    // If it's a ProductResponse with a product property
    if ('product' in response && response.product) {
      return response.product;
    }
    
    // If it's already a Product (has required properties)
    if ('id' in response && 'name' in response && 'price' in response) {
      return response as Product;
    }
    
    return null;
  };
  
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await getPaginatedProducts();
        
        if (pagination && pagination.total > 0) {
          const totalProducts = pagination.total;
          const randomCount = Math.min(8, totalProducts);
          const randomIndices = new Set<number>();

          while (randomIndices.size < randomCount) {
            const randomIndex = Math.floor(Math.random() * totalProducts);
            randomIndices.add(randomIndex);
          }

          const randomProductPromises = Array.from(randomIndices).map(index => 
            getProduct((index + 1).toString())
          );
          
          const randomProducts = await Promise.all(randomProductPromises);
          
        const validProducts: Product[] = randomProducts
          .map(extractProduct)
          .filter((product): product is Product => product !== null);
          
          setFeaturedProducts(validProducts);

          // const largeID = Math.floor(Math.random() * totalProducts) + 1;
          const largeID = 6; // Fixed ID for large product
          const largeProductResponse = await getProduct(largeID.toString());
          const largeProduct = extractProduct(largeProductResponse);
          setLargeProducts(largeProduct ? [largeProduct] : []);
        }
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };

    loadFeaturedProducts();
  }, [getPaginatedProducts, getProduct, pagination]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const isMounted = useRef(true);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -516,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 516,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
      return () => {
          isMounted.current = false;
      };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % urlImg.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='flex flex-col bg-gradient-to-b from-purple-700 to-blue-800'>
      {/* Hero Section with SEO optimized content */}
      <section className='h-full w-full cursor-pointer relative overflow-hidden' aria-label="Banner khuyến mãi và sản phẩm nổi bật">
        <div className='relative h-[600px]'>
          {urlImg.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {index === 0 ? (
                <Link href="/product/20" className="block h-full w-full" aria-label={`Xem chi tiết ${item.title}`}>
                  <div className='relative h-full overflow-hidden'>
                    <Image
                      src={item.img}
                      alt={item.alt}
                      title={item.title}
                      fill
                      className='object-cover brightness-90'
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 100vw"
                    />
                    <div className='absolute inset-0 bg-green-600 opacity-10'></div>
                    <div className='absolute bottom-15 left-1/2 -translate-x-1/2 transform text-center'>
                      <h1 className='rounded-lg bg-green-800/30 px-8 py-4 text-8xl font-semibold text-white shadow-lg backdrop-blur-[1px] md:text-4xl'>
                        Công Nghệ Hàng Đầu <br />
                        <span className='text-3xl font-light text-white italic'>
                          Dẫn Đầu Xu Hướng - Vượt Trội Hiệu Suất
                        </span>
                      </h1>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='relative h-full overflow-hidden'>
                  <Image
                    src={item.img}
                    alt={item.alt}
                    title={item.title}
                    fill
                    className='object-cover brightness-90'
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                  <div className='absolute inset-0 bg-green-600 opacity-10'></div>
                  <div className='absolute bottom-15 left-1/2 -translate-x-1/2 transform text-center'>
                    <h2 className='rounded-lg bg-green-800/30 px-8 py-4 text-8xl font-semibold text-white shadow-lg backdrop-blur-[1px] md:text-4xl'>
                      {index === 1 ? (
                        <>
                          Chất Lượng Đỉnh Cao <br />
                          <span className='text-3xl font-light text-white italic'>
                            Từ những thương hiệu uy tín toàn cầu
                          </span>
                        </>
                      ) : index === 2 ? (
                        <>
                          Laptop Đa Dạng - Giá Tốt Nhất <br />
                          <span className='text-3xl font-light text-white italic'>
                            {item.description}
                          </span>
                        </>
                      ) : (
                        <>
                          Khuyến Mãi Đặc Biệt <br />
                          <span className='text-3xl font-light text-white italic'>
                            {item.description}
                          </span>
                        </>
                      )}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2' role="tablist" aria-label="Điều hướng banner">
          {urlImg.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              role="tab"
              aria-selected={currentSlide === index}
              aria-label={`Chuyển đến slide ${index + 1}: ${item.title}`}
            />
          ))}
        </div>
      </section>

      {/* Awards Section with SEO optimized content */}
      <section className='grid grid-cols-5 bg-blue-900 md:grid-cols-5 py-4' aria-label="Giải thưởng và chứng nhận">
        <h2 className="sr-only">Giải thưởng và chứng nhận chất lượng EMS Electronics</h2>
        {awards.map((item, index) => (
          <div key={index} className='col-span-1 flex justify-center items-center'>
            <Image 
              src={item.img} 
              alt={item.alt} 
              title={item.title}
              width={90} 
              height={100} 
              className='h-25 w-90 object-contain'
            />
          </div>
        ))}
      </section>

      {/* Promotion Section with SEO optimized content */}
      <section className='relative flex w-full h-[600px]' aria-label="Sản phẩm khuyến mãi đặc biệt">
        <h2 className="sr-only">Sản phẩm laptop gaming khuyến mãi đặc biệt</h2>
        {imagePairs.map((item, index) => (
          <div key={index} className='w-1/2 h-full relative group'>
            <Image 
              src={item.img} 
              alt={item.alt}
              title={item.title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
              <div className='text-center text-white'>
                <h3 className='text-3xl font-bold mb-2'>{item.title}</h3>
                <p className='text-lg opacity-90'>{item.description}</p>
                <Link 
                  href="/product" 
                  className='inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300'
                >
                  Khám Phá Ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className='absolute inset-0 left-1/2 flex flex-col items-center justify-center text-white'>
          <div className='rounded-lg bg-gray-900/90 p-10 text-center text-white shadow-2xl backdrop-blur-sm'>
            <h2 className='text-shadow mb-6 text-7xl font-bold tracking-wider text-cyan-400'>
              Mới! <br />
              Mới! <br />
              Mới!
            </h2>
            <div className='text-shadow flex w-96 cursor-pointer items-center justify-between text-2xl'>
              <Link href="/product/36" className='font-mono text-cyan-300 tracking-wider hover:text-cyan-400 transition-colors'>
                Asus ROG Strix G16
              </Link>
              <HiOutlineArrowRight className='mt-2 h-6 w-8 text-cyan-400' />
            </div>
            <hr className='mt-2 w-96 border-cyan-400/50 px-2' />
          </div>
        </div>
      </section>

      {/* Featured Products Section with SEO optimized content */}
      <section className='mt-10' aria-labelledby="featured-products-heading">
        <div className='flex w-full flex-col items-center justify-center p-10 text-white'>
          <h2 id="featured-products-heading" className='text-5xl font-semibold mb-4'>Sản phẩm nổi bật</h2>
          <p className='text-xl text-gray-300 text-center mb-8'>Khám phá những sản phẩm laptop gaming được yêu thích nhất</p>

          <div className='mt-12 w-full relative'>
            <div 
              ref={carouselRef}
              className='w-full overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
              role="region"
              aria-label="Danh sách sản phẩm nổi bật"
            >
              <div className='flex min-w-max gap-6'>
                {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                  <article 
                    key={product.id}
                    className='group h-[285px] w-[510px] flex-none cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative snap-start'
                  >
                    <Link 
                      href={`/product/${product.id}`}
                      aria-label={`Xem chi tiết ${product.name}`}
                      className="block h-full w-full"
                    >
                      <Image
                        src={product.details?.images?.[1] || product.details?.images?.[0] || '/placeholder-image.jpg'}
                        alt={`${product.name} - Laptop gaming chất lượng cao`}
                        title={product.name}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-110'
                        sizes='510px'
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20'>
                        <h3 className='text-lg font-medium text-white'>{product.name || 'Tên sản phẩm'}</h3>
                        <p className='text-sm text-gray-300'>
                          {product.details?.specifications?.find((spec: ProductSpecification) => spec.name === 'CPU')?.value || 'Thông số kỹ thuật'}
                        </p>
                        <div className='mt-2 flex items-center justify-between'>
                          <span className='text-yellow-400 font-semibold'>
                            {product.price ? new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(product.price) : 'Liên hệ'}
                          </span>
                          <span className='text-xs bg-blue-600 px-2 py-1 rounded'>Xem chi tiết</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                )) : (
                  Array.from({ length: 8 }).map((_, index) => (
                    <div 
                      key={index}
                      className='h-[285px] w-[510px] flex-none bg-gray-300 animate-pulse rounded-lg'
                      role="presentation"
                      aria-label="Đang tải sản phẩm"
                    >
                      <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg flex items-center justify-center'>
                        <span className='text-gray-500'>Đang tải...</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <button 
              onClick={scrollLeft}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 z-30 hover:bg-black/80 transition-all'
              aria-label="Xem sản phẩm trước đó"
              type="button"
            >
              <ChevronLeftIcon className='h-6 w-6 text-white' />
            </button>
            <button 
              onClick={scrollRight}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 z-30 hover:bg-black/80 transition-all'
              aria-label="Xem sản phẩm tiếp theo"
              type="button"
            >
              <ChevronRightIcon className='h-6 w-6 text-white' />
            </button>
          </div>

          <div className='flex w-full justify-center'>
            <hr className='mt-1 w-full rounded-full border-4 border-white font-bold' />
          </div>
        </div>
      </section>

      {/* Business Computers Section */}
      <section className='mt-5 mb-5 flex flex-col items-center justify-center' aria-labelledby="business-computers-heading">
        <div className='mb-4 flex w-full flex-col justify-between gap-6 p-4 text-white md:flex-row md:p-10'>
          <div>
            <h2 id="business-computers-heading" className='text-3xl font-semibold md:text-5xl'>
              Máy tính <br className='hidden md:block' /> doanh nghiệp
            </h2>
          </div>
          <div>
            <p className='p-2 text-lg italic md:p-4 md:text-xl'>
              Hiệu suất vượt trội, bảo mật tối ưu <br className='hidden md:block' /> 
              Giải pháp hoàn hảo cho môi trường làm việc chuyên nghiệp
            </p>
          </div>
        </div>

        <div className='w-full px-4 md:px-10'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <article className='relative h-[400px] overflow-hidden rounded-2xl md:h-[570px]'>
              <Link href={`/product/${largeProducts[0]?.id || '6'}`} aria-label={`Xem chi tiết ${largeProducts[0]?.name || 'máy tính doanh nghiệp'}`}>
                <div className='group relative h-full w-full'>
                  <Image
                    src={largeProducts[0]?.details?.images?.[0] || products.find(p => p.id === '6')?.details?.images?.[0] || 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538335/asus_g614jv_jjzvhq.jpg'}
                    alt={`${largeProducts[0]?.name || 'Máy tính doanh nghiệp'} - Giải pháp công nghệ cho doanh nghiệp`}
                    title={largeProducts[0]?.name || 'Máy tính doanh nghiệp'}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                    sizes='(max-width: 768px) 100vw, 50vw'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='absolute bottom-4 left-4 text-white md:bottom-8 md:left-8'>
                      <h3 className='mb-2 text-2xl font-bold md:mb-4 md:text-4xl'>
                        {largeProducts[0]?.name || products.find(p => p.id === '6')?.name || 'Dell OptiPlex 7000'}
                      </h3>
                      <p className='mb-2 text-base text-purple-200 md:mb-4 md:text-xl'>
                        Hiệu suất mạnh mẽ - Thiết kế tinh tế
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        <span className='rounded-full bg-purple-500/20 px-3 py-1 text-xs backdrop-blur-sm md:px-4 md:py-2 md:text-sm'>
                          Doanh nghiệp
                        </span>
                        <span className='rounded-full bg-purple-500/20 px-3 py-1 text-xs backdrop-blur-sm md:px-4 md:py-2 md:text-sm'>
                          Cao cấp
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>

            <article className='flex flex-col justify-between gap-6'>
              <div className='rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white md:p-8'>
                <h3 className='mb-4 text-xl font-bold text-purple-300 md:mb-6 md:text-2xl'>Thông số nổi bật</h3>
                <div className='space-y-3 md:space-y-4'>
                  {(() => {
                    const product = largeProducts[0] || products.find(p => p.id === '6');
                    const specs = product?.details?.specifications?.slice(0, 6);
                    
                    if (specs && specs.length > 0) {
                      return specs.map((spec: ProductSpecification, index: number) => (
                        <div key={index} className='flex justify-between items-center border-b border-gray-600 pb-2'>
                          <span className='text-sm text-gray-300 font-medium md:text-base'>{spec.name}:</span>
                          <span className='text-sm text-white font-semibold text-right max-w-[150px] truncate md:text-base md:max-w-[200px]'>
                            {spec.value}
                          </span>
                        </div>
                      ));
                    }
                    
                    const fallbackSpecs = [
                      { name: 'CPU', value: product?.details?.specifications?.find((spec: ProductSpecification) => spec.name === 'CPU')?.value || 'Intel Core i7-13700' },
                      { name: 'RAM', value: product?.details?.specifications?.find((spec: ProductSpecification) => spec.name === 'RAM')?.value || '16GB DDR4' },
                      { name: 'Storage', value: product?.details?.specifications?.find((spec: ProductSpecification) => spec.name === 'Storage')?.value || '512GB SSD' },
                      { name: 'GPU', value: product?.details?.specifications?.find((spec: ProductSpecification) => spec.name === 'GPU')?.value || 'Intel UHD Graphics' }
                    ];
                    
                    return fallbackSpecs.map((spec, index) => (
                      <div key={index} className='flex justify-between items-center border-b border-gray-600 pb-2'>
                        <span className='text-sm text-gray-300 font-medium md:text-base'>{spec.name}:</span>
                        <span className='text-sm text-white font-semibold md:text-base'>{spec.value}</span>
                      </div>
                    ));
                  })()}
                </div>
                
                <div className='mt-4 pt-4 border-t border-gray-600 md:mt-6 md:pt-6'>
                  <div className='flex items-center justify-between mb-3 md:mb-4'>
                    {(() => {
                      const product = largeProducts[0] || products.find(p => p.id === '6');
                      const currentPrice = product?.price || 25990000;
                      const defaultPrice = product?.default_price;
                      
                      return (
                        <div className='flex flex-col space-y-1'>
                          <div className='flex items-center space-x-2'>
                            <span className='text-xl font-bold text-green-400 md:text-2xl'>
                              {currentPrice.toLocaleString('vi-VN')}₫
                            </span>
                            {defaultPrice && defaultPrice > currentPrice && (
                              <span className='bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold md:px-3 md:text-sm'>
                                -{Math.round(((defaultPrice - currentPrice) / defaultPrice) * 100)}%
                              </span>
                            )}
                          </div>
                          
                          {defaultPrice && defaultPrice > currentPrice && (
                            <div className='flex items-center space-x-3'>
                              <span className='text-sm text-gray-400 line-through md:text-base'>
                                {defaultPrice.toLocaleString('vi-VN')}₫
                              </span>
                              <span className='text-xs text-green-300 font-medium md:text-sm'>
                                Tiết kiệm: {(defaultPrice - currentPrice).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className='space-y-1 md:space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-1.5 h-1.5 bg-green-400 rounded-full md:w-2 md:h-2'></div>
                      <span className='text-xs text-gray-300 md:text-sm'>Bảo hành 36 tháng</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-1.5 h-1.5 bg-green-400 rounded-full md:w-2 md:h-2'></div>
                      <span className='text-xs text-gray-300 md:text-sm'>Hỗ trợ trả góp 0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className='mt-6 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-purple-900 to-blue-900 p-6 text-white md:mt-8 md:flex-row md:p-8'>
            <div className='max-w-2xl'>
              <h3 className='mb-3 text-2xl font-bold md:mb-4 md:text-3xl'>Khám phá bộ sưu tập máy tính cao cấp</h3>
              <p className='mb-4 text-base text-purple-200 md:mb-6 md:text-lg'>
                Nâng tầm trải nghiệm công việc với công nghệ tiên tiến nhất
              </p>
              <Link 
                href="/product"
                className='inline-flex items-center space-x-2 rounded-full bg-white px-4 py-2 text-sm text-purple-900 transition-colors hover:bg-purple-100 md:px-6 md:py-3 md:text-base'
              >
                <span>Xem tất cả</span>
                <HiOutlineArrowRight className='h-4 w-4 md:h-5 md:w-5' />
              </Link>
            </div>
            <div className='flex flex-col items-center justify-center space-y-3 md:space-y-4'>
              <div className='text-center'>
                <span className='block text-4xl font-bold text-yellow-400 drop-shadow-lg md:text-6xl'>0%</span>
                <span className='block text-xl font-semibold text-white tracking-wider md:text-2xl'>LÃI SUẤT</span>
              </div>
              <div className='text-center'>
                <p className='text-base text-purple-200 md:text-lg'>Hỗ trợ trả góp</p>
                <p className='text-base text-purple-200 md:text-lg'>lên đến 24 tháng</p>
              </div>
              <div className='mt-2 rounded-full bg-yellow-400/20 px-4 py-1 backdrop-blur-sm md:mt-4 md:px-6 md:py-2'>
                <span className='text-xs font-medium text-yellow-400 md:text-sm'>Duyệt nhanh 15 phút</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MainPageComponent