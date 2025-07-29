'use client'

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, Home, ChevronRight, Eye, AlertCircle } from "lucide-react";

// Interface cho dữ liệu bản tin
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image: string;
  date: string;
  author: string;
  category: string;
  views: number;
  url: string;
}

async function fetchTechNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Kiểm tra cấu trúc dữ liệu
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid data structure');
    }
    
    // Chuyển đổi dữ liệu sang định dạng NewsItem
    //@ts-expect-error nothing
    return data.articles.map((article: unknown, index: number) => ({
      id: article.url ? encodeURIComponent(article.url) : `tech-${index}`,
      title: article.title || 'Không có tiêu đề',
      summary: article.description || 'Không có tóm tắt',
      image: article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image',
      date: article.publishedAt || new Date().toISOString(),
      author: article.author || article.source?.name || 'Unknown',
      category: 'Công nghệ',
      views: Math.floor(Math.random() * 1000) + 100, // Giả lập số lượt xem
      url: article.url || '#'
    }));
  } catch (error) {
    console.error('Error fetching tech news:', error);
    return [];
  }
}

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleNews, setVisibleNews] = useState<number>(6); // Số lượng bản tin hiển thị ban đầu
  const [hasMore, setHasMore] = useState<boolean>(true); // Còn bản tin để hiển thị không
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // Đang tải thêm bản tin

  // Tải dữ liệu từ NewsAPI
  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const techNews = await fetchTechNews();

        if (techNews.length > 0) {
          setNews(techNews);
          setHasMore(techNews.length > visibleNews);
          setError(null);
        } else {
          setError('Không thể tải dữ liệu bản tin công nghệ');
          const fallbackNews = [
            {
              id: '1',
              title: "Ra mắt dòng laptop gaming mới nhất",
              summary: "Khám phá những tính năng vượt trội của dòng laptop gaming mới nhất với hiệu năng cực mạnh và thiết kế ấn tượng.",
              image: "https://via.placeholder.com/300x200?text=Laptop+Gaming",
              date: "2023-11-15",
              author: "Tech News",
              category: "Công nghệ",
              views: 1250,
              url: "#"
            },
            {
              id: '2',
              title: "Hướng dẫn chọn mua PC gaming phù hợp",
              summary: "Những lưu ý quan trọng khi chọn mua PC gaming để đảm bảo hiệu năng tốt nhất cho nhu cầu của bạn.",
              image: "https://via.placeholder.com/300x200?text=PC+Gaming",
              date: "2023-11-10",
              author: "Tech News",
              category: "Công nghệ",
              views: 980,
              url: "#"
            }
          ];
          setNews(fallbackNews);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error in loadNews:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu bản tin');
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [visibleNews]);

  // Hàm để tải thêm bản tin
  const loadMoreNews = () => {
    setLoadingMore(true);
    // Giả lập việc tải thêm bản tin (thực tế chỉ hiển thị thêm từ danh sách đã có)
    setTimeout(() => {
      setVisibleNews(prevVisible => {
        const newVisible = prevVisible + 6; // Tải thêm 6 bản tin mỗi lần
        setHasMore(newVisible < news.length);
        return newVisible;
      });
      setLoadingMore(false);
    }, 800);
  };

  // Memoize the visible news to prevent unnecessary re-renders
  const visibleNewsItems = useMemo(() => {
    return news.slice(0, visibleNews);
  }, [news, visibleNews]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className='text-black flex'>
              <Home className="h-5 w-5 mr-1 text-black" />
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4 text-black" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/news" className='text-black'>Bản tin</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tiêu đề trang */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Bản Tin Công Nghệ</h1>
        <p className="text-gray-800">Cập nhật những tin tức mới nhất về công nghệ, sản phẩm và khuyến mãi</p>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">{error}</p>
          </div>
          <p className="mt-2 text-sm">Đang hiển thị dữ liệu mẫu thay thế.</p>
        </div>
      )}

      {/* Danh sách bản tin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton loading
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-1/3" />
              </CardFooter>
            </Card>
          ))
        ) : (
          // Hiển thị số lượng bản tin giới hạn theo visibleNews
          visibleNewsItems.map((item, index) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105 w-auto h-auto"
                    priority={index < 3} // Priority for first 3 images (above the fold)
                    loading={index < 3 ? 'eager' : 'lazy'} // Eager loading for first 3
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGxwf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5WHTlw4VrkonMuu5pGpjPzEb5BNbZFcyotMLLxp9CU/SQSfY8gvLWFaHNRFz1g3w=="
                    onError={(e) => {
                      // Fallback image if the original fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/300x200?text=Tech+News";
                    }}
                  />
                </div>
                <Badge className="absolute top-2 right-2 bg-blue-600 z-10">{item.category}</Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors text-lg">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    <Link href={`/news/${item.id}`}>{item.title}</Link>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs mt-2">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(item.date).toLocaleDateString('vi-VN')}
                  <Eye className="h-3 w-3 ml-2" />
                  {item.views}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <p className="text-gray-600 text-sm line-clamp-3">{item.summary}</p>
              </CardContent>
              <CardFooter className="pt-2 mt-auto">
                <Button asChild variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors w-full">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      Đọc tiếp <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  ) : (
                    <Link href={`/news/${item.id}`} className="flex items-center justify-center">
                      Đọc tiếp <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Nút Xem thêm */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-10">
          <Button
            onClick={loadMoreNews}
            variant="outline"
            className="px-8 py-2 border-blue-500 text-blue-600 hover:bg-blue-50"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải...
              </>
            ) : (
              <>
                Xem thêm bản tin
              </>
            )}
          </Button>
        </div>
      )}

      {/* Nguồn dữ liệu */}
      {/* <div className="mt-10 text-center text-sm text-gray-500">
        <p>Dữ liệu bản tin được lấy từ <a href="https://github.com/SauravKanchan/NewsAPI" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NewsAPI</a></p>
      </div> */}
    </div>
  );
}
