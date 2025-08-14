import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdChat,
  MdGroup,
  MdMoreVert,
  MdDelete,
} from "react-icons/md";
import { getThemeClasses } from "../lib/theme";
import {
  chatQueryKeys,
  useChatRooms,
  useDeleteChatRoom,
} from "../hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { isString } from "@/lib/is";

// 스와이프 가능한 채팅방 아이템 컴포넌트
const SwipeableChatItem = ({ 
  room, 
  index, 
  onDelete, 
  onClick,
  theme,
  getRoomName,
  getChatBadgeColor,
  formatLastMessageTime,
  handleMatchDetailClick 
}: any) => {
  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = (_: any, info: any) => {
    const threshold = -50;
    const targetX = info.offset.x < threshold ? -70 : 0;
    
    controls.start({ 
      x: targetX,
      transition: { type: "spring", damping: 30, stiffness: 400 }
    });
    setX(targetX);
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging && x === 0) {
      onClick(room.id);
    } else if (x !== 0) {
      // 삭제 버튼이 보이는 상태에서 클릭하면 원래 위치로
      controls.start({ 
        x: 0,
        transition: { type: "spring", damping: 30, stiffness: 400 }
      });
      setX(0);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 삭제 애니메이션
    controls.start({ 
      x: -window.innerWidth,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
      onDelete(room.id);
    });
  };

  return (
    <div className="relative w-full">
      {/* 삭제 버튼 - 고정 위치 */}
      <div className="absolute inset-y-0 right-2 flex items-center">
        <motion.button
          className="px-4 py-4 rounded-xl bg-red-500 flex items-center justify-center"
          onClick={handleDeleteClick}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: x < -20 ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MdDelete className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* 드래그 가능한 채팅방 카드 */}
      <motion.div
        className="relative w-full"
        animate={controls}
        initial={{ x: 0, opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        drag="x"
        dragConstraints={{ left: -70, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: isDragging ? 1 : 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className={`w-full rounded-2xl p-4 shadow-sm border cursor-pointer ${theme.surface.card} ${theme.border.primary}`}
          onClick={handleClick}
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
                  className={`text-xs whitespace-nowrap ${theme.text.secondary}`}
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
                  {isString(room.lastMessage.content)
                    ? room.lastMessage.content
                    : room.lastMessage.content.type}
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
                {(room.type === "match" || room.type === "private") && room.match && (
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
        </div>
      </motion.div>
    </div>
  );
};

const ChatListPage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const queryClient = useQueryClient();

  const { data, isLoading } = useChatRooms();
  const chatRooms = data?.data || [];
  const deleteChatRoomMutation = useDeleteChatRoom();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;

    try {
      await deleteChatRoomMutation.mutateAsync(selectedRoomId);
      setShowDeleteConfirm(false);
      setSelectedRoomId(null);
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
    }
  };

  const handleLongPress = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowDeleteConfirm(true);
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
              채팅
            </h1>
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

      <div className="py-4">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-2 px-2">
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
            <div className="space-y-2 w-full px-2">
              {chatRooms.map((room, index) => (
                <SwipeableChatItem
                  key={room.id}
                  room={room}
                  index={index}
                  onDelete={handleLongPress}
                  onClick={handleChatClick}
                  theme={theme}
                  getRoomName={getRoomName}
                  getChatBadgeColor={getChatBadgeColor}
                  formatLastMessageTime={formatLastMessageTime}
                  handleMatchDetailClick={handleMatchDetailClick}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && chatRooms.length === 0 && (
          <motion.div
            className="text-center py-16 px-2"
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

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setShowDeleteConfirm(false);
              setSelectedRoomId(null);
            }}
          />
          <motion.div
            className={`relative z-10 w-full max-w-sm rounded-2xl p-6 ${theme.surface.card} shadow-xl`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className={`text-lg font-bold mb-2 ${theme.text.primary}`}>
              채팅방 삭제
            </h3>
            <p className={`mb-6 ${theme.text.secondary}`}>
              정말로 이 채팅방을 삭제하시겠습니까? 삭제된 채팅방은 복구할 수
              없습니다.
            </p>

            <div className="flex gap-3">
              <motion.button
                className={`flex-1 py-2.5 px-4 rounded-xl border ${theme.border.primary} ${theme.text.primary} font-medium`}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedRoomId(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                취소
              </motion.button>
              <motion.button
                className={`flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium ${
                  deleteChatRoomMutation.isPending ? "opacity-50" : ""
                }`}
                onClick={handleDeleteRoom}
                disabled={deleteChatRoomMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {deleteChatRoomMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    삭제 중...
                  </div>
                ) : (
                  "삭제"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatListPage;
