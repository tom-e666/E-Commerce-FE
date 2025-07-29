'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSupportTicket } from '@/hooks/useSupportTicket';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Loader2, ArrowLeft, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AddResponseForm from '@/components/Support/AddResponseForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function SupportTicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthContext();
  const { loading, error, currentTicket, responses, fetchTicketResponses, closeTicket } = useSupportTicket();
  const [isClosingTicket, setIsClosingTicket] = useState(false);

  useEffect(() => {
    const initializeTicket = async () => {
      if (!authLoading && !isAuthenticated) {
        toast.error('Vui lòng đăng nhập để xem chi tiết yêu cầu hỗ trợ');
        router.push('/login?redirect=/support');
        return;
      }

      if (isAuthenticated && ticketId) {
        try {
          await fetchTicketResponses(ticketId as string);
        } catch (err) {
          console.error('Failed to load ticket responses:', err);
          toast.error('Không thể tải chi tiết yêu cầu hỗ trợ');
        }
      }
    };

    initializeTicket();
  }, [isAuthenticated, authLoading, ticketId, fetchTicketResponses, router]);

  const handleCloseTicket = async () => {
    if (!ticketId) return;
    
    setIsClosingTicket(true);
    try {
      const success = await closeTicket(ticketId);
      if (success) {
        toast.success('Yêu cầu hỗ trợ đã được đóng');
      } else {
        toast.error('Không thể đóng yêu cầu hỗ trợ');
      }
    } catch (err) {
      console.error('Error closing ticket:', err);
      toast.error('Đã xảy ra lỗi khi đóng yêu cầu hỗ trợ');
    } finally {
      setIsClosingTicket(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Đang mở</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Đã đóng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Có lỗi xảy ra khi tải yêu cầu hỗ trợ</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <p className="font-medium">Không tìm thấy yêu cầu hỗ trợ</p>
          <Button variant="link" onClick={() => router.push('/support')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const isTicketClosed = currentTicket.status === 'closed';

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/support">
              <ArrowLeft className="h-4 w-4 mr-1 inline" />
              Yêu cầu hỗ trợ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/support/${ticketId}`}>
              Chi tiết yêu cầu #{ticketId.substring(0, 8)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Ticket header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{currentTicket.subject}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatDate(currentTicket.created_at)}</span>
            <span className="mx-2">•</span>
            <User className="h-4 w-4" />
            <span>{currentTicket.user_id === user?.id ? 'Bạn' : 'Khách hàng'}</span>
            <span className="mx-2">•</span>
            <div>{getStatusBadge(currentTicket.status)}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isTicketClosed && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Đóng yêu cầu
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đóng yêu cầu hỗ trợ</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn đóng yêu cầu hỗ trợ này? Bạn sẽ không thể thêm phản hồi sau khi đóng.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCloseTicket} disabled={isClosingTicket}>
                    {isClosingTicket ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đóng
                      </>
                    ) : (
                      <>Đóng yêu cầu</>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Ticket content */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user && getAvatarInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {user?.full_name || 'Khách hàng'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Yêu cầu ban đầu</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {currentTicket.message}
          </div>
        </CardContent>
      </Card>

      {/* Response list */}
      {responses && responses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Phản hồi ({responses.length})</h2>
          <div className="space-y-6">
            {responses.map((response) => (
              <Card key={response.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getAvatarInitials(response.user_id === user?.id ? 
                          user.full_name : 'Support Staff')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {response.user_id === user?.id ? 
                          user.full_name : 'Nhân viên hỗ trợ'}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(response.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">{response.subject}</h3>
                  <div className="prose prose-sm max-w-none">
                    {response.message}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add response form */}
      {!isTicketClosed ? (
        <div>
          <Separator className="my-6" />
          <h2 className="text-lg font-semibold mb-4">Thêm phản hồi</h2>
          <AddResponseForm ticketId={ticketId} onResponseAdded={() => fetchTicketResponses(ticketId)} />
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center mt-8">
          <CheckCircle className="h-8 w-8 mx-auto text-gray-500 mb-2" />
          <h3 className="text-lg font-medium text-gray-700">Yêu cầu hỗ trợ đã đóng</h3>
          <p className="text-gray-500 mb-4">Yêu cầu này đã được đóng và không thể thêm phản hồi mới.</p>
          <Button variant="outline" onClick={() => router.push('/support')}>
            Quay lại danh sách yêu cầu
          </Button>
        </div>
      )}
    </div>
  );
}
