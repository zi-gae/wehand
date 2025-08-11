import { motion } from "framer-motion";
import { MdGroup, MdSportsTennis } from "react-icons/md";
import { getThemeClasses } from "../../../../lib/theme";

// 게임 정보
const Step1 = ({ formData, updateFormData }: any) => {
  const theme = getThemeClasses();
  const gameTypes = [
    {
      value: "singles",
      label: "단식",
      icon: MdSportsTennis,
      description: "1 vs 1 경기",
    },
    {
      value: "mens_doubles",
      label: "남성복식",
      icon: MdGroup,
      description: "남성 2 vs 2",
    },
    {
      value: "womens_doubles",
      label: "여성복식",
      icon: MdGroup,
      description: "여성 2 vs 2",
    },
    {
      value: "mixed_doubles",
      label: "혼성복식",
      icon: MdGroup,
      description: "남녀 혼성 2 vs 2",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* 게임 유형 선택 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          게임 유형을 선택하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          어떤 형태의 테니스 경기를 원하시나요?
        </p>

        <div className="grid grid-cols-2 gap-4">
          {gameTypes.map((type) => (
            <motion.button
              key={type.value}
              className={`p-4 rounded-3xl border-2 transition-all ${
                formData.game_type === type.value
                  ? "border-tennis-court-500 bg-tennis-court-50 dark:bg-tennis-court-900/20 dark:border-tennis-court-400"
                  : `${theme.surface.card} ${theme.border.primary} border hover:border-tennis-court-300 dark:hover:border-tennis-court-600`
              }`}
              onClick={() => updateFormData({ game_type: type.value })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <type.icon
                className={`w-8 h-8 mb-2 ${
                  formData.game_type === type.value
                    ? "text-tennis-court-600 dark:text-tennis-court-400"
                    : "text-tennis-ball-500 dark:text-tennis-ball-400"
                }`}
              />
              <div
                className={`font-bold mb-1 ${
                  formData.game_type === type.value
                    ? "text-tennis-court-700 dark:text-tennis-court-300"
                    : theme.text.primary
                }`}
              >
                {type.label}
              </div>
              <div className={`text-xs ${theme.text.secondary}`}>
                {type.description}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Step1;
