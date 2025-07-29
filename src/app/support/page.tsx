'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSupportTicket } from '@/hooks/useSupportTicket';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquarePlus, Search } from 'lucide-react';
import Link from 'next/link';
import CreateTicketDialog from '@/components/Support/CreateTicketDialog';

export default function SupportPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { loading, error, tickets, fetchUserTickets } = useSupportTicket();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem yêu cầu hỗ trợ');
      router.push('/login?redirect=/support');
      return;
    }

    // Load user's tickets
    if (isAuthenticated) {
      fetchUserTickets().catch(err => {
        console.error('Failed to load tickets:', err);
        toast.error('Không thể tải danh sách yêu cầu hỗ trợ');
      });
    }
  }, [isAuthenticated, authLoading, fetchUserTickets, router]);

  const handleCreateTicket = () => {
    setIsCreateDialogOpen(true);
  };

  const handleTicketCreated = () => {
    // Refresh the ticket list after creating a new ticket
    fetchUserTickets();
  };

  // Function to render badge based on ticket status
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

  // Function to format date
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

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Yêu cầu hỗ trợ</h1>
          <p className="text-gray-600 mt-2">
            Gửi yêu cầu hỗ trợ và theo dõi trạng thái
          </p>
        </div>
        <Button onClick={handleCreateTicket} className="flex items-center">
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          Tạo yêu cầu mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải yêu cầu hỗ trợ...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Có lỗi xảy ra khi tải yêu cầu hỗ trợ</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquarePlus className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Bạn chưa có yêu cầu hỗ trợ nào</h3>
          <p className="mt-2 text-gray-500">
            Tạo yêu cầu mới khi bạn cần hỗ trợ từ đội ngũ của chúng tôi
          </p>
          <Button onClick={handleCreateTicket} className="mt-4">
            Tạo yêu cầu mới
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <Link href={`/support/${ticket.id}`} key={ticket.id} className="block transition-transform hover:scale-[1.02]">
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{ticket.subject}</CardTitle>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <CardDescription className="flex items-center text-xs">
                    <span className="text-gray-500">Tạo lúc: {formatDate(ticket.created_at)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <p className="text-gray-700 line-clamp-3 text-sm">{ticket.message}</p>
                </CardContent>
                <CardFooter className="pt-0 border-t">
                  <div className="w-full flex justify-end">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Search className="h-4 w-4" />
                      Xem chi tiết
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Ticket Dialog */}
      <CreateTicketDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}
