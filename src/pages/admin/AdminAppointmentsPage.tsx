/**
 * AdminAppointmentsPage — Appointment management with tabs, table/cards, confirm/cancel
 */
import { useState } from 'react'
import { CalendarDays, Search, Video, RotateCcw, X as XIcon, Eye } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'

type Appt = {
  id:string; patient:string; initials:string; type:string
  date:string; time:string; status:string
}
const ALL_APPTS: Appt[] = [
  { id:'1', patient:'Michael Vance', initials:'MV', type:'Diabetes Management Follow-up', date:'Oct 24, 2024', time:'09:30 AM', status:'confirmed'  },
  { id:'2', patient:'Anita Chen',    initials:'AC', type:'Sports Nutrition Planning',      date:'Oct 24, 2024', time:'11:00 AM', status:'pending'    },
  { id:'3', patient:'Ravi Sharma',   initials:'RS', type:'Thyroid Package Session',         date:'Oct 25, 2024', time:'02:00 PM', status:'confirmed'  },
  { id:'4', patient:'Priya Kapoor',  initials:'PK', type:'Weight Loss Consultation',        date:'Oct 25, 2024', time:'04:00 PM', status:'completed'  },
  { id:'5', patient:'John Doe',      initials:'JD', type:'Initial Consultation',            date:'Oct 26, 2024', time:'10:00 AM', status:'cancelled'  },
  { id:'6', patient:'Sarah Miller',  initials:'SM', type:'Monthly Follow-up',               date:'Oct 27, 2024', time:'03:30 PM', status:'rescheduled'},
]

const TABS = ['All','Confirmed','Pending','Completed','Cancelled']
const STATUS_LEFT: Record<string,string> = { confirmed:COLORS.brand, pending:'#f59e0b', completed:'#16a34a', cancelled:'#dc2626', rescheduled:'#9ab0bb' }

function Av({i}:{i:string}) {
  return (
    <div style={{width:'34px',height:'34px',minWidth:'34px',borderRadius:'50%',background:COLORS.brandLight,color:COLORS.brand,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:FONT_WEIGHT.semibold}}>
      {i}
    </div>
  )
}

