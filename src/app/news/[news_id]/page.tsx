'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, Clock, Home, ChevronRight, Tag, Eye, User } from "lucide-react";

// Dữ liệu mẫu cho các bản tin (giống như trong trang news)
const sampleNews = [
  {
    id: 1,
    title: "Ra mắt dòng laptop gaming mới nhất",
    summary: "Khám phá những tính năng vượt trội của dòng laptop gaming mới nhất với hiệu năng cực mạnh và thiết kế ấn tượng.",
    content: `<p>Dòng laptop gaming mới nhất đã chính thức được ra mắt với nhiều cải tiến vượt trội. Được trang bị CPU thế hệ mới nhất và GPU mạnh mẽ, những chiếc laptop này hứa hẹn mang đến trải nghiệm chơi game tuyệt vời cho người dùng.</p>

    <p>Với màn hình 15.6 inch, tần số quét 144Hz và độ phân giải Full HD, người dùng sẽ được trải nghiệm hình ảnh sắc nét và mượt mà trong mọi tựa game. Bàn phím RGB tùy chỉnh cũng là một điểm nhấn đáng chú ý, cho phép người dùng tạo ra không gian gaming theo phong cách riêng.</p>

    <p>Về hiệu năng, laptop được trang bị CPU Intel Core i7 thế hệ 12, GPU NVIDIA RTX 3070, 16GB RAM DDR5 và ổ cứng SSD NVMe 1TB. Với cấu hình này, laptop có thể chạy mượt mà hầu hết các tựa game AAA ở mức đồ họa cao.</p>

    <p>Hệ thống tản nhiệt cũng được cải tiến với công nghệ Cooler Boost 5, giúp duy trì nhiệt độ ổn định ngay cả khi chơi game trong thời gian dài. Thời lượng pin cũng được cải thiện, có thể sử dụng liên tục trong khoảng 5-6 giờ với các tác vụ thông thường.</p>

    <p>Dòng laptop gaming mới này đã có mặt tại các cửa hàng với mức giá từ 30 triệu đồng, tùy theo cấu hình. Đây là lựa chọn lý tưởng cho những game thủ đang tìm kiếm một chiếc laptop gaming mạnh mẽ với mức giá hợp lý.</p>`,
    image: "/news/laptop-gaming.jpg",
    date: "2023-11-15",
    author: "Admin",
    category: "Sản phẩm mới",
    views: 1250,
    relatedNews: [2, 4]
  },
  {
    id: 2,
    title: "Hướng dẫn chọn mua PC gaming phù hợp",
    summary: "Những lưu ý quan trọng khi chọn mua PC gaming để đảm bảo hiệu năng tốt nhất cho nhu cầu của bạn.",
    content: `<p>Việc chọn mua một bộ PC gaming phù hợp không phải là điều đơn giản. Bạn cần cân nhắc nhiều yếu tố như CPU, GPU, RAM, bộ nhớ và các linh kiện khác. Bài viết này sẽ hướng dẫn bạn cách chọn lựa các thành phần phù hợp với ngân sách và nhu cầu sử dụng.</p>

    <h3>1. Xác định ngân sách</h3>
    <p>Trước khi bắt đầu, bạn cần xác định rõ ngân sách của mình. PC gaming có thể có giá từ vài triệu đến hàng trăm triệu đồng, tùy thuộc vào cấu hình. Việc xác định ngân sách sẽ giúp bạn dễ dàng lựa chọn các linh kiện phù hợp.</p>

    <h3>2. Chọn CPU</h3>
    <p>CPU là "bộ não" của máy tính. Đối với PC gaming, bạn nên chọn CPU có ít nhất 6 nhân để đảm bảo hiệu năng tốt. Intel Core i5/i7 hoặc AMD Ryzen 5/7 là những lựa chọn phổ biến.</p>

    <h3>3. Lựa chọn GPU</h3>
    <p>GPU là thành phần quan trọng nhất đối với PC gaming. Nó quyết định khả năng xử lý đồ họa của máy tính. NVIDIA RTX 3060 trở lên hoặc AMD Radeon RX 6600 XT trở lên là những lựa chọn tốt cho gaming ở độ phân giải 1080p hoặc 1440p.</p>

    <h3>4. RAM và bộ nhớ</h3>
    <p>Đối với gaming hiện đại, 16GB RAM là mức tối thiểu bạn nên có. Về bộ nhớ, một ổ SSD NVMe để cài hệ điều hành và game là bắt buộc, kết hợp với HDD dung lượng lớn để lưu trữ.</p>

    <h3>5. Nguồn và tản nhiệt</h3>
    <p>Đừng tiết kiệm cho nguồn và hệ thống tản nhiệt. Một nguồn chất lượng tốt sẽ bảo vệ các linh kiện đắt tiền của bạn, trong khi hệ thống tản nhiệt tốt sẽ giúp máy tính hoạt động ổn định trong thời gian dài.</p>

    <p>Hy vọng với những hướng dẫn trên, bạn có thể chọn được một bộ PC gaming phù hợp với nhu cầu và ngân sách của mình.</p>`,
    image: "/news/pc-gaming.jpg",
    date: "2023-11-10",
    author: "Admin",
    category: "Hướng dẫn",
    views: 980,
    relatedNews: [1, 3]
  },
  {
    id: 3,
    title: "Khuyến mãi Black Friday - Giảm giá đến 50%",
    summary: "Cơ hội không thể bỏ lỡ với chương trình khuyến mãi Black Friday, giảm giá lên đến 50% cho nhiều sản phẩm công nghệ.",
    content: `<p>Black Friday năm nay, chúng tôi mang đến chương trình khuyến mãi cực lớn với mức giảm giá lên đến 50% cho nhiều sản phẩm công nghệ. Đây là cơ hội tuyệt vời để bạn sở hữu những sản phẩm công nghệ mới nhất với giá cực kỳ hấp dẫn.</p>

    <h3>Thời gian khuyến mãi</h3>
    <p>Chương trình khuyến mãi sẽ diễn ra từ ngày 24/11 đến hết ngày 27/11/2023. Trong thời gian này, bạn có thể mua sắm trực tiếp tại cửa hàng hoặc qua website của chúng tôi.</p>

    <h3>Sản phẩm khuyến mãi</h3>
    <p>Chương trình áp dụng cho nhiều sản phẩm công nghệ, bao gồm:</p>
    <ul>
      <li>Laptop gaming: Giảm đến 30%</li>
      <li>PC gaming: Giảm đến 25%</li>
      <li>Màn hình gaming: Giảm đến 40%</li>
      <li>Bàn phím, chuột gaming: Giảm đến 50%</li>
      <li>Tai nghe, loa: Giảm đến 45%</li>
      <li>Phụ kiện khác: Giảm đến 50%</li>
    </ul>

    <h3>Ưu đãi đặc biệt</h3>
    <p>Ngoài ra, khi mua sắm trong thời gian khuyến mãi, bạn còn nhận được nhiều ưu đãi đặc biệt như:</p>
    <ul>
      <li>Tặng voucher mua hàng cho lần tiếp theo</li>
      <li>Trả góp 0% lãi suất trong 6 tháng</li>
      <li>Bảo hành mở rộng thêm 6 tháng</li>
      <li>Giao hàng miễn phí toàn quốc</li>
    </ul>

    <p>Đừng bỏ lỡ cơ hội này để sở hữu những sản phẩm công nghệ mới nhất với giá tốt nhất trong năm!</p>`,
    image: "/news/black-friday.jpg",
    date: "2023-11-05",
    author: "Admin",
    category: "Khuyến mãi",
    views: 2100,
    relatedNews: [1, 4]
  },
  {
    id: 4,
    title: "Xu hướng công nghệ nổi bật năm 2023",
    summary: "Điểm qua những xu hướng công nghệ đang thịnh hành và sẽ định hình tương lai của ngành công nghệ trong năm 2023.",
    content: `<p>Năm 2023 chứng kiến sự phát triển mạnh mẽ của nhiều xu hướng công nghệ mới. Từ AI và machine learning, đến VR/AR, blockchain và IoT, những công nghệ này đang dần thay đổi cách chúng ta sống và làm việc.</p>

    <h3>1. AI và Machine Learning</h3>
    <p>Trí tuệ nhân tạo và học máy tiếp tục phát triển mạnh mẽ trong năm 2023. Các mô hình ngôn ngữ lớn như GPT-4 đã đạt được những bước tiến đáng kể, cho phép tạo ra nội dung, code và thậm chí cả hình ảnh với chất lượng gần như không thể phân biệt với con người.</p>

    <h3>2. Metaverse và VR/AR</h3>
    <p>Metaverse tiếp tục là xu hướng nổi bật, với nhiều công ty lớn đầu tư mạnh vào lĩnh vực này. Công nghệ VR/AR cũng ngày càng hoàn thiện, mang đến trải nghiệm thực tế ảo chân thực hơn với giá thành phải chăng hơn.</p>

    <h3>3. Blockchain và Web3</h3>
    <p>Mặc dù thị trường tiền điện tử có nhiều biến động, công nghệ blockchain vẫn tiếp tục phát triển với nhiều ứng dụng thực tế trong lĩnh vực tài chính, chuỗi cung ứng và xác thực danh tính.</p>

    <h3>4. Internet of Things (IoT)</h3>
    <p>IoT ngày càng trở nên phổ biến với sự gia tăng của các thiết bị thông minh trong gia đình và doanh nghiệp. Các tiêu chuẩn kết nối mới như Matter đang giúp các thiết bị từ các nhà sản xuất khác nhau có thể hoạt động cùng nhau một cách liền mạch.</p>

    <h3>5. Điện toán lượng tử</h3>
    <p>Điện toán lượng tử đã có những bước tiến đáng kể trong năm 2023, với nhiều công ty công bố các máy tính lượng tử có số lượng qubit lớn hơn và ổn định hơn. Mặc dù vẫn còn ở giai đoạn sơ khai, công nghệ này hứa hẹn sẽ mang đến những đột phá trong nhiều lĩnh vực như y học, khoa học vật liệu và mật mã học.</p>

    <p>Những xu hướng công nghệ này không chỉ định hình năm 2023 mà còn sẽ tiếp tục phát triển trong những năm tới, mang đến nhiều cơ hội và thách thức mới cho các doanh nghiệp và cá nhân.</p>`,
    image: "/news/tech-trends.jpg",
    date: "2023-10-28",
    author: "Admin",
    category: "Xu hướng",
    views: 1560,
    relatedNews: [1, 2]
  }
];

