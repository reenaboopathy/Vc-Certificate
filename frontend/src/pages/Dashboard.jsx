import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Scale, FileCheck2, RefreshCcw, IndianRupee, AlertTriangle, ArrowUpRight, CalendarClock, Plus } from "lucide-react";
import { api } from "../services/api";
import { useData } from "../context/DataContext";
import { money, status } from "../components/CrudPage";
import "./Dashboard.css";

export default function Dashboard(){
 const d=useData(); const [stats,setStats]=useState(null);
 useEffect(()=>{api.get("/dashboard").then(setStats).catch(()=>{})},[d.customers.length,d.certificates.length,d.payments.length,d.renewals.length]);
 const cards=[
  ["Customers",stats?.customers??d.customers.length,Users,"/customers"],
  ["Weighing Scales",stats?.scales??d.scales.length,Scale,"/scales"],
  ["Certificates",stats?.certificates??d.certificates.length,FileCheck2,"/certificates"],
  ["Pending Renewals",stats?.renewalsPending??d.renewals.filter(x=>x.status==="Pending").length,RefreshCcw,"/renewals"],
 ];
 const expiring=d.certificates.filter(c=>{const days=(new Date(c.expiryDate)-new Date())/86400000;return days>=0&&days<=30});
 return <div className="page dashboard">
  <div className="dashboard-hero">
   <div><div className="eyebrow">OPERATIONS OVERVIEW</div><h1>Good morning, Admin <span>✦</span></h1><p>Here’s what needs your attention across certificates, renewals and collections.</p></div>
   <div className="hero-actions"><Link className="btn btn-secondary" to="/follow-ups"><CalendarClock size={17}/> Follow-ups</Link><Link className="btn btn-primary" to="/certificates"><Plus size={17}/> New Certificate</Link></div>
  </div>
  <div className="stat-grid">{cards.map(([label,value,Icon,to])=><Link to={to} className="stat-card" key={label}><div className="stat-icon"><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong></div><ArrowUpRight className="stat-arrow" size={17}/></Link>)}</div>
  <div className="dashboard-grid">
   <section className="card panel"><div className="panel-head"><div><div className="eyebrow">ATTENTION</div><h2>Expiring in 30 days</h2></div><Link to="/certificates">View all</Link></div>
   {expiring.length?expiring.slice(0,5).map(c=><div className="attention-row" key={c._id}><div className="mini-icon warning"><AlertTriangle size={17}/></div><div className="grow"><b>{c.customerName||"Customer"}</b><span>{c.certificateNumber||"Certificate"} · expires {c.expiryDate||"—"}</span></div>{status("Expiring Soon")}</div>):<div className="empty compact"><FileCheck2 size={28}/><b>No urgent certificates</b><span>You're clear for the next 30 days.</span></div>}
   </section>
   <section className="card panel revenue"><div className="panel-head"><div><div className="eyebrow">COLLECTIONS</div><h2>Payment summary</h2></div><Link to="/payments">Payments</Link></div><div className="revenue-big"><div className="revenue-icon"><IndianRupee size={21}/></div><div><span>Paid revenue</span><strong>{money(stats?.revenue||d.payments.filter(p=>p.status==="Paid").reduce((s,p)=>s+Number(p.amount||0),0))}</strong></div></div><div className="progress-line"><span>Recorded payments</span><b>{d.payments.length}</b></div><div className="progress"><i style={{width:`${Math.min(100,d.payments.length*10)}%`}}/></div></section>
  </div>
 </div>
}
