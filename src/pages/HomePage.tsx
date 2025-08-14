import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import {
  MdSportsTennis,
  MdAdd,
  MdRateReview,
  MdPerson,
  MdSchedule,
  MdStar,
  MdRefresh,
  MdNotifications,
  MdChat,
  MdSearch,
} from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";
import {
  useHomeData,
  useJoinMatchFromHome,
  useUnreadNotificationCount,
  useUnreadChatNotificationCount,
} from "../hooks";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const theme = getThemeClasses();

  // API 호출
  const { data: homeData, isLoading, error, refetch } = useHomeData();
  const joinMatchMutation = useJoinMatchFromHome();
  const { data: notificationCount } = useUnreadNotificationCount();
  const { data: chatCount } = useUnreadChatNotificationCount();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // API 데이터가 있으면 사용, 없으면 fallback 로직 사용
    if (homeData?.user) {
      setGreeting(homeData.user.greeting);
      setMotivationMessage(homeData.user.motivationMessage);
    } else {
      const timeBasedGreeting = getTimeBasedGreeting();
      setGreeting(timeBasedGreeting.greeting);
      setMotivationMessage(timeBasedGreeting.message);
    }

    return () => clearInterval(timer);
  }, [currentTime, homeData]);

  // API 응답에서 시간에 따른 인사말 설정 (fallback 로직)
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) {
      return {
        greeting: "🌙 새벽 테니스도 좋아요",
        message: "열정 가득한 하루 시작하세요!",
      };
    } else if (hour < 12) {
      return { greeting: "🌅 좋은 아침이에요", message: "오늘도 화이팅!" };
    } else if (hour < 17) {
      return { greeting: "☀️ 안녕하세요", message: "활기찬 오후 되세요!" };
    } else if (hour < 20) {
      return {
        greeting: "🌆 저녁 테니스 어때요?",
        message: "하루를 멋지게 마무리해요!",
      };
    } else {
      return {
        greeting: "🌛 편안한 저녁이에요",
        message: "오늘 하루도 수고하셨어요!",
      };
    }
  };

  const upcomingMatches = homeData?.upcomingMatches || [];

  const menuItems = [
    {
      icon: MdSportsTennis,
      label: "빠른 매칭",
      path: "/matching",
      bgColor: tennisGradients.soft,
    },
    {
      icon: MdAdd,
      label: "매치 생성",
      path: "/create",
      bgColor: tennisGradients.primary,
    },
    {
      icon: MdRateReview,
      label: "리뷰하기",
      path: "/reviews",
      bgColor: `bg-gradient-to-br from-accent-400 to-accent-600`,
    },
    {
      icon: MdPerson,
      label: "내 기록",
      path: "/profile",
      bgColor: `bg-gradient-to-br from-secondary-400 to-secondary-600`,
    },
  ];

  const handleMatchClick = (matchId: string) => {
    navigate(`/matching/${matchId}`);
  };

  const handleJoinClick = (matchId: string) => {
    joinMatchMutation.mutate(
      {
        matchId,
        message: "참가 신청합니다!",
      },
      {
        onSuccess: () => {
          console.log("참가 신청 성공!");
          // 토스트 메시지나 알림 서비스로 성공 메시지 표시
        },
        onError: (error) => {
          console.error("참가 신청 실패:", error);
          // 에러 메시지 표시
        },
      }
    );
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/matching?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content transition-colors duration-300 pb-safe`}
    >
      {/* Modern Header - Fixed at Top */}
      <motion.header
        className={`${theme.background.glass} ${theme.text.primary} shadow-sm fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex px-6 py-2 items-center justify-between mb-2">
          <h1
            className={`text-lg font-bold ${theme.text.primary} flex items-center gap-2`}
          >
            <MdSportsTennis className={`${theme.text.tennis} w-5 h-5`} />홈
          </h1>
          <div className="flex items-center gap-3">
            <motion.button
              className={`p-2 rounded-full relative shadow-sm ${theme.surface.card}`}
              onClick={() => navigate("/notifications")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdNotifications className={`w-5 h-5 ${theme.text.secondary}`} />
              {notificationCount?.unreadCount !== undefined &&
                notificationCount.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount.unreadCount > 99
                      ? "99+"
                      : notificationCount.unreadCount}
                  </span>
                )}
            </motion.button>
            <motion.button
              className={`p-2 rounded-full relative shadow-sm ${theme.surface.card}`}
              onClick={() => navigate("/chat")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdChat className={`w-5 h-5 ${theme.text.secondary}`} />
              {chatCount?.count !== undefined && chatCount.count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {chatCount.count > 99 ? "99+" : chatCount.count}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[80px]" />

      {/* Quick Action Menu */}
      <motion.section
        className="px-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              className={`${item.bgColor} p-5 rounded-3xl shadow-lg text-white relative overflow-hidden`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
            >
              <motion.div
                className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 dark:bg-black/10 rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative z-10">
                <motion.div
                  className="text-3xl mb-2"
                  whileHover={{ rotate: [0, -15, 15, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon className="w-8 h-8" />
                </motion.div>
                <div className="font-semibold">{item.label}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Matches */}
      <motion.section
        className="px-2 mt-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-bold ${theme.text.primary} flex items-center gap-2`}
          >
            <MdSchedule className={`w-5 h-5 ${theme.text.tennis}`} />
            다가오는 매치
          </h2>
          {/* <motion.button
            className="text-sm font-medium"
            whileHover={{ x: 5 }}
            onClick={() => navigate("/matching")}
          >
            모두 보기 →
          </motion.button> */}
        </div>

        <div className="space-y-2">
          {isLoading ? (
            // Loading Skeleton
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl p-4 shadow-sm border ${theme.surface.card} ${theme.border.primary}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="animate-pulse">
                    <div
                      className={`h-4 ${theme.background.secondary} rounded mb-2`}
                    ></div>
                    <div
                      className={`h-3 ${theme.background.secondary} rounded w-3/4 mb-2`}
                    ></div>
                    <div
                      className={`h-3 ${theme.background.secondary} rounded w-1/2`}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <motion.div
              className={`text-center py-8 rounded-2xl ${theme.surface.card} border ${theme.border.primary}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`${theme.text.secondary} mb-4`}>
                매치 정보를 불러올 수 없습니다.
              </p>
              <motion.button
                className={`px-4 py-2 ${tennisGradients.primary} text-white rounded-full text-sm`}
                onClick={() => refetch()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                다시 시도
              </motion.button>
            </motion.div>
          ) : upcomingMatches.length > 0 ? (
            // Match List
            upcomingMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                index={index}
                onClick={handleMatchClick}
                onJoinClick={handleJoinClick}
              />
            ))
          ) : (
            // Empty State
            <motion.div
              className={`text-center py-8 rounded-2xl ${theme.surface.card} border ${theme.border.primary}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MdSportsTennis
                className={`w-12 h-12 ${theme.text.secondary} opacity-50 mx-auto mb-3`}
              />
              <p className={`${theme.text.primary} font-semibold mb-2`}>
                예정된 매치가 없습니다
              </p>
              <p className={`${theme.text.secondary} text-sm mb-4`}>
                새로운 매치를 만들거나 기존 매치에 참가해보세요!
              </p>
              <div className="flex gap-2 justify-center">
                <motion.button
                  className={`px-4 py-2 ${tennisGradients.primary} text-white rounded-full text-sm`}
                  onClick={() => navigate("/create")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  매치 만들기
                </motion.button>
                <motion.button
                  className={`px-4 py-2 ${theme.surface.card} border ${theme.border.primary} ${theme.text.primary} rounded-full text-sm`}
                  onClick={() => navigate("/matching")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  매치 찾기
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Join Match Loading */}
          {joinMatchMutation.isPending && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className={`p-6 rounded-2xl ${theme.surface.card} flex flex-col items-center`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="animate-spin w-8 h-8 border-4 border-tennis-court-200 dark:border-tennis-court-700 border-t-tennis-court-500 rounded-full mb-4"></div>
                <p className={`${theme.text.primary} font-medium`}>
                  참가 신청 중...
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Community Banner */}
      <motion.section
        className="px-2 mt-6 mb-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className={`bg-gradient-to-br from-primary-400 to-accent-500 dark:from-primary-600 dark:to-accent-700 p-5 rounded-3xl shadow-xl text-white relative overflow-hidden`}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/board")}
        >
          <motion.div
            className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <MdStar className="w-6 h-6" />
              함께 성장하는 테니스 커뮤니티
            </h3>
            <p className="text-white/90 text-sm mb-3">
              다른 플레이어들과 경험을 나누고 함께 실력을 키워요!
            </p>
            <motion.button
              className="bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              커뮤니티 둘러보기 →
            </motion.button>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
