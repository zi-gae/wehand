import { motion } from "framer-motion";
import {
  MdLocationOn,
  MdSchedule,
  MdGroup,
  MdAttachMoney,
  MdGroupAdd,
} from "react-icons/md";
import { Match } from "../api/generated-api";
import { getThemeClasses } from "../lib/theme";

// 확장된 매치 정보 타입 (상세 페이지용)

interface MatchInfoCardProps {
  matchDetail: Match;
  onCreateGroupChat: () => void;
  onJoinMatch: () => void;
  isHost: boolean;
  isParticipant: boolean;
  showParticipantsList: boolean;
  isJoining?: boolean;
}

const MatchInfoCard = ({
  matchDetail,
  onCreateGroupChat,
  onJoinMatch,
  isHost,
  isParticipant,
  showParticipantsList,
  isJoining = false,
}: MatchInfoCardProps) => {
  const theme = getThemeClasses();

  const getStatusInfo = (status: string, participants: string) => {
    const [current, total] = participants.split("/").map(Number);
    const remaining = total - current;

    if (status === "urgent") {
      return {
        text: `${remaining}명 급구`,
        className: "bg-red-500 text-white",
      };
    }
    if (status === "full") {
      return {
        text: "마감",
        className: "bg-gray-500 text-white",
      };
    }
    if (remaining <= 1) {
      return {
        text: `${remaining}명 모집`,
        className: "bg-orange-500 text-white",
      };
    }
    return {
      text: `${remaining}명 모집`,
      className: "bg-green-500 text-white",
    };
  };

  const statusInfo = getStatusInfo(
    matchDetail.status,
    matchDetail.participants || "0/0"
  );

  return (
    <motion.div
      className={`${theme.surface.card} rounded-2xl p-4 shadow-sm transition-colors duration-300`}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h2 className={`text-lg font-bold mb-2 ${theme.text.primary}`}>
            {matchDetail.title}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium ${theme.background.secondary} ${theme.text.secondary}`}
            >
              {matchDetail.gameType}
            </span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium ${theme.background.secondary} ${theme.text.secondary}`}
            >
              {matchDetail.level}
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-lg text-xs font-bold ${statusInfo.className}`}
        >
          {statusInfo.text}
        </span>
      </div>

      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${theme.text.primary}`}>
          <MdLocationOn className={`w-4 h-4 ${theme.text.secondary}`} />
          <div>
            <p className="font-medium text-sm">{matchDetail.location}</p>
            <p className={`text-xs ${theme.text.secondary}`}>
              {matchDetail.address}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${theme.text.primary}`}>
          <MdSchedule className={`w-4 h-4 ${theme.text.secondary}`} />
          <p className="font-medium text-sm">
            {matchDetail.date} {matchDetail.startTime}~{matchDetail.endTime}
          </p>
        </div>

        <div className={`flex items-center gap-2 ${theme.text.primary}`}>
          <MdGroup className={`w-4 h-4 ${theme.text.secondary}`} />
          <p className="font-medium text-sm">
            참가자: {matchDetail.participants}
          </p>
        </div>

        <div className={`flex items-center gap-2 ${theme.text.primary}`}>
          <MdAttachMoney className={`w-4 h-4 ${theme.text.secondary}`} />
          <p className={`font-bold text-sm ${theme.text.primary}`}>
            {matchDetail.price}
          </p>
        </div>
      </div>

      {/* 참가 신청 버튼 - 호스트가 아닌 경우만 표시 */}
      {!isHost && (
        <motion.button
          className={`w-full mt-4 py-3 rounded-2xl text-base font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
            matchDetail.status === "full" || isParticipant || isJoining
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          }`}
          disabled={matchDetail.status === "full" || isParticipant || isJoining}
          onClick={onJoinMatch}
          whileHover={
            matchDetail.status !== "full" && !isParticipant && !isJoining
              ? { scale: 1.02 }
              : {}
          }
          whileTap={
            matchDetail.status !== "full" && !isParticipant && !isJoining
              ? { scale: 0.98 }
              : {}
          }
        >
          {isJoining ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              참가 신청 중...
            </>
          ) : isParticipant ? (
            "참가 신청 완료"
          ) : matchDetail.status === "full" ? (
            "참가 마감"
          ) : (
            "참가 신청하기"
          )}
        </motion.button>
      )}

      {/* 마감 시 단체 채팅방 생성 버튼 - 호스트만 가능 */}
      {matchDetail.status === "full" && isHost && (
        <motion.button
          className="w-full mt-3 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center gap-2"
          onClick={onCreateGroupChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MdGroupAdd className="w-5 h-5" />
          단체 채팅방 만들기
        </motion.button>
      )}

      {/* 참가자에게 단체 채팅방 대기 메시지 */}
      {matchDetail.status === "full" && !isHost && isParticipant && (
        <div
          className={`w-full mt-3 py-3 rounded-2xl ${theme.background.secondary} ${theme.text.secondary} text-center text-sm transition-colors duration-300`}
        >
          호스트가 단체 채팅방을 생성하면 알림을 받을 수 있어요
        </div>
      )}
    </motion.div>
  );
};

export default MatchInfoCard;
