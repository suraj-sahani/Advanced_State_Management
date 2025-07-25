import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FlightSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <Skeleton className="h-6 w-16 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  <div className="text-center">
                    <Skeleton className="h-6 w-16 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
