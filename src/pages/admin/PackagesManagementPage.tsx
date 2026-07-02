/**
 * PackagesManagementPage — Create/edit healthcare subscription packages
 */
import { useState } from 'react'
import { Package, Pencil, Trash2, Plus, X as XIcon } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

type Pkg = {
  id:string; name:string; category:string; description:string
  price1m:number; price3m:number; price6m:number
  features:string[]; isActive:boolean
}
const MOCK_PKGS: Pkg[] = [
  { id:'1', name:'Thyroid Management', category:'thyroid',    description:'Specialized diet plan for thyroid health management and hormonal balance.',    price1m:1999, price3m:5499, price6m:9999,  features:['Weekly diet plan','Blood report review','Monthly consultation','Progress tracking'], isActive:true  },
  { id:'2', name:'Diabetes Care',      category:'diabetes',   description:'Comprehensive nutrition guidance for blood sugar control and diabetes reversal.', price1m:2199, price3m:5999, price6m:10999, features:['Custom meal plan','Glycemic index guidance','Bi-weekly check-in','Diet journal'], isActive:true  },
  { id:'3', name:'Weight Loss',        category:'weight_loss',description:'Evidence-based weight management with sustainable diet and lifestyle changes.',   price1m:1799, price3m:4999, price6m:8999,  features:['Calorie-tracked plan','Exercise integration','Weekly weigh-in','Support chat'],   isActive:true  },
  { id:'4', name:'General Wellness',   category:'general',    description:'Holistic nutrition for overall health, energy, and immunity improvement.',       price1m:1499, price3m:3999, price6m:7499,  features:['Balanced diet plan','Immunity boost recipes','Quarterly review'],               isActive:false },
]

const CAT_OPTS = [{value:'thyroid',label:'Thyroid'},{value:'diabetes',label:'Diabetes'},{value:'weight_loss',label:'Weight Loss'},{value:'general',label:'General'},{value:'other',label:'Other'}]
const CAT_COLORS: Record<string,{bg:string;text:string}> = {
  thyroid:    {bg:'#eff6ff',text:'#2563eb'},
  diabetes:   {bg:'#fef3c7',text:'#d97706'},
  weight_loss:{bg:'#dcfce7',text:'#16a34a'},
  general:    {bg:COLORS.brandLight,text:COLORS.brand},
  other:      {bg:'#f0f4f6',text:'#6b8896'},
}
const CAT_LABELS: Record<string,string> = {thyroid:'Thyroid',diabetes:'Diabetes',weight_loss:'Weight Loss',general:'General',other:'Other'}

