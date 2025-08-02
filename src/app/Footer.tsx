'use client'
import React from 'react'
import Link from 'next/link'
import { FaPhone, FaShieldAlt, FaMapMarkerAlt, FaLaptopCode } from 'react-icons/fa'
import { IoMdMail } from "react-icons/io";
import { MdOutlineCategory, MdInfo, MdSupportAgent } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";
import Image from 'next/image'
const Footer = () => {
  return (
    <footer className='w-full relative overflow-hidden bg-gray-900 text-white'>
      {/* Laptop Code icon - góc dưới bên phải, kích thước lớn */}
      <div className='absolute -bottom-12 -left-20 opacity-30'>
        <FaLaptopCode className="text-[180px] md:text-[250px] lg:text-[320px] text-blue-200" />
      </div>

      {/* Main content */}
      <div className='container mx-auto py-3 px-4 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Danh mục hàng */}
          <div className='p-4 rounded-lg'>
            <div className='flex items-center mb-3'>
              <MdOutlineCategory className='text-2xl text-blue-400 mr-2' />
              <h3 className='text-lg font-bold text-blue-300'>
                Danh mục hàng
              </h3>
            </div>
            <ul className='space-y-2'>
              {['Laptop văn phòng', 'Laptop gaming', 'Phụ kiện'].map((item, index) => (
                <li key={index}>
                  <a href='#' className='text-gray-300 hover:text-blue-300 flex items-center'>
                    <span className='w-1.5 h-1.5 bg-blue-400 rounded-full mr-2'></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin */}
          <div className='p-4 rounded-lg'>
            <div className='flex items-center mb-3'>
              <MdInfo className='text-2xl text-blue-400 mr-2' />
              <h3 className='text-lg font-bold text-blue-300'>
                Thông tin
              </h3>
            </div>
            <ul className='space-y-2'>
              {[
                { name: 'Hướng dẫn mua hàng', link: '/guide' },
                { name: 'Hình thức thanh toán', link: '/payment' },
                { name: 'Chính sách vận chuyển', link: '/guide/TransferPolicy' },
                { name: 'Chính sách trả hàng', link: '/guide/ReturnPolicy' }
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.link} className='text-gray-300 hover:text-blue-300 flex items-center'>
                    <span className='w-1.5 h-1.5 bg-blue-400 rounded-full mr-2'></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className='p-4 rounded-lg'>
            <div className='flex items-center mb-3'>
              <MdSupportAgent className='text-2xl text-blue-400 mr-2' />
              <h3 className='text-lg font-bold text-blue-300'>
                Hỗ trợ khách hàng
              </h3>
            </div>
            <div className='space-y-3'>
              <p className='flex items-center text-gray-300'>
                <FaPhone className='mr-2 text-blue-400 text-sm' />
                Tổng đài:{' '}
                <span className='font-semibold text-yellow-300 ml-2'>1900 1234</span>
              </p>
              <p className='flex items-center text-gray-300'>
                <FaShieldAlt className='mr-2 text-blue-400 text-sm' />
                Bảo hành:{' '}
                <span className='font-semibold text-yellow-300 ml-2'>1900 4321</span>
              </p>

              <h4 className='text-gray-200 font-medium mt-3 mb-2'>Kết nối với chúng tôi</h4>
              <div className='flex items-center gap-3'>
                <a
                  href='https://zalo.me/0977769904'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-blue-500/20 p-1.5 rounded-full hover:bg-blue-500/30 transition-colors'
                >
                  <Image 
                    src={'/zalo.webp'} 
                    className='h-5 w-5' 
                    alt="Zalo" 
                    width={20} 
                    height={20}
                    loading="lazy"
                    sizes="20px"
                  />
                </a>
                <a
                  href='https://facebook.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-blue-500/20 p-1.5 rounded-full hover:bg-blue-500/30 transition-colors'
                >
                  <Image 
                    src={'/facebook.png'} 
                    className='h-5 w-5' 
                    alt="Facebook" 
                    width={20} 
                    height={20}
                    loading="lazy"
                    sizes="20px"
                  />
                </a>
                <a
                  href='mailto:info@milkstore.com'
                  className='bg-blue-500/20 p-1.5 rounded-full'
                >
                  <IoMdMail className='h-5 w-5 text-gray-300' />
                </a>
                <a
                  href='https://www.google.com/maps/place/129%2F1T+L%E1%BA%A1c+Long+Qu%C3%A2n,+Ph%C6%B0%E1%BB%9Dng+1,+Qu%E1%BA%ADn+11,+H%E1%BB%93+Ch%C3%AD+Minh,+Vietnam/@10.7579894,106.6353088,779m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31752e84e25dc869:0xc0177203312302a6!8m2!3d10.7579841!4d106.6378837!16s%2Fg%2F11j2vw78dy?entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoASAFQAw%3D%3D'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-blue-500/20 p-1.5 rounded-full'
                >
                  <FaMapMarkerAlt className='h-5 w-5 text-gray-300' />
                </a>
              </div>
            </div>
          </div>

          {/* Đơn vị vận chuyển */}
          <div className='p-4 rounded-lg'>
            <div className='flex items-center mb-3'>
              <FaTruckFast className='text-2xl text-blue-400 mr-2' />
              <h3 className='text-lg font-bold text-blue-300'>
                Đơn vị vận chuyển
              </h3>
            </div>
            <div className='flex flex-col space-y-3'>
              <div className='rounded-lg flex items-center'>
                <Image 
                  src={'/GHN.webp'} 
                  alt='GHN' 
                  width={160} 
                  height={50}
                  className='h-auto w-auto max-h-12'
                  loading="lazy"
                  sizes="160px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </footer>
  )
}

export default Footer