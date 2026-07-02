import { useState } from 'react'
import { BookOpen, Plus, Pencil, Trash2, Video, Award, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'
import { useAdminCourses } from '@/hooks/useAdminCourses'
import {
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from '@/hooks/useAdminCourseMutations'
import type { Course } from '@/types'

interface CourseFormState {
  title: string
  description: string
  minSemester: string
  minYear: string
  hasTest: boolean
  isActive: boolean
}

const EMPTY_FORM: CourseFormState = {
  title: '', description: '', minSemester: '', minYear: '', hasTest: true, isActive: true,
}

function SkeletonCard() {
  return (
    <div className="cm-card">
      <div className="cm-card-top">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          <div className="skeleton-pulse" style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '12px', background: '#e8edf0' }}/>
          <div className="skeleton-pulse" style={{ height: '22px', width: '60px', borderRadius: '99px', background: '#e8edf0' }}/>
        </div>
        <div className="skeleton-pulse" style={{ height: '16px', width: '85%', borderRadius: '6px', background: '#e8edf0', marginBottom: '8px' }}/>
        <div className="skeleton-pulse" style={{ height: '12px', width: '100%', borderRadius: '6px', background: '#e8edf0', marginBottom: '4px' }}/>
        <div className="skeleton-pulse" style={{ height: '12px', width: '70%', borderRadius: '6px', background: '#e8edf0', marginBottom: '12px' }}/>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[90, 80, 100].map((w, i) => (
            <div key={i} className="skeleton-pulse" style={{ height: '22px', width: `${w}px`, borderRadius: '6px', background: '#e8edf0' }}/>
          ))}
        </div>
        <div className="skeleton-pulse" style={{ height: '12px', width: '50%', borderRadius: '6px', background: '#e8edf0' }}/>
      </div>
      <div className="cm-card-footer">
        <div className="skeleton-pulse" style={{ height: '20px', width: '80px', borderRadius: '6px', background: '#e8edf0' }}/>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div className="skeleton-pulse" style={{ height: '30px', width: '56px', borderRadius: '8px', background: '#e8edf0' }}/>
          <div className="skeleton-pulse" style={{ height: '30px', width: '30px', borderRadius: '7px', background: '#e8edf0' }}/>
          <div className="skeleton-pulse" style={{ height: '30px', width: '30px', borderRadius: '7px', background: '#e8edf0' }}/>
        </div>
      </div>
    </div>
  )
}

