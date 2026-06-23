import axiosInstance from '@/lib/axios'
import type { ChatMessage, ChatThread, ApiResponse, PaginatedResponse } from '@/types'

export const chatService = {
  getThreads: async (): Promise<ApiResponse<ChatThread[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<ChatThread[]>>('/chat/threads')
    return data
  },

  getMessages: async (
    threadId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedResponse<ChatMessage>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<ChatMessage>>(
      `/chat/threads/${threadId}/messages`,
      { params },
    )
    return data
  },

  sendMessage: async (
    threadId: string,
    content: string,
  ): Promise<ApiResponse<ChatMessage>> => {
    const { data } = await axiosInstance.post<ApiResponse<ChatMessage>>(
      `/chat/threads/${threadId}/messages`,
      { content },
    )
    return data
  },

  markThreadRead: async (threadId: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.patch<ApiResponse<null>>(
      `/chat/threads/${threadId}/read`,
    )
    return data
  },
}
