import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  MdArrowBack,
  MdThumbUp,
  MdComment,
  MdSchedule,
  MdPerson,
  MdMoreVert,
  MdDelete,
  MdEdit,
  MdSend,
  MdSubdirectoryArrowRight,
} from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";
import {
  usePost,
  useLikePost,
  useUnlikePost,
  useDeletePost,
  useUpdatePost,
  usePostComments,
  useCreateComment,
  useDeleteComment,
} from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/hooks";

const BoardDetailPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const theme = getThemeClasses();
  const { user } = useAuth();

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    nickname: string;
  } | null>(null);
  const [editingPost, setEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  // API Hooks
  const { data: post, isLoading: postLoading } = usePost(postId || "");
  const { data: comments, isLoading: commentsLoading } = usePostComments(
    postId || ""
  );
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const isAuthor = user?.id === post?.author?.id;

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return dateString;
    }
  };

  const handleLike = async () => {
    if (!postId) return;

    try {
      if (post?.isLiked) {
        await unlikePost.mutateAsync(postId);
      } else {
        await likePost.mutateAsync(postId);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = async () => {
    if (!postId || !isAuthor) return;

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deletePost.mutateAsync(postId);
        navigate("/board");
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  const handleEdit = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditingPost(true);
    setShowOptions(false);
  };

  const handleUpdatePost = async () => {
    if (!postId || !editTitle.trim() || !editContent.trim()) return;

    try {
      await updatePost.mutateAsync({
        postId,
        postData: {
          title: editTitle.trim(),
          content: editContent.trim(),
        },
      });
      setEditingPost(false);
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!postId || !commentText.trim()) return;

    try {
      await createComment.mutateAsync({
        postId,
        content: commentText.trim(),
        parentId: replyTo?.id,
      });
      setCommentText("");
      setReplyTo(null);
    } catch (error) {
      console.error("Failed to create comment:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) return;

    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment.mutateAsync({ commentId, postId });
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  if (postLoading || commentsLoading) {
    return (
      <motion.div
        className={`min-h-screen ${theme.background.tennis} page-content`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header 스켈레톤 */}
        <div className={`${theme.background.glass} ${theme.text.primary} shadow-sm sticky top-0 z-40`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="p-2 -ml-2">
              <MdArrowBack className={`w-6 h-6 ${theme.text.secondary}`} />
            </div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="w-6 h-6"></div>
          </div>
        </div>

        <div className="px-3 py-3">
          {/* 게시글 스켈레톤 */}
          <div className={`${theme.surface.card} rounded-2xl p-3 mb-3 border ${theme.border.primary} animate-pulse`}>
            {/* 작성자 정보 스켈레톤 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>

            {/* 제목 스켈레톤 */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            
            {/* 내용 스켈레톤 */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            </div>

            {/* 액션 버튼 스켈레톤 */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            </div>
          </div>

          {/* 댓글 섹션 스켈레톤 */}
          <div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3 animate-pulse"></div>
            
            {/* 댓글 입력 스켈레톤 */}
            <div className={`${theme.surface.card} rounded-2xl p-3 mb-3 border ${theme.border.primary} animate-pulse`}>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>

            {/* 댓글 목록 스켈레톤 */}
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`${theme.surface.card} rounded-2xl p-3 border ${theme.border.primary} animate-pulse`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!post) {
    return (
      <div
        className={`min-h-screen ${theme.background.tennis} flex items-center justify-center`}
      >
        <div className={`text-center ${theme.text.secondary}`}>
          <p className="mb-4">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/board")}
            className={`${tennisGradients.primary} text-white px-6 py-2 rounded-full font-medium`}
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors`}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-6 h-6 ${theme.text.secondary}`} />
          </motion.button>

          <h1 className={`text-base font-bold ${theme.text.primary}`}>
            게시글
          </h1>

          {isAuthor && (
            <div className="relative">
              <motion.button
                className={`p-2 -mr-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors`}
                onClick={() => setShowOptions(!showOptions)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdMoreVert className={`w-6 h-6 ${theme.text.secondary}`} />
              </motion.button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    className={`absolute right-0 top-full mt-2 ${theme.surface.card} rounded-lg shadow-lg border ${theme.border.primary} overflow-hidden`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <button
                      onClick={handleEdit}
                      className={`flex items-center gap-2 px-4 py-2 ${theme.text.primary} hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors w-full text-left`}
                    >
                      <MdEdit className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      className={`flex items-center gap-2 px-4 py-2 text-status-error-600 hover:bg-status-error-50 dark:hover:bg-status-error-900/20 transition-colors w-full text-left`}
                    >
                      <MdDelete className="w-4 h-4" />
                      삭제
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.header>

      {/* Post Content */}
      <div className="px-3 py-3">
        {editingPost ? (
          /* Edit Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${theme.surface.card} rounded-2xl p-3 mb-3 border ${theme.border.primary}`}
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={`w-full px-3 py-2 mb-3 rounded-lg ${theme.background.primary} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-2 focus:ring-primary-400`}
              placeholder="제목"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={`w-full px-3 py-2 mb-3 rounded-lg ${theme.background.primary} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none`}
              placeholder="내용"
              rows={8}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingPost(false)}
                className={`px-4 py-2 rounded-full ${theme.surface.card} ${theme.text.secondary} font-medium`}
              >
                취소
              </button>
              <button
                onClick={handleUpdatePost}
                className={`px-4 py-2 rounded-full ${tennisGradients.primary} text-white font-medium`}
              >
                수정 완료
              </button>
            </div>
          </motion.div>
        ) : (
          /* View Mode */
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${theme.surface.card} rounded-2xl p-3 mb-3 border ${theme.border.primary}`}
          >
            {/* Post Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-full ${theme.background.secondary} flex items-center justify-center`}
              >
                <MdPerson className={`w-5 h-5 ${theme.text.secondary}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${theme.text.primary}`}>
                  {post.author?.nickname || "익명"}
                </h3>
                <div
                  className={`flex items-center gap-1 text-xs ${theme.text.secondary}`}
                >
                  <MdSchedule className="w-3 h-3" />
                  {formatTime(post.created_at)}
                </div>
              </div>
            </div>

            {/* Post Title & Content */}
            <h1 className={`text-lg font-bold ${theme.text.primary} mb-3`}>
              {post.title}
            </h1>
            <div
              className={`text-sm ${theme.text.primary} mb-4 whitespace-pre-wrap`}
            >
              {post.content}
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`이미지 ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <motion.button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                  post.isLiked
                    ? `bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400`
                    : `${theme.surface.card} ${theme.text.secondary}`
                } transition-colors`}
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdThumbUp className="w-4 h-4" />
                {post.likes_count || 0}
              </motion.button>

              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${theme.surface.card} ${theme.text.secondary}`}
              >
                <MdComment className="w-4 h-4" />
                {post.comments_count || 0}
              </div>
            </div>
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={`text-base font-bold ${theme.text.primary} mb-3`}>
            댓글 {comments?.length}개
          </h2>

          {/* Comment Input */}
          <div
            className={`${theme.surface.card} rounded-2xl p-3 mb-3 border ${theme.border.primary}`}
          >
            {replyTo && (
              <div
                className={`flex items-center gap-1 mb-2 px-2 py-1.5 rounded-lg ${theme.background.secondary}`}
              >
                <MdSubdirectoryArrowRight
                  className={`w-4 h-4 ${theme.text.secondary}`}
                />
                <span className={`text-sm ${theme.text.secondary}`}>
                  @{replyTo.nickname}님에게 답글
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className={`ml-auto ${theme.text.secondary} hover:${theme.text.primary}`}
                >
                  취소
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  replyTo ? "답글을 입력하세요..." : "댓글을 입력하세요..."
                }
                className={`flex-1 px-3 py-1.5 text-sm rounded-full ${theme.background.primary} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-2 focus:ring-primary-400`}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && commentText.trim()) {
                    handleCommentSubmit();
                  }
                }}
              />
              <motion.button
                className={`p-2 rounded-full ${
                  commentText.trim()
                    ? `${tennisGradients.primary} text-white`
                    : `${theme.surface.card} ${theme.text.secondary} opacity-50`
                } transition-colors`}
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                whileHover={{ scale: commentText.trim() ? 1.05 : 1 }}
                whileTap={{ scale: commentText.trim() ? 0.95 : 1 }}
              >
                <MdSend className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            <AnimatePresence>
              {comments?.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${theme.surface.card} rounded-2xl p-3 border ${theme.border.primary}`}
                >
                  {/* Comment Content */}
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${theme.background.secondary} flex items-center justify-center flex-shrink-0`}
                    >
                      <MdPerson className={`w-5 h-5 ${theme.text.secondary}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-medium ${theme.text.primary}`}
                        >
                          {comment.author?.nickname || "익명"}
                        </span>
                        <span className={`text-xs ${theme.text.secondary}`}>
                          {formatTime(comment.created_at)}
                        </span>
                      </div>
                      <p className={`text-sm ${theme.text.primary} mb-2`}>
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setReplyTo({
                              id: comment.id,
                              nickname: comment.author?.nickname || "익명",
                            })
                          }
                          className={`text-xs ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
                        >
                          답글
                        </button>
                        {user?.id === comment.author?.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-status-error-600 hover:text-status-error-700 transition-colors"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-10 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`flex items-start gap-2 p-2 rounded-lg ${theme.background.secondary}`}
                        >
                          <MdSubdirectoryArrowRight
                            className={`w-4 h-4 ${theme.text.secondary} mt-1 flex-shrink-0`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`font-medium text-xs ${theme.text.primary}`}
                              >
                                {reply.author?.nickname || "익명"}
                              </span>
                              <span
                                className={`text-xs ${theme.text.secondary}`}
                              >
                                {formatTime(reply.created_at)}
                              </span>
                            </div>
                            <p className={`text-xs ${theme.text.primary}`}>
                              {reply.content}
                            </p>
                            {user?.id === reply.author?.id && (
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="text-xs text-status-error-600 hover:text-status-error-700 transition-colors mt-1"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BoardDetailPage;