function PackageForm({ id, pkg }:{ id:string; pkg?:Pkg|null }) {
  const [features, setFeatures] = useState<string[]>(pkg?.features??[])
  const [input, setInput] = useState('')

  const add = () => { if(input.trim()){setFeatures(f=>[...f,input.trim()]);setInput('')} }
  const remove = (i:number) => setFeatures(f=>f.filter((_,idx)=>idx!==i))

  return (
    <form id={id} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FormField id="pkg-name" label="Package Name" placeholder="eg. Thyroid Management" defaultValue={pkg?.name}/>
        </div>
        <SelectField id="pkg-cat" label="Category" options={CAT_OPTS} value={pkg?.category??''} onChange={()=>{}} placeholder="Select category"/>
        <div className="sm:col-span-1"/>
        <div className="sm:col-span-2">
          <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Description</label>
          <textarea defaultValue={pkg?.description} rows={3} placeholder="Describe the package…"
            style={{width:'100%',borderRadius:'10px',border:`1px solid ${COLORS.inputBorder}`,background:COLORS.inputBg,padding:'10px 12px',fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
          />
        </div>
      </div>
      <div>
        <p style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,marginBottom:'10px'}}>Pricing (₹)</p>
        <div className="grid grid-cols-3 gap-3">
          <FormField id="pkg-p1m" label="1 Month"  type="number" placeholder="1999"  defaultValue={pkg?.price1m}/>
          <FormField id="pkg-p3m" label="3 Months" type="number" placeholder="5499"  defaultValue={pkg?.price3m}/>
          <FormField id="pkg-p6m" label="6 Months" type="number" placeholder="9999"  defaultValue={pkg?.price6m}/>
        </div>
      </div>
      <div>
        <p style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,marginBottom:'8px'}}>Features</p>
        <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}}
            placeholder="Add a feature…" style={{flex:1,height:'38px',padding:'0 12px',border:`1px solid ${COLORS.inputBorder}`,borderRadius:'10px',background:COLORS.inputBg,fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',fontFamily:'inherit'}}/>
          <button type="button" onClick={add} style={{padding:'0 14px',borderRadius:'10px',background:COLORS.brand,border:'none',color:'#fff',cursor:'pointer',fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,fontFamily:'inherit'}}>Add</button>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
          {features.map((f,i)=>(
            <span key={i} style={{display:'inline-flex',alignItems:'center',gap:'4px',background:COLORS.brandLight,color:COLORS.brand,padding:'4px 10px',borderRadius:'99px',fontSize:'12px',fontWeight:600}}>
              {f}
              <button type="button" onClick={()=>remove(i)} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex',color:COLORS.brand}}>
                <XIcon size={11} strokeWidth={2.5}/>
              </button>
            </span>
          ))}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>Active</label>
        <div style={{width:'42px',height:'22px',borderRadius:'99px',background:pkg?.isActive!==false?COLORS.brand:COLORS.divider,position:'relative',cursor:'pointer'}}>
          <div style={{position:'absolute',top:'3px',left:pkg?.isActive!==false?undefined:'3px',right:pkg?.isActive!==false?'3px':undefined,width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
        </div>
      </div>
    </form>
  )
}

export default function PackagesManagementPage() {
  const [packages, setPkgs] = useState<Pkg[]>(MOCK_PKGS)
  const [modalOpen, setModal] = useState(false)
  const [deleteOpen,setDelete]= useState(false)
  const [selected, setSelected] = useState<Pkg|null>(null)

  const toggleActive = (id:string) => setPkgs(p=>p.map(pkg=>pkg.id===id?{...pkg,isActive:!pkg.isActive}:pkg))

  return (
    <>
      <style>{`
        .pm-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.pm-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.pm-grid{grid-template-columns:repeat(3,1fr);}}

        .pm-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;}
        .pm-card-body{padding:18px 18px 14px;flex:1;}
        .pm-card-footer{padding:12px 18px;border-top:1px solid #f0f4f6;display:flex;align-items:center;justify-content:space-between;}
        .pm-price-row{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0;}
        .pm-price-chip{background:#f0f4f6;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600;color:#374955;}
      `}</style>

      <AdminPageShell
        title="Packages"
        subtitle="Manage healthcare subscription packages"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={()=>{setSelected(null);setModal(true)}}>Create Package</AdminBtn>}
      >
        {packages.length===0
          ? <AdminEmptyState icon={<Package size={22}/>} title="No packages yet" description="Create your first healthcare package" action={<AdminBtn icon={<Plus size={14}/>} onClick={()=>{setSelected(null);setModal(true)}}>Create Package</AdminBtn>}/>
          : (
            <div className="pm-grid">
              {packages.map(pkg=>{
                const cc = CAT_COLORS[pkg.category]??CAT_COLORS.other
                return (
                  <div key={pkg.id} className="pm-card" style={{opacity:pkg.isActive?1:0.65}}>
                    <div className="pm-card-body">
                      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'8px',marginBottom:'8px'}}>
                        <span style={{background:cc.bg,color:cc.text,borderRadius:'99px',padding:'3px 10px',fontSize:'11px',fontWeight:700}}>{CAT_LABELS[pkg.category]??pkg.category}</span>
                        {!pkg.isActive && <span style={{background:'#fee2e2',color:'#dc2626',borderRadius:'99px',padding:'3px 10px',fontSize:'11px',fontWeight:700}}>Inactive</span>}
                      </div>
                      <p style={{fontSize:FONT_SIZE.md,fontWeight:FONT_WEIGHT.bold,color:COLORS.navy,margin:'0 0 6px'}}>{pkg.name}</p>
                      <p style={{fontSize:'12px',color:COLORS.muted,lineHeight:1.5,margin:0}}>{pkg.description}</p>
                      <div className="pm-price-row">
                        <span className="pm-price-chip">1M: ₹{pkg.price1m.toLocaleString()}</span>
                        <span className="pm-price-chip">3M: ₹{pkg.price3m.toLocaleString()}</span>
                        <span className="pm-price-chip">6M: ₹{pkg.price6m.toLocaleString()}</span>
                      </div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
                        {pkg.features.slice(0,3).map((f,i)=>(
                          <span key={i} style={{background:COLORS.brandLight,color:COLORS.brand,borderRadius:'5px',padding:'2px 7px',fontSize:'11px',fontWeight:500}}>✓ {f}</span>
                        ))}
                        {pkg.features.length>3 && <span style={{fontSize:'11px',color:COLORS.muted}}>+{pkg.features.length-3} more</span>}
                      </div>
                    </div>
                    <div className="pm-card-footer">
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'12px',color:COLORS.muted}}>{pkg.isActive?'Active':'Inactive'}</span>
                        <button onClick={()=>toggleActive(pkg.id)} style={{width:'38px',height:'20px',borderRadius:'99px',border:'none',background:pkg.isActive?COLORS.brand:COLORS.divider,cursor:'pointer',position:'relative',flexShrink:0}}>
                          <div style={{position:'absolute',top:'2px',left:pkg.isActive?undefined:'2px',right:pkg.isActive?'2px':undefined,width:'16px',height:'16px',borderRadius:'50%',background:'#fff'}}/>
                        </button>
                      </div>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button onClick={()=>{setSelected(pkg);setModal(true)}} style={{padding:'5px 10px',borderRadius:'8px',border:`1px solid ${COLORS.divider}`,background:'#fff',cursor:'pointer',color:COLORS.brand,fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px'}}>
                          <Pencil size={13}/> Edit
                        </button>
                        <button onClick={()=>{setSelected(pkg);setDelete(true)}} style={{padding:'5px 10px',borderRadius:'8px',border:'none',background:'#fee2e2',cursor:'pointer',color:'#dc2626',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'4px'}}>
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

      <AdminFormModal open={modalOpen} onClose={()=>setModal(false)} title={selected?'Edit Package':'Create Package'} size="lg"
        footer={<><AdminBtn variant="secondary" onClick={()=>setModal(false)}>Cancel</AdminBtn><AdminBtn>{selected?'Save Changes':'Create Package'}</AdminBtn></>}
      >
        <PackageForm id="package-form" pkg={selected}/>
      </AdminFormModal>

      <ConfirmModal open={deleteOpen} onClose={()=>setDelete(false)} onConfirm={()=>setDelete(false)}
        variant="danger" title={`Delete "${selected?.name}"?`}
        description="This will permanently remove this package. Active subscriptions will not be affected."
        confirmLabel="Delete Package"
      />
    </>
  )
}
