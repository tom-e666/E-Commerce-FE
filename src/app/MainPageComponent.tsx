'use client'
import ParallaxProductGrid from "@/components/ui/Parallax";
import { useProduct } from "@/hooks/useProduct"
import { useEffect, useState, useMemo, useRef } from "react";
import { addToCart as addToCartAPI } from "@/services/cart/endpoint";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/lib/toast-config";
import { HiOutlineArrowRight } from 'react-icons/hi2'
import Link from 'next/link'

// Fisher-Yates shuffle algorithm for randomizing products
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

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

const promotion = [
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/Cautien_2_4aef1fd870.webp',
    alt: 'Promotion 1',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/Cautien_3_f42cd34695.webp',
    alt: 'Promotion 2',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/Cautien_5_18c522f89e.webp',
    alt: 'Promotion 3',
  },
  {
    img: 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1747605194/b%C3%B2_cyqsof.jpg',
    alt: 'Promotion 2',
  },
]

const action = [
  {
    number: '01',
    title: "Mảnh ghép mới trong hệ thống nhà máy 'xanh'",
    content:
      'Trước thềm Đại hội đồng cổ đông thường niên 2024, MilkStore công bố Nhà máy Nước giải khát Việt Nam đạt trung hòa Carbon theo tiêu chuẩn quốc tế PAS.',
    image:
      'https://d8um25gjecm9v.cloudfront.net/store-front-cms/De_tam_hanh_dong_1_bb1abfa116.png',
    alt: 'Nhà máy xanh',
  },
  {
    number: '02',
    title: '3 đơn vị đạt chứng nhận về trung hòa Carbon',
    content:
      'MilkStore đang sở hữu 2 nhà máy và 1 trang trại đạt chứng nhận về trung hòa Carbon, cho thấy những bước tiến quyết liệt trên con đường tiến đến mục tiêu Net Zero vào năm 2050.',
    image:
      'https://d8um25gjecm9v.cloudfront.net/store-front-cms/De_tam_hanh_dong_2_4aa913b700.png',
    alt: 'Chứng nhận Carbon',
  },
  {
    number: '03',
    title: 'Cam kết và Lộ trình tiến đến Net Zero vào năm 2050',
    content:
      'Tiên phong về phát triển bền vững, MilkStore đặt mục tiêu cắt giảm 15% phát thải khí nhà kính vào 2027, 55% vào năm 2035 và tiến đến phát thải ròng bằng 0 vào năm 2050.',
    image:
      'https://d8um25gjecm9v.cloudfront.net/store-front-cms/De_tam_hanh_dong_3_d9f4b80a79.png',
    alt: 'Lộ trình Net Zero',
  },
]

const horizontalImages = [
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/New_2_51cba411a8.webp',
    alt: 'Product 1',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/Cautien_2_4aef1fd870.webp',
    alt: 'Product 2',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/Cautien_3_f42cd34695.webp',
    alt: 'Product 3',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/Cautien_5_18c522f89e.webp',
    alt: 'Product 4',
  },
  {
    img: 'https://d8um25gjecm9v.cloudfront.net/store-front-cms/New_2_51cba411a8.webp',
    alt: 'Product 5',
  },
]

