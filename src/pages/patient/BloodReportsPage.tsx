import { FileText, Download, AlertCircle, RefreshCw } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'
import { API_BASE_URL } from '@/config/constants'
import { usePatientPortalBloodReports } from '@/hooks/usePatientPortal'
import { format, parseISO } from 'date-fns'

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

function resolveFileUrl(url: string) {
  return url.startsWith('http') ? url : `${SERVER_ORIGIN}${url}`
}

export default function BloodReportsPage() {
  const { reports, isLoading, isError, refetch } = usePatientPortalBloodReports({ limit: 50 })

  return (
    <PageShell
      title="Blood Reports"
      subtitle="Reports uploaded by your doctor. Patients cannot upload — your doctor adds these after review."
    >
      <div className="p-4 rounded-xl bg-[#e8f7f9] border border-[#a8d8e2] text-[13px] text-[#1a6b7a] mb-2">
        Blood reports are uploaded by your treating doctor. Contact them if you need a new report added.
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#fff7ed] text-[#c2410c] text-[13px] mb-4">
          <AlertCircle size={16} /> Failed to load reports.
          <button onClick={() => refetch()} className="underline flex items-center gap-1"><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      {isLoading ? (
        <p className="text-[13px] text-[#6b8896] py-8 text-center">Loading reports…</p>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <FileText size={40} className="text-[#1a6b7a]" />
          <p className="text-[14px] font-semibold text-[#1a3c4d]">No blood reports yet</p>
          <p className="text-[13px] text-[#6b8896] max-w-sm">Your doctor will upload reports here after your consultations.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#e6edf0] p-4 flex items-start gap-4 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#dc2626] shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1a3c4d]">{r.title}</p>
                <p className="text-[12px] text-[#6b8896] mt-0.5">
                  Dr. {r.doctor.fullName} · {format(parseISO(r.uploadedAt), 'MMM d, yyyy')}
                </p>
                {r.notes && (
                  <p className="text-[12px] text-[#374955] mt-2 p-2 rounded-lg bg-[#f7fafb]">{r.notes}</p>
                )}
              </div>
              <PrimaryButton size="sm" variant="outline" onClick={() => window.open(resolveFileUrl(r.fileUrl), '_blank')}>
                <Download size={13} /> View PDF
              </PrimaryButton>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
