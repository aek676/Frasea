import { HistorySkeleton } from "@/components/historial/HistorySkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-10 w-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg animate-pulse"></div>
            <div className="h-5 w-48 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <HistorySkeleton />
      </div>
    </div>
  );
}

