import React from "react";

const ChatMessagesSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* 받은 메시지 스켈레톤 */}
      <div className="flex justify-start">
        <div className="max-w-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          </div>
          <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-3 animate-pulse"></div>
        </div>
      </div>

      {/* 보낸 메시지 스켈레톤 */}
      <div className="flex justify-end">
        <div className="max-w-xs space-y-2">
          <div className="px-4 py-3 bg-tennis-ball-200 dark:bg-tennis-ball-800 rounded-2xl animate-pulse">
            <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-36 mb-2"></div>
            <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-28"></div>
          </div>
          <div className="flex justify-end items-center gap-2 mr-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
            <div className="h-3 bg-tennis-ball-200 dark:bg-tennis-ball-700 rounded w-8 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 시스템 메시지 스켈레톤 */}
      <div className="flex justify-center">
        <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        </div>
      </div>

      {/* 확정 요청 카드 스켈레톤 */}
      <div className="flex justify-center">
        <div className="max-w-sm w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-full"></div>
        </div>
      </div>

      {/* 추가 메시지 스켈레톤들 */}
      <div className="flex justify-start">
        <div className="max-w-xs">
          <div className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-xs">
          <div className="px-4 py-3 bg-tennis-ball-200 dark:bg-tennis-ball-800 rounded-2xl animate-pulse">
            <div className="h-4 bg-tennis-ball-300 dark:bg-tennis-ball-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessagesSkeleton;