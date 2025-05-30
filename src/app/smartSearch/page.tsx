import { Suspense } from 'react';
import SmartSearchContent from './SmartSearchContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

function SearchLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => (
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
        ))}
      </div>
    </div>
  );
}

export default function SmartSearchPage() {
  return (
    <Suspense fallback={<SearchLoadingSkeleton />}>
      <SmartSearchContent />
    </Suspense>
  );
}
