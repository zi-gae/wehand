import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  MdArrowBack,
  MdCheck,
  MdChevronRight,
  MdClose,
  MdEdit,
  MdGroup,
  MdInfo,
  MdLocationOn,
  MdSportsTennis,
  MdThumbDown,
  MdThumbUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useReviewableMatches, useSubmitReview } from "../hooks/useReview";
import { getThemeClasses } from "../lib/theme";

interface ReviewableMatch {
  id: string;
  title: string;
  matchDate: string;
  location: string;
  gameType: string;
  participants: Array<{
    id: string;
    name: string;
    nickname?: string;
    ntrp?: number;
    hasReviewed?: boolean;
  }>;
}

const ReviewPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [ntrpRating, setNtrpRating] = useState<number>(3.5);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [comment, setComment] = useState("");

  const { data: matchesData, isLoading, refetch } = useReviewableMatches();
  const submitReviewMutation = useSubmitReview();

  const reviewableMatches = matchesData || [];

  const handleSubmitReview = async () => {
    if (!selectedMatch || !selectedParticipant || feedback === null) {
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        matchId: selectedMatch,
        revieweeId: selectedParticipant,
        ntrp: ntrpRating,
        isPositive: feedback === "like",
        comment: comment.trim() || undefined,
      });

      // 리뷰 제출 성공 후 초기화
      setSelectedParticipant(null);
      setNtrpRating(3.5);
      setFeedback(null);
      setComment("");

      // 데이터 새로고침
      refetch();
    } catch (error) {
      console.error("리뷰 제출 실패:", error);
    }
  };

  const getNtrpLabel = (ntrp: number): string => {
    if (ntrp <= 2.0) return "초급";
    if (ntrp <= 3.0) return "초중급";
    if (ntrp <= 4.0) return "중급";
    if (ntrp <= 5.0) return "중상급";
    return "상급";
  };

  const formatMatchDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "M월 d일 (EEE)", { locale: ko });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      className={`min-h-screen ${theme.background.primary}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div
        className={`${theme.surface.card} border-b ${theme.border.primary} px-4 py-3 flex items-center gap-3`}
      >
        <motion.button
          className={`p-2 rounded-lg ${theme.text.primary}`}
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.95 }}
        >
          <MdArrowBack className="w-6 h-6" />
        </motion.button>
        <h1 className={`font-semibold text-lg ${theme.text.primary}`}>
          리뷰하기
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto pb-safe">
        {isLoading ? (
          <div className="space-y-4">
            {/* 일반 카드 모양 스켈레톤 */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className={`${theme.surface.card} rounded-2xl p-4 shadow-sm border ${theme.border.primary}`}
              >
                <div className="space-y-4">
                  {/* 제목과 메타정보 스켈레톤 */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>

                  {/* 위치 정보 스켈레톤 */}
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* 참가자와 버튼 스켈레톤 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12 animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviewableMatches.length === 0 ? (
          <motion.div
            className={`text-center py-12 ${theme.surface.card} rounded-2xl border ${theme.border.primary}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MdSportsTennis
              className={`w-16 h-16 ${theme.text.secondary} opacity-50 mx-auto mb-4`}
            />
            <p className={`${theme.text.primary} font-semibold mb-2`}>
              리뷰 가능한 매치가 없습니다
            </p>
            <p className={`${theme.text.secondary} text-sm`}>
              완료된 매치의 참가자를 리뷰할 수 있습니다
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* 개선된 매치 목록 디자인 */}
            {!selectedMatch && (
              <AnimatePresence>
                {reviewableMatches.map(
                  (match: ReviewableMatch, index: number) => {
                    const pendingReviews = match.participants.filter(
                      (p) => !p.hasReviewed
                    ).length;
                    const totalParticipants = match.participants.length;

                    return (
                      <motion.div
                        key={match.id}
                        className="rounded-2xl p-4 shadow-sm cursor-pointer bg-white dark:bg-dark-100 border border-tennis-court-200 dark:border-tennis-court-800 transition-colors duration-300 hover:border-tennis-court-300 dark:hover:border-tennis-court-700"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMatch(match.id)}
                      >
                        {/* 상단 헤더 - 제목과 게임 타입 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-base text-tennis-court-800 dark:text-tennis-court-200 mb-1">
                              {match.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400 rounded-md text-xs font-medium">
                                {match.gameType}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatMatchDate(match.matchDate)}
                              </span>
                            </div>
                          </div>

                          {/* 리뷰 진행률 시각화 */}
                          <div className="text-center">
                            <div className="relative">
                              <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  className="text-gray-200 dark:text-gray-700"
                                />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  fill="none"
                                  strokeDasharray={`${
                                    ((totalParticipants - pendingReviews) /
                                      totalParticipants) *
                                    126
                                  } 126`}
                                  className={`${
                                    pendingReviews === 0
                                      ? "text-green-500"
                                      : pendingReviews === 1
                                      ? "text-yellow-500"
                                      : "text-tennis-ball-500"
                                  }`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-tennis-court-800 dark:text-tennis-court-200">
                                  {totalParticipants - pendingReviews}/
                                  {totalParticipants}
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {pendingReviews === 0 ? "완료" : "진행중"}
                            </p>
                          </div>
                        </div>

                        {/* 중간 섹션 - 장소와 참가자 정보 */}
                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <MdLocationOn className="w-3.5 h-3.5 text-tennis-court-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {match.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MdGroup className="w-3.5 h-3.5 text-tennis-lime-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {totalParticipants}명 참가
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 하단 - 리뷰 대상자 및 액션 */}
                        <div className="space-y-2">
                          {/* 리뷰 가능한 참가자 표시 */}
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              리뷰 대기중인 참가자
                            </p>
                            {pendingReviews > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                                  {pendingReviews}명
                                </span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* 참가자 목록 */}
                            <div className="flex-1 flex flex-wrap gap-1">
                              {match.participants.map((participant) => (
                                <span
                                  key={participant.id}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                    participant.hasReviewed
                                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 line-through"
                                      : "bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400"
                                  }`}
                                >
                                  {participant.hasReviewed && (
                                    <MdCheck className="w-3 h-3" />
                                  )}
                                  {participant.nickname || participant.name}
                                </span>
                              ))}
                            </div>

                            {/* 리뷰 버튼 */}
                            <motion.button
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                pendingReviews === 0
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                  : "bg-gradient-to-r from-tennis-ball-500 to-tennis-ball-600 text-white shadow-md hover:shadow-lg hover:from-tennis-ball-600 hover:to-tennis-ball-700"
                              }`}
                              disabled={pendingReviews === 0}
                              whileHover={
                                pendingReviews > 0 ? { scale: 1.05 } : {}
                              }
                              whileTap={
                                pendingReviews > 0 ? { scale: 0.95 } : {}
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                if (pendingReviews > 0)
                                  setSelectedMatch(match.id);
                              }}
                            >
                              {pendingReviews === 0 ? (
                                <span className="flex items-center gap-1">
                                  <MdCheck className="w-3 h-3" />
                                  완료
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <MdEdit className="w-3 h-3" />
                                  리뷰
                                </span>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </AnimatePresence>
            )}

            {/* 별 없는 깨끗한 참가자 선택 UI */}
            {selectedMatch && !selectedParticipant && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <button
                  className={`mb-4 flex items-center gap-2 text-sm ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
                  onClick={() => setSelectedMatch(null)}
                >
                  <MdArrowBack className="w-4 h-4" />
                  매치 목록으로
                </button>

                <h2 className={`text-lg font-bold ${theme.text.primary} mb-1`}>
                  리뷰할 참가자 선택
                </h2>
                <p className={`text-sm ${theme.text.secondary} mb-4`}>
                  총{" "}
                  {
                    reviewableMatches
                      .find((m: ReviewableMatch) => m.id === selectedMatch)
                      ?.participants.filter((p) => !p.hasReviewed).length
                  }
                  명의 참가자가 리뷰를 기다리고 있습니다
                </p>

                <div className="space-y-2">
                  {reviewableMatches
                    .find((m: ReviewableMatch) => m.id === selectedMatch)
                    ?.participants.filter((p) => !p.hasReviewed)
                    .map((participant, index) => (
                      <motion.div
                        key={participant.id}
                        className="rounded-xl bg-white dark:bg-dark-100 border border-tennis-court-200 dark:border-tennis-court-800 transition-all duration-300 hover:border-tennis-ball-400 dark:hover:border-tennis-ball-600 hover:shadow-md cursor-pointer group"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedParticipant(participant.id)}
                      >
                        <div className="flex items-center p-4">
                          {/* 왼쪽 영역 - 아바타와 정보 */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tennis-court-500 to-tennis-court-700 flex items-center justify-center text-white font-bold text-sm">
                                {(participant.nickname || participant.name)
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                              {participant.ntrp && participant.ntrp >= 4.0 && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-100">
                                  <span className="text-[8px] font-bold text-yellow-900">
                                    {participant.ntrp}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-tennis-court-800 dark:text-tennis-court-200">
                                {participant.nickname || participant.name}
                              </p>
                              {participant.ntrp && (
                                <div className="flex items-center gap-3 mt-0.5">
                                  <div className="flex items-center gap-1">
                                    <div className="flex items-center">
                                      <div
                                        className={`h-1.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
                                      >
                                        <div
                                          className={`h-full rounded-full transition-all ${
                                            participant.ntrp >= 4.5
                                              ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                              : participant.ntrp >= 3.5
                                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                              : participant.ntrp >= 2.5
                                              ? "bg-gradient-to-r from-green-500 to-green-600"
                                              : "bg-gradient-to-r from-gray-400 to-gray-500"
                                          }`}
                                          style={{
                                            width: `${
                                              (participant.ntrp / 7) * 100
                                            }%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {getNtrpLabel(participant.ntrp)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 오른쪽 영역 - 리뷰 버튼 */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              리뷰 작성
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-tennis-ball-100 dark:bg-tennis-ball-900/20 flex items-center justify-center group-hover:bg-tennis-ball-500 transition-colors">
                              <MdChevronRight className="w-5 h-5 text-tennis-ball-600 dark:text-tennis-ball-400 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* 하단 안내 */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <MdInfo className="w-4 h-4" />
                    <span>
                      리뷰는 익명으로 처리되며, 상대방의 성장에 도움이 됩니다
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 리뷰 작성 */}
            {selectedMatch && selectedParticipant && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <button
                  className={`mb-4 text-sm ${theme.text.secondary} hover:${theme.text.primary}`}
                  onClick={() => setSelectedParticipant(null)}
                >
                  ← 참가자 목록으로
                </button>

                <div
                  className={`${theme.surface.card} rounded-2xl border ${theme.border.primary} p-6`}
                >
                  <h2
                    className={`text-lg font-semibold ${theme.text.primary} mb-6`}
                  >
                    {reviewableMatches
                      .find((m: ReviewableMatch) => m.id === selectedMatch)
                      ?.participants.find((p) => p.id === selectedParticipant)
                      ?.nickname ||
                      reviewableMatches
                        .find((m: ReviewableMatch) => m.id === selectedMatch)
                        ?.participants.find((p) => p.id === selectedParticipant)
                        ?.name}
                    님 리뷰
                  </h2>

                  {/* NTRP 평가 */}
                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                    >
                      NTRP 레벨 평가
                    </label>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-2xl font-bold text-tennis-ball-500`}
                        >
                          {ntrpRating.toFixed(1)}
                        </span>
                        <span className={`text-sm ${theme.text.secondary}`}>
                          {getNtrpLabel(ntrpRating)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="7.0"
                        step="0.5"
                        value={ntrpRating}
                        onChange={(e) =>
                          setNtrpRating(parseFloat(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tennis-ball-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1.0</span>
                        <span>2.5</span>
                        <span>4.0</span>
                        <span>5.5</span>
                        <span>7.0</span>
                      </div>
                    </div>
                  </div>

                  {/* 개선된 평가 버튼 */}
                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium ${theme.text.primary} mb-3`}
                    >
                      매치는 어떠셨나요?
                    </label>
                    <div className="flex gap-3">
                      <motion.button
                        className={`flex-1 p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                          feedback === "like"
                            ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
                            : `border-gray-200 dark:border-gray-700 hover:border-green-400 ${theme.surface.card}`
                        }`}
                        onClick={() => setFeedback("like")}
                        whileTap={{ scale: 0.95 }}
                      >
                        {feedback === "like" && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="relative">
                          <MdThumbUp
                            className={`w-8 h-8 mx-auto mb-2 transition-all ${
                              feedback === "like"
                                ? "text-green-500 scale-110"
                                : "text-gray-400 group-hover:text-green-500"
                            }`}
                          />
                          <p
                            className={`font-bold text-lg ${
                              feedback === "like"
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-600 dark:text-gray-400 group-hover:text-green-600"
                            }`}
                          >
                            좋았어요
                          </p>
                          <p className={`text-xs mt-1 ${theme.text.secondary}`}>
                            다시 만나고 싶어요
                          </p>
                        </div>
                        {feedback === "like" && (
                          <motion.div
                            className="absolute top-2 right-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <MdCheck className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </motion.button>

                      <motion.button
                        className={`flex-1 p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                          feedback === "dislike"
                            ? "border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
                            : `border-gray-200 dark:border-gray-700 hover:border-red-400 ${theme.surface.card}`
                        }`}
                        onClick={() => setFeedback("dislike")}
                        whileTap={{ scale: 0.95 }}
                      >
                        {feedback === "dislike" && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="relative">
                          <MdThumbDown
                            className={`w-8 h-8 mx-auto mb-2 transition-all ${
                              feedback === "dislike"
                                ? "text-red-500 scale-110"
                                : "text-gray-400 group-hover:text-red-500"
                            }`}
                          />
                          <p
                            className={`font-bold text-lg ${
                              feedback === "dislike"
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-600 dark:text-gray-400 group-hover:text-red-600"
                            }`}
                          >
                            아쉬웠어요
                          </p>
                          <p className={`text-xs mt-1 ${theme.text.secondary}`}>
                            개선이 필요해요
                          </p>
                        </div>
                        {feedback === "dislike" && (
                          <motion.div
                            className="absolute top-2 right-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <MdClose className="w-5 h-5 text-red-500" />
                          </motion.div>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* 코멘트 (선택사항) */}
                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium ${theme.text.primary} mb-2`}
                    >
                      코멘트 (선택사항)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="플레이 스타일이나 매너에 대해 적어주세요..."
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border.primary} ${theme.surface.card} ${theme.text.primary} focus:outline-none focus:ring-2 focus:ring-tennis-ball-500 focus:border-transparent resize-none`}
                      rows={3}
                    />
                  </div>

                  {/* 제출 버튼 */}
                  <motion.button
                    className={`w-full py-3 rounded-xl font-medium ${
                      feedback !== null
                        ? "bg-tennis-ball-500 text-white"
                        : `bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed`
                    }`}
                    onClick={handleSubmitReview}
                    disabled={
                      feedback === null || submitReviewMutation.isPending
                    }
                    whileTap={feedback !== null ? { scale: 0.95 } : undefined}
                  >
                    {submitReviewMutation.isPending
                      ? "제출 중..."
                      : "리뷰 제출"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewPage;
