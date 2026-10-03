import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye, X, FileText } from "lucide-react";

const empty = {};
export default function CrudPage({ title, eyebrow, description, resource, rows=[], fields=[], columns=[], api, onView, extraActions, headerActions }) {
  const [search,setSearch]=useState("");
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState(empty);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  const filtered=useMemo(()=>rows.filter(r=>!search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase())),[rows,search]);
  const startAdd=()=>{setEditing(null);setForm({});setOpen(true);setMessage("")};
  const startEdit=(row)=>{setEditing(row);setForm({...row});setOpen(true);setMessage("")};
  const save=async(e)=>{e.preventDefault();setSaving(true);setMessage("");try{editing?await api.update(editing._id,form):await api.create(form);setOpen(false)}catch(err){setMessage(err.message)}finally{setSaving(false)}};
  const remove=async(row)=>{if(window.confirm(`Delete ${row[columns[0]?.key] || "this record"}?`)) await api.remove(row._id)};
  return <div className="page">
    <div className="page-hero">
      <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
      {headerActions ? <div className="hero-actions">{headerActions}<button className="btn btn-primary" onClick={startAdd}><Plus size={18}/> Add New</button></div> : <button className="btn btn-primary" onClick={startAdd}><Plus size={18}/> Add New</button>}
    </div>
    <div className="toolbar card">
      <div className="searchbox"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`}/></div>
      <div className="toolbar-meta">{filtered.length} records</div>
    </div>
    <div className="card table-card">
      <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead>
      <tbody>{filtered.length ? filtered.map(row=><tr key={row._id}>
        {columns.map(c=><td key={c.key}>{c.render?c.render(row):row[c.key] || "—"}</td>)}
        <td><div className="row-actions">{onView&&<button className="icon-btn" title="View" onClick={()=>onView(row)}><Eye size={16}/></button>}<button className="icon-btn" title="Edit" onClick={()=>startEdit(row)}><Pencil size={16}/></button><button className="icon-btn danger" title="Delete" onClick={()=>remove(row)}><Trash2 size={16}/></button>{extraActions?.(row)}</div></td>
      </tr>):<tr><td colSpan={columns.length+1}><div className="empty"><FileText size={30}/><b>No records found</b><span>Add a record or change your search.</span></div></td></tr>}</tbody></table></div>
    </div>
    {open&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setOpen(false)}><div className="modal">
      <div className="modal-head"><div><div className="eyebrow">{editing?"EDIT":"NEW"} {title.toUpperCase()}</div><h2>{editing?"Update":"Add"} {title.replace(/s$/,"")}</h2></div><button className="icon-btn" onClick={()=>setOpen(false)}><X size={18}/></button></div>
      <form onSubmit={save}><div className="form-grid">{fields.map(f=><label className={`field ${f.wide?"wide":""}`} key={f.name}><span>{f.label}</span>{f.type==="select"?<select value={form[f.name]||""} onChange={e=>setForm({...form,[f.name]:e.target.value})} required={f.required}><option value="">Select {f.label}</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>:f.type==="combobox"?<><input list={`${resource}-${f.name}-options`} value={form[f.name]||""} onChange={e=>setForm({...form,[f.name]:e.target.value})} required={f.required}/><datalist id={`${resource}-${f.name}-options`}>{(f.options||[]).map(o=><option key={o} value={o}/>)}</datalist></>:f.type==="textarea"?<textarea rows="3" value={form[f.name]||""} onChange={e=>setForm({...form,[f.name]:e.target.value})} required={f.required}/>:<input type={f.type||"text"} value={form[f.name]||""} onChange={e=>setForm({...form,[f.name]:e.target.value})} required={f.required && !editing} placeholder={f.placeholder}/>}</label>)}</div>{message&&<div className="alert">{message}</div>}<div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving?"Saving...":editing?"Update":"Save Record"}</button></div></form>
    </div></div>}
  </div>
}
export const status=(value)=> <span className={`status ${String(value||"").toLowerCase().replace(/\s+/g,"-")}`}>{value||"—"}</span>;
export const money=(value)=>`₹${Number(value||0).toLocaleString("en-IN")}`;
