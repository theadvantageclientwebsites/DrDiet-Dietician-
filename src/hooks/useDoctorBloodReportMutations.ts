/**
 * useDoctorBloodReportMutations.ts — create / update / delete blood reports.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorService } from '@/services/api/doctor.service'
import { useToast } from '@/components/ui/toast'
import {
  doctorBloodReportsKey,
  doctorBloodReportDetailKey,
  DEFAULT_DOCTOR_BLOOD_REPORTS_LIMIT,
} from '@/hooks/useDoctorBloodReports'
import type {
  DoctorBloodReportCreatePayload,
  DoctorBloodReportUpdatePayload,
} from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

export function useCreateDoctorBloodReport(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: DoctorBloodReportCreatePayload) =>
      doctorService.createBloodReport(payload),

    onSuccess: (res) => {
      toast({
        variant:     'success',
        title:       'Report uploaded',
        description: res.message ?? 'Blood report saved successfully.',
      })
      qc.invalidateQueries({ queryKey: ['doctor', 'blood-reports', 'list'] })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Upload failed',
        description: getErrorMessage(err, 'Could not save blood report.'),
      })
    },
  })
}

export function useUpdateDoctorBloodReport(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DoctorBloodReportUpdatePayload }) =>
      doctorService.updateBloodReport(id, payload),

    onSuccess: (res, { id }) => {
      toast({
        variant:     'success',
        title:       'Report updated',
        description: res.message ?? 'Blood report updated successfully.',
      })
      qc.invalidateQueries({ queryKey: doctorBloodReportDetailKey(id) })
      qc.invalidateQueries({ queryKey: ['doctor', 'blood-reports', 'list'] })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Update failed',
        description: getErrorMessage(err, 'Could not update blood report.'),
      })
    },
  })
}

export function useDeleteDoctorBloodReport(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => doctorService.deleteBloodReport(id),

    onSuccess: (res) => {
      toast({
        variant:     'success',
        title:       'Report deleted',
        description: res.message ?? 'Blood report removed successfully.',
      })
      qc.invalidateQueries({ queryKey: ['doctor', 'blood-reports', 'list'] })
      qc.invalidateQueries({
        queryKey: doctorBloodReportsKey({ page: 1, limit: DEFAULT_DOCTOR_BLOOD_REPORTS_LIMIT }),
      })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Delete failed',
        description: getErrorMessage(err, 'Could not delete blood report.'),
      })
    },
  })
}

export function useUploadDoctorBloodReportFile() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (file: File) => doctorService.uploadBloodReportFile(file),

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'File upload failed',
        description: getErrorMessage(err, 'Could not upload PDF file.'),
      })
    },
  })
}
