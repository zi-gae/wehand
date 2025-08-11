import { motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getThemeClasses } from "../lib/theme";

const TermsPage = () => {
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
            이용약관
          </h1>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <motion.div
          className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-6">
            {/* 머리글 */}
            <div>
              <h2 className={`text-xl font-bold mb-2 ${theme.text.primary}`}>
                위핸드(WeHand) 서비스 이용약관
              </h2>
              <p className={`text-sm ${theme.text.secondary}`}>
                시행일자: 2024년 1월 1일
              </p>
            </div>

            {/* 약관 내용 */}
            <div className="space-y-6">
              {/* 제1조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제1조 (목적)
                </h3>
                <p className={`${theme.text.primary} leading-relaxed`}>
                  본 약관은 위핸드(WeHand)(이하 "회사")가 제공하는 테니스 매칭 플랫폼 서비스(이하 "서비스")를 
                  이용함에 있어 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              {/* 제2조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제2조 (정의)
                </h3>
                <div className={`${theme.text.primary} leading-relaxed space-y-2`}>
                  <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>"서비스"란 회사가 제공하는 테니스 매칭, 채팅, 커뮤니티 등의 모든 서비스를 의미합니다.</li>
                    <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                    <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                    <li>"매칭"이란 테니스 경기를 위한 참가자들을 연결하는 서비스를 의미합니다.</li>
                  </ul>
                </div>
              </section>

              {/* 제3조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제3조 (서비스의 제공)
                </h3>
                <div className={`${theme.text.primary} leading-relaxed space-y-2`}>
                  <p>회사는 다음과 같은 서비스를 제공합니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>테니스 매치 생성 및 참가 서비스</li>
                    <li>매치 참가자 간 채팅 서비스</li>
                    <li>테니스 관련 커뮤니티 서비스</li>
                    <li>테니스장 정보 제공 서비스</li>
                    <li>기타 회사가 정하는 서비스</li>
                  </ul>
                </div>
              </section>

              {/* 제4조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제4조 (회원가입)
                </h3>
                <div className={`${theme.text.primary} leading-relaxed space-y-2`}>
                  <p>1. 회원가입은 이용자가 본 약관에 동의하고 회사가 정한 가입양식에 따라 회원정보를 기입한 후 회사가 이를 승낙함으로써 성립됩니다.</p>
                  <p>2. 회사는 다음 각 호에 해당하는 가입신청에 대하여는 승낙하지 아니할 수 있습니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                    <li>이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우</li>
                  </ul>
                </div>
              </section>

              {/* 제5조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제5조 (이용자의 의무)
                </h3>
                <div className={`${theme.text.primary} leading-relaxed space-y-2`}>
                  <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개 또는 게시하는 행위</li>
                  </ul>
                </div>
              </section>

              {/* 제6조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제6조 (서비스 이용제한)
                </h3>
                <p className={`${theme.text.primary} leading-relaxed`}>
                  회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 
                  경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                </p>
              </section>

              {/* 제7조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제7조 (서비스의 변경 및 중단)
                </h3>
                <p className={`${theme.text.primary} leading-relaxed`}>
                  회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 
                  변경하거나 중단할 수 있습니다.
                </p>
              </section>

              {/* 제8조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제8조 (면책조항)
                </h3>
                <div className={`${theme.text.primary} leading-relaxed space-y-2`}>
                  <p>1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
                  <p>2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
                  <p>3. 회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</p>
                </div>
              </section>

              {/* 제9조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제9조 (분쟁해결)
                </h3>
                <div className={`${theme.text.primary} leading-relaxed space-y-2`}>
                  <p>1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치․운영합니다.</p>
                  <p>2. 회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법원에 제기합니다.</p>
                </div>
              </section>

              {/* 제10조 */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                  제10조 (약관의 효력 및 변경)
                </h3>
                <p className={`${theme.text.primary} leading-relaxed`}>
                  본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다. 
                  회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 
                  공지 또는 통지함으로써 효력을 발생합니다.
                </p>
              </section>
            </div>

            {/* 연락처 정보 */}
            <div className={`mt-8 pt-6 border-t ${theme.border.primary}`}>
              <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
                문의사항
              </h3>
              <div className={`${theme.text.secondary} space-y-1`}>
                <p>서비스명: 위핸드(WeHand)</p>
                <p>이메일: support@wehand.tennis</p>
                <p>본 약관은 2024년 1월 1일부터 적용됩니다.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TermsPage;