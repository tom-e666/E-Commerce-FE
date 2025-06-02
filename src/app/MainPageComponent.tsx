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
    alt: 'image1',
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748537890/banner_maytinh_3_fp955z.jpg',
    alt: 'image2',
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748537889/bannermaytinh_okzxue.webp',
    alt: 'image3',
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748537888/bannermatinh2_xyosjk.webp',
    alt: 'image4',
  },
]

const awards = [
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_1_fe08b5b4cd.svg',
    alt: 'Quality award',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_2_959a72e121.svg',
    alt: 'Quality award',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_3_298d151332.svg',
    alt: 'Quality award',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_4_271868f252.svg',
    alt: 'Customer satisfaction award',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/award_5_83186cbade.svg',
    alt: 'Innovation award',
  },
]

const imagePairs = [
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538335/asus_g614jv_jjzvhq.jpg',
    alt: 'Promotion 1',
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538492/asusrogstrixg16g614jv3_a5cbfh.jpg',
    alt: 'Promotion 2',
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
  details?: {
    specifications?: ProductSpecification[];
    images?: string[];
  };
}

const MainPageComponent = () => {
  const { products, getPaginatedProducts, pagination, getProduct } = useProduct();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [largeProducts, setLargeProducts] = useState<Product[]>([]);
  
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
          
          const validProducts = randomProducts.filter(product => 
            product && product.details && product.details.images && product.details.images.length > 0
          );
          
          setFeaturedProducts(validProducts);

          // const largeID = Math.floor(Math.random() * totalProducts) + 1;
          const largeID = 6; // Sử dụng ID cố định cho sản phẩm lớn
          const largeProduct = await getProduct(largeID.toString());
          setLargeProducts([largeProduct]);
        }
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };

    loadFeaturedProducts();
  }, [pagination]);

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
      <div className='h-full w-full cursor-pointer relative overflow-hidden'>
        <div className='relative h-[600px]'>
          {urlImg.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {index === 0 ? (
                <Link href="/product/20" className="block h-full w-full">
                  <div className='relative h-full overflow-hidden'>
                    <Image
                      src={item.img}
                      alt={item.alt}
                      fill
                      className='object-cover brightness-90'
                    />
                    <div className='absolute inset-0 bg-green-600 opacity-10'></div>
                    <div className='absolute bottom-15 left-1/2 -translate-x-1/2 transform text-center'>
                      <p className='rounded-lg bg-green-800/30 px-8 py-4 text-8xl font-semibold text-white shadow-lg backdrop-blur-[1px] md:text-4xl'>
                        Công Nghệ Hàng Đầu <br />
                        <span className='text-3xl font-light text-white italic'>
                          Dẫn Đầu Xu Hướng - Vượt Trội Hiệu Suất
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='relative h-full overflow-hidden'>
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className='object-cover brightness-90'
                  />
                  <div className='absolute inset-0 bg-green-600 opacity-10'></div>
                  <div className='absolute bottom-15 left-1/2 -translate-x-1/2 transform text-center'>
                    <p className='rounded-lg bg-green-800/30 px-8 py-4 text-8xl font-semibold text-white shadow-lg backdrop-blur-[1px] md:text-4xl'>
                      {index === 1 ? (
                        <>
                          Chất Lượng Đỉnh Cao <br />
                          <span className='text-3xl font-light text-white italic'>
                            Từ những thương hiệu uy tín toàn cầu
                          </span>
                        </>
                      ) : (
                        <>
                          Khám Phá Thế Giới Công Nghệ – Trải Nghiệm Không Giới Hạn <br />
                          <span className='text-3xl font-light text-white italic'>
                            Khám phá ngay
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2'>
          {urlImg.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className='grid grid-cols-5 bg-blue-900 md:grid-cols-5'>
        {awards.map((item, index) => (
          <div key={index} className='col-span-1'>
            <Image src={item.img} alt={item.alt} width={90} height={100} className='h-25 w-90' />
          </div>
        ))}
      </div>

      <div className='relative flex w-full h-[600px]'>
        {imagePairs.map((item, index) => (
          <div key={index} className='w-1/2 h-full relative'>
            <Image 
              src={item.img} 
              alt={item.alt} 
              fill
              className='object-cover'
            />
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
      </div>

      <div className='mt-10'>
        <div className='flex w-full flex-col items-center justify-center p-10 text-white'>
          <p className='text-5xl font-semibold'>Sản phẩm nổi bật</p>

          <div className='mt-12 w-full relative'>
            <div 
              ref={carouselRef}
              className='w-full overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
            >
              <div className='flex min-w-max gap-6'>
                {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                  <Link 
                    href={`/product/${product.id}`} 
                    key={product.id}
                    className='group h-[285px] w-[510px] flex-none cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative snap-start'
                  >
                    <Image
                      src={product.details?.images?.[1] || product.details?.images?.[0] || '/placeholder-image.jpg'}
                      alt={product.name || 'Product image'}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-110'
                      sizes='510px'
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20'>
                      <p className='text-lg font-medium text-white'>{product.name || 'Tên sản phẩm'}</p>
                      <p className='text-sm text-gray-300'>
                        {product.details?.specifications?.find(spec => spec.name === 'CPU')?.value || 'Thông số kỹ thuật'}
                      </p>
                    </div>
                  </Link>
                )) : (
                  Array.from({ length: 8 }).map((_, index) => (
                    <div 
                      key={index}
                      className='h-[285px] w-[510px] flex-none bg-gray-300 animate-pulse rounded-lg'
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
            >
              <ChevronLeftIcon className='h-6 w-6 text-white' />
            </button>
            <button 
              onClick={scrollRight}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 z-30 hover:bg-black/80 transition-all'
            >
              <ChevronRightIcon className='h-6 w-6 text-white' />
            </button>
          </div>

          <div className='flex w-full justify-center'>
            <hr className='mt-1 w-full rounded-full border-4 border-white font-bold' />
          </div>
        </div>
      </div>

      <div className='mt-5 mb-5 flex flex-col items-center justify-center'>
        <div className='mb-4 flex w-full flex-col justify-between gap-6 p-4 text-white md:flex-row md:p-10'>
          <p className='text-3xl font-semibold md:text-5xl'>
            Máy tính <br className='hidden md:block' /> doanh nghiệp
          </p>
          <p className='p-2 text-lg italic md:p-4 md:text-xl'>
            Hiệu suất vượt trội, bảo mật tối ưu <br className='hidden md:block' /> Giải pháp hoàn hảo cho môi trường làm việc chuyên nghiệp
          </p>
        </div>

        <div className='w-full px-4 md:px-10'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='relative h-[400px] overflow-hidden rounded-2xl md:h-[570px]'>
              <Link href={`/product/${largeProducts[0]?.id || '6'}`}>
                <div className='group relative h-full w-full'>
                  <Image
                    src={largeProducts[0]?.details?.images?.[0] || products.find(p => p.id === '6')?.details?.images?.[0] || 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538335/asus_g614jv_jjzvhq.jpg'}
                    alt="Office Computer"
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
            </div>

            <div className='flex flex-col justify-between gap-6'>
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
                      { name: 'CPU', value: product?.details?.specifications?.find(spec => spec.name === 'CPU')?.value || 'Intel Core i7-13700' },
                      { name: 'RAM', value: product?.details?.specifications?.find(spec => spec.name === 'RAM')?.value || '16GB DDR4' },
                      { name: 'Storage', value: product?.details?.specifications?.find(spec => spec.name === 'Storage')?.value || '512GB SSD' },
                      { name: 'GPU', value: product?.details?.specifications?.find(spec => spec.name === 'GPU')?.value || 'Intel UHD Graphics' }
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
            </div>
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
      </div>
    </div>
  )
}

export default MainPageComponent