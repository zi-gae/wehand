import { AnimatePresence, motion } from "framer-motion";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  MdAdd,
  MdChat,
  MdClose,
  MdFilterList,
  MdNotifications,
  MdPlace,
  MdSchedule,
  MdSearch,
  MdSort,
  MdSports,
  MdSportsTennis,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  parseAsString,
  parseAsFloat,
  parseAsInteger,
  parseAsArrayOf,
  useQueryStates,
} from "nuqs";
import BottomSheet from "../components/BottomSheet";
import LoadingFallback from "../components/LoadingFallback";
import MatchCard from "../components/MatchCard";
import TimeSlotSelector from "../components/ui/TimeSlotSelector";
import { regionData } from "../data/regionData";
import {
  useJoinMatch,
  useSuspenseInfiniteMatches,
  useUnreadNotificationCount,
  useUnreadChatNotificationCount,
} from "../hooks";
import { getThemeClasses, tennisGradients } from "../lib/theme";
import { ScrollToTop } from "@/components/ScrollToTop";

interface MatchingFilters {
  search: string;
  region: string;
  gameType: string; // UI에서는 gameType 유지
  date: string;
  timeSlots: string[];
  ntrpMin: number;
  ntrpMax: number;
  experienceMin: number;
  experienceMax: number;
}

// 컨텐츠 컴포넌트 (Suspense로 감쌀 부분)
const MatchingPageContentSuspense = ({
  appliedFilters,
  sortBy,
  userLocation,
}: {
  appliedFilters: MatchingFilters;
  sortBy: string;
  userLocation: { latitude: number; longitude: number } | null;
}) => {
  const navigate = useNavigate();
  const theme = getThemeClasses();

  // 게임 타입 매핑 함수
  const mapGameTypeToApi = (gameType: string) => {
    const mapping: Record<string, string> = {
      단식: "singles",
      남복: "mens_doubles",
      여복: "womens_doubles",
      혼복: "mixed_doubles",
    };
    return mapping[gameType] || "";
  };

  // API 훅들
  const matchParams = useMemo(() => {
    const params: Record<string, any> = {};

    // 빈 값이 아닌 경우만 파라미터에 추가
    if (appliedFilters.search.trim()) {
      params.search = appliedFilters.search;
    }
    if (appliedFilters.region.trim()) {
      params.region = appliedFilters.region;
    }
    const mappedGameType = mapGameTypeToApi(appliedFilters.gameType);
    if (mappedGameType) {
      params.gameType = mappedGameType;
    }
    if (appliedFilters.date) {
      params.date = appliedFilters.date;
    }
    if (appliedFilters.timeSlots.length > 0) {
      params.timeSlots = appliedFilters.timeSlots.join(",");
    }
    // NTRP 기본값이 아닌 경우만 추가
    if (appliedFilters.ntrpMin !== 1.0 || appliedFilters.ntrpMax !== 7.0) {
      params.ntrpMin = appliedFilters.ntrpMin;
      params.ntrpMax = appliedFilters.ntrpMax;
    }
    // 구력 기본값이 아닌 경우만 추가
    if (
      appliedFilters.experienceMin !== 0 ||
      appliedFilters.experienceMax !== 10
    ) {
      params.experienceMin = appliedFilters.experienceMin;
      params.experienceMax = appliedFilters.experienceMax;
    }
    if (sortBy) {
      params.sort = sortBy;
    }
    if (userLocation && sortBy === "distance") {
      params.latitude = userLocation.latitude;
      params.longitude = userLocation.longitude;
    }

    return params;
  }, [appliedFilters, sortBy, userLocation]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSuspenseInfiniteMatches(matchParams);

  const joinMatchMutation = useJoinMatch();

  // 모든 페이지의 매치를 하나의 배열로 합치기
  const matches = data?.pages?.flatMap((page) => page || []) || [];

  // 전체 매치 수 계산 (로드된 매치 수)
  const totalMatches = matches.length;

  // 무한 스크롤을 위한 observer 설정
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleMatchClick = (matchId: string) => {
    if (!matchId) {
      console.error("매치 ID가 없습니다");
      return;
    }
    navigate(`/matching/${matchId}`);
  };

  const handleJoinClick = (matchId: string) => {
    if (!matchId) {
      console.error("매치 ID가 없습니다");
      return;
    }
    joinMatchMutation.mutate(
      {
        matchId: matchId,
        message: "참가 신청합니다!",
      },
      {
        onSuccess: () => {
          console.log("참가 신청 성공!");
          // 매치 목록 새로고침
          refetch();
        },
        onError: (error) => {
          console.error("참가 신청 실패:", error);
        },
      }
    );
  };

  return (
    <>
      {/* Results Count */}
      <div className="px-2 py-2">
        <div className="flex items-center justify-between">
          <p className={`${theme.text.secondary} text-sm`}>
            {hasNextPage
              ? `${totalMatches}개 이상의`
              : `총 ${totalMatches}개의`}{" "}
            매칭을 찾았습니다
          </p>
        </div>
      </div>

      {/* Match Cards */}
      <div className="px-2 space-y-2 py-3">
        {matches.length > 0 ? (
          <>
            {/* Match List */}
            {matches.map((match, index) => (
              <MatchCard
                key={match.id || `match-${index}`}
                match={match}
                index={index}
                onClick={handleMatchClick}
                onJoinClick={handleJoinClick}
              />
            ))}

            {/* 무한 스크롤 트리거 */}
            <div ref={loadMoreRef} className="py-4">
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-tennis-court-200 dark:border-tennis-court-700 border-t-tennis-court-500 rounded-full"></div>
                </div>
              )}
              {!hasNextPage && matches.length >= 10 && (
                <p className={`text-center ${theme.text.secondary} text-sm`}>
                  모든 매칭을 불러왔습니다
                </p>
              )}
            </div>
          </>
        ) : (
          // Empty State
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MdSportsTennis
              className={`w-16 h-16 ${theme.text.secondary} opacity-30 mx-auto mb-4`}
            />
            <h3 className={`text-xl font-semibold ${theme.text.primary} mb-2`}>
              매칭을 찾을 수 없습니다
            </h3>
            <p className={`${theme.text.secondary} mb-6`}>
              검색 조건을 변경하거나 새로운 매치를 생성해보세요.
            </p>
            <motion.button
              className={`${tennisGradients.primary} text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto`}
              onClick={() => navigate("/create")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdAdd className="w-5 h-5" />새 매치 만들기
            </motion.button>
          </motion.div>
        )}

        {/* Join Match Loading Overlay */}
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
    </>
  );
};

const MatchingPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("datetime");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");

  // 페이지 방문 시 스크롤을 최상단으로

  // 알림 카운트 훅
  const { data: notificationCount } = useUnreadNotificationCount();
  const { data: chatCount } = useUnreadChatNotificationCount();

  // URL 쿼리 스트링으로 필터 값 관리
  const [queryFilters, setQueryFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      region: parseAsString.withDefault(""),
      gameType: parseAsString.withDefault(""),
      date: parseAsString.withDefault(""),
      timeSlots: parseAsArrayOf(parseAsString).withDefault([]),
      ntrpMin: parseAsFloat.withDefault(1.0),
      ntrpMax: parseAsFloat.withDefault(7.0),
      experienceMin: parseAsInteger.withDefault(0),
      experienceMax: parseAsInteger.withDefault(10),
      sort: parseAsString.withDefault("latest"),
      activeTab: parseAsString.withDefault("all"),
    },
    {
      history: "push",
      scroll: false,
      clearOnDefault: true,
    }
  );

  // 실제 적용된 필터 (매칭 리스트에 사용)
  const appliedFilters: MatchingFilters = {
    search: queryFilters.search,
    region: queryFilters.region,
    gameType: queryFilters.gameType,
    date: queryFilters.date,
    timeSlots: queryFilters.timeSlots,
    ntrpMin: queryFilters.ntrpMin,
    ntrpMax: queryFilters.ntrpMax,
    experienceMin: queryFilters.experienceMin,
    experienceMax: queryFilters.experienceMax,
  };

  const sortBy = queryFilters.sort;
  const activeTab = queryFilters.activeTab;

  // 임시 필터 상태 (모달에서 편집 중)
  const [tempFilters, setTempFilters] = useState<MatchingFilters>({
    search: "",
    region: "",
    gameType: "",
    date: "",
    timeSlots: [],
    ntrpMin: 1.0,
    ntrpMax: 7.0,
    experienceMin: 0,
    experienceMax: 10,
  });

  const filterTabs = [
    { id: "datetime", label: "날짜·시간", icon: MdSchedule },
    { id: "location", label: "위치", icon: MdPlace },
    { id: "game", label: "게임·실력", icon: MdSports },
  ];

  const handleFilterChange = (
    key: keyof MatchingFilters,
    value: string | string[] | number
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setQueryFilters({
      search: value || null,
    });
  };

  const applyFilters = () => {
    setQueryFilters({
      search: tempFilters.search || null,
      region: tempFilters.region || null,
      gameType: tempFilters.gameType || null,
      date: tempFilters.date || null,
      timeSlots:
        tempFilters.timeSlots.length > 0 ? tempFilters.timeSlots : null,
      ntrpMin: tempFilters.ntrpMin !== 1.0 ? tempFilters.ntrpMin : null,
      ntrpMax: tempFilters.ntrpMax !== 7.0 ? tempFilters.ntrpMax : null,
      experienceMin:
        tempFilters.experienceMin !== 0 ? tempFilters.experienceMin : null,
      experienceMax:
        tempFilters.experienceMax !== 10 ? tempFilters.experienceMax : null,
    });
    setIsFilterOpen(false);
  };

  const resetTempFilters = () => {
    setTempFilters({
      search: appliedFilters.search,
      region: "",
      gameType: "",
      date: "",
      timeSlots: [],
      ntrpMin: 1.0,
      ntrpMax: 7.0,
      experienceMin: 0,
      experienceMax: 10,
    });
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedSubDistrict("");
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    setSelectedSubDistrict("");
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setSelectedSubDistrict("");

    // 경기도에서 구가 없는 시의 경우 바로 적용
    const cityData = regionData[selectedCity as keyof typeof regionData];
    if (cityData.type === "province") {
      const districtData = (cityData.districts as any)[district];
      if (!districtData || districtData.length === 0) {
        const fullRegion = `${selectedCity} ${district}`;
        handleFilterChange("region", fullRegion);
      }
    } else {
      // 서울, 인천의 경우 바로 적용
      const fullRegion = `${selectedCity} ${district}`;
      handleFilterChange("region", fullRegion);
    }
  };

  const handleSubDistrictSelect = (subDistrict: string) => {
    setSelectedSubDistrict(subDistrict);
    const fullRegion = `${selectedCity} ${selectedDistrict} ${subDistrict}`;
    handleFilterChange("region", fullRegion);
  };

  // 시간 선택 변경 핸들러 (필터용)
  const handleTimeFilterChange = (startTime: string, endTime: string) => {
    // 시작 시간부터 끝 시간까지의 모든 시간 슬롯 생성
    const generateTimeSlots = () => {
      const slots = [];
      for (let hour = 0; hour <= 23; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      return slots;
    };

    const timeSlots = generateTimeSlots();
    const startIndex = timeSlots.indexOf(startTime);
    const endHour = parseInt(endTime.split(":")[0]);
    const endIndex = timeSlots.indexOf(
      `${(endHour - 1).toString().padStart(2, "0")}:00`
    );

    if (startIndex !== -1 && endIndex !== -1) {
      const selectedSlots = timeSlots.slice(startIndex, endIndex + 1);
      setTempFilters((prev) => ({
        ...prev,
        timeSlots: selectedSlots,
      }));
    }
  };

  // 위치 정보 요청 함수
  const requestLocation = async () => {
    if (isGettingLocation) return;

    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation이 지원되지 않습니다.");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5분 캐시
            }
          );
        }
      );

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(newLocation);
      console.log("위치 정보 획득:", newLocation);
    } catch (error) {
      console.error("위치 정보를 가져올 수 없습니다:", error);
      // 위치 정보를 가져올 수 없어도 정렬 변경은 진행
    } finally {
      setIsGettingLocation(false);
    }
  };

  const removeFilter = (key: keyof MatchingFilters) => {
    const updates: any = {};
    if (key === "timeSlots") {
      updates.timeSlots = null;
    } else if (key === "ntrpMin" || key === "ntrpMax") {
      updates.ntrpMin = null;
      updates.ntrpMax = null;
    } else if (key === "experienceMin" || key === "experienceMax") {
      updates.experienceMin = null;
      updates.experienceMax = null;
    } else {
      updates[key] = null;
    }
    setQueryFilters(updates);
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    if (appliedFilters.region)
      activeFilters.push({
        key: "region",
        label: `지역: ${appliedFilters.region}`,
        value: appliedFilters.region,
      });
    if (appliedFilters.gameType)
      activeFilters.push({
        key: "gameType",
        label: `게임: ${appliedFilters.gameType}`,
        value: appliedFilters.gameType,
      });
    if (appliedFilters.date)
      activeFilters.push({
        key: "date",
        label: `날짜: ${appliedFilters.date}`,
        value: appliedFilters.date,
      });
    if (appliedFilters.timeSlots.length > 0)
      activeFilters.push({
        key: "timeSlots",
        label: `시간: ${appliedFilters.timeSlots.length}개`,
        value: appliedFilters.timeSlots,
      });
    if (appliedFilters.ntrpMin !== 1.0 || appliedFilters.ntrpMax !== 7.0)
      activeFilters.push({
        key: "ntrp",
        label: `NTRP: ${appliedFilters.ntrpMin}-${appliedFilters.ntrpMax}`,
        value: `${appliedFilters.ntrpMin}-${appliedFilters.ntrpMax}`,
      });
    if (
      appliedFilters.experienceMin !== 0 ||
      appliedFilters.experienceMax !== 10
    ) {
      const maxLabel =
        appliedFilters.experienceMax === 10
          ? "10+"
          : `${appliedFilters.experienceMax}`;
      activeFilters.push({
        key: "experience",
        label: `구력: ${appliedFilters.experienceMin}-${maxLabel}년`,
        value: `${appliedFilters.experienceMin}-${maxLabel}`,
      });
    }
    if (activeTab !== "all") {
      const tabLabels = { singles: "단식", doubles: "복식", mixed: "혼복" };
      activeFilters.push({
        key: "tab",
        label: tabLabels[activeTab as keyof typeof tabLabels],
        value: activeTab,
      });
    }
    return activeFilters;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content pb-safe transition-colors duration-300`}
    >
      <ScrollToTop />
      {/* Modern Header - Fixed at Top */}
      <motion.header
        className={`${theme.background.glass} ${theme.text.primary} shadow-sm fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-2">
            <h1
              className={`text-lg font-bold ${theme.text.primary} flex items-center gap-2`}
            >
              <MdSportsTennis className={`${theme.text.tennis} w-5 h-5`} />
              매칭 찾기
            </h1>
            <div className="flex items-center gap-3">
              <motion.button
                className={`p-2 rounded-full relative shadow-sm ${theme.surface.card}`}
                onClick={() => navigate("/notifications")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdNotifications
                  className={`w-5 h-5 ${theme.text.secondary}`}
                />
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

          {/* Search Bar */}
          <div className="relative mb-2">
            <MdSearch
              className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${theme.text.secondary} w-4 h-4`}
            />
            <input
              type="text"
              placeholder="매칭 검색..."
              value={appliedFilters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl shadow-sm text-sm ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400`}
            />
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[92px] mb-5" />

      {/* Active Filters */}
      {getActiveFilters().length > 0 && (
        <div
          className={`px-6 py-3 ${theme.surface.card} border-b ${theme.border.primary}`}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {getActiveFilters().map((filter, index) => (
              <motion.div
                key={`${filter.key}-${filter.value}`}
                className="flex items-center gap-1 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 px-3 py-1 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <span>{filter.label}</span>
                <motion.button
                  className="hover:bg-primary-200 dark:hover:bg-primary-800/30 rounded-full p-0.5"
                  onClick={() => {
                    if (filter.key === "tab") {
                      setQueryFilters({ activeTab: null });
                    } else {
                      removeFilter(filter.key as keyof MatchingFilters);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MdClose className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
            <motion.button
              className={`${theme.text.secondary} text-sm underline hover:opacity-80`}
              onClick={() => {
                setQueryFilters({
                  search: queryFilters.search || null, // 검색어는 유지
                  region: null,
                  gameType: null,
                  date: null,
                  timeSlots: null,
                  ntrpMin: null,
                  ntrpMax: null,
                  experienceMin: null,
                  experienceMax: null,
                  activeTab: null,
                });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              모든 필터 지우기
            </motion.button>
          </div>
        </div>
      )}

      {/* Sort Bar */}
      <div className="px-2 py-2">
        <div className="flex items-center justify-end">
          <motion.button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm ${theme.surface.card} border ${theme.border.primary}`}
            onClick={() => setIsSortOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdSort className={`w-4 h-4 ${theme.text.secondary}`} />
            <span className={`text-sm ${theme.text.secondary}`}>
              {sortBy === "latest"
                ? "최신순"
                : sortBy === "distance"
                ? "거리순"
                : "가격순"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Suspense로 감싸진 컨텐츠 영역 */}
      <Suspense fallback={<LoadingFallback type="card" count={6} />}>
        <MatchingPageContentSuspense
          appliedFilters={appliedFilters}
          sortBy={sortBy}
          userLocation={userLocation}
        />
      </Suspense>

      {/* Filter Modal */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        hashRoute="#filter"
      >
        {/* Filter Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeFilterTab === tab.id
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : `border-transparent ${theme.text.secondary} hover:opacity-80`
              }`}
              onClick={() => setActiveFilterTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            {activeFilterTab === "datetime" && (
              <motion.div
                key="datetime"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeInOut",
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                  >
                    날짜 선택
                  </label>
                  {(() => {
                    const today = new Date();
                    const currentMonth = today.getMonth();
                    const currentYear = today.getFullYear();
                    const firstDay = new Date(
                      currentYear,
                      currentMonth,
                      1
                    ).getDay();
                    const daysInMonth = new Date(
                      currentYear,
                      currentMonth + 1,
                      0
                    ).getDate();
                    const selectedDate = tempFilters.date
                      ? new Date(tempFilters.date)
                      : null;

                    const monthNames = [
                      "1월",
                      "2월",
                      "3월",
                      "4월",
                      "5월",
                      "6월",
                      "7월",
                      "8월",
                      "9월",
                      "10월",
                      "11월",
                      "12월",
                    ];
                    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

                    return (
                      <div className={`rounded-2xl p-4 ${theme.surface.card}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`font-semibold ${theme.text.primary}`}>
                            {currentYear}년 {monthNames[currentMonth]}
                          </h3>
                          {tempFilters.date && (
                            <motion.button
                              className={`text-xs ${theme.text.secondary} underline`}
                              onClick={() => handleFilterChange("date", "")}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              선택 해제
                            </motion.button>
                          )}
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day) => (
                            <div
                              key={day}
                              className={`text-center text-xs font-medium ${theme.text.secondary} p-2`}
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDay }, (_, i) => (
                            <div key={`empty-${i}`} className="p-2"></div>
                          ))}

                          {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentYear}-${String(
                              currentMonth + 1
                            ).padStart(2, "0")}-${String(day).padStart(
                              2,
                              "0"
                            )}`;
                            const isSelected =
                              selectedDate && selectedDate.getDate() === day;
                            const isPast =
                              new Date(currentYear, currentMonth, day) <
                              new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate()
                              );
                            const isToday = today.getDate() === day;

                            return (
                              <motion.button
                                key={day}
                                className={`p-2 text-sm rounded-lg transition-colors ${
                                  isPast
                                    ? "text-neutral-300 dark:text-neutral-700 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-primary-500 text-white font-semibold"
                                    : isToday
                                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-semibold"
                                    : `${theme.text.primary} hover:bg-primary-50 dark:hover:bg-primary-900/10`
                                }`}
                                disabled={isPast}
                                onClick={() =>
                                  handleFilterChange("date", dateStr)
                                }
                                whileHover={!isPast ? { scale: 1.1 } : {}}
                                whileTap={!isPast ? { scale: 0.9 } : {}}
                              >
                                {day}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <TimeSlotSelector
                    selectedSlots={tempFilters.timeSlots}
                    onSelectionChange={handleTimeFilterChange}
                    label="시간 선택"
                    description="언제 경기를 찾고 싶으신가요?"
                    minSelectionHours={1}
                    className=""
                  />
                </div>
              </motion.div>
            )}

            {activeFilterTab === "location" && (
              <motion.div
                key="location"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeInOut",
                }}
                className="space-y-6"
              >
                {/* 시/도 선택 */}
                <div>
                  <label
                    className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                  >
                    시/도 선택
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(regionData).map((city) => (
                      <motion.button
                        key={city}
                        className={`p-3 rounded-2xl border-2 text-sm font-medium transition-colors ${
                          selectedCity === city
                            ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                            : `${theme.border.primary} ${theme.surface.card} ${theme.text.primary} hover:border-primary-300`
                        }`}
                        onClick={() => handleCitySelect(city)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {city}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 구/군 선택 */}
                <AnimatePresence>
                  {selectedCity && !selectedDistrict && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <label
                        className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                      >
                        {selectedCity === "경기도" ? "시/군" : "구"} 선택
                      </label>
                      <div
                        className="grid grid-cols-2 gap-2 overflow-y-auto pr-1"
                        style={{
                          scrollbarWidth: "thin",
                          maxHeight: "calc(72vh - 270px)", // 핸들바(40px) + 탭(60px) + 라벨(40px) + 액션버튼(80px) + 여백(60px)
                        }}
                      >
                        {(() => {
                          const cityData =
                            regionData[selectedCity as keyof typeof regionData];
                          const districts =
                            cityData.type === "city"
                              ? cityData.districts
                              : Object.keys(cityData.districts);
                          return districts.map((district) => (
                            <motion.button
                              key={district}
                              className={`p-2.5 rounded-xl border text-sm font-medium transition-colors ${theme.border.primary} ${theme.surface.card} ${theme.text.primary} hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/10`}
                              onClick={() => handleDistrictSelect(district)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {district}
                            </motion.button>
                          ));
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 선택된 시/군 축소 표시 */}
                {selectedDistrict && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-primary-50 border border-primary-200 dark:bg-primary-900/20 dark:border-primary-800 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                          선택된 {selectedCity === "경기도" ? "시/군" : "구"}
                        </p>
                        <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">
                          {selectedCity} {selectedDistrict}
                        </p>
                      </div>
                      <motion.button
                        className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        onClick={() => {
                          setSelectedDistrict("");
                          setSelectedSubDistrict("");
                          if (selectedCity !== "경기도") {
                            handleFilterChange("region", "");
                          }
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MdClose className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* 3단계: 세부구 선택 (경기도의 일부 시만 해당) */}
                <AnimatePresence>
                  {selectedCity === "경기도" &&
                    selectedDistrict &&
                    !selectedSubDistrict &&
                    (() => {
                      const cityData = regionData.경기도;
                      const subDistricts = (cityData.districts as any)[
                        selectedDistrict
                      ];
                      return subDistricts && subDistricts.length > 0;
                    })() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <label
                          className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                        >
                          구 선택
                        </label>
                        <div
                          className="grid grid-cols-2 gap-2 overflow-y-auto pr-1"
                          style={{
                            scrollbarWidth: "thin",
                            maxHeight: "calc(80vh - 350px)", // 3단계에서는 선택된 시/군 카드가 추가되므로 더 많이 빼기
                          }}
                        >
                          {(() => {
                            const cityData = regionData.경기도;
                            const subDistricts = (cityData.districts as any)[
                              selectedDistrict
                            ];
                            return subDistricts.map((subDistrict: string) => (
                              <motion.button
                                key={subDistrict}
                                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 text-sm font-medium transition-colors"
                                onClick={() =>
                                  handleSubDistrictSelect(subDistrict)
                                }
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {subDistrict}
                              </motion.button>
                            ));
                          })()}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                {/* 최종 선택된 구 축소 표시 */}
                {selectedSubDistrict && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-purple-50 border border-purple-200 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-purple-600 font-medium">
                          최종 선택된 지역
                        </p>
                        <p className="text-sm font-semibold text-purple-800">
                          {selectedCity} {selectedDistrict}{" "}
                          {selectedSubDistrict}
                        </p>
                      </div>
                      <motion.button
                        className="text-purple-500 hover:text-purple-700"
                        onClick={() => {
                          setSelectedSubDistrict("");
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MdClose className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* 최종 선택 완료 표시 (서울/인천 또는 경기도 구가 없는 시) */}
                {selectedCity &&
                  selectedDistrict &&
                  !selectedSubDistrict &&
                  (selectedCity !== "경기도" ||
                    (selectedCity === "경기도" &&
                      (() => {
                        const cityData = regionData.경기도;
                        const subDistricts = (cityData.districts as any)[
                          selectedDistrict
                        ];
                        return !subDistricts || subDistricts.length === 0;
                      })())) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            ✓ 선택 완료
                          </p>
                          <p className="text-lg font-semibold text-blue-800">
                            {selectedCity} {selectedDistrict}
                          </p>
                        </div>
                        <motion.button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            setSelectedCity("");
                            setSelectedDistrict("");
                            setSelectedSubDistrict("");
                            handleFilterChange("region", "");
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MdClose className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
              </motion.div>
            )}

            {activeFilterTab === "game" && (
              <motion.div
                key="game"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeInOut",
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                  >
                    게임 유형
                  </label>
                  <div className="flex gap-2">
                    {["단식", "남복", "여복", "혼복"].map((gameType) => (
                      <motion.button
                        key={gameType}
                        className={`flex-1 p-3 rounded-2xl border-2 text-sm font-medium transition-colors ${
                          tempFilters.gameType === gameType
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleFilterChange(
                            "gameType",
                            tempFilters.gameType === gameType ? "" : gameType
                          )
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {gameType}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                  >
                    NTRP 레벨
                  </label>
                  <div
                    className={`${theme.surface.card} border ${theme.border.primary} rounded-2xl p-4`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-tennis-court-600 dark:text-tennis-court-400">
                        {tempFilters.ntrpMin}
                      </span>
                      <span className={`text-xs ${theme.text.secondary}`}>
                        NTRP
                      </span>
                      <span className="text-sm font-medium text-tennis-court-600 dark:text-tennis-court-400">
                        {tempFilters.ntrpMax}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        range
                        min={1}
                        max={7}
                        step={0.5}
                        value={[tempFilters.ntrpMin, tempFilters.ntrpMax]}
                        onChange={(value: number | number[]) => {
                          const [min, max] = Array.isArray(value)
                            ? value
                            : [value, value];
                          setTempFilters((prev) => ({
                            ...prev,
                            ntrpMin: min,
                            ntrpMax: max,
                          }));
                        }}
                        trackStyle={[{ backgroundColor: "#22c55e" }]}
                        handleStyle={[
                          {
                            borderColor: "rgb(34 197 94)",
                            backgroundColor: "rgb(34 197 94)",
                            boxShadow: "0 2px 4px rgba(34, 197, 94, 0.3)",
                          },
                          {
                            borderColor: "rgb(34 197 94)",
                            backgroundColor: "rgb(34 197 94)",
                            boxShadow: "0 2px 4px rgba(34, 197, 94, 0.3)",
                          },
                        ]}
                        railStyle={{ backgroundColor: "#e5e7eb" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-4">
                      <span>입문</span>
                      <span>초급</span>
                      <span>중급</span>
                      <span>상급</span>
                      <span>전문가</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                  >
                    테니스 구력
                  </label>
                  <div
                    className={`${theme.surface.card} border ${theme.border.primary} rounded-2xl p-4`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-tennis-ball-600 dark:text-tennis-ball-400">
                        {tempFilters.experienceMin}년
                      </span>
                      <span className={`text-xs ${theme.text.secondary}`}>
                        구력
                      </span>
                      <span className="text-sm font-medium text-tennis-ball-600 dark:text-tennis-ball-400">
                        {tempFilters.experienceMax === 10
                          ? "10+년"
                          : `${tempFilters.experienceMax}년`}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        range
                        min={0}
                        max={10}
                        step={1}
                        value={[
                          tempFilters.experienceMin,
                          tempFilters.experienceMax,
                        ]}
                        onChange={(value: number | number[]) => {
                          const [min, max] = Array.isArray(value)
                            ? value
                            : [value, value];
                          setTempFilters((prev) => ({
                            ...prev,
                            experienceMin: min,
                            experienceMax: max,
                          }));
                        }}
                        trackStyle={[{ backgroundColor: "#10b981" }]}
                        handleStyle={[
                          {
                            borderColor: "#10b981",
                            backgroundColor: "#10b981",
                            boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)",
                          },
                          {
                            borderColor: "#10b981",
                            backgroundColor: "#10b981",
                            boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)",
                          },
                        ]}
                        railStyle={{ backgroundColor: "#e5e7eb" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-4">
                      <span>신규</span>
                      <span>2년</span>
                      <span>5년</span>
                      <span>7년</span>
                      <span>10+</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-6 py-3 border-t border-gray-100">
          <motion.button
            className={`flex-1 py-3 rounded-2xl font-medium shadow-sm ${theme.surface.card} ${theme.text.primary} border ${theme.border.primary}`}
            onClick={resetTempFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            초기화
          </motion.button>
          <motion.button
            className={`flex-1 py-3 ${tennisGradients.primary} text-white rounded-2xl font-medium shadow-sm`}
            onClick={applyFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            적용하기
          </motion.button>
        </div>
      </BottomSheet>

      {/* Sort Modal */}
      <BottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        hashRoute="#sort"
        size="half"
      >
        <div className="px-6 py-4">
          <h3 className={`text-lg font-semibold ${theme.text.primary} mb-6`}>
            정렬 기준
          </h3>

          <div className="space-y-2">
            {[
              {
                value: "latest",
                label: "최신순",
                description: "최근에 등록된 매칭부터",
              },
              {
                value: "distance",
                label: "거리순",
                description: "가까운 거리부터",
              },
              {
                value: "price",
                label: "가격순",
                description: "저렴한 가격부터",
              },
            ].map((option) => (
              <motion.button
                key={option.value}
                className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                  sortBy === option.value
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : `${theme.border.primary} ${theme.surface.card} hover:border-primary-300`
                }`}
                onClick={async () => {
                  // 거리순을 선택하고 위치 정보가 없는 경우 위치 정보 요청
                  if (option.value === "distance" && !userLocation) {
                    await requestLocation();
                  }
                  setQueryFilters({
                    sort: option.value !== "latest" ? option.value : null,
                  });
                  setIsSortOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`font-medium ${
                        sortBy === option.value
                          ? "text-primary-700 dark:text-primary-400"
                          : theme.text.primary
                      }`}
                    >
                      {option.label}
                    </p>
                    <p
                      className={`text-sm ${
                        sortBy === option.value
                          ? "text-primary-600 dark:text-primary-400"
                          : theme.text.secondary
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {option.value === "distance" && isGettingLocation && (
                      <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                    )}
                    {sortBy === option.value && (
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Floating Filter Button */}
      <motion.button
        className={`fixed bottom-28 right-6 w-12 h-12 ${tennisGradients.primary} text-white rounded-full shadow-lg flex items-center justify-center z-30`}
        onClick={() => {
          setTempFilters(appliedFilters);

          // 기존 지역 선택 상태 복원
          if (appliedFilters.region) {
            const regionParts = appliedFilters.region.split(" ");
            if (regionParts.length >= 2) {
              const city = regionParts[0];

              if (regionParts.length === 2) {
                // 2단계: 시/도 + 구/군
                const district = regionParts[1];
                setSelectedCity(city);
                setSelectedDistrict(district);
                setSelectedSubDistrict("");
              } else if (regionParts.length === 3) {
                // 3단계: 시/도 + 시/군 + 구
                const district = regionParts[1];
                const subDistrict = regionParts[2];
                setSelectedCity(city);
                setSelectedDistrict(district);
                setSelectedSubDistrict(subDistrict);
              }
            }
          } else {
            setSelectedCity("");
            setSelectedDistrict("");
            setSelectedSubDistrict("");
          }

          setIsFilterOpen(true);
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MdFilterList className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};

export default MatchingPage;
