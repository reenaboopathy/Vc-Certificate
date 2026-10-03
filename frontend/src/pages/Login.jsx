import { useEffect, useState } from "react";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login(){
  const {login, isAuthenticated}=useAuth(), nav=useNavigate(), location=useLocation();
  const [email,setEmail]=useState(""), [password,setPassword]=useState(""), [show,setShow]=useState(false);
  const [error,setError]=useState(""), [busy,setBusy]=useState(false);

  useEffect(()=>{ if(isAuthenticated) nav(location.state?.from?.pathname || "/", {replace:true}); },[isAuthenticated]);
  if(isAuthenticated) return null;

  const submit=async e=>{
    e.preventDefault(); setBusy(true); setError("");
    try{ await login(email,password); nav(location.state?.from?.pathname || "/", {replace:true}); }
    catch(err){ setError(err.message); }
    finally{ setBusy(false); }
  };

  return <div className="login-page"><div className="login-orb one"/><div className="login-orb two"/><main className="login-wrap">
    <section className="login-showcase"><div className="login-brand"><div className="brand-mark"><ShieldCheck/></div><div><b>VC MANAGER</b><span>Certificate Management</span></div></div>
      <div className="showcase-copy"><div className="eyebrow">VERIFICATION OPERATIONS</div><h1>Every certificate.<br/><em>Under control.</em></h1><p>A focused workspace for customers, weighing scales, verification certificates, renewals, follow-ups and payments.</p><div className="showcase-points"><span><CheckCircle2/> Certificate expiry tracking</span><span><CheckCircle2/> Renewal follow-up workflow</span><span><CheckCircle2/> Payments & invoice records</span></div></div>
    </section>
    <section className="login-card"><div className="login-heading"><div className="eyebrow">SECURE ACCESS</div><h2>Welcome back</h2><p>Sign in to continue to your operations workspace.</p></div>
      <form onSubmit={submit}>
        <label className="field"><span>Email address</span><div className="input-icon"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username"/></div></label>
        <label className="field"><span>Password</span><div className="input-icon"><Lock size={18}/><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/><button type="button" onClick={()=>setShow(!show)} aria-label="Show password">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {error&&<div className="login-error">{error}</div>}
        <button className="login-submit" disabled={busy}>{busy?"Signing in…":<>Sign in <ArrowRight size={18}/></>}</button>
      </form>
      <div className="no-demo-note"><ShieldCheck size={16}/><span>Use your administrator email and password.</span></div>
    </section>
  </main></div>
}
