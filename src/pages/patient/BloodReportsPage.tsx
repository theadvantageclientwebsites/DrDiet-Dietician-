import { useState, useRef } from 'react'
import { Upload, FileText, Download, MessageSquare, AlertCircle } from 'lucide-react'
import PageShell from '@/components/patient/shared/PageShell'
import PrimaryButton from '@/components/patient/shared/PrimaryButton'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
const MAX_MB = 10

const DUMMY_REPORTS = [
  {
    id: '1',
    fileName:    'blood_work_june_2025.pdf',
    uploadedAt:  '2025-06-20',
    doctorNotes: 'Hemoglobin slightly low. Increase iron-rich foods — spinach, lentils, red meat. Recheck in 4 weeks.',
    reviewedAt:  '2025-06-22',
    fileUrl:     '#',
  },
  {
    id: '2',
    fileName:    'thyroid_panel_may.jpg',
    uploadedAt:  '2025-05-15',
    doctorNotes: null,
    reviewedAt:  null,
    fileUrl:     '#',
  },
]

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase()
  const bg  = ext === 'pdf' ? '#fee2e2' : '#dbeafe'
  const col = ext === 'pdf' ? '#dc2626'  : '#2563eb'
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ background: bg, color: col }}>
      {(ext ?? 'FILE').toUpperCase()}
    </div>
  )
}

export default function BloodReportsPage() {
  const inputRef             = useRef<HTMLInputElement>(null)
  const [dragging, setDrag]  = useState(false)
  const [error, setError]    = useState('')
  const [uploading, setUpl]  = useState(false)

  const handleFile = (file: File) => {
    setError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PDF, JPG, or PNG files are allowed.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_MB}MB.`)
      return
    }
    setUpl(true)
    setTimeout(() => { setUpl(false); alert(`"${file.name}" uploaded successfully!`) }, 1200)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <PageShell title="Blood Reports" subtitle="Upload your lab reports. Your doctor will review and respond.">

      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          dragging ? 'border-[#1a6b7a] bg-[#e8f7f9]' : 'border-[#d0dde2] bg-[#f7fafb] hover:border-[#a8d8e2] hover:bg-[#f0f9fb]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
        <div className="w-12 h-12 rounded-full bg-[#d0ecf2] flex items-center justify-center">
          <Upload size={22} className="text-[#1a6b7a]" />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[#1a3c4d]">
            {uploading ? 'Uploading…' : 'Drop file here or click to upload'}
          </p>
          <p className="text-[12px] text-[#6b8896] mt-0.5">PDF, JPG, PNG — max {MAX_MB}MB</p>
        </div>
        {uploading && <div className="w-8 h-8 border-2 border-[#1a6b7a] border-t-transparent rounded-full animate-spin" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div>
        <p className="text-[15px] font-bold text-[#1a3c4d] mb-3">Uploaded Reports</p>
        <div className="flex flex-col gap-3">
          {DUMMY_REPORTS.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-[#e6edf0] p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-3">
                <FileIcon name={report.fileName} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a3c4d] truncate">{report.fileName}</p>
                  <p className="text-[11px] text-[#9ab0bb]">Uploaded {report.uploadedAt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {report.reviewedAt ? (
                    <span className="text-[11px] font-semibold bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full">Reviewed</span>
                  ) : (
                    <span className="text-[11px] font-semibold bg-[#fef3c7] text-[#d97706] px-2 py-0.5 rounded-full">Pending</span>
                  )}
                  <PrimaryButton size="sm" variant="ghost" onClick={() => window.open(report.fileUrl)}>
                    <Download size={13} />
                  </PrimaryButton>
                </div>
              </div>

              {report.doctorNotes && (
                <div className="bg-[#f0f9fb] border border-[#c8e8ef] rounded-xl p-3 flex gap-2.5">
                  <MessageSquare size={15} className="text-[#1a6b7a] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#1a6b7a] mb-0.5">Doctor's Notes</p>
                    <p className="text-[12px] text-[#374955] leading-relaxed">{report.doctorNotes}</p>
                    <p className="text-[11px] text-[#9ab0bb] mt-1">Reviewed on {report.reviewedAt}</p>
                  </div>
                </div>
              )}

              {!report.doctorNotes && (
                <div className="flex items-center gap-2 text-[12px] text-[#9ab0bb]">
                  <FileText size={13} /> Awaiting doctor review…
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
