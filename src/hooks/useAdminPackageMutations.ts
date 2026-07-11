/**
 * useAdminPackageMutations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Mutation hooks for admin package CRUD + status toggle:
 *   - useCreateAdminPackage   → POST /admin/packages
 *   - useUpdateAdminPackage   → PUT  /admin/packages/:id
 *   - useToggleAdminPackageStatus → PATCH /admin/packages/:id/status
 *   - useDeleteAdminPackage   → DELETE /admin/packages/:id
 *
 * Each mutation shows toast feedback and invalidates the packages query cache.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminPackagesKey, DEFAULT_PACKAGES_LIMIT } from '@/hooks/useAdminPackages'
import type { AdminPackageCreatePayload, AdminPackageUpdatePayload } from '@/types'

// ─── Helper ───────────────────────────────────────────────────────────────────
function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message ?? fallback
}

// ─── Invalidate all package list variants ────────────────────────────────────
function invalidatePackages(qc: ReturnType<typeof useQueryClient>) {
  // Broad key invalidation covers all filter/page combos
  qc.invalidateQueries({ queryKey: ['admin', 'packages'] })
  // Also specifically invalidate the default key used by initial page load
  qc.invalidateQueries({ queryKey: adminPackagesKey({ page: 1, limit: DEFAULT_PACKAGES_LIMIT }) })
}

// ─── Create ───────────────────────────────────────────────────────────────────
export function useCreateAdminPackage(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPackageCreatePayload) =>
      adminService.createAdminPackage(payload),

    onSuccess: (res) => {
      toast({
        variant:     'success',
        title:       'Package created',
        description: res.message ?? 'Package created successfully.',
      })
      invalidatePackages(qc)
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Create failed',
        description: getErrorMessage(err, 'Could not create package. Please try again.'),
      })
    },
  })
}

// ─── Update (PUT — full update) ───────────────────────────────────────────────
export function useUpdateAdminPackage(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminPackageUpdatePayload }) =>
      adminService.updateAdminPackage(id, payload),

    onSuccess: (res) => {
      toast({
        variant:     'success',
        title:       'Package updated',
        description: res.message ?? 'Changes saved successfully.',
      })
      invalidatePackages(qc)
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Update failed',
        description: getErrorMessage(err, 'Could not update package. Please try again.'),
      })
    },
  })
}

// ─── Toggle status (PATCH /status — separate endpoint) ───────────────────────
export function useToggleAdminPackageStatus(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.toggleAdminPackageStatus(id, isActive),

    onSuccess: (res) => {
      const active = res.data?.isActive
      toast({
        variant:     'success',
        title:       active ? 'Package activated' : 'Package deactivated',
        description: res.message ?? (active ? 'Package is now active.' : 'Package is now inactive.'),
      })
      invalidatePackages(qc)
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Toggle failed',
        description: getErrorMessage(err, 'Could not update package status. Please try again.'),
      })
    },
  })
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export function useDeleteAdminPackage(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteAdminPackage(id),

    onSuccess: (res) => {
      toast({
        variant:     'success',
        title:       'Package deleted',
        description: res.message ?? 'Package removed successfully.',
      })
      invalidatePackages(qc)
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant:     'error',
        title:       'Delete failed',
        description: getErrorMessage(err, 'Could not delete package. Please try again.'),
      })
    },
  })
}
