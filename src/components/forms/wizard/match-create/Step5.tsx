import { motion } from "framer-motion";
import { getThemeClasses } from "../../../../lib/theme";

// Step 5: 모집 정보
const Step5 = ({ formData, updateFormData }: any) => {
  const theme = getThemeClasses();
  const maxOptions = [1, 2, 3, 4, 5];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* 모집 인원 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          모집 인원을 설정하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          총 몇 명을 모집하시나요? (본인 포함)
        </p>

        <div className="grid grid-cols-5 gap-3">
          {maxOptions.map((option) => (
            <motion.button
              key={option}
              className={`p-4 rounded-2xl border-2 transition-all ${
                formData.max_participants === option
                  ? "border-tennis-court-500 bg-tennis-court-50 dark:bg-tennis-court-900/20 dark:border-tennis-court-400"
                  : `${theme.surface.card} ${theme.border.primary} border hover:border-tennis-court-300 dark:hover:border-tennis-court-600`
              }`}
              onClick={() => updateFormData({ max_participants: option })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`text-2xl font-bold mb-1 ${
                  formData.max_participants === option
                    ? "text-tennis-court-600 dark:text-tennis-court-400"
                    : "text-tennis-ball-500 dark:text-tennis-ball-400"
                }`}
              >
                {option}
              </div>
              <div className={`text-sm ${theme.text.secondary}`}>명</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 참가비 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          참가비를 설정하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          1인당 참가비를 입력해주세요
        </p>

        <div className="space-y-4">
          <div className="flex gap-3">
            {[10000, 15000, 20000, 25000].map((price) => (
              <motion.button
                key={price}
                className={`px-4 py-3 rounded-2xl border text-sm transition-all ${
                  formData.price === price
                    ? "border-tennis-ball-500 bg-tennis-ball-50 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 dark:border-tennis-ball-400"
                    : `${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border hover:border-tennis-ball-300 dark:hover:border-tennis-ball-600`
                }`}
                onClick={() => updateFormData({ price })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {price.toLocaleString()}원
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="직접 입력"
              className={`flex-1 p-4 rounded-2xl border transition-colors ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} focus:outline-none focus:ring-2 focus:ring-tennis-ball-500 focus:border-tennis-ball-500`}
              onChange={(e) =>
                updateFormData({
                  price: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
            />
            <span className={`font-medium ${theme.text.secondary}`}>원</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Step5;
