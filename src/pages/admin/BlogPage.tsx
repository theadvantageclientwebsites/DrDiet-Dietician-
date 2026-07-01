/**
 * BlogPage — Blog & Recipes management with list, filter tabs, and write form
 */
import { useState } from 'react'
import { Newspaper, Plus, Pencil, Trash2, Eye, Image } from 'lucide-react'
import AdminPageShell  from '@/components/admin/AdminPageShell'
import StatusBadge     from '@/components/admin/StatusBadge'
import AdminBtn        from '@/components/admin/AdminBtn'
import AdminFormModal  from '@/components/admin/AdminFormModal'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import ConfirmModal    from '@/components/ui/ConfirmModal'
import FormField       from '@/components/shared/FormField'
import SelectField     from '@/components/shared/SelectField'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

type Post = { id:string; title:string; category:string; date:string; status:string; excerpt:string }
const MOCK: Post[] = [
  { id:'1', title:'5 Foods to Balance Thyroid Naturally',       category:'blog',   date:'Oct 10, 2024', status:'published', excerpt:'Discover how specific nutrients support thyroid hormone production and balance.' },
  { id:'2', title:'Anti-Inflammatory Diet for Diabetes',        category:'blog',   date:'Oct 05, 2024', status:'published', excerpt:'Learn how an anti-inflammatory approach can help manage blood glucose levels.' },
  { id:'3', title:'Protein-Packed Quinoa Salad Bowl',           category:'recipe', date:'Oct 01, 2024', status:'published', excerpt:'A nutrient-dense salad with complete protein for post-workout recovery.' },
  { id:'4', title:'Understanding Glycemic Index: A Guide',      category:'blog',   date:'Sep 28, 2024', status:'draft',     excerpt:'Everything you need to know about GI values and meal planning for diabetics.' },
  { id:'5', title:'Thyroid-Friendly Breakfast: 3 Easy Recipes', category:'recipe', date:'Sep 22, 2024', status:'published', excerpt:'Start your day with selenium-rich, iodine-balanced breakfast options.' },
  { id:'6', title:'Weight Management Without Crash Diets',      category:'blog',   date:'Sep 18, 2024', status:'draft',     excerpt:'Sustainable strategies for healthy weight management based on clinical evidence.' },
]
const TABS = ['All','Blog','Recipe']
const CAT_OPTS = [{value:'blog',label:'Blog'},{value:'recipe',label:'Recipe'}]
const STATUS_OPTS = [{value:'published',label:'Published'},{value:'draft',label:'Draft'}]

function WritePostForm({id}:{id:string}) {
  const [thumb, setThumb] = useState('')
  return (
    <form id={id} className="flex flex-col gap-4">
      <FormField id="bp-title" label="Title" placeholder="Enter post title…"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField id="bp-cat"    label="Category" options={CAT_OPTS}    value="" onChange={()=>{}} placeholder="Select category"/>
        <SelectField id="bp-status" label="Status"   options={STATUS_OPTS} value="" onChange={()=>{}} placeholder="Select status"/>
        <FormField id="bp-tags" label="Tags" placeholder="eg. nutrition, thyroid, recipes"/>
      </div>
      {/* Featured image */}
      <div>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Featured Image</label>
        <label style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',border:`2px dashed ${COLORS.inputBorder}`,borderRadius:'10px',cursor:'pointer',background:COLORS.inputBg}}>
          <Image size={18} color={COLORS.brand} strokeWidth={1.8}/>
          <span style={{fontSize:FONT_SIZE.sm,color:thumb?COLORS.navy:COLORS.muted}}>{thumb||'Click to upload featured image'}</span>
          <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>setThumb(e.target.files?.[0]?.name??'')}/>
        </label>
      </div>
      {/* Content */}
      <div>
        <label style={{fontSize:FONT_SIZE.sm,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,display:'block',marginBottom:'6px'}}>Content</label>
        <textarea rows={8} placeholder="Write your post content here…"
          style={{width:'100%',minHeight:'200px',borderRadius:'10px',border:`1px solid ${COLORS.inputBorder}`,background:COLORS.inputBg,padding:'12px',fontSize:FONT_SIZE.sm,color:COLORS.navy,outline:'none',resize:'vertical',fontFamily:'inherit',lineHeight:1.7,boxSizing:'border-box'}}
        />
        <p style={{fontSize:'11px',color:COLORS.muted,marginTop:'4px'}}>Rich text editor coming soon — use plain text or markdown.</p>
      </div>
    </form>
  )
}