const MainPageComponent = () => {
  const { products, getProducts } = useProduct();
  const { isAuthenticated } = useAuthContext();
  const [shuffleKey, setShuffleKey] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
  }, [getProducts]);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % urlImg.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const addToCart = async (id: string) => {
      if (!isAuthenticated) {
          toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
          return;
      }
      
      // Using the new toast utility with proper configuration
      toast.promise(
          addToCartAPI(id),
          {
              loading: "Đang thêm sản phẩm vào giỏ hàng...",
              success: "Thêm sản phẩm vào giỏ hàng thành công",
              error: "Không thể thêm sản phẩm vào giỏ hàng"
          }
      );
  };

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
                    <img
                      src={item.img}
                      alt={item.alt}
                      className='h-full w-full object-cover brightness-90'
                    />
                    <div className='absolute inset-0 bg-green-600 opacity-10'></div>
                    <div className='absolute bottom-15 left-1/2 -translate-x-1/2 transform text-center'>
                      <p className='rounded-lg bg-green-800/30 px-8 py-4 text-8xl font-semibold text-white shadow-lg backdrop-blur-[1px] md:text-4xl'>
                        Luôn vắt tươi ngon <br />
                        <span className='text-3xl font-light text-white italic'>
                          từ 5 trang trại xanh toàn quốc
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='relative h-full overflow-hidden'>
                  <img
                    src={item.img}
                    alt={item.alt}
                    className='h-full w-full object-cover brightness-90'
                  />
                  <div className='absolute inset-0 bg-green-600 opacity-10'></div>
                  <div className='absolute bottom-15 left-1/2 -translate-x-1/2 transform text-center'>
                    <p className='rounded-lg bg-green-800/30 px-8 py-4 text-8xl font-semibold text-white shadow-lg backdrop-blur-[1px] md:text-4xl'>
                      {index === 1 ? (
                        <>
                          Luôn sạch tinh khiết <br />
                          <span className='text-3xl font-light text-white italic'>
                            từ 2 nhà máy công nghệ hàng đầu
                          </span>
                        </>
                      ) : (
                        <>
                          Sữa Tươi Nguyên Chất – Vị Tự Nhiên Thuần Khiết <br />
                          <span className='text-3xl font-light text-white italic'>
                            xem ngay
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
        
        {/* Navigation dots */}
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
            <img src={item.img} alt={item.alt} className='h-25 w-90' />
          </div>
        ))}
      </div>

      <div className='relative flex w-full h-[600px]'>
        {imagePairs.map((item, index) => (
          <div key={index} className='w-1/2 h-full'>
            <img 
              src={item.img} 
              alt={item.alt} 
              className='h-full w-full object-cover'
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
          <p className='text-5xl font-semibold'>Mời bạn sắm sửa</p>

          {/* Horizontal Scrollable Carousel */}
          <div className='mt-12 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            <div className='flex min-w-max space-x-6 pb-4'>
              {shuffledProducts.slice(0, 8).map((product) => (
                <Link 
                  href={`/product/${product.id}`} 
                  key={product.id}
                  className='h-64 w-64 flex-none cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105'
                >
                  <img
                    src={product.details.images[0]}
                    alt={product.name}
                    className='h-full w-full object-cover'
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className='flex w-full justify-center'>
            <hr className='mt-1 w-full rounded-full border-4 border-white font-bold' />
          </div>
        </div>
      </div>

      <div className='mt-5 mb-5 flex flex-col items-center justify-center'>
        <div className='mb-4 flex w-full justify-between p-10 text-white'>
          <p className='text-5xl font-semibold'>
            Máy tính <br /> văn phòng
          </p>
          <p className='p-4 text-xl italic'>
            Hiệu suất ổn định, thiết kế chuyên nghiệp <br /> mang đến trải nghiệm làm việc tối ưu
          </p>
        </div>

        {/* New Design Section */}
        <div className='w-full px-10'>
          <div className='grid grid-cols-2 gap-8'>
            {/* Left Column - Featured Product */}
            <div className='relative h-[600px] overflow-hidden rounded-2xl'>
              <Link href="/product/6">
                <div className='group relative h-full w-full'>
                  <img
                    src={products.find(p => p.id === '6')?.details.images[0] || 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538335/asus_g614jv_jjzvhq.jpg'}
                    alt="Office Computer"
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='absolute bottom-8 left-8 text-white'>
                      <h3 className='mb-4 text-4xl font-bold'>Dell OptiPlex 7000</h3>
                      <p className='mb-4 text-xl text-purple-200'>
                        Intel Core i7-12700, Intel UHD Graphics 770
                      </p>
                      <div className='flex items-center space-x-4'>
                        <span className='rounded-full bg-purple-500/20 px-4 py-2 text-sm backdrop-blur-sm'>
                          Desktop PC
                        </span>
                        <span className='rounded-full bg-purple-500/20 px-4 py-2 text-sm backdrop-blur-sm'>
                          16GB RAM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Column - Grid of Products */}
            <div className='grid grid-cols-2 gap-8'>
              {['7', '8', '9', '10'].map((id) => {
                const product = products.find(p => p.id === id);
                return (
                  <Link href={`/product/${id}`} key={id}>
                    <div className='group relative h-[280px] overflow-hidden rounded-2xl'>
                      <img
                        src={product?.details.images[0] || 'https://res.cloudinary.com/dwbcqjupj/image/upload/v1748538492/asusrogstrixg16g614jv3_a5cbfh.jpg'}
                        alt={product?.name || 'Office Computer'}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <div className='absolute bottom-6 left-6 text-white'>
                          <h3 className='mb-2 text-2xl font-bold'>{product?.name || 'Office Computer'}</h3>
                          <p className='text-sm text-purple-200'>
                            {product?.details.specifications.find(spec => spec.name === 'CPU')?.value || ''}, {' '}
                            {product?.details.specifications.find(spec => spec.name === 'GPU')?.value || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Section - Call to Action */}
          <div className='mt-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-purple-900 to-blue-900 p-8 text-white'>
            <div className='max-w-2xl'>
              <h3 className='mb-4 text-3xl font-bold'>Khám phá bộ sưu tập máy tính</h3>
              <p className='mb-6 text-lg text-purple-200'>
                Nâng cao hiệu suất làm việc với những chiếc máy tính chuyên nghiệp
              </p>
              <Link 
                href="/product"
                className='inline-flex items-center space-x-2 rounded-full bg-white px-6 py-3 text-purple-900 transition-colors hover:bg-purple-100'
              >
                <span>Xem tất cả</span>
                <HiOutlineArrowRight className='h-5 w-5' />
              </Link>
            </div>
            <div className='hidden md:flex flex-col items-center justify-center space-y-4'>
              <div className='text-center'>
                <span className='block text-6xl font-bold text-yellow-400 drop-shadow-lg'>0%</span>
                <span className='block text-2xl font-semibold text-white tracking-wider'>TRẢ GÓP</span>
              </div>
              <div className='text-center'>
                <p className='text-lg text-purple-200'>Áp dụng cho tất cả</p>
                <p className='text-lg text-purple-200'>máy tính</p>
              </div>
              <div className='mt-4 rounded-full bg-yellow-400/20 px-6 py-2 backdrop-blur-sm'>
                <span className='text-sm font-medium text-yellow-400'>Không lãi suất</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPageComponent