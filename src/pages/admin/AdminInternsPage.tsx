/**
 * AdminInternsPage — Intern management with stats, table/cards, approval, add/edit
 */
import { useState } from 'react'
import { GraduationCap, Search, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatCard        from '@/components/admin/StatCard'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'

type Intern = {
  id:string; initials:string; name:string; email:string; phone:string
  university:string; specialization:string; semester:number; year:number
  status:string; progress:number
}
const INTERNS: Intern[] = [
  { id:'1', initials:'NA', name:'Neha Agarwal',  email:'neha@uni.edu',  phone:'+91 91234 56789', university:'AIIMS Delhi',       specialization:'M.Sc Dietetics',            semester:4, year:2023, status:'approved', progress:72 },
  { id:'2', initials:'RS', name:'Rahul Sharma',  email:'rahul@uni.edu', phone:'+91 81234 56789', university:'Manipal College',    specialization:'B.Sc Nutrition',            semester:6, year:2022, status:'approved', progress:90 },
  { id:'3', initials:'PD', name:'Pooja Das',     email:'pooja@uni.edu', phone:'+91 71234 56789', university:'BHU Varanasi',       specialization:'PG Diploma in Dietetics',   semester:2, year:2024, status:'pending',  progress:15 },
  { id:'4', initials:'AM', name:'Arjun Mehta',   email:'arjun@uni.edu', phone:'+91 61234 56789', university:'Symbiosis Pune',     specialization:'B.Sc Food Science',         semester:3, year:2023, status:'pending',  progress:0  },
  { id:'5', initials:'SK', name:'Simran Kaur',   email:'simran@uni.edu',phone:'+91 51234 56789', university:'Christ University',  specialization:'M.Sc Dietetics',            semester:1, year:2025, status:'rejected', progress:0  },
]

const SPEC_OPTS = ['B.Sc Nutrition','M.Sc Dietetics','PG Diploma in Dietetics','B.Sc Food Science','Other'].map(s=>({value:s,label:s}))

function Av({ initials }:{initials:string}) {
  return (
    <div style={{
      width:'36px',height:'36px',minWidth:'36px',borderRadius:'50%',
      background: COLORS.brandLight,color: COLORS.brand,
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:'12px',fontWeight: FONT_WEIGHT.semibold,
    }}>{initials}</div>
  )
}

function ProgressBar({ value }:{value:number}) {
  return (
    <div style={{ width:'100px', height:'6px', background: COLORS.divider, borderRadius:'99px', overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${value}%`, background: value>=75 ? '#16a34a' : value>=40 ? COLORS.brand : '#f59e0b', borderRadius:'99px' }} />
    </div>
  )
}

function InternForm({ id }:{id:string}) {
  return (
    <form id={id} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="if-name"  label="Full Name"          placeholder="Jane Intern" />
        <FormField id="if-email" label="Email"  type="email" placeholder="jane@uni.edu" />
        <FormField id="if-phone" label="Phone"  type="tel"   placeholder="+91 000-000-0000" />
        <FormField id="if-uni"   label="University / Institute" placeholder="eg. AIIMS Delhi" />
        <SelectField id="if-spec" label="Specialization" options={SPEC_OPTS} value="" onChange={()=>{}} placeholder="Select" />
        <FormField id="if-sem"  label="Semester" type="number" placeholder="4" />
        <FormField id="if-year" label="Year"     type="number" placeholder="2024" />
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy }}>Approved</label>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'42px',height:'22px',borderRadius:'99px',background: COLORS.brand,position:'relative',cursor:'pointer' }}>
              <div style={{ position:'absolute',top:'3px',right:'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff' }} />
            </div>
            <span style={{ fontSize: FONT_SIZE.sm, color: COLORS.muted }}>Yes</span>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function AdminInternsPage() {
  const [search,     setSearch]  = useState('')
  const [statusFilter, setStatus]= useState('All')
  const [modalOpen,  setModal]   = useState(false)
  const [deleteOpen, setDelete]  = useState(false)
  const [selected,   setSelected]= useState<Intern|null>(null)

  const total    = INTERNS.length
  const approved = INTERNS.filter(i=>i.status==='approved').length
  const pending  = INTERNS.filter(i=>i.status==='pending').length
  const completed= INTERNS.filter(i=>i.progress===100).length

  const filtered = INTERNS.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.university.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter==='All' || i.status===statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  return (
    <>
      <style>{`
        .it-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
        @media(min-width:1024px){ .it-stat-grid{grid-template-columns:repeat(4,1fr);} }

        .it-table { width:100%; border-collapse:collapse; }
        .it-table th { text-align:left;padding:9px 14px;font-size:11px;font-weight:600;color:#9ab0bb;text-transform:uppercase;letter-spacing:.5px;background:#f7fafb;border-bottom:1px solid #e6edf0; }
        .it-table td { padding:10px 14px;font-size:13px;color:#374955;border-bottom:1px solid #f7fafb;vertical-align:middle; }
        .it-table tr:last-child td{border-bottom:none;}
        .it-table tr:hover td{background:#f7fafb;}

        .it-desktop{display:none;}
        .it-mobile{display:flex;flex-direction:column;gap:10px;}
        @media(min-width:768px){.it-desktop{display:block;}.it-mobile{display:none;}}

        .it-filters{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
        .it-search-wrap{flex:1;min-width:180px;max-width:300px;position:relative;display:flex;align-items:center;}
        .it-search{width:100%;height:38px;padding:0 12px 0 34px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;font-family:inherit;}
        .it-select{height:38px;padding:0 28px 0 12px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;cursor:pointer;font-family:inherit;appearance:none;}
      `}</style>

      <AdminPageShell
        title="Intern Management"
        subtitle="Manage internship enrolments and course progress"
        actions={<AdminBtn icon={<GraduationCap size={15}/>} onClick={()=>{setSelected(null);setModal(true)}}>Add Intern</AdminBtn>}
      >
        {/* Stats */}
        <div className="it-stat-grid">
          <StatCard icon={<GraduationCap size={20} strokeWidth={1.8}/>} label="Total Interns"    value={total}    />
          <StatCard icon={<CheckCircle2  size={20} strokeWidth={1.8}/>} label="Approved"         value={approved} accentColor="#16a34a" />
          <StatCard icon={<CheckCircle2  size={20} strokeWidth={1.8}/>} label="Pending Approval" value={pending}  accentColor="#d97706" />
          <StatCard icon={<GraduationCap size={20} strokeWidth={1.8}/>} label="Completed Courses" value={completed} />
        </div>

        {/* Filters */}
        <div className="it-filters">
          <div className="it-search-wrap">
            <Search size={15} style={{position:'absolute',left:'10px',color:COLORS.muted}}/>
            <input className="it-search" placeholder="Search interns…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="it-select" value={statusFilter} onChange={e=>setStatus(e.target.value)}>
            {['All','Approved','Pending','Rejected'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table card */}
        <div style={{background:'#fff',borderRadius:'16px',boxShadow:SHADOW.card,border:`1px solid ${COLORS.divider}`,overflow:'hidden'}}>

          {/* Desktop */}
          <div className="it-desktop">
            {filtered.length===0
              ? <AdminEmptyState icon={<GraduationCap size={22}/>} title="No interns found" description="Try adjusting your search or filters"/>
              : (
                <div style={{overflowX:'auto'}}>
                  <table className="it-table">
                    <thead>
                      <tr><th>Intern</th><th>University</th><th>Specialization</th><th>Sem / Yr</th><th>Status</th><th>Progress</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(i=>(
                        <tr key={i.id}>
                          <td>
                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                              <Av initials={i.initials}/>
                              <div>
                                <p style={{margin:0,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,fontSize:FONT_SIZE.sm}}>{i.name}</p>
                                <p style={{margin:0,fontSize:'11px',color:COLORS.muted}}>{i.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{color:COLORS.muted}}>{i.university}</td>
                          <td>{i.specialization}</td>
                          <td style={{color:COLORS.muted}}>Sem {i.semester} / {i.year}</td>
                          <td><StatusBadge status={i.status}/></td>
                          <td>
                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                              <ProgressBar value={i.progress}/>
                              <span style={{fontSize:'11px',color:COLORS.muted,minWidth:'30px'}}>{i.progress}%</span>
                            </div>
                          </td>
                          <td>
                            <div style={{display:'flex',gap:'6px'}}>
                              <button onClick={()=>{setSelected(i);setModal(true)}} style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.brand}}>
                                <Pencil size={15} strokeWidth={1.8}/>
                              </button>
                              <button onClick={()=>{setSelected(i);setDelete(true)}} style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:'#dc2626'}}>
                                <Trash2 size={15} strokeWidth={1.8}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>

          {/* Mobile */}
          <div className="it-mobile" style={{padding:filtered.length?'12px':'0'}}>
            {filtered.length===0
              ? <AdminEmptyState icon={<GraduationCap size={22}/>} title="No interns found" description="Try adjusting your search"/>
              : filtered.map(i=>(
                <div key={i.id} style={{padding:'12px 14px',borderRadius:'12px',background:'#f7fafb',border:`1px solid ${COLORS.divider}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                    <Av initials={i.initials}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',flexWrap:'wrap'}}>
                        <span style={{fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,fontSize:FONT_SIZE.sm}}>{i.name}</span>
                        <StatusBadge status={i.status}/>
                      </div>
                      <p style={{margin:'2px 0 0',fontSize:'12px',color:COLORS.muted}}>{i.university}</p>
                    </div>
                  </div>
                  <p style={{margin:'0 0 6px',fontSize:'12px',color:COLORS.muted}}>{i.specialization} · Sem {i.semester}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                    <span style={{fontSize:'11px',color:COLORS.muted}}>Progress:</span>
                    <ProgressBar value={i.progress}/>
                    <span style={{fontSize:'11px',color:COLORS.muted}}>{i.progress}%</span>
                  </div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={()=>{setSelected(i);setModal(true)}} style={{padding:'5px 10px',borderRadius:'7px',border:`1px solid ${COLORS.divider}`,background:'#fff',cursor:'pointer',fontSize:'12px',color:COLORS.brand}}>Edit</button>
                    <button onClick={()=>{setSelected(i);setDelete(true)}} style={{padding:'5px 10px',borderRadius:'7px',border:'none',background:'#fee2e2',cursor:'pointer',fontSize:'12px',color:'#dc2626'}}>Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </AdminPageShell>

      <AdminFormModal open={modalOpen} onClose={()=>setModal(false)} title={selected?'Edit Intern':'Add Intern'} size="md"
        footer={<><AdminBtn variant="secondary" onClick={()=>setModal(false)}>Cancel</AdminBtn><AdminBtn>{selected?'Save Changes':'Add Intern'}</AdminBtn></>}
      >
        <InternForm id="intern-form"/>
      </AdminFormModal>

      <ConfirmModal open={deleteOpen} onClose={()=>setDelete(false)} onConfirm={()=>setDelete(false)}
        variant="danger" title={`Remove ${selected?.name}?`}
        description="This will permanently remove the intern and their course progress."
        confirmLabel="Remove Intern"
      />
    </>
  )
}
