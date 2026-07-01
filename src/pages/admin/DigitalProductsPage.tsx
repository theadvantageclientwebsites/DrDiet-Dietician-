/**
 * DigitalProductsPage — Manage ebooks, diet guides, recipe books
 */
import { useState } from 'react'
import { FileText, Plus, Pencil, Trash2, Upload, Eye } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

type Product = { id:string; title:string; category:string; price:number; status:string; thumbnail?:string; description:string }

const MOCK: Product[] = [
  { id:'1', title:'Thyroid Diet Guide',            category:'diet_guide',   price:299,  status:'published', description:'Complete guide to managing thyroid conditions through diet.' },
  { id:'2', title:'Diabetes Meal Planner',         category:'ebook',        price:399,  status:'published', description:'28-day meal plan for blood sugar control and diabetes management.' },
  { id:'3', title:'Weight Loss Recipe Book',       category:'recipe_book',  price:199,  status:'draft',     description:'100+ low-calorie recipes for sustainable weight loss.' },
  { id:'4', title:'Immunity Booster Cookbook',     category:'recipe_book',  price:249,  status:'published', description:'Nutrition-packed recipes to boost immunity and overall health.' },
  { id:'5', title:'PCOS Nutrition Handbook',       category:'ebook',        price:349,  status:'draft',     description:'Evidence-based nutritional strategies for PCOS management.' },
]

const CAT_OPTS = [{value:'ebook',label:'eBook'},{value:'diet_guide',label:'Diet Guide'},{value:'recipe_book',label:'Recipe Book'}]
const STATUS_OPTS = [{value:'published',label:'Published'},{value:'draft',label:'Draft'}]
const CAT_LABELS: Record<string,string> = {ebook:'eBook',diet_guide:'Diet Guide',recipe_book:'Recipe Book'}
const CAT_COLORS: Record<string,{bg:string;text:string}> = {
  ebook:       {bg:'#eff6ff',text:'#2563eb'},
  diet_guide:  {bg:'#dcfce7',text:'#16a34a'},
  recipe_book: {bg:'#fef3c7',text:'#d97706'},
}

function ProductForm({id}:{id:string}) {
  const [file, setFile] = useState('')
  const [thumb, setThumb] = useState('')
  return (
    <form id={id} className="flex flex-col gap-4">
      <FormField id="dp-title" label="Product Title" placeholder="eg. Thyroid Diet Guide"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField id="dp-cat"    label="Category" options={CAT_OPTS}    value="" onChange={()=>{}} placeholder="Select category"/>
        <SelectField id="dp-status" label="Status"   options={STATUS_OPTS} value="" onChange={()=>{}} placeholder="Select status"/>
        <FormField id="dp-price" label="Price (₹)" type="number" placeholder="299"/>
      </div>
      <div>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Description</label>
        <textarea rows={3} placeholder="Describe this product…"
          style={{width:'100%',borderRadius:'10px',border:`1px solid ${COLORS.inputBorder}`,background:COLORS.inputBg,padding:'10px 12px',fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
        />
      </div>
      {/* File upload */}
      <div>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Product File (PDF)</label>
        <label style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',border:`2px dashed ${COLORS.inputBorder}`,borderRadius:'10px',cursor:'pointer',background:COLORS.inputBg}}>
          <Upload size={18} color={COLORS.brand} strokeWidth={1.8}/>
          <span style={{fontSize:FONT_SIZE.sm,color:file?COLORS.navy:COLORS.muted}}>{file||'Click to upload PDF file'}</span>
          <input type="file" accept=".pdf" style={{display:'none'}} onChange={e=>setFile(e.target.files?.[0]?.name??'')}/>
        </label>
      </div>
      <div>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Thumbnail Image</label>
        <label style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',border:`2px dashed ${COLORS.inputBorder}`,borderRadius:'10px',cursor:'pointer',background:COLORS.inputBg}}>
          <Upload size={18} color={COLORS.brand} strokeWidth={1.8}/>
          <span style={{fontSize:FONT_SIZE.sm,color:thumb?COLORS.navy:COLORS.muted}}>{thumb||'Click to upload thumbnail'}</span>
          <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>setThumb(e.target.files?.[0]?.name??'')}/>
        </label>
      </div>
    </form>
  )
}

export default function DigitalProductsPage() {
  const [modalOpen, setModal] = useState(false)
  const [deleteOpen,setDelete]= useState(false)
  const [selected, setSelected] = useState<Product|null>(null)

  return (
    <>
      <style>{`
        .dp-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.dp-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.dp-grid{grid-template-columns:repeat(3,1fr);}}

        .dp-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;}
        .dp-thumb{height:140px;background:#f0f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .dp-body{padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:8px;}
        .dp-footer{padding:10px 16px;border-top:1px solid #f0f4f6;display:flex;align-items:center;justify-content:flex-end;gap:8px;}
      `}</style>

      <AdminPageShell
        title="Digital Products"
        subtitle="Manage ebooks, diet guides, and recipe books"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={()=>{setSelected(null);setModal(true)}}>Add Product</AdminBtn>}
      >
        {MOCK.length===0
          ? <AdminEmptyState icon={<FileText size={22}/>} title="No products yet" description="Add your first digital product"/>
          : (
            <div className="dp-grid">
              {MOCK.map(p=>{
                const cc = CAT_COLORS[p.category]??{bg:'#f0f4f6',text:'#6b8896'}
                return (
                  <div key={p.id} className="dp-card">
                    <div className="dp-thumb">
                      <FileText size={36} color={COLORS.muted} strokeWidth={1.5}/>
                    </div>
                    <div className="dp-body">
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'6px'}}>
                        <span style={{background:cc.bg,color:cc.text,borderRadius:'99px',padding:'3px 10px',fontSize:'11px',fontWeight:700}}>{CAT_LABELS[p.category]}</span>
                        <StatusBadge status={p.status}/>
                      </div>
                      <p style={{fontSize:FONT_SIZE.base,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,margin:0,lineHeight:1.3}}>{p.title}</p>
                      <p style={{fontSize:'12px',color:COLORS.muted,margin:0,lineHeight:1.5}}>{p.description}</p>
                      <p style={{fontSize:FONT_SIZE.md,fontWeight:FONT_WEIGHT.bold,color:COLORS.navy,margin:0}}>₹{p.price}</p>
                    </div>
                    <div className="dp-footer">
                      <button title="Preview" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.muted}}><Eye size={15} strokeWidth={1.8}/></button>
                      <button onClick={()=>{setSelected(p);setModal(true)}} title="Edit" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.brand}}><Pencil size={15} strokeWidth={1.8}/></button>
                      <button onClick={()=>{setSelected(p);setDelete(true)}} title="Delete" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:'#dc2626'}}><Trash2 size={15} strokeWidth={1.8}/></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </AdminPageShell>

      <AdminFormModal open={modalOpen} onClose={()=>setModal(false)} title={selected?'Edit Product':'Add Digital Product'} size="md"
        footer={<><AdminBtn variant="secondary" onClick={()=>setModal(false)}>Cancel</AdminBtn><AdminBtn>{selected?'Save Changes':'Add Product'}</AdminBtn></>}
      >
        <ProductForm id="dp-form"/>
      </AdminFormModal>

      <ConfirmModal open={deleteOpen} onClose={()=>setDelete(false)} onConfirm={()=>setDelete(false)}
        variant="danger" title={`Delete "${selected?.title}"?`}
        description="This will permanently remove this product. Existing purchases will still have access."
        confirmLabel="Delete Product"
      />
    </>
  )
}
