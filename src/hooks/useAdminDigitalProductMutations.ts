import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/api/admin.service'
import { useToast } from '@/components/ui/toast'
import { adminDigitalProductsKey } from '@/hooks/useAdminDigitalProducts'
import type { DigitalProductCreatePayload, DigitalProductUpdatePayload, DigitalProductStatus } from '@/types'

function getErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } }; message?: string }
  return e?.response?.data?.message ?? e?.message ?? fallback
}

// ─── Upload helpers ────────────────────────────────────────────────────────────

/** Uploads PDF file, returns the fileUrl string. Throws on failure. */
async function uploadFile(file: File): Promise<string> {
  const res = await adminService.uploadDigitalProductFile(file)
  const url = res?.data?.fileUrl
  if (!url) throw new Error('File upload succeeded but returned no URL.')
  return url
}

/** Uploads thumbnail image, returns the thumbnailUrl string. Throws on failure. */
async function uploadThumbnail(image: File): Promise<string> {
  const res = await adminService.uploadDigitalProductThumbnail(image)
  const url = res?.data?.thumbnailUrl
  if (!url) throw new Error('Thumbnail upload succeeded but returned no URL.')
  return url
}

// ─── Create ────────────────────────────────────────────────────────────────────

export interface CreateDigitalProductInput {
  fields: Omit<DigitalProductCreatePayload, 'fileUrl' | 'thumbnailUrl'>
  /** Optional PDF file — will be uploaded first if provided */
  file?: File | null
  /** Optional thumbnail image — will be uploaded first if provided */
  thumbnail?: File | null
}

/**
 * 2-step upload flow:
 *   1. Upload PDF   → get fileUrl
 *   2. Upload thumb → get thumbnailUrl
 *   3. POST /admin/digital-products with both URLs + fields
 *
 * Steps 1 & 2 run in parallel when both files are provided.
 * Upload progress is exposed via `isUploading`.
 */
export function useCreateDigitalProduct(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: async ({ fields, file, thumbnail }: CreateDigitalProductInput) => {
      // ── Step 1 & 2: parallel uploads ──────────────────────────────────────
      setIsUploading(true)
      let fileUrl: string | undefined
      let thumbnailUrl: string | undefined

      try {
        const uploads = await Promise.all([
          file      ? uploadFile(file)           : Promise.resolve(undefined),
          thumbnail ? uploadThumbnail(thumbnail) : Promise.resolve(undefined),
        ])
        fileUrl      = uploads[0]
        thumbnailUrl = uploads[1]
      } finally {
        setIsUploading(false)
      }

      // ── Step 3: create product ─────────────────────────────────────────────
      const payload: DigitalProductCreatePayload = {
        ...fields,
        ...(fileUrl      ? { fileUrl }      : {}),
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
      }
      return adminService.createDigitalProduct(payload)
    },

    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Product created',
        description: res?.message ?? 'Digital product added successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Create failed',
        description: getErrorMessage(err, 'Could not create product. Please try again.'),
      })
    },
  })

  return { ...mutation, isUploading }
}

// ─── Update ────────────────────────────────────────────────────────────────────

export interface UpdateDigitalProductInput {
  id: string
  payload: DigitalProductUpdatePayload
  /** Optionally replace the PDF file — will be uploaded before the PUT */
  file?: File | null
  /** Optionally replace the thumbnail — will be uploaded before the PUT */
  thumbnail?: File | null
}

export function useUpdateDigitalProduct(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: async ({ id, payload, file, thumbnail }: UpdateDigitalProductInput) => {
      let fileUrl      = payload.fileUrl
      let thumbnailUrl = payload.thumbnailUrl

      if (file || thumbnail) {
        setIsUploading(true)
        try {
          const uploads = await Promise.all([
            file      ? uploadFile(file)           : Promise.resolve(undefined),
            thumbnail ? uploadThumbnail(thumbnail) : Promise.resolve(undefined),
          ])
          if (uploads[0]) fileUrl      = uploads[0]
          if (uploads[1]) thumbnailUrl = uploads[1]
        } finally {
          setIsUploading(false)
        }
      }

      return adminService.updateDigitalProduct(id, {
        ...payload,
        ...(fileUrl      ? { fileUrl }      : {}),
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
      })
    },

    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Product updated',
        description: res?.message ?? 'Changes saved successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Update failed',
        description: getErrorMessage(err, 'Could not update product. Please try again.'),
      })
    },
  })

  return { ...mutation, isUploading }
}

// ─── Status toggle ─────────────────────────────────────────────────────────────

export function useUpdateDigitalProductStatus() {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DigitalProductStatus }) =>
      adminService.updateDigitalProductStatus(id, status),

    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Status updated',
        description: res?.message ?? 'Product status changed.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
    },

    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Status update failed',
        description: getErrorMessage(err, 'Could not change product status.'),
      })
    },
  })
}

// ─── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteDigitalProduct(onSuccess?: () => void) {
  const { toast } = useToast()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.deleteDigitalProduct(id),

    onSuccess: (res) => {
      toast({
        variant: 'success',
        title: 'Product deleted',
        description: res?.message ?? 'Removed successfully.',
      })
      qc.invalidateQueries({ queryKey: adminDigitalProductsKey })
      onSuccess?.()
    },

    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Delete failed',
        description: getErrorMessage(err, 'Could not delete product. Please try again.'),
      })
    },
  })
}
