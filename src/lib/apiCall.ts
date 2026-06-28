/**
 * apiCall.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generic HTTP helper built on top of the shared axios instance.
 * All service functions call this instead of using axiosInstance directly,
 * giving us a single place to control logging, error shaping, and FormData.
 *
 * Usage:
 *   // GET with query params
 *   APICall<User[]>('get', { page: 1 }, ENDPOINTS.PATIENTS.LIST)
 *
 *   // POST JSON
 *   APICall<AuthResponse>('post', payload, ENDPOINTS.AUTH.LOGIN)
 *
 *   // POST multipart/form-data
 *   APICall<BloodReport>('post', filePayload, ENDPOINTS.PATIENTS.BLOOD_REPORTS, {}, true)
 */

import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '@/lib/axios'

// ─── Types ────────────────────────────────────────────────────────────────────

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

/** The resolved shape that every APICall promise resolves to. */
export interface APICallResult<T = unknown> {
  status: number
  data: T
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build standard request headers.
 * Passing `isFormData = true` sets the Content-Type to multipart/form-data.
 * Axios will then append the correct boundary string automatically when the
 * body is a FormData instance.
 */
export const getHeaders = (isFormData = false): Record<string, string> => ({
  accept: 'application/json',
  'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
})

/** Convert a plain object to FormData (shallow — no nested objects). */
const toFormData = (obj: Record<string, unknown>): FormData => {
  const fd = new FormData()
  Object.entries(obj).forEach(([key, value]) => {
    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value)
    } else if (value !== undefined && value !== null) {
      fd.append(key, String(value))
    }
  })
  return fd
}

// ─── Core ─────────────────────────────────────────────────────────────────────

/**
 * APICall — generic request executor.
 *
 * @param method    HTTP verb
 * @param body      Request body (POST/PUT/PATCH) or query params (GET/DELETE)
 * @param url       Endpoint path — use values from ENDPOINTS config
 * @param headers   Optional extra headers merged on top of defaults
 * @param formData  Set to `true` to encode the body as multipart/form-data
 */
const APICall = <T = unknown>(
  method: HttpMethod,
  body: unknown = null,
  url: string | null = null,
  headers: Record<string, string> = {},
  formData = false,
): Promise<APICallResult<T>> => {
  const config: AxiosRequestConfig = { method }

  if (url) config.url = url

  // Params vs body
  if (body && (method === 'get' || method === 'delete')) {
    config.params = body
  } else if (body && formData) {
    // FormData — body can be a plain object or already a FormData instance
    config.data = body instanceof FormData ? body : toFormData(body as Record<string, unknown>)
    config.headers = { 'Content-Type': 'multipart/form-data' }
  } else {
    config.data = body
  }

  // Merge any caller-supplied extra headers
  if (Object.keys(headers).length > 0) {
    config.headers = { ...config.headers, ...headers }
  }

  return new Promise<APICallResult<T>>((resolve, reject) => {
    axiosInstance(config)
      .then((res) => {
        resolve({ status: res.status, data: res.data as T })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default APICall