export default function AdminAppointmentsPage() {
  const [tab,         setTab]    = useState('All')
  const [search,      setSearch] = useState('')
  const [confirmOpen, setConfirm]= useState(false)
  const [cancelOpen,  setCancel] = useState(false)
  const [selected,    setSel]    = useState<Appt|null>(null)

  const visible = ALL_APPTS.filter(a => {
    const matchTab = tab==='All' || a.status===tab.toLowerCase() || (tab==='Confirmed'&&a.status==='confirmed')
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <>
      <style>{`
        .aa-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
        .aa-tab{padding:6px 14px;border-radius:20px;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit;}

        .aa-filters{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
        .aa-search-wrap{flex:1;min-width:180px;max-width:300px;position:relative;display:flex;align-items:center;}
        .aa-search{width:100%;height:38px;padding:0 12px 0 34px;border:1px solid #e6edf0;border-radius:10px;background:#f7fafb;font-size:13px;color:#374955;outline:none;font-family:inherit;}

        .aa-table{width:100%;border-collapse:collapse;}
        .aa-table th{text-align:left;padding:9px 14px;font-size:11px;font-weight:600;color:#9ab0bb;text-transform:uppercase;letter-spacing:.5px;background:#f7fafb;border-bottom:1px solid #e6edf0;}
        .aa-table td{padding:10px 14px;font-size:13px;color:#374955;border-bottom:1px solid #f7fafb;vertical-align:middle;}
        .aa-table tr:last-child td{border-bottom:none;}
        .aa-table tr:hover td{background:#f7fafb;}

        .aa-desktop{display:none;}
        .aa-mobile{display:flex;flex-direction:column;gap:10px;}
        @media(min-width:768px){.aa-desktop{display:block;}.aa-mobile{display:none;}}
      `}</style>

      <AdminPageShell
        title="Appointments"
        subtitle="Manage all consultation appointments"
        actions={<AdminBtn icon={<CalendarDays size={15}/>}>New Appointment</AdminBtn>}
      >
        {/* Tabs */}
        <div className="aa-tabs">
          {TABS.map(t=>(
            <button key={t} className="aa-tab"
              style={{ background: tab===t ? COLORS.brand : COLORS.divider, color: tab===t ? '#fff' : COLORS.body }}
              onClick={()=>setTab(t)}
            >{t}</button>
          ))}
        </div>

        {/* Search */}
        <div className="aa-filters">
          <div className="aa-search-wrap">
            <Search size={15} style={{position:'absolute',left:'10px',color:COLORS.muted}}/>
            <input className="aa-search" placeholder="Search patient…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>

        {/* Table card */}
        <div style={{background:'#fff',borderRadius:'16px',boxShadow:SHADOW.card,border:`1px solid ${COLORS.divider}`,overflow:'hidden'}}>

          {/* Desktop */}
          <div className="aa-desktop">
            {visible.length===0
              ? <AdminEmptyState icon={<CalendarDays size={22}/>} title="No appointments" description="No appointments match your current filter"/>
              : (
                <div style={{overflowX:'auto'}}>
                  <table className="aa-table">
                    <thead>
                      <tr><th>Patient</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {visible.map(a=>(
                        <tr key={a.id}>
                          <td>
                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                              <Av i={a.initials}/>
                              <span style={{fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>{a.patient}</span>
                            </div>
                          </td>
                          <td style={{color:COLORS.muted}}>{a.type}</td>
                          <td>{a.date}</td>
                          <td>{a.time}</td>
                          <td><StatusBadge status={a.status}/></td>
                          <td>
                            <div style={{display:'flex',gap:'6px'}}>
                              <button title="View" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.muted}}><Eye size={15} strokeWidth={1.8}/></button>
                              {(a.status==='pending'||a.status==='confirmed') && (
                                <button title="Start Call" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.brand}}><Video size={15} strokeWidth={1.8}/></button>
                              )}
                              {a.status==='pending' && (
                                <button title="Confirm" onClick={()=>{setSel(a);setConfirm(true)}} style={{padding:'5px',borderRadius:'7px',border:'none',background:'#dcfce7',cursor:'pointer',color:'#16a34a',fontSize:'11px',fontWeight:600}}>Confirm</button>
                              )}
                              <button title="Reschedule" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:'#d97706'}}><RotateCcw size={15} strokeWidth={1.8}/></button>
                              {a.status!=='cancelled'&&a.status!=='completed' && (
                                <button title="Cancel" onClick={()=>{setSel(a);setCancel(true)}} style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:'#dc2626'}}><XIcon size={15} strokeWidth={1.8}/></button>
                              )}
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
          <div className="aa-mobile" style={{padding:visible.length?'12px':'0'}}>
            {visible.length===0
              ? <AdminEmptyState icon={<CalendarDays size={22}/>} title="No appointments" description="No appointments match your filter"/>
              : visible.map(a=>(
                <div key={a.id} style={{
                  padding:'12px 14px',borderRadius:'12px',background:'#f7fafb',
                  border:`1px solid ${COLORS.divider}`,
                  borderLeft:`3px solid ${STATUS_LEFT[a.status]??COLORS.divider}`,
                }}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',marginBottom:'6px',flexWrap:'wrap'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <Av i={a.initials}/>
                      <span style={{fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,fontSize:FONT_SIZE.sm}}>{a.patient}</span>
                    </div>
                    <StatusBadge status={a.status}/>
                  </div>
                  <p style={{margin:'0 0 2px',fontSize:'12px',color:COLORS.muted}}>{a.type}</p>
                  <p style={{margin:'0 0 8px',fontSize:'12px',color:COLORS.muted}}>{a.date} · {a.time}</p>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {a.status==='pending' && (
                      <button onClick={()=>{setSel(a);setConfirm(true)}} style={{padding:'5px 10px',borderRadius:'7px',border:'none',background:'#dcfce7',cursor:'pointer',fontSize:'12px',color:'#16a34a',fontWeight:600}}>Confirm</button>
                    )}
                    <button style={{padding:'5px 10px',borderRadius:'7px',border:`1px solid ${COLORS.divider}`,background:'#fff',cursor:'pointer',fontSize:'12px',color:COLORS.muted}}>Reschedule</button>
                    {a.status!=='cancelled'&&a.status!=='completed' && (
                      <button onClick={()=>{setSel(a);setCancel(true)}} style={{padding:'5px 10px',borderRadius:'7px',border:'none',background:'#fee2e2',cursor:'pointer',fontSize:'12px',color:'#dc2626'}}>Cancel</button>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </AdminPageShell>

      <ConfirmModal open={confirmOpen} onClose={()=>setConfirm(false)} onConfirm={()=>setConfirm(false)}
        variant="success" title="Confirm appointment?" description={`Confirm appointment for ${selected?.patient} on ${selected?.date} at ${selected?.time}.`}
        confirmLabel="Confirm Appointment"
      />
      <ConfirmModal open={cancelOpen} onClose={()=>setCancel(false)} onConfirm={()=>setCancel(false)}
        variant="danger" title="Cancel appointment?" description={`Cancel ${selected?.patient}'s appointment on ${selected?.date}? This will notify the patient.`}
        confirmLabel="Cancel Appointment"
      />
    </>
  )
}