export default function NewsDetailPage() {
  const params = useParams();
  const [newsId, setNewsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsDetail, setNewsDetail] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);

  // Xử lý params là Promise trong Next.js 15
  useEffect(() => {
    async function extractParams() {
      try {
        if (params instanceof Promise) {
          const resolvedParams = await params;
          const id = resolvedParams.news_id as string;
          setNewsId(id);
        } else {
          const id = params.news_id as string;
          setNewsId(id);
        }
      } catch (error) {
        console.error("Error extracting params:", error);
      }
    }

    extractParams();
  }, [params]);

  // Tải dữ liệu bản tin khi có newsId
  useEffect(() => {
    if (!newsId) return;

    // Kiểm tra xem newsId có phải là URL từ GearVN không
    if (newsId.startsWith('http') || newsId.includes('gearvn.com')) {
      // Nếu là URL, chuyển hướng đến trang GearVN
      window.location.href = newsId;
      return;
    }

    // Giả lập việc tải dữ liệu
    const timer = setTimeout(() => {
      // Thử chuyển đổi newsId thành số nếu có thể
      let id;
      try {
        id = parseInt(newsId);
      } catch (e) {
        id = newsId; // Nếu không thể chuyển đổi, giữ nguyên dạng string
      }

      const news = sampleNews.find(item => {
        if (typeof item.id === 'number' && typeof id === 'number') {
          return item.id === id;
        }
        return String(item.id) === String(id);
      });

      if (news) {
        setNewsDetail(news);

        // Lấy bản tin liên quan
        if (news.relatedNews && news.relatedNews.length > 0) {
          const related = sampleNews.filter(item => news.relatedNews.includes(item.id));
          setRelatedNews(related);
        }
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [newsId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/news">Bản tin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <Skeleton className="h-4 w-24" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-64 w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!newsDetail) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy bản tin</h1>
          <p className="mb-6">Bản tin bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button asChild>
            <Link href="/news">Quay lại trang bản tin</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-1" />
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/news">Bản tin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{newsDetail.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Nội dung bản tin */}
      <article className="mb-10">
        <h1 className="text-3xl font-bold mb-4">{newsDetail.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {newsDetail.author}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(newsDetail.date).toLocaleDateString('vi-VN')}
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <Badge variant="outline">{newsDetail.category}</Badge>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {newsDetail.views} lượt xem
          </div>
        </div>

        <div className="relative h-80 w-full mb-6">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <Image
              src={newsDetail.image}
              alt={newsDetail.title}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: newsDetail.content }}
        />
      </article>

      {/* Bản tin liên quan */}
      {relatedNews.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Bản tin liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-blue-600">{item.category}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                    <Link href={`/news/${item.id}`}>{item.title}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('vi-VN')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{item.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
