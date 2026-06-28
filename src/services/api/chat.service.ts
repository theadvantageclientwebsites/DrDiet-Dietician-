import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type { ChatMessage, ChatThread, ApiResponse, PaginatedResponse } from '@/types'

export const chatService = {
  getThreads: () =>
    APICall<ApiResponse<ChatThread[]>>('get', null, ENDPOINTS.CHAT.THREADS)
      .then((res) => res.data),

  getMessages: (threadId: string, params?: { page?: number; limit?: number }) =>
    APICall<PaginatedResponse<ChatMessage>>(
      'get',
      params ?? null,
      ENDPOINTS.CHAT.MESSAGES(threadId),
    ).then((res) => res.data),

  sendMessage: (threadId: string, content: string) =>
    APICall<ApiResponse<ChatMessage>>(
      'post',
      { content },
      ENDPOINTS.CHAT.SEND(threadId),
    ).then((res) => res.data),

  markThreadRead: (threadId: string) =>
    APICall<ApiResponse<null>>('patch', null, ENDPOINTS.CHAT.MARK_READ(threadId))
      .then((res) => res.data),
}
