import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import { useToast } from '@/components/ui/toast'
import { doctorPatientsKey, doctorPatientDetailKey } from '@/hooks/useDoctorPatients'
import type { DietPlansListParams, DoctorDietPlanPayload } from '@/types'

export const doctorDietPlansKey = (params: DietPlansListParams) =>
  ['doctor', 'diet-plans', params] as const

export const doctorPatientDietPlanKey = (patientId: string) =>
  ['doctor', 'patient', patientId, 'diet-plan'] as const

const FALLBACK = { page: 1, limit: 10, totalItems: 0, totalPages: 1 }

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useDoctorDietPlans(params: DietPlansListParams = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: doctorDietPlansKey(params),
    queryFn:  () => doctorService.getDietPlans(params),
    placeholderData: keepPreviousData,
    retry: 1,
  })
  return {
    plans:      data?.data?.items ?? [],
    pagination: data?.data?.pagination ?? FALLBACK,
    isLoading,
    isError,
    error,
    refetch,
  }
}

export function useDoctorPatientDietPlan(patientId: string | undefined) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: doctorPatientDietPlanKey(patientId ?? ''),
    queryFn:  () => doctorService.getPatientDietPlan(patientId!),
    enabled:  !!patientId,
    retry:    1,
  })
  return {
    data: data?.data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  }
}

function invalidateDiet(qc: ReturnType<typeof useQueryClient>, patientId?: string) {
  qc.invalidateQueries({ queryKey: ['doctor', 'diet-plans'] })
  qc.invalidateQueries({ queryKey: ['doctor', 'patients'] })
  if (patientId) {
    qc.invalidateQueries({ queryKey: doctorPatientDietPlanKey(patientId) })
    qc.invalidateQueries({ queryKey: doctorPatientDetailKey(patientId) })
    qc.invalidateQueries({ queryKey: doctorPatientsKey({}) })
  }
}

export function useUpsertDoctorDietPlan() {
  const { toast } = useToast()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: DoctorDietPlanPayload) => doctorService.upsertDietPlan(payload),
    onSuccess: (res, payload) => {
      toast({ variant: 'success', title: 'Draft saved', description: res.message ?? 'Diet plan saved as draft.' })
      invalidateDiet(qc, payload.patientId)
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Save failed', description: getErrorMessage(err, 'Could not save diet plan.') })
    },
  })
}

export function useSubmitDoctorDietPlan(patientId?: string) {
  const { toast } = useToast()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => doctorService.submitDietPlan(id),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Submitted', description: res.message ?? 'Plan sent to admin for approval.' })
      invalidateDiet(qc, patientId)
    },
    onError: (err) => {
      toast({ variant: 'error', title: 'Submit failed', description: getErrorMessage(err, 'Could not submit diet plan.') })
    },
  })
}
