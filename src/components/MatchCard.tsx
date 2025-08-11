import { GetApiMatches200DataItem } from "@/api/generated-api.schemas";
import { motion } from "framer-motion";
import { MdGroup, MdLocationOn, MdSchedule } from "react-icons/md";
import { getThemeClasses } from "../lib/theme";

interface MatchCardProps {
  match: GetApiMatches200DataItem;
  index?: number;
  onClick: (matchId: string) => void;
  onJoinClick?: (matchId: string) => void;
}

const MatchCard = ({
  match,
  index = 0,
  onClick,
  onJoinClick,
}: MatchCardProps) => {
  const theme = getThemeClasses();

  const getStatusInfo = (status?: string, participants?: string) => {
    if (!participants) {
      return {
        text: "모집중",
        className: "bg-tennis-court-500 text-white",
        urgency: "normal",
      };
    }
    const [current, total] = participants.split("/").map(Number);
    const remaining = total - current;

    if (status === "urgent") {
      return {
        text: `${remaining}명 급구`,
        className: "bg-status-error-500 text-white",
        urgency: "urgent",
      };
    }
    if (status === "full") {
      return {
        text: "마감",
        className: "bg-neutral-500 dark:bg-neutral-600 text-white",
        urgency: "full",
      };
    }
    if (remaining <= 1) {
      return {
        text: `${remaining}명 모집`,
        className: "bg-tennis-ball-500 text-white",
        urgency: "few",
      };
    }
    return {
      text: `${remaining}명 모집`,
      className: "bg-tennis-court-500 text-white",
      urgency: "normal",
    };
  };

  const statusInfo = getStatusInfo(match.status, match.participants);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (match.status !== "full" && onJoinClick && match.id) {
      onJoinClick(match.id);
    }
  };

  return (
    <motion.div
      className="rounded-2xl p-4 shadow-sm cursor-pointer bg-white dark:bg-dark-100 border border-tennis-court-200 dark:border-tennis-court-800 transition-colors duration-300 hover:border-tennis-court-300 dark:hover:border-tennis-court-700"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => match.id && onClick(match.id)}
    >
      {/* Header: 제목과 상태만 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold truncate flex-1 min-w-0 text-tennis-court-800 dark:text-tennis-court-200">
          {match.title}
        </h3>
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${statusInfo.className} ml-2`}
        >
          {statusInfo.text}
        </span>
      </div>

      {/* 정보들을 2줄로 컴팩트하게 배치 */}
      <div className="space-y-1.5 mb-3">
        <div
          className={`flex items-center justify-between text-xs ${theme.text.secondary}`}
        >
          <div className="flex items-center gap-1.5">
            <MdLocationOn className="w-3.5 h-3.5 text-tennis-court-500 dark:text-tennis-court-400" />
            <span className="truncate">{match.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MdSchedule className="w-3.5 h-3.5 text-tennis-ball-500 dark:text-tennis-ball-400" />
            <span>
              {match.date} {match.startTime}~{match.endTime}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400 rounded-md text-xs font-medium">
              {match.gameType}
            </span>
            <span className="px-2 py-0.5 bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 rounded-md text-xs font-medium">
              {match.level}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 ${theme.text.secondary}`}>
            <MdGroup className="w-3.5 h-3.5 text-tennis-lime-500 dark:text-tennis-lime-400" />
            <span>{match.participants}</span>
          </div>
        </div>
      </div>

      {/* 가격과 참가 버튼 */}
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-tennis-ball-600 dark:text-tennis-ball-400">
          {match.price}
        </span>
        <motion.button
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            match.status === "full"
              ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              : "bg-tennis-court-600 dark:bg-tennis-court-500 text-white hover:bg-tennis-court-700 dark:hover:bg-tennis-court-600"
          }`}
          disabled={match.status === "full"}
          whileHover={match.status !== "full" ? { scale: 1.05 } : {}}
          whileTap={match.status !== "full" ? { scale: 0.95 } : {}}
          onClick={handleJoinClick}
        >
          {match.status === "full" ? "마감됨" : "참가하기"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MatchCard;
export type { MatchCardProps };
