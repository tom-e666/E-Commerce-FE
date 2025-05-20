'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GuidePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/guide/PurchaseGuide')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  )
}
