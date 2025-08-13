import { motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getThemeClasses } from "../lib/theme";

const PrivacyPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();

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
      >
        <div className="flex items-center px-6 py-4">
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>

          <h1 className={`text-lg font-bold ml-4 ${theme.text.primary}`}>
            개인정보처리방침
          </h1>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-2 py-4 max-w-4xl mx-auto">
        <motion.div
          className={`rounded-2xl p-4 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-4">
            {/* 머리글 */}
            <div>
              <h2 className={`text-lg font-bold mb-2 ${theme.text.primary}`}>
                위핸드(WeHand) 개인정보처리방침
              </h2>
              <p className={`text-xs ${theme.text.secondary}`}>
                시행일자: 2024년 1월 1일
              </p>
            </div>

            {/* 개인정보처리방침 내용 */}
            <div className="space-y-4">
              {/* 제1조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제1조 (개인정보의 처리목적)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>위핸드(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>회원 가입 및 관리</li>
                    <li>테니스 매칭 서비스 제공</li>
                    <li>본인확인 및 개인 식별</li>
                    <li>서비스 이용에 따른 본인인증, 개인 식별</li>
                    <li>불량회원의 부정 이용 방지와 비인가 사용 방지</li>
                    <li>고객 상담 및 불만처리</li>
                    <li>서비스 개선 및 신규 서비스 개발</li>
                    <li>마케팅 및 광고에의 활용</li>
                  </ul>
                </div>
              </section>

              {/* 제2조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제2조 (처리하는 개인정보의 항목)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-3`}>
                  <div>
                    <p className="font-semibold mb-2">1. 회원가입 시 수집하는 개인정보:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>필수항목: 이메일, 이름, 닉네임</li>
                      <li>선택항목: 프로필 사진, 자기소개, 테니스 실력 등급(NTRP), 구력, 선호 플레이 스타일</li>
                      <li>카카오 로그인 시: 카카오 계정 정보 (이메일, 이름, 프로필 이미지)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">2. 서비스 이용 과정에서 수집하는 개인정보:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>매칭 생성 및 참가 정보</li>
                      <li>채팅 및 커뮤니티 활동 내역</li>
                      <li>서비스 이용 기록, 접속 로그, 접속 IP 정보</li>
                      <li>기기정보 (모델명, OS버전 등)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 제3조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제3조 (개인정보의 처리 및 보유기간)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                  <p>2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>회원 가입 및 관리: 회원 탈퇴시까지</li>
                    <li>서비스 이용 기록: 3년</li>
                    <li>불만 또는 분쟁처리에 관한 기록: 3년</li>
                    <li>마케팅 정보 제공: 회원 탈퇴시까지</li>
                  </ul>
                </div>
              </section>

              {/* 제4조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제4조 (개인정보의 제3자 제공)
                </h3>
                <p className={`${theme.text.primary} text-xs leading-relaxed`}>
                  회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 
                  정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 
                  개인정보를 제3자에게 제공합니다.
                </p>
              </section>

              {/* 제5조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제5조 (개인정보처리의 위탁)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>카카오톡 로그인 서비스: ㈜카카오</li>
                    <li>클라우드 서버 호스팅: Amazon Web Services, Inc.</li>
                    <li>푸시 알림 서비스: Firebase Cloud Messaging</li>
                  </ul>
                </div>
              </section>

              {/* 제6조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제6조 (정보주체의 권리·의무 및 그 행사방법)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>개인정보 처리현황 통지요구</li>
                    <li>개인정보 처리정지 요구</li>
                    <li>개인정보의 수정·삭제 요구</li>
                    <li>손해배상 청구</li>
                  </ul>
                  <p>위의 권리 행사는 회사에 대해 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.</p>
                </div>
              </section>

              {/* 제7조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제7조 (개인정보의 안전성 확보조치)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>정기적인 자체 감사 실시</li>
                    <li>개인정보 취급 직원의 최소화 및 교육</li>
                    <li>개인정보에 대한 접근 제한</li>
                    <li>개인정보를 안전하게 저장·전송할 수 있는 암호화기법 사용</li>
                    <li>백신프로그램을 이용한 컴퓨터바이러스에 의한 피해 방지</li>
                    <li>해킹 등에 의한 개인정보 유출 및 훼손 방지를 위한 보안프로그램 설치 및 갱신·점검</li>
                  </ul>
                </div>
              </section>

              {/* 제8조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제8조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>1. 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
                  <p>2. 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</p>
                  <p>3. 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</p>
                </div>
              </section>

              {/* 제9조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제9조 (개인정보보호책임자)
                </h3>
                <div className={`${theme.text.primary} text-xs leading-relaxed space-y-2`}>
                  <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
                  <div className="ml-4 space-y-1">
                    <p>▶ 개인정보보호책임자</p>
                    <p>성명: 위핸드 개발팀</p>
                    <p>이메일: privacy@wehand.tennis</p>
                  </div>
                </div>
              </section>

              {/* 제10조 */}
              <section>
                <h3 className={`text-sm font-semibold mb-2 ${theme.text.primary}`}>
                  제10조 (개인정보처리방침 변경)
                </h3>
                <p className={`${theme.text.primary} text-xs leading-relaxed`}>
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
                  변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </section>
            </div>

            {/* 연락처 정보 */}
            <div className={`mt-6 pt-4 border-t ${theme.border.primary}`}>
              <h3 className={`text-sm font-semibold mb-3 ${theme.text.primary}`}>
                문의사항
              </h3>
              <div className={`${theme.text.secondary} text-xs space-y-1`}>
                <p>서비스명: 위핸드(WeHand)</p>
                <p>개인정보보호 담당자: privacy@wehand.tennis</p>
                <p>고객센터: support@wehand.tennis</p>
                <p>본 방침은 2024년 1월 1일부터 시행됩니다.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;