'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { sendVerificationEmail } from '@/services/auth/endpoints'
import { useAuthContext } from '@/contexts/AuthContext'

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, MailOpen, ArrowLeft, Info } from 'lucide-react'

export default function ResendVerificationPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  
  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/login?redirect=/resend-verification')
    return null
  }

  const handleSendVerification = async () => {
    setIsSending(true)
    try {
      const response = await sendVerificationEmail()
      
      if (response.code === 200) {
        setEmailSent(true)
        toast.success('Email xác minh đã được gửi thành công!')
      } else {
        toast.error(response.message || 'Không thể gửi email xác minh.')
      }
    } catch (error) {
      console.error('Error sending verification email:', error)
      toast.error('Đã xảy ra lỗi khi gửi email xác minh.')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Đang tải...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Gửi lại email xác minh</CardTitle>
          <CardDescription>
            Vui lòng yêu cầu gửi lại email xác minh tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-6">
          {!emailSent ? (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 rounded-full p-3 mx-auto w-fit">
                <MailOpen className="h-16 w-16 text-blue-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Xác minh email của bạn</h3>
                <p className="text-muted-foreground max-w-md">
                  Chúng tôi sẽ gửi một email xác minh tới địa chỉ email của bạn. Vui lòng kiểm tra hộp thư để hoàn tất quá trình xác minh.
                </p>
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex text-left">
                  <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Nếu bạn không nhận được email trong vòng vài phút, vui lòng kiểm tra thư mục Spam hoặc Thùng rác của bạn.
                  </p>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleSendVerification}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi email...
                  </>
                ) : (
                  "Gửi email xác minh"
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 rounded-full p-3 mx-auto w-fit">
                <MailOpen className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Email đã được gửi!</h3>
                <p className="text-muted-foreground">
                  Chúng tôi đã gửi một email xác minh tới địa chỉ email của bạn. 
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để xác minh tài khoản.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
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
