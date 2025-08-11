import { motion } from "framer-motion";
import {
  MdStar,
  MdLocationOn,
  MdSchedule,
  MdGroup,
  MdCheck,
} from "react-icons/md";
import { getThemeClasses } from "../../../../lib/theme";

interface Step7Props {
  formData: any;
  onSubmit: () => void;
  isLoading?: boolean;
}

// Step 7: 최종 확인
const Step7 = ({ formData, onSubmit, isLoading = false }: Step7Props) => {
  const theme = getThemeClasses();
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          매칭 정보를 확인하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          생성하기 전에 정보를 다시 한번 확인해주세요
        </p>
      </div>

      {/* 매칭 정보 카드 */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary}`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-3 ${theme.text.primary}`}>
              {formData.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400 rounded-full text-sm font-medium">
                {formData.game_type === "singles"
                  ? "단식"
                  : formData.game_type === "mens_doubles"
                  ? "남성복식"
                  : formData.game_type === "womens_doubles"
                  ? "여성복식"
                  : formData.game_type === "mixed_doubles"
                  ? "혼성복식"
                  : formData.game_type}
              </span>
              {formData.recruit_ntrp_min && formData.recruit_ntrp_max && (
                <span className="px-3 py-1 bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 rounded-full text-sm font-medium">
                  <MdStar className="inline w-4 h-4 mr-1" />
                  NTRP {formData.recruit_ntrp_min}~{formData.recruit_ntrp_max}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`flex items-center gap-3 ${theme.text.primary}`}>
            <MdLocationOn className="w-5 h-5 text-tennis-court-500 dark:text-tennis-court-400" />
            <p className="font-medium">{formData.court}</p>
          </div>

          <div className={`flex items-center gap-3 ${theme.text.primary}`}>
            <MdSchedule className="w-5 h-5 text-tennis-ball-500 dark:text-tennis-ball-400" />
            <p className="font-medium">
              {formData.match_date &&
                new Date(formData.match_date).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}{" "}
              {formData.start_time}~{formData.end_time}
            </p>
          </div>

          <div className={`flex items-center gap-3 ${theme.text.primary}`}>
            <MdGroup className="w-5 h-5 text-accent-500 dark:text-accent-400" />
            <p className="font-medium">
              최대 {formData.max_participants}명 모집
            </p>
          </div>

          <div className={`flex items-center gap-3 ${theme.text.primary}`}>
            <span className="w-5 h-5 text-center text-tennis-ball-600 dark:text-tennis-ball-400 font-bold">
              ₩
            </span>
            <p className="font-medium text-tennis-court-600 dark:text-tennis-court-400 text-lg">
              {formData.price ? formData.price.toLocaleString() : 0}원
            </p>
          </div>
        </div>

        {formData.description && (
          <div className="mt-6 p-4 bg-tennis-court-50 dark:bg-tennis-court-900/10 rounded-2xl">
            <p className={`text-sm leading-relaxed ${theme.text.primary}`}>
              {formData.description}
            </p>
          </div>
        )}

        <motion.button
          className={`w-full mt-6 py-4 bg-gradient-to-r from-tennis-court-500 to-tennis-ball-500 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-shadow ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          onClick={onSubmit}
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 inline mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
              매칭 생성 중...
            </>
          ) : (
            <>
              <MdCheck className="w-6 h-6 inline mr-2" />
              매칭 생성하기
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
export default Step7;
