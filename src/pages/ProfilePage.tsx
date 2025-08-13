import { motion } from "framer-motion";
import { useState } from "react";
import {
  MdArrowBack,
  MdEdit,
  MdHelp,
  MdHistory,
  MdLogout,
  MdNotifications,
  MdRateReview,
  MdSportsTennis,
  MdThumbDown,
  MdThumbUp,
  MdDescription,
  MdSecurity,
  MdSettings,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useLogout } from "../hooks";
import { useMyReviews, useProfile } from "../hooks/useProfile";
import { getThemeClasses, tennisGradients } from "../lib/theme";

const ProfilePageContent = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // API 훅
  const logoutMutation = useLogout();
  const {
    data: userData,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const { data: reviewsData, isLoading: reviewsLoading } = useMyReviews();

  // 사용자 정보 처리
  const userInfo = {
    name: userData?.userInfo?.name || "사용자",
    nickname:
      userData?.userInfo?.nickname ||
      userData?.userInfo?.email?.split("@")[0] ||
      "user",
    bio: userData?.userInfo?.bio || "프로필을 작성해주세요.",
    profileImage: userData?.userInfo?.profileImageUrl || null,
    ntrp: userData?.userInfo?.ntrp ?? 3.5,
    experience: userData?.userInfo?.experience_years
      ? `${userData.userInfo?.experience_years}년`
      : "-",
    favoriteStyle: userData?.userInfo?.favorite_style || "미설정",
    joinDate: "-", // created_at은 User 타입에 없음
    positiveReviews: userData?.userInfo?.positive_reviews ?? 0,
    negativeReviews: userData?.userInfo?.negative_reviews ?? 0,
    totalReviews: userData?.userInfo?.total_reviews ?? 0,
    reviewNtrp: userData?.userInfo?.review_ntrp ?? 0,
  };

  const menuItems = [
    {
      id: 1,
      icon: MdEdit,
      title: "프로필 수정",
      description: "개인정보 및 테니스 정보 수정",
      color:
        "text-accent-600 bg-accent-100 dark:text-accent-400 dark:bg-accent-900/20",
    },
    {
      id: 2,
      icon: MdHistory,
      title: "경기 기록",
      description: "나의 모든 매치 기록 확인",
      color:
        "text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/20",
    },
    {
      id: 3,
      icon: MdSettings,
      title: "설정",
      description: "알림, 테마 및 기타 설정",
      color: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20",
    },
    {
      id: 4,
      icon: MdNotifications,
      title: "알림 설정",
      description: "푸시 알림 및 이메일 설정",
      color: "text-purple-600 bg-purple-100",
    },
    {
      id: 7,
      icon: MdHelp,
      title: "고객 지원",
      description: "문의사항 및 자주 묻는 질문",
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const handleMenuClick = (menuId: number) => {
    switch (menuId) {
      case 1:
        navigate("/profile/edit");
        break;
      case 2:
        break;
      case 3:
        navigate("/settings");
        break;
      case 5:
        navigate("/terms");
        break;
      case 6:
        navigate("/privacy");
        break;
      default:
        break;
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
        navigate("/signup", { replace: true });
      },
      onError: () => {
        setShowLogoutModal(false);
        navigate("/signup", { replace: true });
      },
    });
  };
  const handleLogoutCancel = () => setShowLogoutModal(false);

  if (profileLoading) {
    return (
      <div
        className={`min-h-screen ${theme.background.tennis} page-content pb-safe`}
      >
        {/* Header Skeleton */}
        <div
          className={`${theme.background.glass} shadow-sm sticky top-0 z-40`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="px-2 py-4 space-y-4">
          {/* Profile Card Skeleton */}
          <div
            className={`rounded-2xl p-6 border shadow-sm ${theme.surface.card} ${theme.border.primary}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Tennis Info Card Skeleton */}
          <div
            className={`rounded-2xl p-6 border shadow-sm ${theme.surface.card} ${theme.border.primary}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10 animate-pulse" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Review Card Skeleton */}
          <div
            className={`rounded-2xl p-6 border shadow-sm ${theme.surface.card} ${theme.border.primary}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl py-4"
                >
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2 animate-pulse" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>

          {/* Menu Items Skeleton */}
          <div
            className={`rounded-2xl border shadow-sm ${theme.surface.card} ${theme.border.primary}`}
          >
            <div className={`divide-y ${theme.border.primary}`}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button Skeleton */}
          <div
            className={`rounded-2xl border shadow-sm ${theme.surface.card} ${theme.border.primary}`}
          >
            <div className="p-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className={`min-h-screen ${theme.background.tennis} p-6`}>
        사용자 정보를 불러오지 못했습니다.
      </div>
    );
  }

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
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>
          <div className="text-center flex-1">
            <h1
              className={`text-lg font-bold ${theme.text.primary} flex items-center justify-center gap-2`}
            >
              프로필
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>
      <div className="px-2 py-4">
        {/* Profile Card */}
        <motion.div
          className={`rounded-2xl p-6 mb-4 border shadow-sm ${theme.surface.card} ${theme.border.primary}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              {userInfo.profileImage ? (
                <img
                  src={userInfo.profileImage}
                  alt={userInfo.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-tennis-court-500 to-tennis-ball-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {userInfo.name.charAt(0)}
                  </span>
                </div>
              )}
              <motion.button
                className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-lg flex items-center justify-center ${theme.surface.card}`}
                onClick={() => navigate("/profile/edit")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MdEdit className="w-4 h-4 text-tennis-court-600 dark:text-tennis-court-400" />
              </motion.button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-xl font-bold mb-1 ${theme.text.primary}`}>
                {userInfo.name}
              </h2>
              <p className="text-tennis-court-600 dark:text-tennis-court-400 font-medium mb-2">
                @{userInfo.nickname}
              </p>
              <p className={`text-sm leading-relaxed ${theme.text.primary}`}>
                {userInfo.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tennis Info Card */}
        <motion.div
          className={`rounded-2xl p-6 shadow-sm border mb-4 ${theme.surface.card} ${theme.border.primary}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3
            className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.text.primary}`}
          >
            <MdSportsTennis className="w-5 h-5 text-tennis-court-600 dark:text-tennis-court-400" />
            테니스 정보
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-tennis-court-50 dark:bg-tennis-court-900/20 rounded-xl p-3">
              <div className="text-2xl font-bold text-tennis-court-600 dark:text-tennis-court-400 mb-1">
                {userInfo.ntrp}
              </div>
              <div className="text-xs text-tennis-court-700 dark:text-tennis-court-400 font-medium">
                NTRP
              </div>
            </div>
            <div className="bg-tennis-ball-50 dark:bg-tennis-ball-900/20 rounded-xl p-3">
              <div className="text-2xl font-bold text-tennis-ball-600 dark:text-tennis-ball-400 mb-1">
                {userInfo.experience}
              </div>
              <div className="text-xs text-tennis-ball-700 dark:text-tennis-ball-400 font-medium">
                경력
              </div>
            </div>
          </div>
        </motion.div>

        {/* Review Card */}
        <motion.div
          className={`rounded-2xl p-6 shadow-sm border mb-4 ${theme.surface.card} ${theme.border.primary}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-bold flex items-center gap-2 ${theme.text.primary}`}
            >
              <MdRateReview className="w-5 h-5 text-tennis-court-600 dark:text-tennis-court-400" />
              매치 리뷰
            </h3>
            {reviewsLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-tennis-ball-500" />
            )}
          </div>

          {reviewsLoading ? (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl py-4 animate-pulse"
                  >
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ) : userInfo.totalReviews === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdRateReview className="w-8 h-8 text-gray-400" />
              </div>
              <p className={`font-medium ${theme.text.primary} mb-2`}>
                아직 받은 리뷰가 없습니다
              </p>
              <p className={`text-sm ${theme.text.secondary}`}>
                매치에 참여하고 리뷰를 받아보세요!
              </p>
              <motion.button
                className={`mt-4 px-4 py-2 rounded-full ${tennisGradients.primary} text-white text-sm font-medium`}
                onClick={() => navigate("/matching")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                매치 찾아보기
              </motion.button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center bg-tennis-court-50 dark:bg-tennis-court-900/20 rounded-xl py-4">
                  <div className="flex items-center justify-center mb-2">
                    <MdThumbUp className="w-6 h-6 text-tennis-court-600 dark:text-tennis-court-400" />
                  </div>
                  <div className="text-2xl font-bold text-tennis-court-600 dark:text-tennis-court-400 mb-1">
                    {userInfo.positiveReviews}
                  </div>
                  <div className="text-xs text-tennis-court-700 dark:text-tennis-court-400 font-medium">
                    좋아요
                  </div>
                </div>
                <div className="text-center bg-status-error-50 dark:bg-status-error-900/20 rounded-xl py-4">
                  <div className="flex items-center justify-center mb-2">
                    <MdThumbDown className="w-6 h-6 text-status-error-600 dark:text-status-error-400" />
                  </div>
                  <div className="text-2xl font-bold text-status-error-600 dark:text-status-error-400 mb-1">
                    {userInfo.negativeReviews}
                  </div>
                  <div className="text-xs text-status-error-700 dark:text-status-error-400 font-medium">
                    별로예요
                  </div>
                </div>
                <div className="text-center bg-tennis-ball-50 dark:bg-tennis-ball-900/20 rounded-xl py-4">
                  <div className="flex items-center justify-center mb-2">
                    <MdSportsTennis className="w-6 h-6 text-tennis-ball-600 dark:text-tennis-ball-400" />
                  </div>
                  <div className="text-2xl font-bold text-tennis-ball-600 dark:text-tennis-ball-400 mb-1">
                    {userInfo.reviewNtrp > 0
                      ? userInfo.reviewNtrp.toFixed(1)
                      : "-"}
                  </div>
                  <div className="text-xs text-tennis-ball-700 dark:text-tennis-ball-400 font-medium">
                    리뷰 NTRP
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${theme.text.primary}`}>
                    총 {userInfo.totalReviews}개 리뷰
                  </span>
                  <span className={`text-sm ${theme.text.secondary}`}>
                    {userInfo.totalReviews > 0
                      ? `${Math.round(
                          (userInfo.positiveReviews / userInfo.totalReviews) *
                            100
                        )}% 긍정적`
                      : "0% 긍정적"}
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-3 ${theme.border.primary} bg-gray-200 dark:bg-gray-700`}
                >
                  <div
                    className="bg-gradient-to-r from-tennis-court-500 to-tennis-ball-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width:
                        userInfo.totalReviews > 0
                          ? `${
                              (userInfo.positiveReviews /
                                userInfo.totalReviews) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
              {reviewsData && reviewsData.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4
                    className={`text-sm font-medium ${theme.text.primary} mb-2`}
                  >
                    최근 리뷰
                  </h4>
                  {reviewsData.slice(0, 3).map((review: any, index: number) => (
                    <motion.div
                      key={review.id}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {review.isPositive ? (
                            <MdThumbUp className="w-4 h-4 text-tennis-court-600 dark:text-tennis-court-400" />
                          ) : (
                            <MdThumbDown className="w-4 h-4 text-status-error-600 dark:text-status-error-400" />
                          )}
                          <span
                            className={`text-xs font-medium ${theme.text.primary}`}
                          >
                            {review.reviewerName || "익명"}
                          </span>
                        </div>
                        {typeof review.rating === "number" && (
                          <span className={`text-xs ${theme.text.secondary}`}>
                            NTRP {review.rating}
                          </span>
                        )}
                      </div>
                      {review.comment && (
                        <p
                          className={`text-xs ${theme.text.secondary} line-clamp-2`}
                        >
                          {review.comment}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="bg-tennis-court-50 dark:bg-tennis-court-900/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MdRateReview className="w-4 h-4 text-tennis-court-600 dark:text-tennis-court-400" />
                  <span
                    className={`font-semibold text-sm ${theme.text.primary}`}
                  >
                    매치 후 리뷰
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed ${theme.text.secondary}`}
                >
                  매치가 끝난 후 상대방이 남긴 평가입니다.
                  <span className="text-tennis-court-600 dark:text-tennis-court-400 font-medium">
                    좋아요 {userInfo.positiveReviews}개
                  </span>
                  ,
                  <span className="text-status-error-600 dark:text-status-error-400 font-medium">
                    별로예요 {userInfo.negativeReviews}개
                  </span>
                  를 받았습니다.
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className={`rounded-2xl shadow-sm border mb-4 ${theme.surface.card} ${theme.border.primary}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className={`divide-y ${theme.border.primary}`}>
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                className={`w-full flex items-center gap-4 p-4 hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl`}
                onClick={() => handleMenuClick(item.id)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`font-semibold ${theme.text.primary}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    {item.description}
                  </p>
                </div>
                <div className={theme.text.secondary}>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          className={`rounded-2xl shadow-sm border ${theme.surface.card} ${theme.border.primary}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="w-full flex items-center justify-center gap-3 p-4 text-status-error-600 dark:text-status-error-400 hover:bg-status-error-50 dark:hover:bg-status-error-900/10 transition-colors rounded-2xl"
            onClick={handleLogoutClick}
            disabled={logoutMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdLogout className="w-5 h-5" />
            <span className="font-semibold">
              {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-full max-w-sm rounded-2xl p-6 ${theme.surface.card} ${theme.border.primary} border shadow-xl`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-status-error-100 dark:bg-status-error-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdLogout className="w-8 h-8 text-status-error-600 dark:text-status-error-400" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${theme.text.primary}`}>
                로그아웃 하시겠습니까?
              </h3>
              <p className={`text-sm ${theme.text.secondary}`}>
                로그아웃하면 다시 로그인해야 합니다.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                className={`flex-1 py-3 px-4 rounded-xl font-medium ${theme.surface.card} ${theme.text.primary} border ${theme.border.primary} transition-colors`}
                onClick={handleLogoutCancel}
                disabled={logoutMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                취소
              </motion.button>
              <motion.button
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors ${
                  logoutMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-status-error-500 hover:bg-status-error-600"
                }`}
                onClick={handleLogoutConfirm}
                disabled={logoutMutation.isPending}
                whileHover={!logoutMutation.isPending ? { scale: 1.02 } : {}}
                whileTap={!logoutMutation.isPending ? { scale: 0.98 } : {}}
              >
                {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// 메인 ProfilePage 컴포넌트 (Suspense 제거)
const ProfilePage = () => {
  return <ProfilePageContent />;
};

export default ProfilePage;
