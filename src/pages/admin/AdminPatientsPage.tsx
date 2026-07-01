/**
 * AdminPatientsPage — Patient management with search, filters, table/cards, add/edit modal
 */
import { useState } from 'react'
import { UserPlus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT, SHADOW } from '@/config/theme'

// ─── Mock data ────────────────────────────────────────────────────────────────
type Patient = {
  id: string; initials: string; name: string; email: string; phone: string
  bloodGroup: string; status: string; joined: string; gender: string; age: number
}
const PATIENTS: Patient[] = [
  { id:'1', initials:'SM', name:'Sarah Miller',  email:'sarah@email.com',  phone:'+91 98765 43210', bloodGroup:'A+',   status:'active',   joined:'Jan 12, 2024', gender:'Female', age:34 },
  { id:'2', initials:'JD', name:'John Doe',       email:'john@email.com',   phone:'+91 87654 32109', bloodGroup:'O+',   status:'active',   joined:'Feb 28, 2024', gender:'Male',   age:42 },
  { id:'3', initials:'EK', name:'Elena Kostic',   email:'elena@email.com',  phone:'+91 76543 21098', bloodGroup:'B-',   status:'inactive', joined:'Mar 15, 2024', gender:'Female', age:28 },
  { id:'4', initials:'AR', name:'Arun Reddy',     email:'arun@email.com',   phone:'+91 65432 10987', bloodGroup:'AB+',  status:'pending',  joined:'Apr 02, 2024', gender:'Male',   age:55 },
  { id:'5', initials:'PK', name:'Priya Kapoor',   email:'priya@email.com',  phone:'+91 54321 09876', bloodGroup:'A-',   status:'active',   joined:'May 20, 2024', gender:'Female', age:31 },
  { id:'6', initials:'MV', name:'Michael Vance',  email:'michael@email.com',phone:'+91 43210 98765', bloodGroup:'O-',   status:'active',   joined:'Jun 08, 2024', gender:'Male',   age:47 },
]

const GENDER_OPTS = ['Male','Female','Other','Prefer Not To Say'].map(g=>({value:g,label:g}))
const BLOOD_OPTS  = ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=>({value:b,label:b}))
const STATUS_OPTS = ['All','Active','Inactive','Pending'].map(s=>({value:s,label:s}))

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Av({ initials }: { initials: string }) {
  return (
    <div style={{
      width:'36px', height:'36px', minWidth:'36px', borderRadius:'50%',
      background: COLORS.brandLight, color: COLORS.brand,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'12px', fontWeight: FONT_WEIGHT.semibold,
    }}>{initials}</div>
  )
}

// ─── Row actions ──────────────────────────────────────────────────────────────
function RowActions({ onEdit, onDelete }: { onEdit:()=>void; onDelete:()=>void }) {
  return (
    <div style={{ display:'flex', gap:'6px' }}>
      <button title="View" style={{ padding:'5px', borderRadius:'7px', border:'none', background:'transparent', cursor:'pointer', color: COLORS.muted }}>
        <Eye size={15} strokeWidth={1.8} />
      </button>
      <button onClick={onEdit} title="Edit" style={{ padding:'5px', borderRadius:'7px', border:'none', background:'transparent', cursor:'pointer', color: COLORS.brand }}>
        <Pencil size={15} strokeWidth={1.8} />
      </button>
      <button onClick={onDelete} title="Delete" style={{ padding:'5px', borderRadius:'7px', border:'none', background:'transparent', cursor:'pointer', color:'#dc2626' }}>
        <Trash2 size={15} strokeWidth={1.8} />
      </button>
    </div>
  )
}

