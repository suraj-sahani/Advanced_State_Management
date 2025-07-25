'use client';
export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="text-right space-y-2">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
