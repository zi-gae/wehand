import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdArrowBack,
  MdForum,
  MdAdd,
  MdThumbUp,
  MdComment,
  MdSchedule,
  MdPerson,
  MdSearch,
  MdMoreVert,
  MdLocalFireDepartment,
  MdTipsAndUpdates,
  MdSportsTennis,
  MdHelp,
  MdCampaign,
} from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";
import { usePosts } from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const categoryMap = {
  free: { label: "자유게시판", icon: MdForum },
  tips: { label: "팁/기술", icon: MdTipsAndUpdates },
  equipment: { label: "장비", icon: MdSportsTennis },
  match: { label: "경기후기", icon: MdSportsTennis },
  question: { label: "질문", icon: MdHelp },
  announcement: { label: "공지사항", icon: MdCampaign },
};

const BoardPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "free"
  );
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">(
    "latest"
  );

  const {
    data: postsData,
    isLoading,
    error,
  } = usePosts({
    search: searchQuery,
    category: selectedCategory,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory && selectedCategory !== "free")
      params.set("category", selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handlePostClick = (postId: string) => {
    navigate(`/board/${postId}`);
  };

  const handleWriteClick = () => {
    navigate("/board/write");
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content pb-safe transition-colors duration-300`}
    >
      {/* Header */}
      <motion.header
        className={`${theme.background.glass} ${theme.text.primary} shadow-sm sticky top-0 z-40 transition-colors duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-center flex-1">
            <h1
              className={`text-lg font-bold ${theme.text.primary} flex items-center justify-center gap-2`}
            >
              {categoryMap[selectedCategory as keyof typeof categoryMap]
                ?.label || "게시판"}
            </h1>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {Object.entries(categoryMap).map(([key, value]) => (
              <motion.button
                key={key}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === key
                    ? `${tennisGradients.primary} text-white`
                    : `${theme.surface.card} ${theme.text.secondary} border ${theme.border.primary}`
                }`}
                onClick={() => setSelectedCategory(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {value.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-2">
          <div className="relative">
            <MdSearch
              className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${theme.text.secondary} w-3.5 h-3.5`}
            />
            <input
              type="text"
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg shadow-sm text-sm ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400`}
            />
          </div>
        </div>
      </motion.header>

      <div className="px-2 py-4">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 shadow-sm ${theme.surface.card} border ${theme.border.primary} animate-pulse`}
              >
                {/* 배지 스켈레톤 */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-12"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-10"></div>
                </div>

                {/* 제목 스켈레톤 */}
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>

                {/* 내용 스켈레톤 */}
                <div className="space-y-1 mb-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>

                {/* 하단 정보 스켈레톤 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`text-center py-8 ${theme.text.secondary}`}>
            게시글을 불러오는데 실패했습니다.
          </div>
        )}

        {/* Posts List */}
        {!isLoading && !error && (
          <div className="space-y-2">
            <AnimatePresence>
              {postsData?.map((post, index) => {
                const isHot =
                  (post.likes_count || 0) > 20 ||
                  (post.comments_count || 0) > 10;
                const isPinned = post.category === "announcement";

                return (
                  <motion.div
                    key={post.id}
                    className={`rounded-2xl p-4 shadow-sm cursor-pointer relative ${theme.surface.card} border ${theme.border.primary}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handlePostClick(post.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Pinned & Hot Badges */}
                    <div className="flex items-center gap-2 mb-2">
                      {isPinned && (
                        <span className="bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400 px-2 py-1 rounded-lg text-xs font-medium">
                          📌 공지
                        </span>
                      )}
                      {isHot && (
                        <span className="bg-status-error-100 text-status-error-700 dark:bg-status-error-900/20 dark:text-status-error-400 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <MdLocalFireDepartment className="w-3 h-3" />
                          HOT
                        </span>
                      )}
                    </div>

                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold ${theme.text.primary} mb-1 line-clamp-2`}
                        >
                          {post.title}
                        </h3>

                        <p
                          className={`text-sm ${theme.text.secondary} mb-3 line-clamp-2`}
                        >
                          {post.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-3 text-xs ${theme.text.secondary}`}
                          >
                            <span className="flex items-center gap-1">
                              <MdPerson className="w-3 h-3" />
                              {post.author?.nickname || "익명"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MdSchedule className="w-3 h-3" />
                              {formatTime(post.created_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`flex items-center gap-1 text-xs ${theme.text.secondary}`}
                            >
                              <MdThumbUp className="w-3 h-3" />
                              {post.likes_count || 0}
                            </span>
                            <span
                              className={`flex items-center gap-1 text-xs ${theme.text.secondary}`}
                            >
                              <MdComment className="w-3 h-3" />
                              {post.comments_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State */}
            {postsData?.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${theme.surface.card}`}
                >
                  <MdForum
                    className={`w-10 h-10 ${theme.text.secondary} opacity-50`}
                  />
                </div>
                <h3
                  className={`text-xl font-semibold ${theme.text.primary} mb-2`}
                >
                  게시글이 없습니다
                </h3>
                <p className={`${theme.text.secondary} mb-6`}>
                  첫 번째 게시글을 작성해보세요!
                </p>
                <motion.button
                  className={`${tennisGradients.primary} text-white px-6 py-3 rounded-full font-medium`}
                  onClick={handleWriteClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  글쓰기
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Floating Write Button */}
      <motion.button
        className={`fixed bottom-24 right-6 w-14 h-14 ${tennisGradients.primary} text-white rounded-full shadow-lg flex items-center justify-center z-30`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWriteClick}
      >
        <MdAdd className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};

export default BoardPage;
