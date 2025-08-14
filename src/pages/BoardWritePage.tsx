import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdArrowBack, MdSend, MdImage, MdClose } from "react-icons/md";
import { getThemeClasses, tennisGradients } from "../lib/theme";
import { useCreatePost } from "../hooks/usePosts";
import { PostCategory } from "../api/generated-api";

const categoryOptions = [
  { value: "free", label: "자유게시판" },
  { value: "tips", label: "팁/기술" },
  { value: "equipment", label: "장비" },
  { value: "match", label: "경기후기" },
];

const BoardWritePage = () => {
  const navigate = useNavigate();
  const theme = getThemeClasses();
  const createPost = useCreatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("free");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (title.length > 200) {
      alert("제목은 200자 이내로 작성해주세요.");
      return;
    }

    if (content.length > 5000) {
      alert("내용은 5000자 이내로 작성해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        category,
        images: images.length > 0 ? images : undefined,
      });

      if (result) {
        navigate(`/board/${result.id}`);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 실제 구현에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
    // 여기서는 임시로 로컬 URL을 사용합니다
    const newImages: string[] = [];
    for (let i = 0; i < files.length && i < 10 - images.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push(url);
    }

    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme.background.tennis} page-content pb-safe transition-colors duration-300`}
    >
      {/* Header - Fixed at Top */}
      <motion.header
        className={`${theme.background.glass} ${theme.text.primary} shadow-sm fixed top-0 left-0 right-0 z-40 transition-colors duration-300`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            className={`p-2 -ml-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors`}
            onClick={() => {
              navigate("/board");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdArrowBack className={`w-5 h-5 ${theme.text.secondary}`} />
          </motion.button>

          <h1 className={`text-base font-bold ${theme.text.primary}`}>
            게시글 작성
          </h1>

          <motion.button
            className={`p-2 -mr-2 rounded-full ${
              title.trim() && content.trim() && !isSubmitting
                ? `hover:bg-primary-100 dark:hover:bg-primary-900/20`
                : `opacity-50 cursor-not-allowed`
            } transition-colors`}
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
            whileHover={{
              scale: title.trim() && content.trim() && !isSubmitting ? 1.05 : 1,
            }}
            whileTap={{
              scale: title.trim() && content.trim() && !isSubmitting ? 0.95 : 1,
            }}
          >
            <MdSend
              className={`w-5 h-5 ${
                title.trim() && content.trim() && !isSubmitting
                  ? theme.text.tennis
                  : theme.text.secondary
              }`}
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[56px]" />

      <div className="px-3 py-3">
        {/* Category Selection */}
        <motion.div
          className="mb-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label
            className={`block text-[13px] font-medium ${theme.text.secondary} mb-1.5`}
          >
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PostCategory)}
            className={`w-full px-3 py-1.5 rounded-lg text-[13px] ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400`}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Title Input */}
        <motion.div
          className="mb-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label
            className={`block text-[13px] font-medium ${theme.text.secondary} mb-1.5`}
          >
            제목 ({title.length}/200)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 200))}
            placeholder="제목을 입력하세요"
            className={`w-full px-3 py-2 rounded-lg text-[14px] ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400`}
          />
        </motion.div>

        {/* Content Textarea */}
        <motion.div
          className="mb-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label
            className={`block text-[13px] font-medium ${theme.text.secondary} mb-1.5`}
          >
            내용 ({content.length}/5000)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 5000))}
            placeholder="내용을 입력하세요"
            rows={10}
            className={`w-full px-3 py-2 rounded-lg text-[13px] ${theme.surface.card} ${theme.text.primary} ${theme.border.primary} border focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none`}
          />
        </motion.div>

        {/* Image Upload */}
        <motion.div
          className="mb-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label
            className={`block text-[13px] font-medium ${theme.text.secondary} mb-1.5`}
          >
            이미지 첨부 ({images.length}/10)
          </label>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`첨부 이미지 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <MdClose className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < 10 && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] ${theme.surface.card} ${theme.text.secondary} ${theme.border.primary} border border-dashed hover:border-primary-400 transition-colors`}
              >
                <MdImage className="w-4 h-4" />
                <span>이미지 선택</span>
              </div>
            </label>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          className={`w-full py-2.5 rounded-full text-[14px] font-medium transition-colors ${
            title.trim() && content.trim() && !isSubmitting
              ? `${tennisGradients.primary} text-white`
              : `${theme.surface.card} ${theme.text.secondary} opacity-50 cursor-not-allowed`
          }`}
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || isSubmitting}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{
            scale: title.trim() && content.trim() && !isSubmitting ? 1.02 : 1,
          }}
          whileTap={{
            scale: title.trim() && content.trim() && !isSubmitting ? 0.98 : 1,
          }}
        >
          {isSubmitting ? "작성 중..." : "게시글 작성"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BoardWritePage;
