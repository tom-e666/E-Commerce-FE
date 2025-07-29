'use client'

import React from 'react'

const PurchaseGuide = () => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hướng Dẫn Mua Hàng</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi đã xây dựng quy trình đặt hàng đơn giản, nhanh chóng và an toàn.
            Hãy làm theo các bước sau để hoàn tất việc mua sắm của bạn.
          </p>
        </div>

        {/* Steps Process Visualization */}
        <div className="hidden md:flex justify-between items-center mb-16 px-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">1</div>
            <div className="text-blue-600 font-medium mt-2">Tìm kiếm</div>
          </div>
          <div className="h-1 flex-1 bg-blue-200 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">2</div>
            <div className="text-blue-600 font-medium mt-2">Giỏ hàng</div>
          </div>
          <div className="h-1 flex-1 bg-blue-200 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">3</div>
            <div className="text-blue-600 font-medium mt-2">Thanh toán</div>
          </div>
          <div className="h-1 flex-1 bg-blue-200 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">4</div>
            <div className="text-blue-600 font-medium mt-2">Theo dõi</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Bước 1 */}
          <div className="rounded-xl bg-white p-8 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">1</div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Tìm kiếm sản phẩm</h2>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Truy cập vào trang sản phẩm thông qua menu &quot;Sản phẩm&quot; hoặc tìm kiếm trực tiếp</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sử dụng bộ lọc để tìm sản phẩm theo danh mục, giá cả</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Nhấp vào sản phẩm để xem thông tin chi tiết</span>
                  </p>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 italic">
                    <span className="font-medium">Mẹo:</span> Sử dụng thanh tìm kiếm ở đầu trang để nhanh chóng tìm thấy sản phẩm cụ thể bạn đang tìm kiếm.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="rounded-xl bg-white p-8 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">2</div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Thêm vào giỏ hàng</h2>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Chọn số lượng sản phẩm bạn muốn mua</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Nhấn nút &quot;Thêm vào giỏ hàng&quot;</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Có thể tiếp tục mua sắm hoặc tiến hành thanh toán</span>
                  </p>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 italic">
                    <span className="font-medium">Lưu ý:</span> Bạn có thể xem lại và điều chỉnh giỏ hàng bất cứ lúc nào trước khi thanh toán.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="rounded-xl bg-white p-8 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">3</div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Thanh toán</h2>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Kiểm tra giỏ hàng và số lượng sản phẩm</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Nhập thông tin giao hàng chính xác</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Chọn phương thức thanh toán phù hợp</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Xác nhận đơn hàng</span>
                  </p>
                </div>
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-3">Chúng tôi chấp nhận:</h3>
                  <div className="flex space-x-4">
                    <div className="bg-white p-2 rounded border">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" viewBox="0 0 24 24" fill="#172B85">
                        <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.1,9,20.8v-1.6c0-0.3-0.3-0.6-0.6-0.6H8.2c-1.9,0-3.4-1.5-3.4-3.4c0-0.8,0.3-1.5,0.8-2.2C5.9,12.5,6,12.4,6,12.2v-0.8c0-0.3-0.2-0.6-0.5-0.6c-1.3,0-2.4,1.1-2.4,2.4v9.3c0,0.3,0.3,0.6,0.6,0.6h9.6c0.3,0,0.6-0.3,0.6-0.6V4.8C14,2.4,12.6,1,10.9,2.1z"></path>
                        <path d="M18.6,6.6C19.4,7.3,20,8.4,20,9.6c0,1.9-1.1,3.4-2.7,4.3c-0.4,0.2-0.7,0.6-0.7,1v2.7c0,0.3,0.3,0.6,0.6,0.6h0.8c0.3,0,0.6-0.3,0.6-0.6V20c0-0.3,0.2-0.6,0.5-0.6c1.6-0.3,2.9-1.8,2.9-3.6c0-1.7-1.2-3.2-2.9-3.6c-0.3,0-0.5-0.3-0.5-0.6v-0.8c0-0.3,0.2-0.6,0.5-0.6c1.1,0,2-0.9,2-2c0-1-0.9-1.9-1.9-2l-0.1,0c-0.3,0-0.6-0.2-0.6-0.6V5.4c0-0.3,0.3-0.6,0.6-0.6h0.8c0.3,0,0.6-0.3,0.6-0.6V4.8C19.4,4.3,19.1,4,18.8,4h-1.6c-1.1,0-2,0.9-2,2v0.8c0,0.3,0.3,0.6,0.6,0.6h0.8c0.3,0,0.6,0.3,0.6,0.6v0.8c0,0.3-0.3,0.6-0.6,0.6h-0.8c-0.3,0-0.6,0.3-0.6,0.6v0.8c0,0.3,0.2,0.5,0.4,0.6C16.1,5.7,17.7,5.6,18.6,6.6z"></path>
                      </svg>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" viewBox="0 0 24 24" fill="#EB001B">
                        <circle cx="7" cy="12" r="7"></circle>
                        <circle cx="17" cy="12" r="7" fill="#F79E1B"></circle>
                        <path d="M12 17a7 7 0 0 0 0-10" opacity="0.6" fill="#FF5F00"></path>
                      </svg>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" viewBox="0 0 24 24" fill="#1434CB">
                        <path d="M21.5,12a9.5,9.5,0,1,1-9.5-9.5A9.5,9.5,0,0,1,21.5,12Zm-9.5,7a7,7,0,1,0-7-7A7,7,0,0,0,12,19Z" fill="#FFB600"></path>
                        <path d="M11,9.5a2.5,2.5,0,0,1,5,0v5a2.5,2.5,0,0,1-5,0Z" fill="#1434CB"></path>
                      </svg>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" viewBox="0 0 24 24" fill="#003087">
                        <path d="M20,8h-3V6c0-2.2-1.8-4-4-4H7C4.8,2,3,3.8,3,6v12c0,2.2,1.8,4,4,4h10c2.2,0,4-1.8,4-4v-6C21,9.3,20.7,8,20,8z M7,6h6c1.1,0,2,0.9,2,2H7V6z M17,18H7v-8h10V18z M18,14h-1v-2h1V14z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Bước 4 */}
          <div className="rounded-xl bg-white p-8 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">4</div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">Theo dõi đơn hàng</h2>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Nhận email xác nhận đơn hàng</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Theo dõi trạng thái đơn hàng qua email hoặc tài khoản</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Nhận thông báo khi đơn hàng được giao</span>
                  </p>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 italic">
                    <span className="font-medium">Quan trọng:</span> Nếu bạn không nhận được email xác nhận trong vòng 30 phút, vui lòng kiểm tra thư mục spam hoặc liên hệ với chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hỗ trợ */}
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 shadow-lg text-white mt-12">
            <div className="md:flex items-center">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ?</h2>
                <p className="mb-4">
                  Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ với chúng tôi qua:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Hotline: <strong>1900 1234</strong></span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email: <strong>support@think5.com</strong></span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>Chat trực tuyến trên website</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
                <svg className="w-32 h-32 text-white opacity-20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-500">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md">
                Liên hệ ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseGuide
