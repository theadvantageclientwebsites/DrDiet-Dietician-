import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientService } from '@/services/api/patient.service'
import type { Patient } from '@/types'

export const PATIENT_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: object) => [...PATIENT_KEYS.lists(), params] as const,
  detail: (id: string) => [...PATIENT_KEYS.all, id] as const,
  profile: () => [...PATIENT_KEYS.all, 'profile'] as const,
  dietPlans: (id?: string) => [...PATIENT_KEYS.all, id ?? 'me', 'diet-plans'] as const,
  bloodReports: (id?: string) => [...PATIENT_KEYS.all, id ?? 'me', 'blood-reports'] as const,
}

export const usePatientProfile = () => {
  return useQuery({
    queryKey: PATIENT_KEYS.profile(),
    queryFn: () => patientService.getProfile(),
  })
}

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: PATIENT_KEYS.detail(id),
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  })
}

export const usePatients = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: PATIENT_KEYS.list(params ?? {}),
    queryFn: () => patientService.getAll(params),
  })
}

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Patient>) => patientService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.profile() })
    },
  })
}

export const useDietPlans = (patientId?: string) => {
  return useQuery({
    queryKey: PATIENT_KEYS.dietPlans(patientId),
    queryFn: () => patientService.getDietPlans(patientId),
  })
}

export const useBloodReports = (patientId?: string) => {
  return useQuery({
    queryKey: PATIENT_KEYS.bloodReports(patientId),
    queryFn: () => patientService.getBloodReports(patientId),
  })
}

export const useUploadBloodReport = (patientId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => patientService.uploadBloodReport(patientId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.bloodReports(patientId) })
    },
  })
}
