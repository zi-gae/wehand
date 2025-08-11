import { motion } from "framer-motion";
import { useState } from "react";
import { MdChevronLeft, MdChevronRight, MdSchedule } from "react-icons/md";
import TimeSlotSelector from "../../../ui/TimeSlotSelector";
import { getThemeClasses } from "../../../../lib/theme";

// Step 4: 날짜 & 시간 선택
const Step4 = ({ formData, updateFormData }: any) => {
  const theme = getThemeClasses();
  const [selectedDate, setSelectedDate] = useState(formData.match_date || "");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 달력 날짜 생성
  const generateCalendarDates = () => {
    const today = new Date();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 주 시작일에 맞춰 조정

    const dates = [];
    const currentDate = new Date(startDate);

    // 6주간 날짜 생성 (42일)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today && !isToday;

      dates.push({
        value: currentDate.toISOString().split("T")[0],
        date: currentDate.getDate(),
        month: currentDate.getMonth(),
        day: currentDate.toLocaleDateString("ko-KR", { weekday: "short" }),
        isToday,
        isCurrentMonth,
        isPast,
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();

  // 월 이동 핸들러
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 이전 달로 이동 불가 체크
  const canGoPrevious = () => {
    const today = new Date();
    const targetMonth = new Date(currentYear, currentMonth - 1, 1);
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    return targetMonth >= currentMonthStart;
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (dateValue: string) => {
    setSelectedDate(dateValue);
    updateFormData({ match_date: dateValue });
  };

  // 시간 선택 변경 핸들러
  const handleTimeSelectionChange = (startTime: string, endTime: string) => {
    updateFormData({
      start_time: startTime,
      end_time: endTime,
    });
  };

  // 선택된 시간 슬롯 계산
  const getSelectedTimeSlots = () => {
    if (!formData.start_time || !formData.end_time) return [];

    const generateTimeSlots = () => {
      const slots = [];
      for (let hour = 0; hour <= 23; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      return slots;
    };

    const timeSlots = generateTimeSlots();
    const startIndex = timeSlots.indexOf(formData.start_time);
    const endHour = parseInt(formData.end_time.split(":")[0]);
    const endIndex = timeSlots.indexOf(
      `${(endHour - 1).toString().padStart(2, "0")}:00`
    );

    if (startIndex !== -1 && endIndex !== -1) {
      return timeSlots.slice(startIndex, endIndex + 1);
    }
    return [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* 날짜 선택 - 캘린더 형태 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          날짜를 선택하세요
        </h2>
        <p className={`text-sm mb-4 ${theme.text.secondary}`}>
          언제 경기를 진행하시나요?
        </p>

        <div
          className={`rounded-2xl p-4 border ${theme.surface.card} ${theme.border.primary}`}
        >
          {/* 달력 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              className={`p-2 rounded-full ${
                canGoPrevious()
                  ? `${theme.text.primary} hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20`
                  : `${theme.text.secondary} cursor-not-allowed`
              }`}
              onClick={goToPreviousMonth}
              disabled={!canGoPrevious()}
              whileHover={canGoPrevious() ? { scale: 1.05 } : {}}
              whileTap={canGoPrevious() ? { scale: 0.95 } : {}}
            >
              <MdChevronLeft className="w-5 h-5" />
            </motion.button>

            <h3 className={`text-lg font-bold ${theme.text.primary}`}>
              {currentYear}년 {currentMonth + 1}월
            </h3>

            <motion.button
              className={`p-2 rounded-full ${theme.text.primary} hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20`}
              onClick={goToNextMonth}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-medium py-2 ${
                  index === 0
                    ? "text-status-error-500"
                    : index === 6
                    ? "text-tennis-court-500"
                    : theme.text.secondary
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDates.map((dateOption, index) => (
              <motion.button
                key={`${dateOption.value}-${index}`}
                className={`aspect-square p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDate === dateOption.value
                    ? "bg-tennis-court-500 text-white shadow-lg"
                    : !dateOption.isCurrentMonth
                    ? `${theme.text.secondary} opacity-50 hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/10`
                    : dateOption.isPast
                    ? `${theme.text.secondary} cursor-not-allowed opacity-40`
                    : dateOption.isToday
                    ? "bg-tennis-ball-50 dark:bg-tennis-ball-900/20 text-tennis-ball-600 dark:text-tennis-ball-400 border border-tennis-ball-200 dark:border-tennis-ball-700"
                    : dateOption.isWeekend
                    ? "text-status-error-500 hover:bg-status-error-50 dark:hover:bg-status-error-900/10"
                    : `${theme.text.primary} hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/10`
                }`}
                onClick={() =>
                  !dateOption.isPast && handleDateSelect(dateOption.value)
                }
                whileHover={!dateOption.isPast ? { scale: 1.05 } : {}}
                whileTap={!dateOption.isPast ? { scale: 0.95 } : {}}
                disabled={dateOption.isPast}
              >
                {dateOption.date}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-4 p-4 bg-tennis-court-50 dark:bg-tennis-court-900/20 rounded-2xl">
            <div className="flex items-center gap-2">
              <MdSchedule className="w-5 h-5 text-tennis-court-600 dark:text-tennis-court-400" />
              <span className="text-tennis-court-800 dark:text-tennis-court-300 font-medium">
                선택된 날짜:{" "}
                {new Date(selectedDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </span>
            </div>
          </div>
        )}

        {/* 시간 선택 */}
        <div className="mt-4">
          <TimeSlotSelector
            selectedSlots={getSelectedTimeSlots()}
            onSelectionChange={handleTimeSelectionChange}
            label="시간을 선택하세요"
            description="언제부터 언제까지 경기하시나요? (최소 2시간)"
            minSelectionHours={2}
            className=""
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Step4;
