/**
 * ServicesManagementPage — Yoga, Zumba, Blood Test services CRUD
 */
import { useState } from 'react'
import { Plus, Pencil, Trash2, PersonStanding, Music, Droplets } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

type Service = { id:string; name:string; type:string; description:string; price:number; slots:string[]; isActive:boolean }
const MOCK: Service[] = [
  { id:'1', name:'Morning Yoga',          type:'yoga',       description:'Therapeutic yoga sessions focused on flexibility, breathing, and mental wellness.', price:799,  slots:['7:00 AM','8:00 AM','9:00 AM','6:00 PM'], isActive:true  },
  { id:'2', name:'Zumba Fitness',         type:'zumba',      description:'High-energy dance fitness classes for weight loss and cardiovascular health.',        price:649,  slots:['8:00 AM','10:00 AM','5:00 PM','7:00 PM'], isActive:true  },
  { id:'3', name:'Blood Test (At Home)', type:'blood_test', description:'Comprehensive blood panel with doorstep sample collection and doctor review.',        price:1299, slots:['9:00 AM','11:00 AM','2:00 PM','4:00 PM'], isActive:true  },
  { id:'4', name:'Evening Yoga',          type:'yoga',       description:'Wind-down yoga sessions for stress relief and better sleep quality.',                  price:699,  slots:['6:00 PM','7:00 PM','8:00 PM'],           isActive:false },
]

const TYPE_OPTS = [{value:'yoga',label:'Yoga'},{value:'zumba',label:'Zumba'},{value:'blood_test',label:'Blood Test'}]
const TYPE_ICONS: Record<string, React.ReactElement> = {
  yoga:       <PersonStanding size={24} strokeWidth={1.8}/>,
  zumba:      <Music          size={24} strokeWidth={1.8}/>,
  blood_test: <Droplets       size={24} strokeWidth={1.8}/>,
}
const TYPE_LABELS: Record<string,string> = {yoga:'Yoga',zumba:'Zumba',blood_test:'Blood Test'}
const TYPE_COLORS: Record<string,{bg:string;text:string}> = {
  yoga:       {bg:'#dcfce7',text:'#16a34a'},
  zumba:      {bg:'#fef3c7',text:'#d97706'},
  blood_test: {bg:'#fee2e2',text:'#dc2626'},
}

