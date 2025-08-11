import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  MdArrowBack,
  MdBookmark,
  MdBookmarkBorder,
  MdComment,
  MdMoreVert,
  MdPerson,
  MdReply,
  MdSchedule,
  MdSend,
  MdShare,
  MdThumbUp,
  MdThumbUpOffAlt,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { getThemeClasses, tennisGradients } from "../lib/theme";

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
  parentAuthor: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  time: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  isHot?: boolean;
  isPinned?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const theme = getThemeClasses();

  // 실제로는 API에서 가져올 데이터
  const [post, setPost] = useState<Post>({
    id: parseInt(postId || "1"),
    title: "초보자를 위한 백핸드 스트로크 개선 팁",
    content: `백핸드 스트로크를 향상시키는 핵심 포인트들을 정리해보았습니다.

**1. 올바른 그립**
백핸드의 기본은 올바른 그립부터 시작됩니다. 이스턴 백핸드 그립이나 세미 웨스턴 그립을 사용하는 것이 좋습니다.

**2. 준비 자세**
- 어깨를 충분히 돌려서 옆을 향하도록 준비
- 라켓을 일찍 뒤로 빼기
- 무게중심을 뒤쪽 발에 두기

**3. 스윙 동작**
- 임팩트 순간에 라켓 면이 수직이 되도록
- 팔로우 스루는 몸을 가로질러서
- 피니시는 어깨 위쪽까지

**4. 연습 방법**
매일 벽 치기 연습을 30분씩 하시면 확실히 늘어요! 처음엔 힘들지만 꾸준히 하면 분명 발전이 있을 겁니다.

궁금한 점 있으시면 언제든 댓글로 물어보세요! 🎾`,
    author: "테니스마스터",
    time: "2시간 전",
    category: "tips",
    likes: 24,
    comments: 8,
    views: 156,
    isHot: true,
    isPinned: true,
    isLiked: false,
    isBookmarked: false,
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "백핸드초보",
      content:
        "정말 유용한 팁이네요! 특히 그립 부분이 많이 도움되었습니다. 감사합니다!",
      time: "1시간 전",
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 1,
          author: "테니스마스터",
          content:
            "도움이 되셨다니 기쁩니다! 연습할 때 무리하지 마시고 천천히 해보세요 😊",
          time: "45분 전",
          likes: 2,
          isLiked: false,
          parentAuthor: "백핸드초보",
        },
      ],
    },
    {
      id: 2,
      author: "중급자",
      content:
        "벽치기 연습 정말 효과적이에요! 저도 매일 30분씩 하고 있는데 확실히 늘어요.",
      time: "30분 전",
      likes: 3,
      isLiked: true,
      replies: [],
    },
    {
      id: 3,
      author: "테니스러버",
      content:
        "스윙 동작 부분에서 질문이 있어요. 임팩트 순간에 손목은 어떻게 해야 하나요?",
      time: "15분 전",
      likes: 1,
      isLiked: false,
      replies: [],
    },
  ]);

  const handleLikePost = () => {
    setPost((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleBookmarkPost = () => {
    setPost((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }));
  };

  const handleLikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleLikeReply = (commentId: number, replyId: number) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: "나",
      content: newComment.trim(),
      time: "방금 전",
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
    setPost((prev) => ({ ...prev, comments: prev.comments + 1 }));
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) return;

    const targetComment = comments.find((c) => c.id === commentId);
    if (!targetComment) return;

    const reply: Reply = {
      id: targetComment.replies.length + 1,
      author: "나",
      content: replyContent.trim(),
      time: "방금 전",
      likes: 0,
      isLiked: false,
      parentAuthor: targetComment.author,
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply],
          };
        }
        return comment;
      })
    );

    setReplyContent("");
    setReplyTo(null);
    setPost((prev) => ({ ...prev, comments: prev.comments + 1 }));
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3
            key={index}
            className={`font-bold ${theme.text.primary} mt-4 mb-2`}
          >
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className={`ml-4 mb-1 ${theme.text.primary}`}>
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className={`mb-2 ${theme.text.primary} leading-relaxed`}>
          {line}
        </p>
      );
    });
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
        <div className="flex items-center justify-between px-6 py-3">
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-tennis-court-50 dark:hover:bg-tennis-court-900/20 transition-colors`}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.primary}`} />
          </motion.button>

          <div className="text-center flex-1">
            <h1 className={`text-lg font-bold ${theme.text.primary}`}>
              게시글
            </h1>
            <p className={`text-sm ${theme.text.secondary}`}>자유 게시판</p>
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
        {/* Post Content */}
        <motion.div
          className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} mb-4 transition-colors duration-300`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Post Header */}
          <div className="flex items-center gap-2 mb-4">
            {post.isPinned && (
              <span className="bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-700 dark:text-tennis-ball-400 px-2 py-1 rounded-lg text-xs font-medium">
                📌 공지
              </span>
            )}
            {post.isHot && (
              <span className="bg-status-error-100 dark:bg-status-error-900/20 text-status-error-700 dark:text-status-error-400 px-2 py-1 rounded-lg text-xs font-medium">
                🔥 HOT
              </span>
            )}
          </div>

          <h1 className={`text-xl font-bold ${theme.text.primary} mb-4`}>
            {post.title}
          </h1>

          <div
            className={`flex items-center justify-between mb-6 pb-4 border-b ${theme.border.primary}`}
          >
            <div
              className={`flex items-center gap-4 text-sm ${theme.text.secondary}`}
            >
              <span className="flex items-center gap-1">
                <MdPerson className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <MdSchedule className="w-4 h-4" />
                {post.time}
              </span>
              <span>조회 {post.views}</span>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-6">{formatContent(post.content)}</div>

          {/* Action Buttons */}
          <div
            className={`flex items-center justify-between pt-4 border-t ${theme.border.primary}`}
          >
            <div className="flex items-center gap-4">
              <motion.button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  post.isLiked
                    ? "bg-tennis-ball-100 dark:bg-tennis-ball-900/20 text-tennis-ball-600 dark:text-tennis-ball-400"
                    : `${theme.background.secondary} ${theme.text.secondary} hover:bg-tennis-court-100 dark:hover:bg-tennis-court-800`
                }`}
                onClick={handleLikePost}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {post.isLiked ? (
                  <MdThumbUp className="w-5 h-5" />
                ) : (
                  <MdThumbUpOffAlt className="w-5 h-5" />
                )}
                {post.likes}
              </motion.button>

              <div
                className={`flex items-center gap-2 ${theme.text.secondary}`}
              >
                <MdComment className="w-5 h-5" />
                <span>{post.comments}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className={`p-2 rounded-full transition-colors ${
                  post.isBookmarked
                    ? "bg-tennis-court-100 dark:bg-tennis-court-900/20 text-tennis-court-600 dark:text-tennis-court-400"
                    : `${theme.background.secondary} ${theme.text.secondary} hover:bg-tennis-court-100 dark:hover:bg-tennis-court-800`
                }`}
                onClick={handleBookmarkPost}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {post.isBookmarked ? (
                  <MdBookmark className="w-5 h-5" />
                ) : (
                  <MdBookmarkBorder className="w-5 h-5" />
                )}
              </motion.button>

              <motion.button
                className={`p-2 rounded-full ${theme.background.secondary} ${theme.text.secondary} hover:bg-tennis-court-100 dark:hover:bg-tennis-court-800 transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdShare className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          className={`rounded-3xl p-6 shadow-sm border ${theme.surface.card} ${theme.border.primary} transition-colors duration-300`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={`text-lg font-bold ${theme.text.primary} mb-4`}>
            댓글 {comments.length}개
          </h2>

          {/* Add Comment */}
          <div className={`mb-6 pb-6 border-b ${theme.border.primary}`}>
            <div className="flex gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력해주세요..."
                className={`flex-1 p-3 ${theme.background.secondary} rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-tennis-court-500 ${theme.text.primary} min-h-[80px] resize-none transition-colors`}
              />
              <motion.button
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  newComment.trim()
                    ? `${tennisGradients.primary} text-white hover:opacity-90`
                    : `${theme.background.secondary} ${theme.text.muted} cursor-not-allowed`
                }`}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                whileHover={newComment.trim() ? { scale: 1.05 } : {}}
                whileTap={newComment.trim() ? { scale: 0.95 } : {}}
              >
                <MdSend className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className="space-y-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 ${theme.background.secondary} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <MdPerson className={`w-5 h-5 ${theme.text.secondary}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className={`${theme.background.secondary} rounded-2xl p-4 transition-colors`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-semibold ${theme.text.primary}`}
                          >
                            {comment.author}
                          </span>
                          <span className={`text-xs ${theme.text.secondary}`}>
                            {comment.time}
                          </span>
                        </div>
                        <p className={`${theme.text.primary} leading-relaxed`}>
                          {comment.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-2 ml-4">
                        <motion.button
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            comment.isLiked
                              ? "text-tennis-ball-600 dark:text-tennis-ball-400"
                              : `${theme.text.secondary} hover:${theme.text.primary}`
                          }`}
                          onClick={() => handleLikeComment(comment.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {comment.isLiked ? (
                            <MdThumbUp className="w-4 h-4" />
                          ) : (
                            <MdThumbUpOffAlt className="w-4 h-4" />
                          )}
                          {comment.likes > 0 && comment.likes}
                        </motion.button>

                        <motion.button
                          className={`flex items-center gap-1 text-sm ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
                          onClick={() =>
                            setReplyTo(
                              replyTo === comment.id ? null : comment.id
                            )
                          }
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MdReply className="w-4 h-4" />
                          답글
                        </motion.button>
                      </div>

                      {/* Reply Input */}
                      {replyTo === comment.id && (
                        <motion.div
                          className="mt-3 ml-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={`${comment.author}님에게 답글...`}
                              className={`flex-1 p-2 ${theme.surface.card} border ${theme.border.primary} rounded-xl focus:outline-none focus:ring-2 focus:ring-tennis-court-500 ${theme.text.primary} text-sm transition-colors`}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddReply(comment.id);
                                }
                              }}
                            />
                            <motion.button
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                replyContent.trim()
                                  ? `${tennisGradients.primary} text-white hover:opacity-90`
                                  : `${theme.background.secondary} ${theme.text.muted} cursor-not-allowed`
                              }`}
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyContent.trim()}
                              whileHover={
                                replyContent.trim() ? { scale: 1.05 } : {}
                              }
                              whileTap={
                                replyContent.trim() ? { scale: 0.95 } : {}
                              }
                            >
                              <MdSend className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-13 space-y-2">
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply.id}
                          className="flex gap-3"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <div
                            className={`w-8 h-8 ${theme.background.secondary} rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <MdPerson
                              className={`w-4 h-4 ${theme.text.secondary}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div
                              className={`${theme.background.tertiary} rounded-2xl p-3 transition-colors`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`font-semibold ${theme.text.primary} text-sm`}
                                >
                                  {reply.author}
                                </span>
                                <span
                                  className={`text-xs ${theme.text.secondary}`}
                                >
                                  {reply.time}
                                </span>
                              </div>
                              <p
                                className={`${theme.text.primary} text-sm leading-relaxed`}
                              >
                                <span className="text-tennis-court-600 dark:text-tennis-court-400 font-medium">
                                  @{reply.parentAuthor}
                                </span>{" "}
                                {reply.content}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mt-1 ml-3">
                              <motion.button
                                className={`flex items-center gap-1 text-xs transition-colors ${
                                  reply.isLiked
                                    ? "text-tennis-ball-600 dark:text-tennis-ball-400"
                                    : `${theme.text.secondary} hover:${theme.text.primary}`
                                }`}
                                onClick={() =>
                                  handleLikeReply(comment.id, reply.id)
                                }
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {reply.isLiked ? (
                                  <MdThumbUp className="w-3 h-3" />
                                ) : (
                                  <MdThumbUpOffAlt className="w-3 h-3" />
                                )}
                                {reply.likes > 0 && reply.likes}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {comments.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div
                  className={`w-16 h-16 ${theme.background.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <MdComment className={`w-8 h-8 ${theme.text.muted}`} />
                </div>
                <h3
                  className={`text-lg font-semibold ${theme.text.secondary} mb-2`}
                >
                  아직 댓글이 없습니다
                </h3>
                <p className={`${theme.text.secondary}`}>
                  첫 번째 댓글을 남겨보세요!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostDetailPage;
