/**
 * CourseManagementPage — Intern training course management
 */
import { useState } from 'react'
import { BookOpen, Plus, Pencil, Trash2, Video, Award, ChevronRight } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

type Course = {
  id:string; title:string; description:string;
  minSemester:number; minYear:number; videoCount:number
  hasTest:boolean; isActive:boolean; enrolledCount:number
}
const MOCK: Course[] = [
  { id:'1', title:'Clinical Nutrition Fundamentals', description:'Core principles of clinical nutrition, macronutrients, and evidence-based dietary guidelines for healthcare settings.', minSemester:1, minYear:2023, videoCount:12, hasTest:true,  isActive:true,  enrolledCount:18 },
  { id:'2', title:'Therapeutic Diets & Disease Management', description:'Diet planning for chronic conditions including diabetes, hypertension, renal disease, and cardiovascular disorders.', minSemester:3, minYear:2023, videoCount:18, hasTest:true,  isActive:true,  enrolledCount:11 },
  { id:'3', title:'Pediatric Nutrition',              description:'Nutritional requirements from infancy through adolescence, including growth monitoring and special needs.',              minSemester:4, minYear:2022, videoCount:9,  hasTest:false, isActive:true,  enrolledCount:6  },
  { id:'4', title:'Sports Nutrition & Performance',  description:'Nutritional strategies for athletic performance, recovery, body composition, and supplementation guidelines.',           minSemester:5, minYear:2022, videoCount:14, hasTest:true,  isActive:false, enrolledCount:0  },
]

function CourseForm({id}:{id:string}) {
  return (
    <form id={id} className="flex flex-col gap-4">
      <FormField id="c-title" label="Course Title" placeholder="eg. Clinical Nutrition Fundamentals"/>
      <div>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Description</label>
        <textarea rows={3} placeholder="Describe this course…"
          style={{width:'100%',borderRadius:'10px',border:`1px solid ${COLORS.inputBorder}`,background:COLORS.inputBg,padding:'10px 12px',fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
        />
      </div>
      <div>
        <p style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,marginBottom:'8px'}}>Eligibility Criteria</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField id="c-sem"  label="Min Semester" type="number" placeholder="3"/>
          <FormField id="c-year" label="Min Year"     type="number" placeholder="2022"/>
        </div>
      </div>
      <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>Has Final Test</label>
          <div style={{width:'42px',height:'22px',borderRadius:'99px',background:COLORS.brand,position:'relative',cursor:'pointer'}}>
            <div style={{position:'absolute',top:'3px',right:'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>Active</label>
          <div style={{width:'42px',height:'22px',borderRadius:'99px',background:COLORS.brand,position:'relative',cursor:'pointer'}}>
            <div style={{position:'absolute',top:'3px',right:'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>(MOCK)
  const [modalOpen, setModal] = useState(false)
  const [deleteOpen,setDelete]= useState(false)
  const [selected, setSelected] = useState<Course|null>(null)

  const toggleActive = (id:string) => setCourses(c=>c.map(course=>course.id===id?{...course,isActive:!course.isActive}:course))

  return (
    <>
      <style>{`
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
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={()=>{setSelected(null);setModal(true)}}>Add Course</AdminBtn>}
      >
        {courses.length===0
          ? <AdminEmptyState icon={<BookOpen size={22}/>} title="No courses yet" description="Create your first training course for interns"/>
          : (
            <div className="cm-grid">
              {courses.map(c=>(
                <div key={c.id} className="cm-card" style={{opacity:c.isActive?1:0.65}}>
                  <div className="cm-card-top">
                    {/* Header */}
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'8px',marginBottom:'10px'}}>
                      <div style={{width:'42px',height:'42px',minWidth:'42px',borderRadius:'12px',background:COLORS.brandLight,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS.brand}}>
                        <BookOpen size={20} strokeWidth={1.8}/>
                      </div>
                      <StatusBadge status={c.isActive?'active':'inactive'}/>
                    </div>

                    <p style={{fontSize:FONT_SIZE.base,fontWeight:FONT_WEIGHT.bold,color:COLORS.navy,margin:'0 0 6px',lineHeight:1.3}}>{c.title}</p>
                    <p style={{fontSize:'12px',color:COLORS.muted,lineHeight:1.5,margin:'0 0 12px'}}>{c.description}</p>

                    {/* Meta pills */}
                    <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'10px'}}>
                      <span style={{background:'#f0f4f6',color:COLORS.body,borderRadius:'6px',padding:'3px 8px',fontSize:'11px',fontWeight:600,display:'flex',alignItems:'center',gap:'3px'}}>
                        <Video size={11}/> {c.videoCount} videos
                      </span>
                      <span style={{background:'#f0f4f6',color:COLORS.body,borderRadius:'6px',padding:'3px 8px',fontSize:'11px',fontWeight:600}}>
                        Sem {c.minSemester}+ / {c.minYear}+
                      </span>
                      {c.hasTest && (
                        <span style={{background:'#fef3c7',color:'#d97706',borderRadius:'6px',padding:'3px 8px',fontSize:'11px',fontWeight:600,display:'flex',alignItems:'center',gap:'3px'}}>
                          <Award size={11}/> Test included
                        </span>
                      )}
                    </div>

                    {/* Enrolled count */}
                    <p style={{fontSize:'12px',color:COLORS.muted,margin:0}}>
                      <span style={{fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>{c.enrolledCount}</span> interns enrolled
                    </p>
                  </div>

                  <div className="cm-card-footer">
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={{fontSize:'12px',color:COLORS.muted}}>{c.isActive?'Active':'Inactive'}</span>
                      <button onClick={()=>toggleActive(c.id)} style={{width:'38px',height:'20px',borderRadius:'99px',border:'none',background:c.isActive?COLORS.brand:COLORS.divider,cursor:'pointer',position:'relative',flexShrink:0}}>
                        <div style={{position:'absolute',top:'2px',left:c.isActive?undefined:'2px',right:c.isActive?'2px':undefined,width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
                      </button>
                    </div>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button style={{padding:'5px 10px',borderRadius:'8px',border:`1px solid ${COLORS.divider}`,background:'#fff',cursor:'pointer',color:COLORS.body,fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'3px'}}>
                        <ChevronRight size={13}/> View
                      </button>
                      <button onClick={()=>{setSelected(c);setModal(true)}} style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.brand}}>
                        <Pencil size={15} strokeWidth={1.8}/>
                      </button>
                      <button onClick={()=>{setSelected(c);setDelete(true)}} style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:'#dc2626'}}>
                        <Trash2 size={15} strokeWidth={1.8}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </AdminPageShell>

      <AdminFormModal open={modalOpen} onClose={()=>setModal(false)} title={selected?'Edit Course':'Add Course'} size="md"
        footer={<><AdminBtn variant="secondary" onClick={()=>setModal(false)}>Cancel</AdminBtn><AdminBtn>{selected?'Save Changes':'Add Course'}</AdminBtn></>}
      >
        <CourseForm id="course-form"/>
      </AdminFormModal>

      <ConfirmModal open={deleteOpen} onClose={()=>setDelete(false)} onConfirm={()=>setDelete(false)}
        variant="danger" title={`Delete "${selected?.title}"?`}
        description="This will permanently remove this course and all enrolled intern progress."
        confirmLabel="Delete Course"
      />
    </>
  )
}
