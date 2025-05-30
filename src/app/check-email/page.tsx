'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { resendVerificationEmail } from '@/services/auth/endpoints'

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Loader2, MailOpen, ArrowLeft, Mail, Info, CheckCircle } from 'lucide-react'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  useEffect(() => {
    // Start countdown when the component mounts
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // When countdown reaches 0, show the success popup
      setShowSuccessPopup(true)
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
    <div className="container mx-auto max-w-md py-12 mb-8">
      <Card className="w-full"> 
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Kiểm tra email của bạn</CardTitle>
          <CardDescription>
            Chúng tôi đã gửi một email xác minh đến {email ? <span className="font-medium">{email}</span> : 'địa chỉ email của bạn'}
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Đăng ký thành công</span>
                <span>{countdown > 0 ? countdown : 0}</span>
              </div>
              <Progress value={(5 - countdown) * 20} className="h-2" />
            </div>

            <div className={`bg-green-50 p-4 rounded-md border-green-200 border text-center ${showSuccessPopup ? 'block' : 'hidden'} mb-4`}>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="font-medium text-green-700">Đăng ký tài khoản thành công!</span>
              </div>
              <p className="text-green-600">Vui lòng kiểm tra email của bạn để hoàn tất quá trình xác minh.</p>
            </div>
            
            <p className="text-center">
              Vui lòng kiểm tra hộp thư đến của bạn và nhấp vào liên kết trong email để xác minh tài khoản.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-blue-700 text-sm">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Lưu ý:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Liên kết xác minh chỉ có hiệu lực trong 24 giờ</li>
                    <li>Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam</li>
                    <li>Đảm bảo địa chỉ email bạn đã đăng ký là chính xác</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={handleResendVerification}
            disabled={isSending}
            variant="outline"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi lại...
              </>
            ) : (
              <>
                <MailOpen className="mr-2 h-4 w-4" />
                Gửi lại email
              </>
            )}
          </Button>
          
          <Button asChild variant="secondary">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-md py-12 mb-8">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}
