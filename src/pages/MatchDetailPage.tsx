import { motion } from "framer-motion";
import { Suspense, useState } from "react";
import {
  MdArrowBack,
  MdBookmark,
  MdChat,
  MdGroup,
  MdInfo,
  MdShare,
  MdSportsTennis,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import LoadingFallback from "../components/LoadingFallback";
import MatchInfoCard from "../components/MatchInfoCard";
import {
  useBookmarkMatch,
  useCreateChatRoom,
  useCreateMatchChat,
  useCreatePrivateChat,
  useGetApiAuthMeSuspense,
  useJoinChatRoom,
  usePostApiMatchesMatchIdJoin,
  useShareMatch,
  useSuspenseMatch,
  useUnbookmarkMatch,
} from "../hooks";
import { getThemeClasses, tennisGradients } from "../lib/theme";
// MatchDetail 타입은 api.ts에서 자동으로 추론됨

// Suspense로 감쌀 컨텐츠 컴포넌트
const MatchDetailContentSuspense = ({ matchId }: { matchId: string }) => {
  const navigate = useNavigate();
  const theme = getThemeClasses();

  // API 훅들
  const { data: matchDetail } = useSuspenseMatch(matchId);
  const { data: user } = useGetApiAuthMeSuspense();
  const bookmarkMutation = useBookmarkMatch();
  const unbookmarkMutation = useUnbookmarkMatch();
  const shareMutation = useShareMatch();
  const joinMatchMutation = usePostApiMatchesMatchIdJoin();
  const createMatchChatMutation = useCreateMatchChat();
  const createPrivateChatMutation = useCreatePrivateChat();
  const createChatRoomMutation = useCreateChatRoom();
  const joinChatRoomMutation = useJoinChatRoom();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    if (!matchDetail) return;

    try {
      // API로 공유 URL 생성
      const shareResponse = await shareMutation.mutateAsync(matchId);

      if (shareResponse?.shareUrl) {
        const shareData = {
          title: matchDetail.title,
          text: matchDetail.description || "테니스 매치에 참가해보세요!",
          url: shareResponse.shareUrl,
        };

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          await navigator.share(shareData);
        } else {
          // Fallback: 클립보드에 URL 복사
          await navigator.clipboard.writeText(shareResponse.shareUrl);
          alert("링크가 클립보드에 복사되었습니다!");
        }
      }
    } catch (error) {
      // 공유가 취소되었거나 실패한 경우
      if (error instanceof Error && error.name !== "AbortError") {
        // Fallback: 클립보드에 URL 복사 시도
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("링크가 클립보드에 복사되었습니다!");
        } catch (clipboardError) {
          console.error("공유 실패:", error, clipboardError);
          alert("공유에 실패했습니다.");
        }
      }
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      unbookmarkMutation.mutate(matchId, {
        onSuccess: () => setIsBookmarked(false),
        onError: (error) => console.error("북마크 해제 실패:", error),
      });
    } else {
      bookmarkMutation.mutate(matchId, {
        onSuccess: () => setIsBookmarked(true),
        onError: (error) => console.error("북마크 실패:", error),
      });
    }
  };

  // API로 가져온 데이터 사용

  const handleCreateGroupChat = async () => {
    try {
      // 매치 채팅방 생성
      const chatResponse = await createMatchChatMutation.mutateAsync(matchId);

      if (chatResponse?.chatRoomId) {
        navigate(`/chat/${chatResponse.chatRoomId}`);
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  const handleCreatePrivateChat = async () => {
    try {
      // 1:1 채팅방 생성
      const chatResponse = await createPrivateChatMutation.mutateAsync(matchId);

      if (chatResponse?.chatRoomId) {
        navigate(`/chat/${chatResponse.chatRoomId}`);
      }
    } catch (error) {
      console.error("1:1 채팅방 생성 실패:", error);
      alert("1:1 채팅방 생성에 실패했습니다.");
    }
  };

  const handleJoinMatch = async () => {
    if (!matchDetail || matchDetail.status === "full") return;

    try {
      // 매치 참가 신청
      const joinResponse = await joinMatchMutation.mutateAsync({
        matchId: matchId,
        data: {
          message: "참가 신청합니다!",
        },
      });

      // 매치 채팅방 생성/참가
      const chatResponse = await createPrivateChatMutation.mutateAsync(matchId);

      if (chatResponse?.chatRoomId) {
        navigate(`/chat/${chatResponse.chatRoomId}`);
      } else {
        alert("참가 신청이 완료되었습니다!");
      }
    } catch (error) {
      console.error("참가 신청 실패:", error);
      alert("참가 신청에 실패했습니다.");
    }
  };

  // 현재 사용자가 호스트인지 확인
  const isHost = user?.id === matchDetail?.hostId;

  // confirmedParticipants 배열에서 현재 사용자가 참가자인지 확인
  const isParticipant =
    matchDetail?.confirmedParticipants?.some((p) => p.id === user?.id) || false;

  // 참가자 목록 표시 여부 (참가자만 확인 가능)
  const showParticipantsList = isParticipant;

  // participants 문자열에서 참가자 수 파싱
  const getParticipantCount = () => {
    if (!matchDetail?.participants) return { current: 0, total: 0 };
    const [current, total] = matchDetail.participants
      .split("/")
      .map((num) => parseInt(num, 10));
    return { current: current || 0, total: total || 0 };
  };

  const participantCount = getParticipantCount();

  // 실제 참가자 목록 사용
  const participants = matchDetail?.confirmedParticipants?.filter(
    (p) => !p.isHost
  );

  return (
    <div className="px-2 py-4 space-y-6">
      {!matchDetail ? (
        // Not Found State
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MdSportsTennis
            className={`w-16 h-16 ${theme.text.secondary} opacity-30 mx-auto mb-4`}
          />
          <h3 className={`text-xl font-semibold ${theme.text.primary} mb-2`}>
            매치를 찾을 수 없습니다
          </h3>
          <p className={`${theme.text.secondary} mb-6`}>
            요청하신 매치가 존재하지 않거나 삭제되었습니다.
          </p>
          <motion.button
            className={`${tennisGradients.primary} text-white px-6 py-3 rounded-full font-medium`}
            onClick={() => navigate("/matching")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            매치 목록으로 돌아가기
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* 매치 정보 카드 */}
          <MatchInfoCard
            matchDetail={matchDetail}
            onCreateGroupChat={handleCreateGroupChat}
            onJoinMatch={handleJoinMatch}
            isHost={isHost}
            isParticipant={isParticipant}
            showParticipantsList={showParticipantsList}
          />

          {/* 참가자 목록 - 참가자만 확인 가능 */}
          {showParticipantsList && (
            <motion.div
              className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.text.primary}`}
              >
                <MdGroup className="w-5 h-5 text-accent-500" />
                참가자 목록 ({participantCount.current}명)
              </h3>

              <div className="space-y-3">
                {participants?.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    className={`flex items-center justify-between p-3 rounded-2xl ${theme.background.secondary} transition-colors duration-300`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          participant.isHost
                            ? "bg-gradient-to-br from-tennis-ball-400 to-tennis-ball-600"
                            : "bg-gradient-to-br from-tennis-court-400 to-tennis-court-600"
                        }`}
                      >
                        <span className="text-white font-bold text-sm">
                          {participant.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-bold text-sm ${theme.text.primary}`}
                          >
                            {participant.name}
                          </p>
                          {participant.isHost && (
                            <span className="px-2 py-0.5 bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 rounded-full text-xs font-medium">
                              호스트
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${theme.text.secondary}`}>
                          NTRP {participant.ntrp} • 구력{" "}
                          {participant.experience}
                        </p>
                      </div>
                    </div>
                    {/* <motion.button
                      className="p-2 bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-600 dark:text-tennis-ball-400 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdChat className="w-4 h-4" />
                    </motion.button> */}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 참가자가 아닌 경우 참가자 목록 제한 메시지 */}
          {!showParticipantsList && (
            <motion.div
              className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.text.primary}`}
              >
                <MdGroup className="w-5 h-5 text-accent-500" />
                참가자 목록 ({participantCount.current}명)
              </h3>

              <div className="space-y-3">
                {participants?.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    className={`flex items-center p-3 rounded-2xl ${theme.background.secondary} transition-colors duration-300`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          participant.isHost
                            ? "bg-gradient-to-br from-tennis-ball-400 to-tennis-ball-600"
                            : "bg-gradient-to-br from-gray-400 to-gray-600"
                        }`}
                      >
                        <span className="text-white font-bold text-sm">
                          {participant.isHost ? "H" : (index + 1).toString()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-bold text-sm ${theme.text.primary}`}
                          >
                            {participants.map((p) => p.id).includes(user?.id)
                              ? participant.name
                              : `익명${index + 1}`}
                          </p>
                          {participant.isHost && (
                            <span className="px-2 py-0.5 bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 rounded-full text-xs font-medium">
                              호스트
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 호스트 정보 */}
          <motion.div
            className={`rounded-2xl p-4 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-tennis-court-400 to-tennis-court-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {matchDetail?.hostName?.charAt(0) || "H"}
                  </span>
                </div>
                <div>
                  <p className={`font-bold text-sm ${theme.text.primary}`}>
                    {matchDetail?.hostName || "호스트"}
                  </p>
                  <p className={`text-xs ${theme.text.secondary}`}>
                    NTRP {matchDetail?.hostNtrp || "4.0"} • 구력{" "}
                    {matchDetail?.hostExperience || "경력 미정"}
                  </p>
                </div>
              </div>
              {!isHost && (
                <motion.button
                  className="p-1.5 bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-600 dark:text-tennis-ball-400 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreatePrivateChat}
                >
                  <MdChat className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* 상세 설명 */}
          <motion.div
            className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3
              className={`text-lg font-bold mb-3 flex items-center gap-2 ${theme.text.primary}`}
            >
              <MdInfo className={`w-5 h-5 ${theme.text.secondary}`} />
              상세 설명
            </h3>
            <p className={`leading-relaxed ${theme.text.primary}`}>
              {matchDetail.description}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
};

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const matchId = id || "";

  const bookmarkMutation = useBookmarkMatch();
  const unbookmarkMutation = useUnbookmarkMatch();
  const shareMutation = useShareMatch();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      const shareResponse = await shareMutation.mutateAsync(matchId);

      if (shareResponse?.shareUrl) {
        const shareData = {
          title: "테니스 매치",
          text: "테니스 매치에 참가해보세요!",
          url: shareResponse.shareUrl,
        };

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareResponse.shareUrl);
          alert("링크가 클립보드에 복사되었습니다!");
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("링크가 클립보드에 복사되었습니다!");
        } catch (clipboardError) {
          console.error("공유 실패:", error, clipboardError);
          alert("공유에 실패했습니다.");
        }
      }
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      unbookmarkMutation.mutate(matchId, {
        onSuccess: () => setIsBookmarked(false),
        onError: (error) => console.error("북마크 해제 실패:", error),
      });
    } else {
      bookmarkMutation.mutate(matchId, {
        onSuccess: () => setIsBookmarked(true),
        onError: (error) => console.error("북마크 실패:", error),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content transition-colors duration-300`}
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

          <h1
            className={`text-lg font-bold text-center flex-1 ${theme.text.primary}`}
          >
            매칭 상세
          </h1>

          <div className="flex items-center gap-2">
            <motion.button
              className={`p-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
              onClick={handleBookmark}
              disabled={
                bookmarkMutation.isPending || unbookmarkMutation.isPending
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdBookmark
                className={`w-5 h-5 ${
                  isBookmarked ? "text-tennis-ball-500" : theme.text.secondary
                }`}
              />
            </motion.button>
            <motion.button
              className={`p-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdShare className={`w-5 h-5 ${theme.text.secondary}`} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Suspense로 감싸진 컨텐츠 영역 */}
      <Suspense fallback={<LoadingFallback type="detail" />}>
        <MatchDetailContentSuspense matchId={matchId} />
      </Suspense>
    </motion.div>
  );
};

export default MatchDetailPage;
