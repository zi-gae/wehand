import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MdCheck } from "react-icons/md";
import { getThemeClasses } from "../../lib/theme";

interface RangeSlotSelectorProps {
  options: string[];
  selectedSlots: string[];
  onSelectionChange: (slots: string[]) => void;
  label: string;
  description: string;
  theme?: "blue" | "green" | "purple" | "red";
  valueMapping?: Record<string, string>; // UI 값을 실제 값으로 매핑
  className?: string;
}

const RangeSlotSelector = ({
  options,
  selectedSlots,
  onSelectionChange,
  label,
  description,
  theme = "blue",
  valueMapping,
  className = "",
}: RangeSlotSelectorProps) => {
  const [localSelectedSlots, setLocalSelectedSlots] = useState<string[]>(selectedSlots || []);
  const themeClasses = getThemeClasses();

  // 테마별 색상 설정 (테니스 컬러 팔레트 사용)
  const getThemeColors = () => {
    const themes = {
      blue: {
        primary: "bg-tennis-court-500 text-white border-tennis-court-500",
        secondary: "bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400 border-tennis-court-300 dark:border-tennis-court-700",
        hover: "hover:border-tennis-court-300 dark:hover:border-tennis-court-600 hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/10",
        result: "bg-tennis-court-50 dark:bg-tennis-court-900/20 text-tennis-court-800 dark:text-tennis-court-300",
        icon: "text-tennis-court-600 dark:text-tennis-court-400",
      },
      green: {
        primary: "bg-tennis-ball-500 text-white border-tennis-ball-500",
        secondary: "bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 border-tennis-ball-300 dark:border-tennis-ball-700",
        hover: "hover:border-tennis-ball-300 dark:hover:border-tennis-ball-600 hover:bg-tennis-ball-50 dark:hover:bg-tennis-ball-900/10",
        result: "bg-tennis-ball-50 dark:bg-tennis-ball-900/20 text-tennis-ball-800 dark:text-tennis-ball-300",
        icon: "text-tennis-ball-600 dark:text-tennis-ball-400",
      },
      purple: {
        primary: "bg-accent-500 text-white border-accent-500",
        secondary: "bg-accent-100 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 border-accent-300 dark:border-accent-700",
        hover: "hover:border-accent-300 dark:hover:border-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/10",
        result: "bg-accent-50 dark:bg-accent-900/20 text-accent-800 dark:text-accent-300",
        icon: "text-accent-600 dark:text-accent-400",
      },
      red: {
        primary: "bg-status-error-500 text-white border-status-error-500",
        secondary: "bg-status-error-100 dark:bg-status-error-900/20 text-status-error-700 dark:text-status-error-400 border-status-error-300 dark:border-status-error-700",
        hover: "hover:border-status-error-300 dark:hover:border-status-error-600 hover:bg-status-error-50 dark:hover:bg-status-error-900/10",
        result: "bg-status-error-50 dark:bg-status-error-900/20 text-status-error-800 dark:text-status-error-300",
        icon: "text-status-error-600 dark:text-status-error-400",
      },
    };
    return themes[theme];
  };

  const colors = getThemeColors();

  // 슬롯 선택 핸들러
  const handleSlotClick = (slot: string) => {
    const slotIndex = options.indexOf(slot);
    let newSlots: string[];

    if (localSelectedSlots.length === 0) {
      // 처음 선택
      newSlots = [slot];
    } else if (localSelectedSlots.length === 1) {
      // 두 번째 선택 - 범위 설정
      const startIndex = options.indexOf(localSelectedSlots[0]);
      const endIndex = slotIndex;

      if (endIndex >= startIndex) {
        newSlots = options.slice(startIndex, endIndex + 1);
      } else {
        newSlots = options.slice(endIndex, startIndex + 1);
      }
    } else {
      // 재선택
      newSlots = [slot];
    }

    setLocalSelectedSlots(newSlots);
    
    // 매핑된 값으로 변환하여 콜백 호출
    const mappedSlots = valueMapping 
      ? newSlots.map((s) => valueMapping[s] || s)
      : newSlots;
    
    onSelectionChange(mappedSlots);
  };

  // 슬롯 스타일 계산
  const getSlotStyle = (slot: string) => {
    if (localSelectedSlots.includes(slot)) {
      const index = localSelectedSlots.indexOf(slot);
      if (index === 0 && localSelectedSlots.length > 1) {
        return colors.primary; // 시작점
      } else if (index === localSelectedSlots.length - 1 && localSelectedSlots.length > 1) {
        return colors.primary; // 끝점
      } else if (localSelectedSlots.length > 1) {
        return colors.secondary; // 중간점
      } else {
        return colors.primary; // 단일 선택
      }
    }
    return `${themeClasses.surface.card} ${themeClasses.text.primary} ${themeClasses.border.primary} border ${colors.hover}`;
  };

  // 외부에서 selectedSlots가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    if (valueMapping && selectedSlots.length > 0) {
      // 매핑된 값을 다시 UI 용으로 변환
      const uiSlots = selectedSlots.map((mapped) => {
        const entry = Object.entries(valueMapping).find(
          ([_, value]) => value === mapped
        );
        return entry ? entry[0] : mapped;
      });
      setLocalSelectedSlots(uiSlots);
    } else {
      setLocalSelectedSlots(selectedSlots || []);
    }
  }, [selectedSlots, valueMapping]);

  return (
    <div className={className}>
      <h2 className={`text-xl font-bold mb-2 ${themeClasses.text.primary}`}>{label}</h2>
      <p className={`text-sm mb-3 ${themeClasses.text.secondary}`}>{description}</p>

      <div className={`rounded-2xl p-3 border transition-colors ${themeClasses.surface.card} ${themeClasses.border.primary}`}>
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-1 min-w-max">
            {options.map((slot) => (
              <motion.button
                key={slot}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${getSlotStyle(slot)}`}
                onClick={() => handleSlotClick(slot)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {slot}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {localSelectedSlots.length > 0 && (
        <div className={`mt-2 p-2 rounded-lg ${colors.result}`}>
          <div className="flex items-center gap-2">
            <MdCheck className={`w-3 h-3 ${colors.icon}`} />
            <span className="font-medium text-xs">
              {label}: {localSelectedSlots[0]} ~{" "}
              {localSelectedSlots[localSelectedSlots.length - 1]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeSlotSelector;