'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Mail, CheckCircle, X, Phone } from 'lucide-react'

export default function SubscribePage() {
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 5000)
  }

  useEffect(() => {
    // Initialize MailerLite after component mounts
    if (typeof window !== 'undefined' && window.ml) {
      // Handle form submission
      const form = document.getElementById('ml-embedded-subscribe-form');
      if (form) {
        const handleSubmit = function(e: Event) {
          e.preventDefault(); // Prevent default redirect
          
          const email = (document.getElementById('ml-email') as HTMLInputElement)?.value;
          
          if (!email) {
            showToast('error', 'Vui lòng nhập địa chỉ email');
            return false;
          }
          
          // Show loading toast
          showToast('success', 'Đang xử lý đăng ký...');
          
          // Submit via AJAX to avoid redirect
          const formData = new FormData(form as HTMLFormElement);
          
          fetch('https://landing.mailerlite.com/webforms/landing/subscribe', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          }).then(() => {
            // Show success modal
            setTimeout(() => {
              setShowSuccessModal(true);
              // Reset form
              (document.getElementById('ml-email') as HTMLInputElement).value = '';
            }, 2000);
          }).catch(() => {
            // Fallback success (no-cors mode doesn't give real response)
            setTimeout(() => {
              setShowSuccessModal(true);
              (document.getElementById('ml-email') as HTMLInputElement).value = '';
            }, 2000);
          });
        };

        form.addEventListener('submit', handleSubmit);

        return () => {
          form.removeEventListener('submit', handleSubmit);
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      {/* MailerLite Universal Script */}
      <Script id="mailerlite-universal" strategy="afterInteractive">
        {`
          (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
          .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
          n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
          (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
          ml('account', '1710093');
        `}
      </Script>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Đăng Ký Thành Công!
            </h3>
            
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đăng ký nhận tin từ E-Commerce Laptop. Chúng tôi sẽ gửi những thông tin mới nhất về sản phẩm và ưu đãi đặc biệt đến email của bạn.
            </p>
            
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Tuyệt vời!
            </button>
          </div>
        </div>
      )}

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
            <div id="ml_embed_shell">
              <style type="text/css">
                {`
                  .custom-form .ml-field-group {
                    margin-bottom: 1.5rem;
                  }
                  .custom-form input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.75rem;
                    background: #ffffff;
                    color: #374151;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                  }
                  .custom-form input:focus {
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
                    width: 100%;
                  }
                  .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
                    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                  }
                  .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                  }
                  .indicates-required {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-bottom: 2rem;
                    text-align: center;
                  }
                `}
              </style>
              
              <div id="ml_embed_signup" className="custom-form">
                <form id="ml-embedded-subscribe-form" name="ml-embedded-subscribe-form" className="validate">
                  <input type="hidden" name="ml-submit" value="1" />
                  <input type="hidden" name="anticsrf" value="true" />
                  
                  <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    Đăng Ký Nhận Tin
                  </h2>
                  
                  <div className="indicates-required">
                    <span className="asterisk">*</span> Thông tin bắt buộc
                  </div>

                  {/* Email Field */}
                  <div className="ml-field-group">
                    <label htmlFor="ml-email">
                      Địa chỉ Email <span className="asterisk">*</span>
                    </label>
                    <div className="field-wrapper">
                      <Mail className="input-icon w-5 h-5" />
                      <input 
                        type="email" 
                        name="fields[email]" 
                        id="ml-email" 
                        required 
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center mt-8">
                    <button 
                      type="submit"
                      className="submit-btn"
                    >
                      🚀 Đăng Ký Ngay
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      Bằng cách đăng ký, bạn đồng ý với{' '}
                      <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                      {' '}và{' '}
                      <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                    </p>
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
    </div>
  )
}