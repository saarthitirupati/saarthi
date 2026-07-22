import React from 'react';

export default function SkeletonRenderer() {
  return (
    <div className="animate-pulse px-4 py-6 space-y-8">
      {/* Skeleton Hero / Live Card */}
      <div className="h-32 bg-gray-200 rounded-3xl w-full"></div>
      
      {/* Skeleton Best Right Now */}
      <div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
          <div className="shrink-0 w-64 h-56 bg-gray-200 rounded-2xl"></div>
          <div className="shrink-0 w-64 h-56 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>

      {/* Skeleton Essentials */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}
