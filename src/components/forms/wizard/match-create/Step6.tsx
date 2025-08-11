import { motion } from "framer-motion";
import { getThemeClasses } from "../../../../lib/theme";

// Step 6: 상세 설명
const Step6 = ({ formData, updateFormData, onSubmit }: any) => {
  const theme = getThemeClasses();
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* 매칭 제목 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          매칭 제목을 작성하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          참가자들이 쉽게 찾을 수 있는 제목을 만들어주세요
        </p>

        <input
          type="text"
          placeholder="예) 즐거운 주말 테니스 매치!"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          className={`w-full p-4 rounded-2xl border transition-colors ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} focus:outline-none focus:ring-2 focus:ring-tennis-court-500 focus:border-tennis-court-500`}
          maxLength={50}
        />
        <div className={`text-right text-xs mt-2 ${theme.text.secondary}`}>
          {formData.title?.length || 0}/50
        </div>
      </div>

      {/* 상세 설명 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          상세 설명을 작성하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          매칭에 대한 자세한 정보를 알려주세요
        </p>

        <textarea
          placeholder="예) 즐겁고 건전한 테니스 경기를 하실 분들을 모집합니다. 실력보다는 매너를 중시하며, 함께 즐길 수 있는 분들과 좋은 시간을 보내고 싶어요!"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className={`w-full p-4 rounded-2xl border transition-colors resize-none ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} focus:outline-none focus:ring-2 focus:ring-tennis-court-500 focus:border-tennis-court-500`}
          rows={6}
          maxLength={300}
        />
        <div className={`text-right text-xs mt-2 ${theme.text.secondary}`}>
          {formData.description?.length || 0}/300
        </div>
      </div>
    </motion.div>
  );
};

export default Step6;
