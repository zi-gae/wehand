import { motion } from "framer-motion";
import { useState } from "react";
import RangeSlotSelector from "../../../ui/RangeSlotSelector";

// Step 2: 모집 기준
const Step2 = ({ formData, updateFormData }: any) => {
  const ntripOptions = [
    "1.0",
    "1.5",
    "2.0",
    "2.5",
    "3.0",
    "3.5",
    "4.0",
    "4.5",
    "5.0",
    "5.5",
    "6.0",
    "6.5",
    "7.0",
  ];

  const experienceOptions = [
    "입문",
    "1년",
    "2년",
    "3년",
    "4년",
    "5년",
    "6년",
    "7년",
    "8년",
    "9년",
    "10년",
  ];

  // 백엔드에서 사용할 수 있도록 매핑
  const experienceMapping: Record<string, string> = {
    입문: "0",
    "1년": "1",
    "2년": "2",
    "3년": "3",
    "4년": "4",
    "5년": "5",
    "6년": "6",
    "7년": "7",
    "8년": "8",
    "9년": "9",
    "10년": "10",
  };

  // NTRP 초기값을 min/max에서 가져와서 범위로 변환
  const getNtrpRangeFromMinMax = () => {
    if (
      formData.recruit_ntrp_min !== undefined &&
      formData.recruit_ntrp_max !== undefined
    ) {
      const min = formData.recruit_ntrp_min.toString();
      const max = formData.recruit_ntrp_max.toString();
      const startIndex = ntripOptions.indexOf(min);
      const endIndex = ntripOptions.indexOf(max);
      if (startIndex >= 0 && endIndex >= 0) {
        return ntripOptions.slice(startIndex, endIndex + 1);
      }
    }
    return [];
  };

  // 경력 초기값을 min/max에서 가져와서 범위로 변환
  const getExperienceRangeFromMinMax = () => {
    if (
      formData.recruit_experience_min !== undefined &&
      formData.recruit_experience_max !== undefined
    ) {
      const min = formData.recruit_experience_min.toString();
      const max = formData.recruit_experience_max.toString();
      const minKey = Object.entries(experienceMapping).find(
        ([_, value]) => value === min
      )?.[0];
      const maxKey = Object.entries(experienceMapping).find(
        ([_, value]) => value === max
      )?.[0];
      if (minKey && maxKey) {
        const startIndex = experienceOptions.indexOf(minKey);
        const endIndex = experienceOptions.indexOf(maxKey);
        if (startIndex >= 0 && endIndex >= 0) {
          return experienceOptions.slice(startIndex, endIndex + 1);
        }
      }
    }
    return [];
  };

  const [selectedNtrpSlots, setSelectedNtrpSlots] = useState<string[]>(
    getNtrpRangeFromMinMax()
  );
  const [selectedExperienceSlots, setSelectedExperienceSlots] = useState<
    string[]
  >(getExperienceRangeFromMinMax());

  // NTRP 선택 변경 핸들러
  const handleNtrpSelectionChange = (slots: string[]) => {
    setSelectedNtrpSlots(slots);
    if (slots.length > 0) {
      const min = parseFloat(slots[0]);
      const max = parseFloat(slots[slots.length - 1]);
      updateFormData({
        recruit_ntrp_min: min,
        recruit_ntrp_max: max,
      });
    }
  };

  // 구력 선택 변경 핸들러
  const handleExperienceSelectionChange = (mappedSlots: string[]) => {
    setSelectedExperienceSlots(mappedSlots);
    if (mappedSlots.length > 0) {
      const min = parseInt(mappedSlots[0]);
      const max = parseInt(mappedSlots[mappedSlots.length - 1]);
      updateFormData({
        recruit_experience_min: min,
        recruit_experience_max: max,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* NTRP 범위 선택 */}
      <RangeSlotSelector
        options={ntripOptions}
        selectedSlots={selectedNtrpSlots}
        onSelectionChange={handleNtrpSelectionChange}
        label="NTRP를 설정해 주세요"
        description="어떤 실력대의 참가자를 모집하실 건가요?"
        theme="blue"
      />

      {/* 구력 범위 선택 */}
      <RangeSlotSelector
        options={experienceOptions}
        selectedSlots={selectedExperienceSlots}
        onSelectionChange={handleExperienceSelectionChange}
        label="구력을 설정해 주세요"
        description="어느 정도 경험이 있는 분들을 모집하실 건가요?"
        theme="green"
        valueMapping={experienceMapping}
      />
    </motion.div>
  );
};

export default Step2;
