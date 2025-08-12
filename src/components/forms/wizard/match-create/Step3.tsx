import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MdSearch, MdLocationOn, MdCheck } from "react-icons/md";
import { getThemeClasses } from "../../../../lib/theme";
import { supabase } from "@/lib/supabase/client";

// Step 3: 장소 선택
const Step3 = ({ formData, updateFormData }: any) => {
  const theme = getThemeClasses();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourts, setFilteredCourts] = useState<any[]>([]);
  const [courtsData, setCourtsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCourts = async () => {
      try {
        const response = await fetch("/courts.json");
        const data = await response.json();
        setCourtsData(data);
      } catch (error) {
        console.error("테니스장 데이터 로드 실패:", error);
      }
    };
    loadCourts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && courtsData.length > 0) {
      setIsLoading(true);
      const filtered = courtsData
        .filter(
          (court) =>
            court.name.toLowerCase().includes(query.toLowerCase()) ||
            court.address.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10); // 최대 10개까지만 표시
      setFilteredCourts(filtered);
      setIsLoading(false);
    } else {
      setFilteredCourts([]);
    }
  };

  const selectCourt = (court: any) => {
    updateFormData({
      venue_id: court.id, // 코트의 id를 venue_id로 사용
      court: court.name,
    });
    setSearchQuery("");
    setFilteredCourts([]);
  };

  const popularLocations = [
    "올림픽공원 테니스장",
    "잠실 테니스장",
    "한강공원 테니스장",
    "반포 테니스장",
  ];

  const selectPopularLocation = (location: string) => {
    // 인기 장소에서 해당하는 코트를 courtsData에서 찾기
    const foundCourt = courtsData.find(
      (court) =>
        court.name.includes(location.replace(" 테니스장", "")) ||
        court.name === location
    );

    if (foundCourt) {
      updateFormData({
        venue_id: foundCourt.id,
        court: foundCourt.name,
      });
    } else {
      // 찾지 못한 경우 임시 ID 생성 (실제로는 에러 처리 필요)
      const tempId = `temp-${location
        .replace(" 테니스장", "")
        .toLowerCase()}-id`;
      updateFormData({
        venue_id: tempId,
        court: location,
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
      {/* 장소 선택 */}
      <div>
        <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
          테니스장을 선택하세요
        </h2>
        <p className={`text-sm mb-6 ${theme.text.secondary}`}>
          경기를 진행할 테니스장을 찾아보세요
        </p>

        <div className="relative mb-6">
          <MdSearch
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.text.secondary}`}
          />
          <input
            type="text"
            placeholder="테니스장 이름이나 주소를 검색하세요..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-colors ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} focus:outline-none focus:ring-2 focus:ring-tennis-court-500 focus:border-tennis-court-500`}
          />

          {isLoading && (
            <div
              className={`absolute z-10 w-full mt-2 rounded-2xl border shadow-lg p-4 text-center ${theme.surface.card} ${theme.border.primary}`}
            >
              <div className={theme.text.secondary}>검색 중...</div>
            </div>
          )}

          {filteredCourts.length > 0 && (
            <div
              className={`absolute z-10 w-full mt-2 rounded-2xl border shadow-lg max-h-80 overflow-y-auto ${theme.surface.card} ${theme.border.primary}`}
            >
              {filteredCourts.map((court) => (
                <motion.button
                  key={court.id}
                  className={`w-full p-4 text-left hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/10 flex items-start gap-3 border-b ${theme.border.primary} last:border-b-0`}
                  onClick={() => selectCourt(court)}
                  whileHover={{ x: 5 }}
                >
                  <MdLocationOn className="w-5 h-5 text-tennis-court-500 dark:text-tennis-court-400 mt-1" />
                  <div>
                    <div className={`font-medium ${theme.text.primary}`}>
                      {court.name}
                    </div>
                    <div className={`text-sm ${theme.text.secondary}`}>
                      {court.address}
                    </div>
                    {court.location && (
                      <div className="text-xs text-tennis-ball-600 dark:text-tennis-ball-400 mt-1">
                        {court.location.full_region}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className={`text-sm font-medium mb-3 ${theme.text.primary}`}>
            인기 테니스장
          </p>
          <div className="grid grid-cols-2 gap-3">
            {popularLocations.map((location) => (
              <motion.button
                key={location}
                className={`p-3 rounded-2xl border text-sm transition-colors ${
                  formData.court === location
                    ? "border-tennis-court-500 bg-tennis-court-50 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400"
                    : `${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border hover:border-tennis-court-300 dark:hover:border-tennis-court-600`
                }`}
                onClick={() => selectPopularLocation(location)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdLocationOn className="w-4 h-4 inline mr-1" />
                {location.replace(" 테니스장", "")}
              </motion.button>
            ))}
          </div>
        </div>

        {formData.court && (
          <div className="mt-4 p-4 bg-tennis-court-50 dark:bg-tennis-court-900/20 rounded-2xl">
            <div className="flex items-center gap-2">
              <MdCheck className="w-5 h-5 text-tennis-court-600 dark:text-tennis-court-400" />
              <span className="text-tennis-court-800 dark:text-tennis-court-300 font-medium">
                선택된 장소: {formData.court}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Step3;
