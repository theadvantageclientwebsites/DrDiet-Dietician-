/**
 * BloodReportsPage — List, upload, edit, and delete blood reports.
 * Data: GET/POST/PUT/DELETE /doctor/blood-reports, POST /upload/blood-report
 */
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FileText, Search, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight,
  Plus, Upload, Trash2, ExternalLink, X,
} from 'lucide-react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'
import { API_BASE_URL } from '@/config/constants'
import {
  useDoctorBloodReports,
  DEFAULT_DOCTOR_BLOOD_REPORTS_LIMIT,
} from '@/hooks/useDoctorBloodReports'
import {
  useCreateDoctorBloodReport,
  useDeleteDoctorBloodReport,
  useUploadDoctorBloodReportFile,
} from '@/hooks/useDoctorBloodReportMutations'
import { useDoctorPatients } from '@/hooks/useDoctorPatients'
import type { DoctorBloodReport } from '@/types'
import { format, parseISO } from 'date-fns'

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

function resolveFileUrl(url: string) {
  return url.startsWith('http') ? url : `${SERVER_ORIGIN}${url}`
}

function fmtDate(iso: string) {
  try { return format(parseISO(iso), 'MMM d, yyyy') }
  catch { return iso }
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 12, marginBottom: 16,
      background: '#fff7ed', border: '1px solid #fed7aa', flexWrap: 'wrap',
    }}>
      <AlertTriangle size={16} color="#ea580c" />
      <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c' }}>
        Could not load blood reports. Please try again.
      </span>
      <button onClick={onRetry} style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 7, background: '#ea580c', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: FONT_WEIGHT.semibold,
      }}>
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  )
}