export default function BlogPage() {
  const [tab,       setTab]     = useState('All')
  const [modalOpen, setModal]   = useState(false)
  const [deleteOpen,setDelete]  = useState(false)
  const [selected, setSelected] = useState<Post|null>(null)

  const visible = MOCK.filter(p => tab==='All' || p.category===tab.toLowerCase())

  return (
    <>
      <style>{`
        .bp-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
        .bp-tab{padding:6px 16px;border-radius:20px;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:inherit;}

        .bp-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:640px){.bp-grid{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.bp-grid{grid-template-columns:repeat(3,1fr);}}

        .bp-card{background:#fff;border-radius:16px;border:1px solid #e6edf0;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;}
        .bp-img{height:140px;background:linear-gradient(135deg,#d0ecf2 0%,#b8dde6 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .bp-body{padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:8px;}
        .bp-footer{padding:10px 16px;border-top:1px solid #f0f4f6;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;}
      `}</style>

      <AdminPageShell
        title="Blog & Recipes"
        subtitle="Manage blog posts and recipe articles"
        actions={<AdminBtn icon={<Plus size={15}/>} onClick={()=>{setSelected(null);setModal(true)}}>Write Post</AdminBtn>}
      >
        {/* Filter tabs */}
        <div className="bp-tabs">
          {TABS.map(t=>(
            <button key={t} className="bp-tab"
              style={{background:tab===t?COLORS.brand:COLORS.divider,color:tab===t?'#fff':COLORS.body}}
              onClick={()=>setTab(t)}
            >{t}</button>
          ))}
        </div>

        {visible.length===0
          ? <AdminEmptyState icon={<Newspaper size={22}/>} title="No posts found" description="Write your first post to get started"/>
          : (
            <div className="bp-grid">
              {visible.map(p=>(
                <div key={p.id} className="bp-card">
                  <div className="bp-img">
                    <Newspaper size={36} color={COLORS.brand} strokeWidth={1.2} style={{opacity:0.4}}/>
                  </div>
                  <div className="bp-body">
                    <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
                      <span style={{
                        background: p.category==='recipe'?'#fef3c7':'#eff6ff',
                        color:      p.category==='recipe'?'#d97706':'#2563eb',
                        borderRadius:'99px',padding:'2px 8px',fontSize:'11px',fontWeight:700,textTransform:'capitalize'
                      }}>{p.category}</span>
                      <StatusBadge status={p.status}/>
                    </div>
                    <p style={{fontSize:FONT_SIZE.base,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,margin:0,lineHeight:1.3}}>{p.title}</p>
                    <p style={{fontSize:'12px',color:COLORS.muted,margin:0,lineHeight:1.5}}>{p.excerpt}</p>
                  </div>
                  <div className="bp-footer">
                    <span style={{fontSize:'11px',color:COLORS.muted}}>{p.date}</span>
                    <div style={{display:'flex',gap:'4px'}}>
                      <button title="Preview" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.muted}}><Eye size={15} strokeWidth={1.8}/></button>
                      <button onClick={()=>{setSelected(p);setModal(true)}} title="Edit" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:COLORS.brand}}><Pencil size={15} strokeWidth={1.8}/></button>
                      <button onClick={()=>{setSelected(p);setDelete(true)}} title="Delete" style={{padding:'5px',borderRadius:'7px',border:'none',background:'transparent',cursor:'pointer',color:'#dc2626'}}><Trash2 size={15} strokeWidth={1.8}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </AdminPageShell>

      <AdminFormModal open={modalOpen} onClose={()=>setModal(false)} title={selected?'Edit Post':'Write New Post'} size="lg"
        footer={<><AdminBtn variant="secondary" onClick={()=>setModal(false)}>Cancel</AdminBtn><AdminBtn>{selected?'Save Changes':'Publish Post'}</AdminBtn></>}
      >
        <WritePostForm id="blog-form"/>
      </AdminFormModal>

      <ConfirmModal open={deleteOpen} onClose={()=>setDelete(false)} onConfirm={()=>setDelete(false)}
        variant="danger" title={`Delete "${selected?.title}"?`}
        description="This post will be permanently removed and unpublished."
        confirmLabel="Delete Post"
      />
    </>
  )
}
