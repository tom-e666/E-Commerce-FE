'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Mail, User, MapPin, Phone, CheckCircle, X } from 'lucide-react'

export default function SubscribePage() {
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 5000)
  }

  useEffect(() => {
    // Initialize Mailchimp validation after component mounts
    if (typeof window !== 'undefined' && window.jQuery) {
      const $ = window.jQuery;
      window.fnames = []; 
      window.ftypes = [];
      window.fnames[0]='EMAIL';
      window.ftypes[0]='email';
      window.fnames[1]='FNAME';
      window.ftypes[1]='text';
      window.fnames[2]='LNAME';
      window.ftypes[2]='text';
      window.fnames[3]='ADDRESS';
      window.ftypes[3]='address';
      window.fnames[4]='PHONE';
      window.ftypes[4]='phone';
      window.$mcj = $.noConflict(true);

      // Handle form submission
      $('#mc-embedded-subscribe-form').on('submit', function(e) {
        const email = $('#mce-EMAIL').val();
        
        if (!email) {
          e.preventDefault();
          showToast('error', 'Vui lòng nhập địa chỉ email');
          return false;
        }
        
        // Show loading toast
        showToast('success', 'Đang xử lý đăng ký...');
        
        // Handle success/error after form submission
        setTimeout(() => {
          const errorResponse = $('#mce-error-response').is(':visible');
          const successResponse = $('#mce-success-response').is(':visible');
          
          if (successResponse) {
            showToast('success', 'Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận tin.');
          } else if (errorResponse) {
            showToast('error', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
          }
        }, 2000);
      });
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
            ) : (
              <X className="w-5 h-5 mr-3 text-red-600" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Đăng Ký Nhận Tin
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Đăng ký để nhận thông tin mới nhất về sản phẩm công nghệ, khuyến mãi đặc biệt và tin tức độc quyền từ chúng tôi.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tin Tức Độc Quyền</h3>
              <p className="text-gray-600">Nhận thông tin sản phẩm mới nhất trước người khác</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ưu Đãi Đặc Biệt</h3>
              <p className="text-gray-600">Giảm giá độc quyền dành riêng cho hội viên</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ Trợ 24/7</h3>
              <p className="text-gray-600">Hỗ trợ tư vấn và chăm sóc khách hàng tận tình</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
            <div id="mc_embed_shell">
              <style type="text/css">
                {`
                  .custom-form .mc-field-group {
                    margin-bottom: 1.5rem;
                  }
                  .custom-form input, 
                  .custom-form select {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    background: #ffffff;
                    color: #374151;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                  }
                  .custom-form input:focus,
                  .custom-form select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                  }
                  .custom-form input::placeholder {
                    color: #9ca3af;
                  }
                  .custom-form label {
                    display: block;
                    color: #374151;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                  }
                  .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                    z-index: 10;
                  }
                  .field-wrapper {
                    position: relative;
                  }
                  .asterisk {
                    color: #ef4444;
                  }
                  .submit-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    border: none;
                    padding: 1rem 3rem;
                    border-radius: 0.75rem;
                    color: white;
                    font-weight: 700;
                    font-size: 1.125rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
                  }
                  .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                  }
                  .indicates-required {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-bottom: 2rem;
                    text-align: center;
                  }
                  .no-icon-input {
                    padding: 0.875rem 1rem !important;
                    background: #ffffff !important;
                    border: 2px solid #e5e7eb !important;
                  }
                  .no-icon-input:focus {
                    background: #ffffff !important;
                    border-color: #3b82f6 !important;
                  }
                  #mce-responses {
                    display: none !important;
                  }
                `}
              </style>
              
              <div id="mc_embed_signup" className="custom-form">
                <form action="https://tempure.us7.list-manage.com/subscribe/post?u=113af64fb56477d5f3439d21c&amp;id=2ee3476fb6&amp;f_id=007952e0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank">
                  <div id="mc_embed_signup_scroll">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                      Thông Tin Đăng Ký
                    </h2>
                    
                    <div className="indicates-required">
                      <span className="asterisk">*</span> Thông tin bắt buộc
                    </div>

                    {/* Email Field */}
                    <div className="mc-field-group">
                      <label htmlFor="mce-EMAIL">
                        Địa chỉ Email <span className="asterisk">*</span>
                      </label>
                      <div className="field-wrapper">
                        <Mail className="input-icon w-5 h-5" />
                        <input 
                          type="email" 
                          name="EMAIL" 
                          className="required email" 
                          id="mce-EMAIL" 
                          required 
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="mc-field-group">
                        <label htmlFor="mce-FNAME">Họ</label>
                        <div className="field-wrapper">
                          <User className="input-icon w-5 h-5" />
                          <input 
                            type="text" 
                            name="FNAME" 
                            id="mce-FNAME" 
                            placeholder="Nguyễn"
                          />
                        </div>
                      </div>
                      <div className="mc-field-group">
                        <label htmlFor="mce-LNAME">Tên</label>
                        <div className="field-wrapper">
                          <User className="input-icon w-5 h-5" />
                          <input 
                            type="text" 
                            name="LNAME" 
                            id="mce-LNAME" 
                            placeholder="Văn A"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="mc-address-group">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                        Địa Chỉ (Tùy chọn)
                      </h3>
                      
                      <div className="grid gap-4">
                        <div className="mc-field-group">
                          <label htmlFor="mce-ADDRESS-addr1">Địa chỉ</label>
                          <div className="field-wrapper">
                            <MapPin className="input-icon w-5 h-5" />
                            <input 
                              type="text" 
                              maxLength="70" 
                              name="ADDRESS[addr1]" 
                              id="mce-ADDRESS-addr1" 
                              placeholder="123 Đường ABC"
                            />
                          </div>
                        </div>

                        <div className="mc-field-group">
                          <label htmlFor="mce-ADDRESS-addr2">Địa chỉ (Dòng 2)</label>
                          <div className="field-wrapper">
                            <MapPin className="input-icon w-5 h-5" />
                            <input 
                              type="text" 
                              maxLength="70" 
                              name="ADDRESS[addr2]" 
                              id="mce-ADDRESS-addr2" 
                              placeholder="Phường/Quận"
                            />
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="mc-field-group">
                            <label htmlFor="mce-ADDRESS-city">Thành phố</label>
                            <input 
                              type="text" 
                              maxLength="40" 
                              name="ADDRESS[city]" 
                              id="mce-ADDRESS-city" 
                              placeholder="Hồ Chí Minh"
                              className="no-icon-input"
                            />
                          </div>
                          <div className="mc-field-group">
                            <label htmlFor="mce-ADDRESS-state">Tỉnh/Thành phố</label>
                            <input 
                              type="text" 
                              maxLength="20" 
                              name="ADDRESS[state]" 
                              id="mce-ADDRESS-state" 
                              placeholder="TP. Hồ Chí Minh"
                              className="no-icon-input"
                            />
                          </div>
                          <div className="mc-field-group">
                            <label htmlFor="mce-ADDRESS-zip">Mã bưu điện</label>
                            <input 
                              type="text" 
                              maxLength="10" 
                              name="ADDRESS[zip]" 
                              id="mce-ADDRESS-zip" 
                              placeholder="70000"
                              className="no-icon-input"
                            />
                          </div>
                        </div>

                        <div className="mc-field-group">
                          <label htmlFor="mce-ADDRESS-country">Quốc gia</label>
                          <select name="ADDRESS[country]" id="mce-ADDRESS-country" className="no-icon-input">
                            <option value="Vietnam">Việt Nam</option>
                            <option value="USA">Hoa Kỳ</option>
                            <option value="Japan">Nhật Bản</option>
                            <option value="South Korea">Hàn Quốc</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Thailand">Thái Lan</option>
                            <option value="United Kingdom">Vương quốc Anh</option>
                            <option value="Australia">Úc</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="mc-field-group">
                      <label htmlFor="mce-PHONE">Số điện thoại</label>
                      <div className="field-wrapper">
                        <Phone className="input-icon w-5 h-5" />
                        <input 
                          type="text" 
                          name="PHONE" 
                          className="REQ_CSS"
                          id="mce-PHONE" 
                          placeholder="+84 123 456 789"
                        />
                      </div>
                    </div>

                    {/* Response Messages - Hidden but kept for Mailchimp functionality */}
                    <div id="mce-responses" className="clear foot">
                      <div className="response" id="mce-error-response" style={{display: 'none'}}></div>
                      <div className="response" id="mce-success-response" style={{display: 'none'}}></div>
                    </div>

                    {/* Honeypot */}
                    <div aria-hidden="true" style={{position: 'absolute', left: '-5000px'}}>
                      <input type="text" name="b_113af64fb56477d5f3439d21c_2ee3476fb6" tabIndex={-1} />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-8">
                      <input 
                        type="submit" 
                        name="subscribe" 
                        id="mc-embedded-subscribe" 
                        className="submit-btn" 
                        value="🚀 Đăng Ký Ngay"
                      />
                      <p className="text-sm text-gray-500 mt-4">
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                        {' '}và{' '}
                        <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-500">
              Có câu hỏi? Liên hệ với chúng tôi tại{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Script 
        src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js" 
        strategy="afterInteractive"
      />
    </div>
  )
}
