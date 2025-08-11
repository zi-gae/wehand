import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getWeHandTennisAPI, CreatePostRequest, UpdatePostRequest } from "../api";

// Query Keys
export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (params: Record<string, any>) =>
    [...postQueryKeys.lists(), params] as const,
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...postQueryKeys.details(), id] as const,
} as const;

// 게시글 목록 조회 훅
export const usePosts = (params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: postQueryKeys.list(params || {}),
    queryFn: () =>
      api
        .getApiCommunityPosts({
          search: params?.search,
          category: params?.category as any,
          page: params?.page,
          limit: params?.limit,
        })
        .then((response) => response.data),
    staleTime: 3 * 60 * 1000,
  });
};

// 무한 스크롤 게시글 목록 훅
export const useInfinitePosts = (params?: {
  search?: string;
  category?: string;
}) => {
  const api = getWeHandTennisAPI();

  return useInfiniteQuery({
    queryKey: postQueryKeys.list(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      api
        .getApiCommunityPosts({
          search: params?.search,
          category: params?.category as any,
          page: pageParam,
          limit: 10,
        })
        .then((response) => response),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.pagination?.hasNext ? lastPageParam + 1 : undefined;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// 게시글 상세 조회 훅
export const usePost = (postId: string) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: postQueryKeys.detail(postId),
    queryFn: () =>
      api.getApiCommunityPostsPostId(postId).then((response) => response.data),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
};

// 게시글 작성 훅
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (postData: CreatePostRequest) =>
      api.postApiCommunityPosts(postData).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
    },
  });
};

// 게시글 좋아요 훅
export const useLikePost = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (postId: string) =>
      api.postApiCommunityPostsPostIdLike(postId).then((response) => response),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(postId),
      });
    },
  });
};

// 게시글 좋아요 해제 훅
export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (postId: string) =>
      api
        .deleteApiCommunityPostsPostIdLike(postId)
        .then((response) => response),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(postId),
      });
    },
  });
};

// 댓글 작성 훅
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({
      postId,
      content,
      parentId,
    }: {
      postId: string;
      content: string;
      parentId?: string;
    }) =>
      api
        .postApiCommunityPostsPostIdComments(postId, {
          content,
          parent_id: parentId,
        })
        .then((response) => response.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(variables.postId),
      });
    },
  });
};

// 댓글 삭제 훅
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({
      commentId,
      postId,
    }: {
      commentId: string;
      postId: string;
    }) =>
      api
        .deleteApiCommunityCommentsCommentId(commentId)
        .then((response) => response),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(variables.postId),
      });
    },
  });
};

// 게시글 수정 훅
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: ({
      postId,
      postData,
    }: {
      postId: string;
      postData: UpdatePostRequest;
    }) =>
      api.putApiCommunityPostsPostId(postId, postData).then((response) => response.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });
};

// 게시글 삭제 훅
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const api = getWeHandTennisAPI();

  return useMutation({
    mutationFn: (postId: string) =>
      api.deleteApiCommunityPostsPostId(postId).then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });
};

// 게시글 댓글 조회 훅
export const usePostComments = (postId: string, params?: {
  page?: number;
  limit?: number;
}) => {
  const api = getWeHandTennisAPI();

  return useQuery({
    queryKey: [...postQueryKeys.detail(postId), 'comments', params],
    queryFn: () =>
      api.getApiCommunityPostsPostIdComments(postId, {
        page: params?.page,
        limit: params?.limit,
      }).then((response) => response.data),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
  });
};
