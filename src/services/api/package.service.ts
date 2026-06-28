import APICall from '@/lib/apiCall'
import ENDPOINTS from '@/config/endpoints'
import type { Package, ApiResponse, RazorpayOrder, PaymentVerification } from '@/types'

export const packageService = {
  getAll: () =>
    APICall<ApiResponse<Package[]>>('get', null, ENDPOINTS.PACKAGES.LIST)
      .then((res) => res.data),

  getById: (id: string) =>
    APICall<ApiResponse<Package>>('get', null, ENDPOINTS.PACKAGES.BY_ID(id))
      .then((res) => res.data),

  // ─── Admin — CRUD ─────────────────────────────────────────────────────────

  create: (payload: Partial<Package>) =>
    APICall<ApiResponse<Package>>('post', payload, ENDPOINTS.PACKAGES.LIST)
      .then((res) => res.data),

  update: (id: string, payload: Partial<Package>) =>
    APICall<ApiResponse<Package>>('patch', payload, ENDPOINTS.PACKAGES.BY_ID(id))
      .then((res) => res.data),

  delete: (id: string) =>
    APICall<ApiResponse<null>>('delete', null, ENDPOINTS.PACKAGES.BY_ID(id))
      .then((res) => res.data),

  // ─── Payments ─────────────────────────────────────────────────────────────

  createOrder: (packageId: string) =>
    APICall<ApiResponse<RazorpayOrder>>('post', { packageId }, ENDPOINTS.PAYMENTS.CREATE_ORDER)
      .then((res) => res.data),

  verifyPayment: (payload: PaymentVerification) =>
    APICall<ApiResponse<null>>('post', payload, ENDPOINTS.PAYMENTS.VERIFY)
      .then((res) => res.data),
}