function CourseForm({
  id,
  form,
  setForm,
}: {
  id: string
  form: CourseFormState
  setForm: React.Dispatch<React.SetStateAction<CourseFormState>>
}) {
  return (
    <form id={id} className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
      <FormField
        id="c-title" label="Course Title" placeholder="eg. Clinical Nutrition Fundamentals"
        value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
      />
      <div>
        <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, display: 'block', marginBottom: '6px' }}>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe this course…"
          style={{ width: '100%', borderRadius: '10px', border: `1px solid ${COLORS.inputBorder}`, background: COLORS.inputBg, padding: '10px 12px', fontSize: FONT_SIZE.sm, color: COLORS.navy, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <p style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, marginBottom: '8px' }}>Eligibility Criteria</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="c-sem" label="Min Semester" type="number" placeholder="3"
            value={form.minSemester} onChange={e => setForm(f => ({ ...f, minSemester: e.target.value }))}
          />
          <FormField
            id="c-year" label="Min Year" type="number" placeholder="2022"
            value={form.minYear} onChange={e => setForm(f => ({ ...f, minYear: e.target.value }))}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Has Final Test</label>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, hasTest: !f.hasTest }))}
            style={{ width: '42px', height: '22px', borderRadius: '99px', background: form.hasTest ? COLORS.brand : COLORS.divider, border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ position: 'absolute', top: '3px', left: form.hasTest ? undefined : '3px', right: form.hasTest ? '3px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }}/>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Active</label>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
            style={{ width: '42px', height: '22px', borderRadius: '99px', background: form.isActive ? COLORS.brand : COLORS.divider, border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ position: 'absolute', top: '3px', left: form.isActive ? undefined : '3px', right: form.isActive ? '3px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }}/>
          </button>
        </div>
      </div>
    </form>
  )
}

export default function CourseManagementPage() {
  const [modalOpen,  setModal]   = useState(false)
  const [deleteOpen, setDelete]  = useState(false)
  const [selected,   setSelected] = useState<Course | null>(null)
  const [form, setForm] = useState<CourseFormState>(EMPTY_FORM)

  const { courses, isLoading, isError, refetch } = useAdminCourses()

  const createMutation = useCreateCourse(() => { setModal(false); setForm(EMPTY_FORM) })
  const updateMutation = useUpdateCourse(() => { setModal(false); setSelected(null) })
  const deleteMutation = useDeleteCourse(() => { setDelete(false); setSelected(null) })

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  function openCreate() {
    setSelected(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  function openEdit(c: Course) {
    setSelected(c)
    setForm({
      title: c.title,
      description: c.description,
      minSemester: String(c.eligibility?.minSemester ?? ''),
      minYear:     String(c.eligibility?.minYear ?? ''),
      hasTest:  c.hasTest,
      isActive: c.isActive,
    })
    setModal(true)
  }

  function handleToggleActive(c: Course) {
    updateMutation.mutate({ id: c.id, payload: { isActive: !c.isActive } })
  }

  function handleSubmit() {
    const payload: Partial<Course> = {
      title:       form.title,
      description: form.description,
      eligibility: {
        minSemester: Number(form.minSemester),
        minYear:     Number(form.minYear),
        courses:     selected?.eligibility?.courses ?? [],
      },
      hasTest:  form.hasTest,
      isActive: form.isActive,
    }
    if (selected) {
      updateMutation.mutate({ id: selected.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        .skeleton-pulse { animation: skeletonPulse 1.5s ease-in-out infinite; }

        .cm-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:768px){.cm-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1200px){.cm-grid{grid-template-columns:repeat(3,1fr);}}

        .cm-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);display:flex;flex-direction:column;overflow:hidden;}
        .cm-card-top{padding:18px 18px 14px;flex:1;}
        .cm-card-footer{padding:12px 18px;border-top:1px solid #f0f4f6;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}
      `}</style>

      <AdminPageShell
        title="Course Management"
        subtitle="Manage intern training courses and certifications"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={openCreate}>Add Course</AdminBtn>}
      >
        {isError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #fed7aa', marginBottom: '16px', flexWrap: 'wrap' }}>
            <AlertTriangle size={16} color="#ea580c"/>
            <span style={{ flex: 1, fontSize: FONT_SIZE.sm, color: '#c2410c' }}>Failed to load courses. Please try again.</span>
            <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '7px', background: '#ea580c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: FONT_WEIGHT.semibold }}>
              <RefreshCw size={12}/> Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="cm-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i}/>)}
          </div>
        ) : !isError && courses.length === 0 ? (
          <AdminEmptyState icon={<BookOpen size={22}/>} title="No courses yet" description="Create your first training course for interns"/>
        ) : (
          <div className="cm-grid" style={{ opacity: isMutating ? 0.65 : 1, transition: 'opacity 0.2s' }}>
            {courses.map(c => (
              <div key={c.id} className="cm-card" style={{ opacity: c.isActive ? 1 : 0.65 }}>
                <div className="cm-card-top">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '12px', background: COLORS.brandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.brand }}>
                      <BookOpen size={20} strokeWidth={1.8}/>
                    </div>
                    <StatusBadge status={c.isActive ? 'active' : 'inactive'}/>
                  </div>

                  <p style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.bold, color: COLORS.navy, margin: '0 0 6px', lineHeight: 1.3 }}>{c.title}</p>
                  <p style={{ fontSize: '12px', color: COLORS.muted, lineHeight: 1.5, margin: '0 0 12px' }}>{c.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ background: '#f0f4f6', color: COLORS.body, borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Video size={11}/> {(c.videos ?? []).length} videos
                    </span>
                    <span style={{ background: '#f0f4f6', color: COLORS.body, borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600 }}>
                      Sem {c.eligibility?.minSemester ?? '—'}+ / {c.eligibility?.minYear ?? '—'}+
                    </span>
                    {c.hasTest && (
                      <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Award size={11}/> Test included
                      </span>
                    )}
                  </div>
                </div>

                <div className="cm-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: COLORS.muted }}>{c.isActive ? 'Active' : 'Inactive'}</span>
                    <button
                      onClick={() => handleToggleActive(c)}
                      disabled={updateMutation.isPending}
                      style={{ width: '38px', height: '20px', borderRadius: '99px', border: 'none', background: c.isActive ? COLORS.brand : COLORS.divider, cursor: updateMutation.isPending ? 'not-allowed' : 'pointer', position: 'relative', flexShrink: 0 }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: c.isActive ? undefined : '2px', right: c.isActive ? '2px' : undefined, width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }}/>
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ padding: '5px 10px', borderRadius: '8px', border: `1px solid ${COLORS.divider}`, background: '#fff', cursor: 'pointer', color: COLORS.body, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ChevronRight size={13}/> View
                    </button>
                    <button onClick={() => openEdit(c)} style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: COLORS.brand }}>
                      <Pencil size={15} strokeWidth={1.8}/>
                    </button>
                    <button onClick={() => { setSelected(c); setDelete(true) }} style={{ padding: '5px', borderRadius: '7px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626' }}>
                      <Trash2 size={15} strokeWidth={1.8}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPageShell>

      <AdminFormModal
        open={modalOpen}
        onClose={() => { setModal(false); setForm(EMPTY_FORM) }}
        title={selected ? 'Edit Course' : 'Add Course'}
        size="md"
        footer={
          <>
            <AdminBtn variant="secondary" onClick={() => { setModal(false); setForm(EMPTY_FORM) }}>Cancel</AdminBtn>
            <AdminBtn onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Saving…' : selected ? 'Save Changes' : 'Add Course'}
            </AdminBtn>
          </>
        }
      >
        <CourseForm id="course-form" form={form} setForm={setForm}/>
      </AdminFormModal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => { setDelete(false); setSelected(null) }}
        onConfirm={() => selected && deleteMutation.mutate(selected.id)}
        loading={deleteMutation.isPending}
        variant="danger"
        title={`Delete "${selected?.title}"?`}
        description="This will permanently remove this course and all enrolled intern progress."
        confirmLabel="Delete Course"
      />
    </>
  )
}
