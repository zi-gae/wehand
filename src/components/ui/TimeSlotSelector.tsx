import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MdCheck } from "react-icons/md";

interface TimeSlotSelectorProps {
  selectedSlots: string[];
  onSelectionChange: (startTime: string, endTime: string) => void;
  label: string;
  description: string;
  minSelectionHours?: number;
  className?: string;
}

const TimeSlotSelector = ({
  selectedSlots,
  onSelectionChange,
  label,
  description,
  minSelectionHours = 2,
  className = "",
}: TimeSlotSelectorProps) => {
  const [localSelectedSlots, setLocalSelectedSlots] = useState<string[]>(selectedSlots || []);

  // 시간 슬롯 생성 (1시간 단위)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 시간 슬롯 선택 핸들러 (연속 선택)
  const handleTimeSlotClick = (slot: string) => {
    const slotIndex = timeSlots.indexOf(slot);
    let newSlots: string[];
    let startTime = "";
    let endTime = "";

    if (localSelectedSlots.length === 0) {
      // 처음 선택
      newSlots = [slot];
    } else if (localSelectedSlots.length === 1) {
      // 두 번째 선택 - 범위 설정
      const startIndex = timeSlots.indexOf(localSelectedSlots[0]);
      const endIndex = slotIndex;

      if (endIndex > startIndex) {
        newSlots = timeSlots.slice(startIndex, endIndex + 1);
      } else if (endIndex === startIndex) {
        // 같은 슬롯 선택 - 1시간 설정
        newSlots = [slot];
      } else {
        // 역순 선택
        newSlots = timeSlots.slice(endIndex, startIndex + 1);
      }
    } else {
      // 재선택
      newSlots = [slot];
    }

    setLocalSelectedSlots(newSlots);

    // 시작 시간과 종료 시간 계산
    if (newSlots.length > 0) {
      startTime = newSlots[0];
      const lastHour = parseInt(newSlots[newSlots.length - 1].split(":")[0]);
      const endHour = lastHour === 23 ? 0 : lastHour + 1;
      endTime = endHour === 0 ? "24:00" : `${endHour.toString().padStart(2, "0")}:00`;
      
      onSelectionChange(startTime, endTime);
    }
  };

  // 시간 슬롯 스타일
  const getSlotStyle = (slot: string) => {
    if (localSelectedSlots.includes(slot)) {
      const index = localSelectedSlots.indexOf(slot);
      if (index === 0 && localSelectedSlots.length > 1) {
        return "bg-blue-500 text-white border-blue-500"; // 시작
      } else if (index === localSelectedSlots.length - 1 && localSelectedSlots.length > 1) {
        return "bg-blue-500 text-white border-blue-500"; // 끝
      } else {
        return "bg-blue-100 text-blue-700 border-blue-300"; // 중간
      }
    }
    return "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50";
  };

  // 외부에서 선택된 시간 슬롯이 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setLocalSelectedSlots(selectedSlots || []);
  }, [selectedSlots]);

  return (
    <div className={className}>
      <h3 className="text-base font-bold text-gray-800 mb-2">{label}</h3>
      <p className="text-gray-500 text-sm mb-3">{description}</p>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-max">
          {timeSlots.map((slot) => (
            <motion.button
              key={slot}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${getSlotStyle(slot)}`}
              onClick={() => handleTimeSlotClick(slot)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {slot}
            </motion.button>
          ))}
        </div>
      </div>

      {localSelectedSlots.length > 0 && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MdCheck className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium text-sm">
              선택된 시간: {localSelectedSlots[0]} ~ {(() => {
                const lastHour = parseInt(localSelectedSlots[localSelectedSlots.length - 1].split(":")[0]);
                const endHour = lastHour === 23 ? 0 : lastHour + 1;
                const endTime = endHour === 0 ? "24:00" : `${endHour.toString().padStart(2, "0")}:00`;
                const duration = localSelectedSlots.length;
                return `${endTime} (${duration}시간)`;
              })()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;