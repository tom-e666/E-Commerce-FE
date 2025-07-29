'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { resendVerificationEmail } from '@/services/auth/endpoints'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get('email') || ''
  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Start countdown when the component mounts
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // When countdown reaches 0, show the success popup
      toast.success("Vui lòng xác nhận email của bạn để hoàn tất quá trình đăng ký.", {
        duration: 5000,
      })
    }
  }, [countdown])
  
  const handleResendVerification = async () => {
    setIsSending(true)
    try {
      const response = await resendVerificationEmail()
      
      if (response.code === 200) {
        toast.success('Email xác minh đã được gửi lại thành công!')
      } else {
        toast.error(response.message || 'Không thể gửi lại email xác minh.')
      }
    } catch (error) {
      console.error('Error resending verification email:', error)
      toast.error('Đã xảy ra lỗi khi gửi lại email xác minh.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Kiểm tra email của bạn
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-gray-600 mb-2">
            Chúng tôi đã gửi email xác nhận đến:
          </p>
          <p className="font-semibold text-blue-600 break-all">
            {email || 'địa chỉ email của bạn'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <p className="text-sm text-gray-500">
            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để xác nhận tài khoản của bạn.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">
              Không nhận được email? Kiểm tra thư mục spam hoặc 
              <button className="text-blue-600 hover:underline ml-1" onClick={handleResendVerification} disabled={isSending}>
                {isSending ? 'Đang gửi lại...' : 'Gửi lại email xác nhận'}
              </button>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Button asChild variant="outline" className="w-full">
            <Link href="/login" className="flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}