function UploadModal({ onClose, defaultPatientId }: { onClose: () => void; defaultPatientId?: string }) {
  const [patientId, setPatientId] = useState(defaultPatientId ?? '')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { patients } = useDoctorPatients({ limit: 100 })
  const uploadFile = useUploadDoctorBloodReportFile()
  const createReport = useCreateDoctorBloodReport(onClose)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId || !title.trim() || !file) return

    const uploadRes = await uploadFile.mutateAsync(file)
    const fileUrl = uploadRes.data?.fileUrl
    if (!fileUrl) return

    createReport.mutate({
      patientId,
      title: title.trim(),
      fileUrl,
      notes: notes.trim() || undefined,
    })
  }

  const busy = uploadFile.isPending || createReport.isPending

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15, 61, 74, 0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480,
          boxShadow: SHADOW.card, overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${COLORS.divider}`,
        }}>
          <h2 style={{ margin: 0, fontSize: FONT_SIZE.lg, color: COLORS.navy }}>Upload Blood Report</h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Patient *</span>
            <select
              required
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm }}
            >
              <option value="">Select patient…</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Title *</span>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CBC Report July 2026"
              style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>PDF File *</span>
            <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px', borderRadius: 8, border: `1px dashed ${COLORS.brand}`,
                background: COLORS.brandLight, color: COLORS.brand, cursor: 'pointer',
                fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
              }}
            >
              <Upload size={16} />
              {file ? file.name : 'Choose PDF (max 20MB)'}
            </button>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Notes</span>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional clinical notes…"
              style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm, resize: 'vertical' }}
            />
          </label>

          <button
            type="submit"
            disabled={busy || !patientId || !title.trim() || !file}
            style={{
              padding: '10px 0', borderRadius: 10, border: 'none', cursor: busy ? 'wait' : 'pointer',
              background: COLORS.brand, color: '#fff',
              fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
              opacity: busy || !patientId || !title.trim() || !file ? 0.6 : 1,
            }}
          >
            {busy ? 'Uploading…' : 'Save Report'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function BloodReportsPage() {
  const [searchParams] = useSearchParams()
  const patientIdFilter = searchParams.get('patientId') ?? ''

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_DOCTOR_BLOOD_REPORTS_LIMIT)
  const [showUpload, setShowUpload] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search])

  const { reports, pagination, isLoading, isFetching, isError, refetch } = useDoctorBloodReports({
    patientId: patientIdFilter || undefined,
    search:    debouncedSearch || undefined,
    page,
    limit,
  })

  const deleteReport = useDeleteDoctorBloodReport(() => setDeleteId(null))

  return (
    <div style={{ padding: 16, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: 0 }}>
            Blood Reports
          </h1>
          <p style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted, marginTop: 4 }}>
            Upload and manage patient blood test reports.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, background: COLORS.brand,
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
          }}
        >
          <Plus size={16} /> Upload Report
        </button>
      </div>

      {patientIdFilter && (
        <div style={{
          padding: '8px 12px', borderRadius: 8, background: COLORS.brandLight,
          color: COLORS.brand, fontSize: FONT_SIZE.sm, marginBottom: 12,
        }}>
          Filtered by patient ID: {patientIdFilter}
        </div>
      )}

      {isError && <ErrorBanner onRetry={refetch} />}

      <div style={{
        background: '#fff', borderRadius: 16, padding: 16,
        border: `1px solid ${COLORS.divider}`, boxShadow: SHADOW.card, marginBottom: 16,
      }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <Search size={15} color={COLORS.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by report title…"
            style={{
              width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8,
              border: `1px solid ${COLORS.divider}`, fontSize: FONT_SIZE.sm,
            }}
          />
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, border: `1px solid ${COLORS.divider}`,
        boxShadow: SHADOW.card, overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>Loading reports…</div>
        ) : reports.length === 0 ? (
          <div style={{
            padding: 48, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          }}>
            <FileText size={40} color={COLORS.brand} style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>No blood reports yet</p>
            <p style={{ margin: '6px 0 16px', fontSize: FONT_SIZE.sm, color: COLORS.muted }}>
              Upload a PDF report for one of your patients.
            </p>
            <button onClick={() => setShowUpload(true)} style={{
              padding: '8px 16px', borderRadius: 8, background: COLORS.brand, color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold,
            }}>
              Upload first report
            </button>
          </div>
        ) : (
          <div>
            {reports.map((r: DoctorBloodReport) => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
                padding: '14px 16px', borderBottom: `1px solid ${COLORS.divider}`,
                opacity: isFetching ? 0.7 : 1,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: COLORS.brandLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={20} color={COLORS.brand} />
                </div>

                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ margin: 0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>{r.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
                    {r.patient.fullName} · {fmtDate(r.uploadedAt)}
                  </p>
                  {r.notes && (
                    <p style={{ margin: '6px 0 0', fontSize: FONT_SIZE.xs, color: COLORS.body, lineHeight: 1.4 }}>{r.notes}</p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => window.open(resolveFileUrl(r.fileUrl), '_blank')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                      background: COLORS.brandLight, color: COLORS.brand,
                      fontSize: 11, fontWeight: FONT_WEIGHT.semibold,
                    }}
                  >
                    <ExternalLink size={13} /> View PDF
                  </button>
                  <button
                    onClick={() => setDeleteId(r.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                      background: '#fee2e2', color: '#dc2626',
                      fontSize: 11, fontWeight: FONT_WEIGHT.semibold,
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderTop: `1px solid ${COLORS.divider}`, flexWrap: 'wrap', gap: 8,
          }}>
            <span style={{ fontSize: FONT_SIZE.xs, color: COLORS.muted }}>
              Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} total
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
                <ChevronLeft size={16} />
              </button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: 6, borderRadius: 6, border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          defaultPatientId={patientIdFilter || undefined}
        />
      )}

      {deleteId && (
        <ConfirmModal
          open
          title="Delete blood report?"
          description="This action cannot be undone. The report file will be removed."
          confirmLabel="Delete"
          variant="danger"
          loading={deleteReport.isPending}
          onConfirm={() => deleteReport.mutate(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
