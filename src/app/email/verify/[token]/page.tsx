'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle, AlertTriangle, MailOpen } from 'lucide-react'
import { verifyEmail } from '@/services/auth/endpoints'

function EmailVerificationContent() {
  const router = useRouter()
  const params = useParams()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    async function verifyUserEmail() {
      try {
        const token = Array.isArray(params.token) ? params.token[0] : params.token
        if (!token) {
          setVerificationStatus('error')
          setErrorMessage('Token xác minh không hợp lệ.')
          return
        }

        const response = await verifyEmail(token)
        if (response.code === 200) {
          setVerificationStatus('success')
          
          // Auto-redirect after success
          setTimeout(() => {
            router.push('/login')
          }, 5000)
        } else if (response.code === 410) {
          // Expired token
          setVerificationStatus('expired')
          setErrorMessage(response.message || 'Liên kết xác minh đã hết hạn.')
        } else {
          setVerificationStatus('error')
          setErrorMessage(response.message || 'Có lỗi xảy ra khi xác minh email.')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
        setErrorMessage('Có lỗi xảy ra khi xác minh email. Vui lòng thử lại sau.')
      }
    }

    if (params.token) {
      verifyUserEmail()
    }
  }, [params.token, router])

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Xác minh Email</CardTitle>
          <CardDescription>
            {verificationStatus === 'loading' && 'Đang xác minh email của bạn...'}
            {verificationStatus === 'success' && 'Email đã được xác minh thành công!'}
            {verificationStatus === 'error' && 'Không thể xác minh email'}
            {verificationStatus === 'expired' && 'Liên kết xác minh đã hết hạn'}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-6">
          {verificationStatus === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Đang xác minh email của bạn, vui lòng đợi...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 rounded-full p-3 mx-auto w-fit">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Xác minh thành công!</h3>
                <p className="text-muted-foreground">
                  Email của bạn đã được xác minh thành công. Bạn có thể đăng nhập vào tài khoản ngay bây giờ.
                </p>
                <p className="text-sm text-muted-foreground">
                  Bạn sẽ được chuyển hướng đến trang đăng nhập sau 5 giây...
                </p>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="bg-red-50 rounded-full p-3 mx-auto w-fit">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Xác minh thất bại</h3>
                <p className="text-muted-foreground">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {verificationStatus === 'expired' && (
            <div className="text-center space-y-4">
              <div className="bg-amber-50 rounded-full p-3 mx-auto w-fit">
                <AlertTriangle className="h-16 w-16 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Liên kết đã hết hạn</h3>
                <p className="text-muted-foreground">
                  Liên kết xác minh email đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          {verificationStatus === 'success' && (
            <Button asChild>
              <Link href="/login">
                Đăng nhập ngay
              </Link>
            </Button>
          )}

          {verificationStatus === 'error' && (
            <Button asChild variant="outline">
              <Link href="/login">
                Quay lại đăng nhập
              </Link>
            </Button>
          )}

          {verificationStatus === 'expired' && (
            <>
              <Button asChild>
                <Link href="/resend-verification">
                  <MailOpen className="mr-2 h-4 w-4" />
                  Gửi lại email xác minh
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">
                  Quay lại đăng nhập
                </Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default function EmailVerification() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-md py-12">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  )
}
