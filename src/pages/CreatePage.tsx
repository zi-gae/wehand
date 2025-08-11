import Step1 from "@/components/forms/wizard/match-create/Step1";
import Step2 from "@/components/forms/wizard/match-create/Step2";
import Step3 from "@/components/forms/wizard/match-create/Step3";
import Step4 from "@/components/forms/wizard/match-create/Step4";
import Step5 from "@/components/forms/wizard/match-create/Step5";
import Step6 from "@/components/forms/wizard/match-create/Step6";
import Step7 from "@/components/forms/wizard/match-create/Step7";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCreateMatch } from "../hooks";
import { getThemeClasses, tennisGradients } from "../lib/theme";
import type { CreateMatchRequest } from "../api/generated-api";

const CreatePage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [currentStep, setCurrentStep] = useState(1);
  const autoProgressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // API 훅
  const createMatchMutation = useCreateMatch();

  const [formData, setFormData] = useState<CreateMatchRequest>({
    title: "",
    game_type: "singles",
    venue_id: "",
    court: "",
    match_date: "",
    start_time: "",
    end_time: "",
    max_participants: 2,
    recruit_ntrp_min: undefined,
    recruit_ntrp_max: undefined,
    recruit_experience_min: undefined,
    recruit_experience_max: undefined,
    price: undefined,
    description: "",
    rules: [],
  });

  const totalSteps = 7;

  // 컴포넌트 언마운트 시 타이머 정리 및 마운트 상태 관리
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (autoProgressTimerRef.current) {
        clearTimeout(autoProgressTimerRef.current);
        autoProgressTimerRef.current = null;
      }
    };
  }, []);

  const prevStep = () => {
    // 자동 진행 타이머 클리어
    if (autoProgressTimerRef.current) {
      clearTimeout(autoProgressTimerRef.current);
      autoProgressTimerRef.current = null;
    }

    if (currentStep > 1 && isMountedRef.current) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    createMatchMutation.mutate(formData, {
      onSuccess: (response) => {
        console.log("매치 생성 성공:", response);
        // 성공 시 생성된 매치의 상세 페이지로 이동
        navigate(`/matching/${response?.id}`);
      },
      onError: (error) => {
        console.error("매치 생성 실패:", error);
        // 에러 처리 (토스트 메시지 등)
      },
    });
  };

  const updateFormData = (updates: Partial<CreateMatchRequest>) => {
    if (!isMountedRef.current) return;

    setFormData((prev) => {
      const newData = { ...prev, ...updates };

      // 기존 타이머 클리어 (중복 실행 방지)
      if (autoProgressTimerRef.current) {
        clearTimeout(autoProgressTimerRef.current);
      }

      // 값이 업데이트된 후 자동 다음 단계로 이동
      autoProgressTimerRef.current = setTimeout(
        () => {
          const canProceedToNext = (() => {
            switch (currentStep) {
              case 1:
                return newData.game_type;
              case 2: {
                // NTRP와 구력 모두 범위가 선택되어야 함
                const hasNtrpRange =
                  newData.recruit_ntrp_min !== undefined &&
                  newData.recruit_ntrp_max !== undefined;
                const hasExperienceRange =
                  newData.recruit_experience_min !== undefined &&
                  newData.recruit_experience_max !== undefined;
                return hasNtrpRange && hasExperienceRange;
              }
              case 3:
                return newData.venue_id;
              case 4: {
                // 날짜와 시간이 모두 선택되어야 함 (시간은 최소 2시간 이상)
                if (
                  !newData.match_date ||
                  !newData.start_time ||
                  !newData.end_time
                )
                  return false;
                const startHour = parseInt(newData.start_time.split(":")[0]);
                const endHour =
                  newData.end_time === "24:00"
                    ? 24
                    : parseInt(newData.end_time.split(":")[0]);
                return endHour - startHour >= 2;
              }
              case 5:
                return (
                  newData.max_participants > 0 && newData.price !== undefined
                );
              case 6:
                return newData.title && newData.description;
              case 7:
                // 최종 확인 단계는 항상 진행 가능
                return true;
              default:
                return false;
            }
          })();

          if (
            canProceedToNext &&
            currentStep < totalSteps &&
            isMountedRef.current
          ) {
            setCurrentStep(currentStep + 1);
          }

          autoProgressTimerRef.current = null;
        },
        currentStep === 5 || currentStep === 6 ? 800 : 300
      ); // 입력 필드는 0.8초, 선택은 0.3초 후 자동 진행

      return newData;
    });
  };

  const getStepTitle = () => {
    const titles = [
      "",
      "게임 정보",
      "모집 기준",
      "장소 선택",
      "날짜 & 시간",
      "모집 정보",
      "상세 설명",
    ];
    return titles[currentStep];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content transition-colors duration-300`}
    >
      {/* Header */}
      <motion.header
        className={`${theme.background.glass} ${theme.text.primary} shadow-sm sticky top-0 z-40 transition-colors duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors`}
            onClick={() => (currentStep === 1 ? navigate(-1) : prevStep())}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.secondary}`} />
          </motion.button>

          <div className="text-center flex-1">
            <h1 className={`text-lg font-bold ${theme.text.primary}`}>
              {currentStep === totalSteps ? "최종 확인" : "매칭 생성"}
            </h1>
            <p className={`text-sm ${theme.text.secondary}`}>
              {getStepTitle()}
            </p>
          </div>

          <div className="w-10 flex justify-center">
            <span className={`text-sm ${theme.text.secondary}`}>
              {currentStep}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 bg-neutral-200 dark:bg-neutral-700`}>
          <motion.div
            className={`h-full ${tennisGradients.primary}`}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
      </motion.header>

      {/* Form Content */}
      <div className="px-2 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1
              key="step1"
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <Step2
              key="step2"
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <Step3
              key="step3"
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <Step4
              key="step4"
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 5 && (
            <Step5
              key="step5"
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 6 && (
            <Step6
              key="step6"
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
            />
          )}
          {currentStep === 7 && (
            <Step7
              key="step7"
              formData={formData}
              onSubmit={handleSubmit}
              isLoading={createMatchMutation.isPending}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Step 1: 게임 정보

export default CreatePage;