function SlotsInput({ initialSlots }:{initialSlots?:string[]}) {
  const [slots, setSlots] = useState<string[]>(initialSlots??[])
  const [input, setInput] = useState('')
  const add = () => { if(input.trim()){setSlots(s=>[...s,input.trim()]);setInput('')} }
  const remove = (i:number) => setSlots(s=>s.filter((_,idx)=>idx!==i))
  return (
    <div>
      <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Available Slots</label>
      <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}}
          placeholder="eg. 9:00 AM" style={{flex:1,height:'38px',padding:'0 12px',border:`1px solid ${COLORS.inputBorder}`,borderRadius:'10px',background:COLORS.inputBg,fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',fontFamily:'inherit'}}/>
        <button type="button" onClick={add} style={{padding:'0 14px',borderRadius:'10px',background:COLORS.brand,border:'none',color:'#fff',cursor:'pointer',fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,fontFamily:'inherit'}}>Add</button>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
        {slots.map((s,i)=>(
          <span key={i} style={{display:'inline-flex',alignItems:'center',gap:'4px',background:COLORS.brandLight,color:COLORS.brand,padding:'4px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:600}}>
            {s}
            <button type="button" onClick={()=>remove(i)} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex',color:COLORS.brand,fontSize:'12px',lineHeight:1}}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

function ServiceForm({id, svc}:{id:string; svc?:Service|null}) {
  return (
    <form id={id} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="svc-name" label="Service Name" placeholder="eg. Morning Yoga" defaultValue={svc?.name}/>
        <SelectField id="svc-type" label="Type" options={TYPE_OPTS} value={svc?.type??''} onChange={()=>{}} placeholder="Select type"/>
        <div className="sm:col-span-2">
          <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Description</label>
          <textarea rows={2} defaultValue={svc?.description} placeholder="Describe the service…"
            style={{width:'100%',borderRadius:'10px',border:`1px solid ${COLORS.inputBorder}`,background:COLORS.inputBg,padding:'10px 12px',fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
          />
        </div>
        <FormField id="svc-price" label="Price per Session (₹)" type="number" placeholder="799" defaultValue={svc?.price}/>
      </div>
      <SlotsInput initialSlots={svc?.slots}/>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>Active</label>
        <div style={{width:'42px',height:'22px',borderRadius:'99px',background:svc?.isActive!==false?COLORS.brand:COLORS.divider,position:'relative',cursor:'pointer'}}>
          <div style={{position:'absolute',top:'3px',left:svc?.isActive!==false?undefined:'3px',right:svc?.isActive!==false?'3px':undefined,width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
        </div>
      </div>
    </form>
  )
}

export default function ServicesManagementPage() {
  const [services, setSvcs] = useState<Service[]>(MOCK)
  const [modalOpen, setModal] = useState(false)
  const [deleteOpen,setDelete]= useState(false)
  const [selected, setSelected] = useState<Service|null>(null)

  const toggleActive = (id:string) => setSvcs(s=>s.map(svc=>svc.id===id?{...svc,isActive:!svc.isActive}:svc))

  return (
    <>
      <style>{`
        .svc-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.svc-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.svc-grid{grid-template-columns:repeat(3,1fr);}}

        .svc-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);padding:18px;display:flex;flex-direction:column;gap:12px;}
      `}</style>

      <AdminPageShell
        title="Services"
        subtitle="Manage yoga, zumba, and blood test services"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={()=>{setSelected(null);setModal(true)}}>Add Service</AdminBtn>}
      >
        {services.length===0
          ? <AdminEmptyState icon={<PersonStanding size={22}/>} title="No services yet" description="Add your first service"/>
          : (
            <div className="svc-grid">
              {services.map(svc=>{
                const cc = TYPE_COLORS[svc.type]??{bg:'#f0f4f6',text:'#6b8896'}
                return (
                  <div key={svc.id} className="svc-card" style={{opacity:svc.isActive?1:0.65}}>
                    {/* Icon + name + badge row */}
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <div style={{width:'50px',height:'50px',minWidth:'50px',borderRadius:'14px',background:COLORS.brandLight,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS.brand}}>
                        {TYPE_ICONS[svc.type]}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap',marginBottom:'3px'}}>
                          <p style={{fontSize:FONT_SIZE.base,fontWeight:FONT_WEIGHT.bold,color:COLORS.navy,margin:0,lineHeight:1.2}}>{svc.name}</p>
                        </div>
                        <span style={{background:cc.bg,color:cc.text,borderRadius:'99px',padding:'2px 8px',fontSize:'11px',fontWeight:700}}>{TYPE_LABELS[svc.type]}</span>
                      </div>
                    </div>

                    <p style={{fontSize:'12px',color:COLORS.muted,lineHeight:1.5,margin:0}}>{svc.description}</p>

                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
                      <div>
                        <span style={{fontSize:FONT_SIZE.md,fontWeight:FONT_WEIGHT.bold,color:COLORS.navy}}>₹{svc.price}</span>
                        <span style={{fontSize:'12px',color:COLORS.muted}}> / session</span>
                      </div>
                      <StatusBadge status={svc.isActive?'active':'inactive'}/>
                    </div>

                    <div>
                      <p style={{fontSize:'11px',color:COLORS.muted,marginBottom:'5px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.4px'}}>Slots ({svc.slots.length})</p>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                        {svc.slots.map(s=>(
                          <span key={s} style={{background:'#f0f4f6',color:COLORS.body,borderRadius:'6px',padding:'2px 8px',fontSize:'11px',fontWeight:500}}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'8px',borderTop:`1px solid ${COLORS.divider}`}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'12px',color:COLORS.muted}}>{svc.isActive?'Active':'Inactive'}</span>
                        <button onClick={()=>toggleActive(svc.id)} style={{width:'38px',height:'20px',borderRadius:'99px',border:'none',background:svc.isActive?COLORS.brand:COLORS.divider,cursor:'pointer',position:'relative',flexShrink:0}}>
                          <div style={{position:'absolute',top:'2px',left:svc.isActive?undefined:'2px',right:svc.isActive?'2px':undefined,width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
                        </button>
                      </div>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button onClick={()=>{setSelected(svc);setModal(true)}} style={{padding:'5px 10px',borderRadius:'8px',border:`1px solid ${COLORS.divider}`,background:'#fff',cursor:'pointer',color:COLORS.brand,fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px'}}>
                          <Pencil size={13}/> Edit
                        </button>
                        <button onClick={()=>{setSelected(svc);setDelete(true)}} style={{padding:'5px 10px',borderRadius:'8px',border:'none',background:'#fee2e2',cursor:'pointer',color:'#dc2626',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px'}}>
                          <Trash2 size={13}/> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </AdminPageShell>

      <AdminFormModal open={modalOpen} onClose={()=>setModal(false)} title={selected?'Edit Service':'Add Service'} size="md"
        footer={<><AdminBtn variant="secondary" onClick={()=>setModal(false)}>Cancel</AdminBtn><AdminBtn>{selected?'Save Changes':'Add Service'}</AdminBtn></>}
      >
        <ServiceForm id="svc-form" svc={selected}/>
      </AdminFormModal>

      <ConfirmModal open={deleteOpen} onClose={()=>setDelete(false)} onConfirm={()=>setDelete(false)}
        variant="danger" title={`Delete "${selected?.name}"?`}
        description="This will permanently remove this service and all associated bookings."
        confirmLabel="Delete Service"
      />
    </>
  )
}