// ─── Patient form ─────────────────────────────────────────────────────────────
function PatientForm({ id }: { id: string }) {
  return (
    <form id={id} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="pf-name"  label="Full Name"     placeholder="Jane Doe"          />
        <FormField id="pf-email" label="Email"         type="email" placeholder="jane@email.com" />
        <FormField id="pf-phone" label="Phone Number"  type="tel"   placeholder="+91 000-000-0000" />
        <FormField id="pf-wapp"  label="WhatsApp"      type="tel"   placeholder="+91 000-000-0000" />
        <SelectField id="pf-gender" label="Gender"     options={GENDER_OPTS} value="" onChange={()=>{}} placeholder="Select gender" />
        <SelectField id="pf-blood"  label="Blood Group" options={BLOOD_OPTS}  value="" onChange={()=>{}} placeholder="Select" />
        <FormField id="pf-age"    label="Age"    type="number" placeholder="30" />
        <FormField id="pf-height" label="Height (cm)" type="number" placeholder="165" />
        <FormField id="pf-weight" label="Weight (kg)" type="number" placeholder="65" />
        <div className="sm:col-span-2">
          <FormField id="pf-loc" label="Location" placeholder="eg. Mumbai, India" />
        </div>
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPatientsPage() {
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatus]   = useState('All')
  const [modalOpen,  setModal]      = useState(false)
  const [deleteOpen, setDelete]     = useState(false)
  const [selected,   setSelected]   = useState<Patient | null>(null)

  const filtered = PATIENTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  return (
    <>
      <style>{`
        /* Patient table */
        .pt-table { width:100%; border-collapse:collapse; }
        .pt-table th {
          text-align:left; padding:9px 14px;
          font-size:11px; font-weight:600; color:#9ab0bb;
          text-transform:uppercase; letter-spacing:0.5px;
          background:#f7fafb; border-bottom:1px solid #e6edf0;
        }
        .pt-table td {
          padding:10px 14px; font-size:13px; color:#374955;
          border-bottom:1px solid #f7fafb; vertical-align:middle;
        }
        .pt-table tr:last-child td { border-bottom:none; }
        .pt-table tr:hover td { background:#f7fafb; }
        .pt-table-wrap { overflow-x:auto; border-radius:0 0 14px 14px; }

        /* Desktop/Mobile toggle */
        .pt-desktop { display:none; }
        .pt-mobile  { display:flex; flex-direction:column; gap:10px; }
        @media (min-width:768px) {
          .pt-desktop { display:block; }
          .pt-mobile  { display:none; }
        }

        /* Filters */
        .pt-filters {
          display:flex; align-items:center; gap:10px; flex-wrap:wrap;
          margin-bottom:16px;
        }
        .pt-search-wrap {
          flex:1; min-width:180px; max-width:320px;
          position:relative; display:flex; align-items:center;
        }
        .pt-search {
          width:100%; height:38px; padding:0 12px 0 34px;
          border:1px solid #e6edf0; border-radius:10px;
          background:#f7fafb; font-size:13px; color:#374955;
          outline:none; font-family:inherit;
        }
        .pt-select {
          height:38px; padding:0 28px 0 12px;
          border:1px solid #e6edf0; border-radius:10px;
          background:#f7fafb; font-size:13px; color:#374955;
          outline:none; cursor:pointer; font-family:inherit; appearance:none;
        }
      `}</style>

      <AdminPageShell
        title="Patient Management"
        subtitle="Manage all registered patients"
        actions={
          <AdminBtn icon={<UserPlus size={15} />} onClick={() => { setSelected(null); setModal(true) }}>
            Add Patient
          </AdminBtn>
        }
      >
        {/* Filters */}
        <div className="pt-filters">
          <div className="pt-search-wrap">
            <Search size={15} style={{ position:'absolute', left:'10px', color: COLORS.muted }} />
            <input className="pt-search" placeholder="Search patients…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="pt-select" value={statusFilter} onChange={e=>setStatus(e.target.value)}>
            {STATUS_OPTS.map(o=><option key={o.value}>{o.label}</option>)}
          </select>
          <select className="pt-select">
            <option>All Blood Groups</option>
            {BLOOD_OPTS.map(o=><option key={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Card */}
        <div style={{ background:'#fff', borderRadius:'16px', boxShadow: SHADOW.card, border:`1px solid ${COLORS.divider}`, overflow:'hidden' }}>

          {/* Desktop table */}
          <div className="pt-desktop">
            {filtered.length === 0
              ? <AdminEmptyState icon={<UserPlus size={22} />} title="No patients found" description="Try adjusting your search or filters" />
              : (
                <div className="pt-table-wrap">
                  <table className="pt-table">
                    <thead>
                      <tr>
                        <th>Patient</th><th>Email</th><th>Phone</th>
                        <th>Blood Grp</th><th>Status</th><th>Joined</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                              <Av initials={p.initials} />
                              <div>
                                <p style={{ margin:0, fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>{p.name}</p>
                                <p style={{ margin:0, fontSize:'11px', color: COLORS.muted }}>{p.gender}, {p.age}y</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: COLORS.muted }}>{p.email}</td>
                          <td>{p.phone}</td>
                          <td>
                            <span style={{ background: COLORS.brandLight, color: COLORS.brand, borderRadius:'6px', padding:'2px 8px', fontSize:'12px', fontWeight:600 }}>
                              {p.bloodGroup}
                            </span>
                          </td>
                          <td><StatusBadge status={p.status} /></td>
                          <td style={{ color: COLORS.muted, fontSize:'12px' }}>{p.joined}</td>
                          <td>
                            <RowActions
                              onEdit={() => { setSelected(p); setModal(true) }}
                              onDelete={() => { setSelected(p); setDelete(true) }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>

          {/* Mobile cards */}
          <div className="pt-mobile" style={{ padding: filtered.length ? '12px' : '0' }}>
            {filtered.length === 0
              ? <AdminEmptyState icon={<UserPlus size={22} />} title="No patients found" description="Try adjusting your search" />
              : filtered.map(p => (
                <div key={p.id} style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'12px 14px', borderRadius:'12px', background:'#f7fafb',
                  border:`1px solid ${COLORS.divider}`,
                }}>
                  <Av initials={p.initials} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontWeight: FONT_WEIGHT.semibold, color: COLORS.navy, fontSize: FONT_SIZE.sm }}>{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p style={{ margin:'2px 0 0', fontSize:'12px', color: COLORS.muted }}>{p.phone} · {p.bloodGroup}</p>
                    <p style={{ margin:'1px 0 6px', fontSize:'12px', color: COLORS.muted }}>Joined {p.joined}</p>
                    <RowActions
                      onEdit={() => { setSelected(p); setModal(true) }}
                      onDelete={() => { setSelected(p); setDelete(true) }}
                    />
                  </div>
                </div>
              ))
            }
          </div>

          {/* Pagination (desktop) */}
          {filtered.length > 0 && (
            <div style={{
              padding:'12px 16px', borderTop:`1px solid ${COLORS.divider}`,
              display:'flex', alignItems:'center', justifyContent:'space-between',
              flexWrap:'wrap', gap:'8px',
            }}>
              <span style={{ fontSize:'12px', color: COLORS.muted }}>Showing {filtered.length} of {PATIENTS.length} patients</span>
              <div style={{ display:'flex', gap:'6px' }}>
                <button style={{ padding:'5px 12px', borderRadius:'8px', border:`1px solid ${COLORS.divider}`, background:'#fff', fontSize:'12px', cursor:'pointer', color: COLORS.muted }}>Prev</button>
                <button style={{ padding:'5px 12px', borderRadius:'8px', border:'none', background: COLORS.brand, color:'#fff', fontSize:'12px', cursor:'pointer' }}>1</button>
                <button style={{ padding:'5px 12px', borderRadius:'8px', border:`1px solid ${COLORS.divider}`, background:'#fff', fontSize:'12px', cursor:'pointer', color: COLORS.muted }}>Next</button>
              </div>
            </div>
          )}
        </div>
      </AdminPageShell>

      {/* Add/Edit Modal */}
      <AdminFormModal
        open={modalOpen}
        onClose={() => setModal(false)}
        title={selected ? 'Edit Patient' : 'Add New Patient'}
        subtitle="Fill in the patient's details below"
        size="lg"
        footer={
          <>
            <AdminBtn variant="secondary" onClick={() => setModal(false)}>Cancel</AdminBtn>
            <AdminBtn>{selected ? 'Save Changes' : 'Add Patient'}</AdminBtn>
          </>
        }
      >
        <PatientForm id="patient-form" />
      </AdminFormModal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDelete(false)}
        onConfirm={() => setDelete(false)}
        variant="danger"
        title={`Delete ${selected?.name}?`}
        description="This will permanently remove the patient and all associated data. This action cannot be undone."
        confirmLabel="Delete Patient"
      />
    </>
  )
}
