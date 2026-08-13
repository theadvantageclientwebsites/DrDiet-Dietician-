/**
 * usePatientPortal.ts — TanStack Query hooks for /patient/* APIs
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { patientPortalService } from '@/services/api/patientPortal.service'
import { useToast } from '@/components/ui/toast'
import type {
  PatientAppointmentsParams,
  PatientBookAppointmentPayload,
  PatientDoctorsParams,
  PatientDigitalProductsParams,
  PatientPortalProfileUpdatePayload,
  PatientCreateOrderPayload,
  PatientPaymentVerifyPayload,
  PatientPortalPagination,
} from '@/types'

export const PATIENT_PORTAL_KEYS = {
  dashboard:     ['patient', 'dashboard'] as const,
  profile:       ['patient', 'profile'] as const,
  doctors:       (p: PatientDoctorsParams) => ['patient', 'doctors', p] as const,
  appointments:  (p: PatientAppointmentsParams) => ['patient', 'appointments', p] as const,
  appointment:   (id: string) => ['patient', 'appointment', id] as const,
  packages:      (p: object) => ['patient', 'packages', p] as const,
  digitalProducts:(p: PatientDigitalProductsParams) => ['patient', 'digital-products', p] as const,
  bloodReports:  (p: object) => ['patient', 'blood-reports', p] as const,
  orders:        (p: object) => ['patient', 'orders', p] as const,
}

const FALLBACK_PAGINATION: PatientPortalPagination = {
  page: 1, limit: 10, totalItems: 0, totalPages: 1,
}

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function usePatientPortalDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: PATIENT_PORTAL_KEYS.dashboard,
    queryFn:  () => patientPortalService.getDashboard(),
    retry:    1,
    staleTime: 60_000,
  })
  return {
    dashboard: data?.data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  }
}

export function usePatientPortalProfile() {
  return useQuery({
    queryKey: PATIENT_PORTAL_KEYS.profile,
    queryFn:  () => patientPortalService.getProfile(),
    retry:    1,
  })
}

export function useUpdatePatientPortalProfile() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (payload: PatientPortalProfileUpdatePayload) =>
      patientPortalService.updateProfile(payload),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Profile updated', description: res.message })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.profile })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.dashboard })
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Update failed', description: getErrorMessage(err, 'Could not update profile.') })
    },
  })
}

export function useUploadPatientProfilePhoto() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (file: File) => patientPortalService.uploadProfilePhoto(file),
    onSuccess: () => {
      toast({ variant: 'success', title: 'Photo updated', description: 'Profile photo saved.' })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.profile })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.dashboard })
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Upload failed', description: getErrorMessage(err, 'Could not upload photo.') })
    },
  })
}

export function usePatientDoctors(params: PatientDoctorsParams = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: PATIENT_PORTAL_KEYS.doctors(params),
    queryFn:  () => patientPortalService.getDoctors(params),
    retry:    1,
  })
  return { doctors: data?.data ?? [], isLoading, isError, error, refetch }
}

export function usePatientPortalAppointments(params: PatientAppointmentsParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: PATIENT_PORTAL_KEYS.appointments(params),
    queryFn:  () => patientPortalService.getAppointments(params),
    placeholderData: keepPreviousData,
    retry:    1,
  })
  return {
    appointments: data?.data?.items ?? [],
    pagination:   data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function useBookPatientAppointment(onSuccess?: () => void) {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (payload: PatientBookAppointmentPayload) =>
      patientPortalService.bookAppointment(payload),
    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Appointment requested',
        description: res.message ?? 'Your appointment is pending doctor confirmation.',
      })
      qc.invalidateQueries({ queryKey: ['patient', 'appointments'] })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.dashboard })
      onSuccess?.()
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Booking failed', description: getErrorMessage(err, 'Could not book appointment.') })
    },
  })
}

export function useCancelPatientAppointment() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => patientPortalService.cancelAppointment(id),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Cancelled', description: res.message ?? 'Appointment cancelled.' })
      qc.invalidateQueries({ queryKey: ['patient', 'appointments'] })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.dashboard })
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Cancel failed', description: getErrorMessage(err, 'Could not cancel appointment.') })
    },
  })
}

export function usePatientPortalPackages(params?: { search?: string; category?: string }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: PATIENT_PORTAL_KEYS.packages(params ?? {}),
    queryFn:  () => patientPortalService.getPackages(params),
    retry:    1,
  })
  return { packages: data?.data ?? [], isLoading, isError, error, refetch }
}

export function usePatientDigitalProducts(params: PatientDigitalProductsParams = {}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: PATIENT_PORTAL_KEYS.digitalProducts(params),
    queryFn:  () => patientPortalService.getDigitalProducts(params),
    placeholderData: keepPreviousData,
    retry:    1,
  })
  return {
    products:   data?.data?.items ?? [],
    pagination: data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export function usePatientPortalBloodReports(params?: { page?: number; limit?: number }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: PATIENT_PORTAL_KEYS.bloodReports(params ?? {}),
    queryFn:  () => patientPortalService.getBloodReports(params),
    retry:    1,
  })
  return {
    reports:    data?.data?.items ?? [],
    pagination: data?.data?.pagination ?? FALLBACK_PAGINATION,
    isLoading,
    isError,
    error,
    refetch,
  }
}

export function usePatientCreateOrder() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: (payload: PatientCreateOrderPayload) =>
      patientPortalService.createPaymentOrder(payload),
    onError: (err) => {
      toast({ variant: 'error', title: 'Order failed', description: getErrorMessage(err, 'Could not create payment order.') })
    },
  })
}

export function usePatientVerifyPayment() {
  const qc = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (payload: PatientPaymentVerifyPayload) =>
      patientPortalService.verifyPayment(payload),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Payment successful', description: res.message ?? res.data?.message })
      qc.invalidateQueries({ queryKey: PATIENT_PORTAL_KEYS.orders({}) })
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Verification failed', description: getErrorMessage(err, 'Payment verification failed.') })
    },
  })
}
