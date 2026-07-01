/**
 * RevenuePage — Revenue analytics with stat cards, chart, and breakdown table
 */
import { useState } from 'react'
import { IndianRupee, Stethoscope, Package, BookOpen } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatCard       from '@/components/admin/StatCard'
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '@/config/theme'

const MONTHLY = [
  { month:'Jan', consultations:45000, packages:28000, digital:8000  },
  { month:'Feb', consultations:52000, packages:31000, digital:9500  },
  { month:'Mar', consultations:48000, packages:35000, digital:11000 },
  { month:'Apr', consultations:61000, packages:40000, digital:12500 },
  { month:'May', consultations:57000, packages:38000, digital:13000 },
  { month:'Jun', consultations:68000, packages:45000, digital:15000 },
  { month:'Jul', consultations:63000, packages:42000, digital:14500 },
  { month:'Aug', consultations:75000, packages:50000, digital:16000 },
  { month:'Sep', consultations:71000, packages:48000, digital:17500 },
  { month:'Oct', consultations:82000, packages:55000, digital:19000 },
  { month:'Nov', consultations:78000, packages:52000, digital:18000 },
  { month:'Dec', consultations:90000, packages:60000, digital:21000 },
]

const TRANSACTIONS = [
  { id:'1', date:'Oct 22',  patient:'Michael Vance',  type:'consultation', amount:999,  method:'Razorpay', status:'paid'    },
  { id:'2', date:'Oct 21',  patient:'Anita Chen',     type:'package',      amount:5499, method:'Razorpay', status:'paid'    },
  { id:'3', date:'Oct 20',  patient:'Ravi Sharma',    type:'consultation', amount:999,  method:'Razorpay', status:'paid'    },
  { id:'4', date:'Oct 19',  patient:'Priya Kapoor',   type:'digital',      amount:399,  method:'Razorpay', status:'paid'    },
  { id:'5', date:'Oct 18',  patient:'John Doe',       type:'package',      amount:1999, method:'Razorpay', status:'refunded'},
  { id:'6', date:'Oct 17',  patient:'Sarah Miller',   type:'consultation', amount:999,  method:'Razorpay', status:'pending' },
]

const TYPE_COLORS: Record<string,{bg:string;text:string;label:string}> = {
  consultation: {bg:'#eff6ff',text:'#2563eb',label:'Consultation'},
  package:      {bg:COLORS.brandLight,text:COLORS.brand,label:'Package'},
  digital:      {bg:'#fef3c7',text:'#d97706',label:'Digital Product'},
}
const TX_STATUS: Record<string,{bg:string;text:string}> = {
  paid:     {bg:'#dcfce7',text:'#16a34a'},
  pending:  {bg:'#fef3c7',text:'#d97706'},
  refunded: {bg:'#fee2e2',text:'#dc2626'},
}

type Series = 'consultations' | 'packages' | 'digital'

function RevenueBarChart({ active }:{active:Series}) {
  const max = Math.max(...MONTHLY.map(m=>m[active]))
  const W=600, H=200, PL=52, PR=16, PT=10, PB=36
  const cW=W-PL-PR, cH=H-PT-PB
  const n=MONTHLY.length
  const barW=(cW/n)*0.55
  const xOf=(i:number)=>PL+(i+0.5)*(cW/n)
  const yOf=(v:number)=>PT+cH-(v/max)*cH

  const yTicks = [0, Math.round(max/4), Math.round(max/2), Math.round(3*max/4), max]
  const SERIES_COLOR: Record<Series,string> = {
    consultations: COLORS.brand,
    packages:      '#f59e0b',
    digital:       '#2563eb',
  }
  const col = SERIES_COLOR[active]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{display:'block'}}>
      {yTicks.map(v=>(
        <g key={v}>
          <line x1={PL} y1={yOf(v)} x2={W-PR} y2={yOf(v)} stroke={COLORS.divider} strokeWidth="1"/>
          <text x={PL-6} y={yOf(v)+4} textAnchor="end" fontSize="9.5" fill={COLORS.muted}>
            {v>=1000?`₹${Math.round(v/1000)}k`:`₹${v}`}
          </text>
        </g>
      ))}
      {MONTHLY.map((m,i)=>(
        <g key={m.month}>
          <rect
            x={xOf(i)-barW/2} y={yOf(m[active])}
            width={barW} height={cH-(yOf(m[active])-PT)}
            fill={col} rx="4" opacity="0.85"
          />
          <text x={xOf(i)} y={H-8} textAnchor="middle" fontSize="10" fill={COLORS.muted}>{m.month}</text>
        </g>
      ))}
    </svg>
  )
}

