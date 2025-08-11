import { NotificationSkeleton } from "@/components/skeletons/NotificationSkeleton";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useMemo, useState } from "react";
import {
  MdAnnouncement,
  MdArrowBack,
  MdCampaign,
  MdChat,
  MdDelete,
  MdDoneAll,
  MdExpandMore,
  MdGroup,
  MdNotifications,
  MdSchedule,
  MdSportsTennis,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { NotificationType } from "../api";
import { useSuspenseChatRoom } from "../hooks/useChat";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useSuspenseNotifications,
  useSuspenseUnreadNotificationCount,
} from "../hooks/useNotifications";
import { getThemeClasses } from "../lib/theme";

// 스켈레톤 컴포넌트

// 채팅방 이름을 가져오는 컴포넌트 (일반 useQuery 사용)
const ChatRoomName = ({ roomId }: { roomId: string }) => {
  const { data: chatRoomData } = useSuspenseChatRoom(roomId);
  return <>{chatRoomData?.data?.name || "채팅 알림"}</>;
};

// 메인 콘텐츠 컴포넌트
const NotificationContent = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // API 훅 (Suspense)
  const { data: notifications = [], refetch } = useSuspenseNotifications({
    limit: 50,
  });

  const { data: unreadCountData } = useSuspenseUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const unreadCount = unreadCountData?.unreadCount || 0;

  // 알림을 그룹화하는 로직
  const groupedNotifications = useMemo(() => {
    const chatRoomGroups: { [key: string]: any[] } = {};
    const ungrouped: any[] = [];

    notifications.forEach((notification: any) => {
      // chatRoomId가 있는 모든 알림을 그룹화 (타입 구분 없이)
      if (notification.action_data?.chatRoomId) {
        const chatRoomId = notification.action_data.chatRoomId;
        if (!chatRoomGroups[chatRoomId]) {
          chatRoomGroups[chatRoomId] = [];
        }
        chatRoomGroups[chatRoomId].push(notification);
      } else {
        ungrouped.push(notification);
      }
    });

    // 그룹과 개별 알림을 합쳐서 반환
    const result: any[] = [];

    // chatRoomId 그룹 추가
    Object.entries(chatRoomGroups).forEach(([chatRoomId, items]) => {
      if (items.length > 1) {
        // 2개 이상일 때만 그룹으로 처리
        result.push({
          type: "room-group",
          groupId: chatRoomId,
          items: items.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          ),
        });
      } else {
        // 1개면 개별 알림으로 처리
        ungrouped.push(...items);
      }
    });

    // 개별 알림 추가
    ungrouped.forEach((notification) => {
      result.push({
        type: "single",
        item: notification,
      });
    });

    // 시간순 정렬 (최신순)
    return result.sort((a, b) => {
      const aTime =
        a.type !== "single"
          ? new Date(a.items[0].created_at).getTime()
          : new Date(a.item.created_at).getTime();
      const bTime =
        b.type !== "single"
          ? new Date(b.items[0].created_at).getTime()
          : new Date(b.item.created_at).getTime();
      return bTime - aTime;
    });
  }, [notifications]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.match:
        return MdSportsTennis;
      case NotificationType.chat:
        return MdChat;
      case NotificationType.community:
        return MdGroup;
      case NotificationType.system:
        return MdAnnouncement;
      case NotificationType.marketing:
        return MdCampaign;
      default:
        return MdNotifications;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.match:
        return "text-tennis-court-600 dark:text-tennis-court-400 bg-tennis-court-100 dark:bg-tennis-court-900/20";
      case NotificationType.chat:
        return "text-tennis-ball-600 dark:text-tennis-ball-400 bg-tennis-ball-100 dark:bg-tennis-ball-900/20";
      case NotificationType.community:
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20";
      case NotificationType.system:
        return "text-accent-600 dark:text-accent-400 bg-accent-100 dark:bg-accent-900/20";
      case NotificationType.marketing:
        return "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20";
      default:
        return `${theme.text.secondary} ${theme.background.secondary}`;
    }
  };

  const getNotificationBorderColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.match:
        return "border-l-tennis-court-500";
      case NotificationType.chat:
        return "border-l-tennis-ball-500";
      case NotificationType.community:
        return "border-l-purple-500";
      case NotificationType.system:
        return "border-l-accent-500";
      case NotificationType.marketing:
        return "border-l-pink-500";
      default:
        return "border-l-gray-500 dark:border-l-gray-600";
    }
  };

  const getNotificationTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.match:
        return "매치";
      case NotificationType.chat:
        return "채팅";
      case NotificationType.community:
        return "커뮤니티";
      case NotificationType.system:
        return "시스템";
      case NotificationType.marketing:
        return "마케팅";
      default:
        return "알림";
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.is_read) {
      try {
        markAsReadMutation.mutateAsync(notification.id);
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    if (notification.type === NotificationType.community) {
      navigate(`/board/${notification.action_data.params.postId}`);
      return;
    }

    // 알림 타입에 따른 네비게이션
    if (
      notification.type === NotificationType.match &&
      notification.data?.match_id
    ) {
      navigate(`/matching/${notification.data.match_id}`);
    } else if (
      notification.type === NotificationType.chat &&
      notification.action_data?.chatRoomId
    ) {
      navigate(`/chat/${notification.action_data.chatRoomId}`);
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("알림 삭제 실패:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } catch {
      return dateString;
    }
  };

  // 그룹화된 알림 컴포넌트
  const GroupedNotificationItem = (props: any) => {
    const {
      group,
      isExpanded,
      unreadCount,
      latestNotification,
      IconComponent,
      theme,
      toggleGroup,
      navigate,
      getNotificationColor,
      getNotificationBorderColor,
      formatTimeAgo,
      NotificationItem,
      NotificationType,
    } = props;

    return (
      <motion.div
        layoutId={`group-${group.groupId}`}
        className={`${
          theme.surface.card
        } rounded-2xl border-l-4 ${getNotificationBorderColor(
          latestNotification.type
        )} shadow-sm transition-colors duration-300`}
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
      >
        {/* 그룹 헤더 */}
        <motion.div
          className="p-4 cursor-pointer"
          onClick={() => toggleGroup(group.groupId)}
          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(
                  latestNotification.type
                )}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3
                  className={`font-semibold ${theme.text.primary} flex items-center gap-2`}
                >
                  <Suspense
                    fallback={
                      group.items.some(
                        (item: any) => item.type === NotificationType.system
                      ) &&
                      group.items.some(
                        (item: any) => item.type === NotificationType.chat
                      )
                        ? "혼합 알림"
                        : group.items[0].type === NotificationType.system
                        ? "시스템 알림"
                        : "채팅 알림"
                    }
                  >
                    <ChatRoomName roomId={group.groupId} />
                  </Suspense>
                  <span
                    className={`text-sm font-normal ${theme.text.secondary}`}
                  >
                    ({group.items.length}개)
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs whitespace-nowrap flex items-center gap-1 ${theme.text.secondary}`}
                  >
                    <MdSchedule className="w-3 h-3" />
                    {formatTimeAgo(latestNotification.created_at)}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MdExpandMore
                      className={`w-5 h-5 ${theme.text.secondary}`}
                    />
                  </motion.div>
                </div>
              </div>

              <p className={`text-sm ${theme.text.secondary}`}>
                {latestNotification.title}
              </p>

              {!isExpanded && (
                <div className="flex items-center gap-2 mt-2">
                  {unreadCount > 0 && (
                    <span className="bg-status-error-100 dark:bg-status-error-900/20 text-status-error-700 dark:text-status-error-400 px-2 py-1 rounded-lg text-xs font-medium">
                      새 알림 {unreadCount}개
                    </span>
                  )}
                  <span
                    className="text-xs text-tennis-court-600 dark:text-tennis-court-400 font-medium ml-auto cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chat/${group.groupId}`);
                    }}
                  >
                    채팅방 이동 →
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 펼쳐진 그룹 아이템들 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                {group.items.map((notification: any) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isInGroup={true}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // 개별 알림 렌더링 컴포넌트
  const NotificationItem = ({ notification, isInGroup = false }: any) => {
    const IconComponent = getNotificationIcon(notification.type);

    return (
      <motion.div
        layoutId={notification.id}
        className={`${theme.surface.card} ${
          !isInGroup ? "rounded-2xl border-l-4" : "rounded-xl"
        } ${
          !isInGroup ? getNotificationBorderColor(notification.type) : ""
        } shadow-sm cursor-pointer transition-colors duration-300 ${
          !notification.is_read ? "shadow-md" : ""
        } ${isInGroup ? "ml-12 mb-2" : ""}`}
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        onClick={() => {
          handleNotificationClick(notification);
        }}
        whileHover={{ scale: isInGroup ? 1.01 : 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={isInGroup ? "p-3" : "p-4"}>
          <div className="flex items-start gap-3">
            {!isInGroup && (
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                {!notification.is_read && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3
                  className={`font-semibold ${isInGroup ? "text-sm" : ""} ${
                    !notification.is_read
                      ? theme.text.primary
                      : theme.text.secondary
                  }`}
                >
                  {notification.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs whitespace-nowrap flex items-center gap-1 ${theme.text.secondary}`}
                  >
                    <MdSchedule className="w-3 h-3" />
                    {formatTimeAgo(notification.created_at)}
                  </span>
                  {!isInGroup && (
                    <motion.button
                      className={`p-1 rounded-full hover:bg-status-error-50 dark:hover:bg-status-error-900/20 transition-colors`}
                      onClick={(e) =>
                        handleDeleteNotification(e, notification.id)
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MdDelete className="w-4 h-4 text-status-error-600 dark:text-status-error-400" />
                    </motion.button>
                  )}
                </div>
              </div>

              <p
                className={`text-sm mb-2 ${
                  !notification.is_read
                    ? theme.text.primary
                    : theme.text.secondary
                }`}
              >
                {notification.message as string}
              </p>

              {!isInGroup && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        notification.type === NotificationType.match
                          ? "bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-700 dark:text-tennis-court-400"
                          : notification.type === NotificationType.chat
                          ? "bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400"
                          : notification.type === NotificationType.community
                          ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                          : notification.type === NotificationType.system
                          ? "bg-accent-100 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400"
                          : "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400"
                      }`}
                    >
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                    {!notification.is_read && (
                      <span className="bg-status-error-100 dark:bg-status-error-900/20 text-status-error-700 dark:text-status-error-400 px-2 py-1 rounded-lg text-xs font-medium">
                        NEW
                      </span>
                    )}
                  </div>

                  {notification.type === NotificationType.chat &&
                  notification.action_data?.chatRoomId ? (
                    <span
                      className="text-xs text-tennis-court-600 dark:text-tennis-court-400 font-medium"
                      onClick={() => {
                        navigate(
                          `/chat/${notification?.action_data?.chatRoomId}`
                        );
                      }}
                    >
                      상세 보기 →
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
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
              <MdNotifications className="w-6 h-6 text-tennis-court-600 dark:text-tennis-court-400" />
              알림
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-tennis-court-600 dark:text-tennis-court-400">
                새로운 알림 {unreadCount}개
              </p>
            )}
          </div>

          <motion.button
            className={`p-2 -mr-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors ${
              markAllAsReadMutation.isPending ? "opacity-50" : ""
            }`}
            onClick={markAllAsRead}
            disabled={markAllAsReadMutation.isPending || unreadCount === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdDoneAll className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>
        </div>
      </motion.header>

      <div className="px-2 py-4">
        {/* 알림 리스트 */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {groupedNotifications.map((group, index) => {
              if (group.type === "single") {
                // 개별 알림
                return (
                  <div key={group.item.id}>
                    <NotificationItem notification={group.item} />
                  </div>
                );
              } else if (group.type === "room-group") {
                // 그룹화된 알림
                const isExpanded = expandedGroups.has(group.groupId);
                const unreadCount = group.items.filter(
                  (item: any) => !item.is_read
                ).length;
                const latestNotification = group.items[0];
                // 그룹의 첫 번째 알림 타입으로 아이콘 결정
                const IconComponent = getNotificationIcon(
                  latestNotification.type
                );

                return (
                  <GroupedNotificationItem
                    key={group.groupId}
                    group={group}
                    isExpanded={isExpanded}
                    unreadCount={unreadCount}
                    latestNotification={latestNotification}
                    IconComponent={IconComponent}
                    theme={theme}
                    index={index}
                    toggleGroup={toggleGroup}
                    navigate={navigate}
                    getNotificationColor={getNotificationColor}
                    getNotificationBorderColor={getNotificationBorderColor}
                    getNotificationTypeLabel={getNotificationTypeLabel}
                    formatTimeAgo={formatTimeAgo}
                    NotificationItem={NotificationItem}
                    NotificationType={NotificationType}
                  />
                );
              }
            })}
          </AnimatePresence>

          {/* 빈 상태 */}
          {notifications.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${theme.surface.card}`}
              >
                <MdNotifications
                  className={`w-10 h-10 ${theme.text.secondary}`}
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${theme.text.primary}`}
              >
                새로운 알림이 없습니다
              </h3>
              <p className={`mb-6 ${theme.text.secondary}`}>
                매칭 신청이나 메시지가 도착하면 알려드릴게요!
              </p>
              <motion.button
                className="bg-gradient-to-r from-tennis-court-500 to-tennis-ball-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate("/matching")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                매칭 찾아보기
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// 메인 NotificationPage 컴포넌트 (Suspense 래핑)
const NotificationPage = () => {
  return (
    <Suspense fallback={<NotificationSkeleton />}>
      <NotificationContent />
    </Suspense>
  );
};

export default NotificationPage;
