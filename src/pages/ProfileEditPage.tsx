import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdCalendarToday,
  MdCheck,
  MdEmojiEvents,
  MdPerson,
  MdTimer,
  MdTrendingUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { getThemeClasses } from "../lib/theme";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();

  // API 훅
  const { data: userData, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // 폼 상태
  const [formData, setFormData] = useState({
    nickname: "",
    experience_years: 0,
    ntrp: 3.5,
  });

  // 유효성 검사 상태
  const [errors, setErrors] = useState({
    nickname: "",
    experience_years: "",
    ntrp: "",
  });

  // 사용자 데이터로 폼 초기화
  useEffect(() => {
    if (userData?.userInfo) {
      setFormData({
        nickname:
          userData.userInfo.nickname ||
          userData.userInfo.email?.split("@")[0] ||
          "",
        experience_years: userData.userInfo.experience_years || 0,
        ntrp: userData.userInfo.ntrp || 3.5,
      });
    }
  }, [userData]);

  // NTRP 레벨 옵션
  const ntrpLevels = [
    {
      value: 2.0,
      label: "2.0",
      description: "테니스를 막 시작",
      color: "from-blue-400 to-blue-500",
    },
    {
      value: 2.5,
      label: "2.5",
      description: "기본 스트로크 가능",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: 3.0,
      label: "3.0",
      description: "꾸준한 랠리 가능",
      color: "from-cyan-500 to-teal-500",
    },
    {
      value: 3.5,
      label: "3.5",
      description: "방향 조절 가능",
      color: "from-teal-500 to-green-500",
    },
    {
      value: 4.0,
      label: "4.0",
      description: "스핀과 페이스 조절",
      color: "from-green-500 to-lime-500",
    },
    {
      value: 4.5,
      label: "4.5",
      description: "파워와 정확성",
      color: "from-lime-500 to-yellow-500",
    },
    {
      value: 5.0,
      label: "5.0",
      description: "토너먼트 수준",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: 5.5,
      label: "5.5",
      description: "지역 대회 상위",
      color: "from-orange-500 to-red-500",
    },
    {
      value: 6.0,
      label: "6.0",
      description: "준프로 수준",
      color: "from-red-500 to-purple-500",
    },
  ];

  // 구력 레벨 옵션
  const experienceLevels = [
    {
      value: 0,
      label: "0년",
      description: "이제 막 시작",
      color: "from-blue-400 to-blue-500",
    },
    {
      value: 1,
      label: "1년",
      description: "기초를 배우는 중",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: 2,
      label: "2년",
      description: "기본기 익히기",
      color: "from-cyan-500 to-teal-500",
    },
    {
      value: 3,
      label: "3년",
      description: "꾸준히 연습 중",
      color: "from-teal-500 to-green-500",
    },
    {
      value: 4,
      label: "4년",
      description: "실력 향상 중",
      color: "from-green-500 to-lime-500",
    },
    {
      value: 5,
      label: "5년",
      description: "안정적인 플레이",
      color: "from-lime-500 to-yellow-500",
    },
    {
      value: 6,
      label: "6년",
      description: "다양한 기술 구사",
      color: "from-yellow-500 to-amber-500",
    },
    {
      value: 7,
      label: "7년",
      description: "경험이 풍부",
      color: "from-amber-500 to-orange-500",
    },
    {
      value: 8,
      label: "8년",
      description: "숙련된 플레이어",
      color: "from-orange-500 to-red-500",
    },
    {
      value: 9,
      label: "9년",
      description: "베테랑 수준",
      color: "from-red-500 to-pink-500",
    },
    {
      value: 10,
      label: "10년+",
      description: "마스터 레벨",
      color: "from-pink-500 to-purple-500",
    },
  ];

  // 입력 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = {
      nickname: "",
      location: "",
      experience_years: "",
      ntrp: "",
    };

    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요";
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다";
    } else if (formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 20자 이하여야 합니다";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validate()) return;

    try {
      await updateProfileMutation.mutateAsync({
        nickname: formData.nickname.trim(),
        experience_years: formData.experience_years,
        ntrp: formData.ntrp,
      });

      // 성공 시 프로필 페이지로 이동
      navigate("/profile");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
    }
  };

  if (profileLoading) {
    return (
      <div className={`min-h-screen ${theme.background.tennis} p-4 pb-safe`}>
        <div className="max-w-lg mx-auto space-y-4 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content pb-safe`}
    >
      {/* Floating Header - Fixed at Top */}
      <motion.header
        className={`${theme.background.glass} backdrop-blur-lg shadow-lg fixed top-0 left-0 right-0 z-40`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            className="p-2.5 rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm"
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-5 h-5 ${theme.text.primary}`} />
          </motion.button>

          <motion.h1
            className={`text-lg font-bold ${theme.text.primary}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            프로필 설정
          </motion.h1>

          <motion.button
            className={`p-2.5 rounded-2xl ${
              updateProfileMutation.isPending
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-gradient-to-r from-tennis-court-500 to-tennis-ball-500"
            } shadow-lg`}
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            whileHover={!updateProfileMutation.isPending ? { scale: 1.05 } : {}}
            whileTap={!updateProfileMutation.isPending ? { scale: 0.95 } : {}}
          >
            {updateProfileMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MdCheck className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[68px]" />

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* 프로필 미리보기 카드 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-3xl p-6 shadow-xl ${theme.surface.card} border ${theme.border.primary}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tennis-court-400 to-tennis-ball-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {formData.nickname.charAt(0) || "?"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${theme.text.primary}`}>
                {formData.nickname || "닉네임"}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-1 rounded-lg bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-600 dark:text-tennis-court-400 text-xs font-medium">
                  NTRP {formData.ntrp}
                </span>
                <span className="px-2 py-1 rounded-lg bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-600 dark:text-tennis-ball-400 text-xs font-medium">
                  {formData.experience_years}년 경력
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 닉네임 입력 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-5 ${theme.surface.card} border ${theme.border.primary} shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MdPerson className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${theme.text.primary}`}>닉네임</h3>
              <p className={`text-xs ${theme.text.secondary}`}>
                다른 사용자에게 보여질 이름
              </p>
            </div>
          </div>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            placeholder="닉네임을 입력하세요"
            className={`w-full px-4 py-3 rounded-xl ${
              theme.background.primary
            } ${theme.text.primary} ${
              errors.nickname ? "border-red-500" : theme.border.primary
            } border-2 focus:outline-none focus:border-tennis-court-400 transition-all`}
            maxLength={20}
          />
          <div className="flex items-center justify-between mt-2">
            {errors.nickname ? (
              <p className="text-red-500 text-xs">{errors.nickname}</p>
            ) : (
              <p className={`text-xs ${theme.text.secondary}`}>
                2-20자 한글, 영문, 숫자
              </p>
            )}
            <span className={`text-xs ${theme.text.secondary}`}>
              {formData.nickname.length}/20
            </span>
          </div>
        </motion.div>

        {/* 테니스 경력 선택 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-5 ${theme.surface.card} border ${theme.border.primary} shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <MdTimer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${theme.text.primary}`}>
                테니스 경력
              </h3>
              <p className={`text-xs ${theme.text.secondary}`}>
                테니스를 시작한 지 얼마나 되셨나요?
              </p>
            </div>
          </div>

          {/* 경력 슬라이더 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${theme.text.secondary}`}>경력</span>
              <span className={`text-lg font-bold ${theme.text.primary}`}>
                {formData.experience_years === 10
                  ? "10년+"
                  : `${formData.experience_years}년`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={formData.experience_years}
              onChange={(e) =>
                handleInputChange("experience_years", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                  (formData.experience_years / 10) * 100
                }%, #E5E7EB ${
                  (formData.experience_years / 10) * 100
                }%, #E5E7EB 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${theme.text.secondary}`}>입문</span>
              <span className={`text-xs ${theme.text.secondary}`}>5년</span>
              <span className={`text-xs ${theme.text.secondary}`}>베테랑</span>
            </div>
          </div>

          {/* 선택된 경력 설명 */}
          <AnimatePresence mode="wait">
            {experienceLevels.map(
              (level) =>
                level.value === formData.experience_years && (
                  <motion.div
                    key={level.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-xl ${theme.background.secondary} border ${theme.border.primary}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-lg">
                            {level.value === 10 ? "10+" : level.value}
                          </span>
                        </div>
                        <div>
                          <div
                            className={`font-semibold ${theme.text.primary}`}
                          >
                            테니스 경력 {level.label}
                          </div>
                          <div className={`text-sm ${theme.text.secondary}`}>
                            {level.description}
                          </div>
                        </div>
                      </div>
                      <MdCalendarToday
                        className={`w-5 h-5 ${theme.text.secondary} opacity-50`}
                      />
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </motion.div>

        {/* NTRP 레벨 선택 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl p-5 ${theme.surface.card} border ${theme.border.primary} shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tennis-court-500 to-tennis-ball-500 flex items-center justify-center">
              <MdEmojiEvents className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${theme.text.primary}`}>
                NTRP 레벨
              </h3>
              <p className={`text-xs ${theme.text.secondary}`}>
                본인의 실력을 평가해주세요
              </p>
            </div>
          </div>

          {/* NTRP 슬라이더 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${theme.text.secondary}`}>레벨</span>
              <span className={`text-lg font-bold ${theme.text.primary}`}>
                {formData.ntrp.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="6.0"
              step="0.5"
              value={formData.ntrp}
              onChange={(e) =>
                handleInputChange("ntrp", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                  ((formData.ntrp - 2.0) / 4.0) * 100
                }%, #E5E7EB ${
                  ((formData.ntrp - 2.0) / 4.0) * 100
                }%, #E5E7EB 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${theme.text.secondary}`}>초급</span>
              <span className={`text-xs ${theme.text.secondary}`}>중급</span>
              <span className={`text-xs ${theme.text.secondary}`}>상급</span>
            </div>
          </div>

          {/* 선택된 레벨 설명 */}
          <AnimatePresence mode="wait">
            {ntrpLevels.map(
              (level) =>
                level.value === formData.ntrp && (
                  <motion.div
                    key={level.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-xl ${theme.background.secondary} border ${theme.border.primary}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-lg">
                            {level.label}
                          </span>
                        </div>
                        <div>
                          <div
                            className={`font-semibold ${theme.text.primary}`}
                          >
                            NTRP 레벨 {level.label}
                          </div>
                          <div className={`text-sm ${theme.text.secondary}`}>
                            {level.description}
                          </div>
                        </div>
                      </div>
                      <MdTrendingUp
                        className={`w-5 h-5 ${theme.text.secondary} opacity-50`}
                      />
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </motion.div>

        {/* 저장 버튼 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
              updateProfileMutation.isPending
                ? "bg-gray-400"
                : "bg-gradient-to-r from-tennis-court-500 to-tennis-ball-500"
            }`}
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            whileHover={
              !updateProfileMutation.isPending ? { scale: 1.02, y: -2 } : {}
            }
            whileTap={!updateProfileMutation.isPending ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <MdCheck className="w-5 h-5" />
                  <span>변경사항 저장</span>
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileEditPage;