export default function RevenuePage() {
  const [series, setSeries] = useState<Series>('consultations')

  const totalRevenue = MONTHLY.reduce((s,m)=>s+m.consultations+m.packages+m.digital,0)
  const consultRev   = MONTHLY.reduce((s,m)=>s+m.consultations,0)
  const packageRev   = MONTHLY.reduce((s,m)=>s+m.packages,0)
  const digitalRev   = MONTHLY.reduce((s,m)=>s+m.digital,0)

  const fmt = (n:number) => n>=100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(1)}k`

  return (
    <>
      <style>{`
        .rv-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
        @media(min-width:1024px){.rv-stat-grid{grid-template-columns:repeat(4,1fr);}}

        .rv-chart-card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);border:1px solid #e6edf0;margin-bottom:20px;}
        .rv-toggle{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
        .rv-toggle-btn{padding:6px 14px;border-radius:20px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;}

        .rv-table-card{background:#fff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.08);border:1px solid #e6edf0;overflow:hidden;}
        .rv-table{width:100%;border-collapse:collapse;}
        .rv-table th{text-align:left;padding:9px 14px;font-size:11px;font-weight:600;color:#9ab0bb;text-transform:uppercase;letter-spacing:.5px;background:#f7fafb;border-bottom:1px solid #e6edf0;}
        .rv-table td{padding:10px 14px;font-size:13px;color:#374955;border-bottom:1px solid #f7fafb;vertical-align:middle;}
        .rv-table tr:last-child td{border-bottom:none;}
        .rv-table tr:hover td{background:#f7fafb;}

        .rv-desktop{display:none;}
        .rv-mobile{display:flex;flex-direction:column;gap:8px;padding:12px;}
        @media(min-width:640px){.rv-desktop{display:block;}.rv-mobile{display:none;}}
      `}</style>

      <AdminPageShell
        title="Revenue Analytics"
        subtitle="Financial overview across all revenue streams"
      >
        {/* Stats */}
        <div className="rv-stat-grid">
          <StatCard dark icon={<IndianRupee size={22} strokeWidth={1.8}/>} label="Total Revenue" value={fmt(totalRevenue)} trend={{value:18,label:'vs last month',up:true}}/>
          <StatCard icon={<Stethoscope size={20} strokeWidth={1.8}/>} label="Consultation Revenue" value={fmt(consultRev)} trend={{value:12,label:'vs last month',up:true}}/>
          <StatCard icon={<Package     size={20} strokeWidth={1.8}/>} label="Package Revenue"      value={fmt(packageRev)} trend={{value:8,label:'vs last month',up:true}}/>
          <StatCard icon={<BookOpen    size={20} strokeWidth={1.8}/>} label="Digital Products"     value={fmt(digitalRev)} trend={{value:22,label:'vs last month',up:true}} accentColor="#2563eb"/>
        </div>

        {/* Chart */}
        <div className="rv-chart-card">
          <p style={{fontSize:FONT_SIZE.base,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,margin:'0 0 14px'}}>Monthly Revenue</p>
          <div className="rv-toggle">
            {(['consultations','packages','digital'] as Series[]).map(s=>(
              <button key={s} className="rv-toggle-btn"
                style={{background:series===s?COLORS.brand:COLORS.divider,color:series===s?'#fff':COLORS.body}}
                onClick={()=>setSeries(s)}
              >
                {s==='consultations'?'Consultations':s==='packages'?'Packages':'Digital Products'}
              </button>
            ))}
          </div>
          <div style={{height:'200px'}}>
            <RevenueBarChart active={series}/>
          </div>
        </div>

        {/* Transaction table */}
        <div className="rv-table-card">
          <div style={{padding:'14px 16px',borderBottom:`1px solid ${COLORS.divider}`}}>
            <p style={{fontSize:FONT_SIZE.base,fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,margin:0}}>Revenue Breakdown</p>
          </div>

          {/* Desktop */}
          <div className="rv-desktop">
            <div style={{overflowX:'auto'}}>
              <table className="rv-table">
                <thead>
                  <tr><th>Date</th><th>Patient</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map(tx=>{
                    const tc = TYPE_COLORS[tx.type]
                    const sc = TX_STATUS[tx.status]
                    return (
                      <tr key={tx.id}>
                        <td style={{color:COLORS.muted}}>{tx.date}</td>
                        <td style={{fontWeight:FONT_WEIGHT.medium,color:COLORS.navy}}>{tx.patient}</td>
                        <td><span style={{background:tc.bg,color:tc.text,borderRadius:'6px',padding:'2px 8px',fontSize:'11px',fontWeight:700}}>{tc.label}</span></td>
                        <td style={{fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy}}>₹{tx.amount.toLocaleString()}</td>
                        <td style={{color:COLORS.muted}}>{tx.method}</td>
                        <td><span style={{background:sc.bg,color:sc.text,borderRadius:'99px',padding:'3px 10px',fontSize:'11px',fontWeight:600,textTransform:'capitalize'}}>{tx.status}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="rv-mobile">
            {TRANSACTIONS.map(tx=>{
              const tc = TYPE_COLORS[tx.type]
              const sc = TX_STATUS[tx.status]
              return (
                <div key={tx.id} style={{padding:'10px 12px',borderRadius:'10px',background:'#f7fafb',border:`1px solid ${COLORS.divider}`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px',flexWrap:'wrap',gap:'6px'}}>
                    <span style={{fontWeight:FONT_WEIGHT.semibold,color:COLORS.navy,fontSize:FONT_SIZE.sm}}>{tx.patient}</span>
                    <span style={{fontWeight:FONT_WEIGHT.bold,color:COLORS.navy}}>₹{tx.amount.toLocaleString()}</span>
                  </div>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
                    <span style={{background:tc.bg,color:tc.text,borderRadius:'6px',padding:'2px 8px',fontSize:'11px',fontWeight:700}}>{tc.label}</span>
                    <span style={{background:sc.bg,color:sc.text,borderRadius:'99px',padding:'2px 8px',fontSize:'11px',fontWeight:600,textTransform:'capitalize'}}>{tx.status}</span>
                    <span style={{fontSize:'11px',color:COLORS.muted}}>{tx.date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AdminPageShell>
    </>
  )
}
