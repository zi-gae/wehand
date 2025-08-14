import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdChat, MdGroup, MdMoreVert } from "react-icons/md";
import { getThemeClasses } from "../lib/theme";
import { chatQueryKeys, useChatRooms } from "../hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const ChatListPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const queryClient = useQueryClient();

  const { data, isLoading } = useChatRooms();
  const chatRooms = data?.data || [];

  // Socket 연결 설정 - 새 메시지가 오면 채팅방 목록 갱신
  const { socket } = useSocket({
    onNewMessage: (message) => {
      console.log("새 메시지 수신 - 채팅방 목록 갱신:", message);
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });

  // 컴포넌트 마운트 시 전체 채팅방의 업데이트를 받기 위한 이벤트 리스너
  useEffect(() => {
    if (!socket?.connected) return;

    // 채팅방 목록 업데이트 이벤트 리스너 (서버에서 구현 필요)
    const handleChatRoomUpdate = (data: any) => {
      console.log("채팅방 업데이트 이벤트:", data);
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    };

    socket.on("chat-room-updated", handleChatRoomUpdate);

    return () => {
      socket.off("chat-room-updated", handleChatRoomUpdate);
    };
  }, [socket, queryClient]);

  const handleChatClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return "";
    }
  };

  const getRoomName = (room: (typeof chatRooms)[0]) => {
    if (room.name) return room.name;
    if (room.type === "match" && room.match) {
      return `🎾 ${room.match.title}`;
    }
    if (room.type === "private" && room.otherParticipant) {
      return room.otherParticipant.nickname || "알 수 없는 사용자";
    }
    return "채팅방";
  };

  const getChatBadgeColor = (type: string) => {
    if (type === "match") {
      return "text-tennis-court-600 dark:text-tennis-court-400 bg-tennis-court-100 dark:bg-tennis-court-900/20";
    }
    return "text-tennis-ball-600 dark:text-tennis-ball-400 bg-tennis-ball-100 dark:bg-tennis-ball-900/20";
  };

  const handleMatchDetailClick = (roomId?: string) => {
    if (!roomId) return;

    navigate(`/matching/${roomId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content transition-colors duration-300 pb-safe`}
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
            className={`p-2 -ml-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>

          <div className="text-center flex-1">
            <h1
              className={`text-lg font-bold flex items-center justify-center gap-2 ${theme.text.primary}`}
            >
              <MdChat className="w-6 h-6 text-tennis-ball-600 dark:text-tennis-ball-400" />
              채팅
            </h1>
            <p className={`text-sm ${theme.text.secondary}`}>
              {chatRooms.length}개 채팅방
            </p>
          </div>

          <motion.button
            className={`p-2 -mr-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdMoreVert className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>
        </div>
      </motion.header>

      <div className="px-2 py-4">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl p-4 shadow-sm border ${theme.surface.card} ${theme.border.primary}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            {/* Chat Rooms List */}
            <div className="space-y-2">
              {chatRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  className={`rounded-2xl p-4 shadow-sm border cursor-pointer transition-colors duration-300 ${theme.surface.card} ${theme.border.primary}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => handleChatClick(room.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${getChatBadgeColor(
                          room.type
                        )}`}
                      >
                        {room.type === "private" &&
                        room.otherParticipant?.profile_image_url ? (
                          <img
                            src={room.otherParticipant.profile_image_url}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : room.type === "match" ? (
                          <MdGroup className="w-6 h-6" />
                        ) : (
                          <MdChat className="w-6 h-6" />
                        )}
                      </div>
                      {room.unreadCount != null && room.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {room.unreadCount > 99 ? "99+" : room.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold truncate ${theme.text.primary}`}
                        >
                          {getRoomName(room).replace(/^🎾/, "").trim()}
                        </h3>
                        <span
                          className={`text-xs whitespace-nowrap ml-2 ${theme.text.secondary}`}
                        >
                          {formatLastMessageTime(room.updatedAt)}
                        </span>
                      </div>

                      {room.lastMessage && (
                        <p
                          className={`text-sm truncate mb-2 ${theme.text.secondary}`}
                        >
                          {room.lastMessage.sender?.nickname && (
                            <span className="font-medium">
                              {room.lastMessage.sender.nickname}:{" "}
                            </span>
                          )}
                          {room.lastMessage.content}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {room.type === "match" && (
                            <span className="bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400 px-2 py-1 rounded-lg text-xs font-medium">
                              단체 채팅
                            </span>
                          )}
                          {room.type === "private" && (
                            <span className="bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 px-2 py-1 rounded-lg text-xs font-medium">
                              1:1 채팅
                            </span>
                          )}
                          {room.type === "match" && room.match && (
                            <span className={`text-xs ${theme.text.secondary}`}>
                              {room.match.match_date}
                            </span>
                          )}
                        </div>
                        {room.type === "match" && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMatchDetailClick(room.match?.id);
                            }}
                            className="text-xs text-tennis-court-600 dark:text-tennis-court-400 font-medium"
                          >
                            매치 상세 →
                          </span>
                        )}
                        {room.type === "private" && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();

                              handleMatchDetailClick(room.match?.id);
                            }}
                            className="text-xs text-tennis-court-600 dark:text-tennis-court-400 font-medium"
                          >
                            매치 상세 →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && chatRooms.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${theme.surface.card}`}
            >
              <MdChat className={`w-10 h-10 ${theme.text.secondary}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme.text.primary}`}>
              아직 참여한 채팅방이 없습니다
            </h3>
            <p className={`mb-6 ${theme.text.secondary}`}>
              매치에 참가하면 자동으로 채팅방이 생성됩니다!
            </p>
            <motion.button
              className="bg-gradient-to-r from-tennis-ball-500 to-tennis-court-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => navigate("/matching")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              매치 찾아보기
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatListPage;
