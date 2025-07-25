export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#121416] dark:text-white">
        Your Trips
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Trip cards will go here */}
        <div className="p-4 rounded-lg border border-[#f1f2f4] dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-[#121416] dark:text-white">
            No trips yet
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Create your first trip to get started
          </p>
        </div>
      </div>
    </div>
  );
}
