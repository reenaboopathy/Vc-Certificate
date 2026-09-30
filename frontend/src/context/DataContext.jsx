import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);
const resources = ["customers","scales","certificates","renewals","followups","payments","invoices","users"];

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(Object.fromEntries(resources.map((r) => [r, []])));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!isAuthenticated) {
      setData(Object.fromEntries(resources.map((r) => [r, []])));
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    try {
      const values = await Promise.all(resources.map((r) => api.get(`/${r}`)));
      setData(Object.fromEntries(resources.map((r, i) => [r, Array.isArray(values[i]) ? values[i] : []])));
      setError("");
    } catch (e) {
      setError(e.message);
      if (/unauthorized|invalid|token/i.test(e.message)) {
        localStorage.removeItem("vc_user");
        localStorage.removeItem("vc_token");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [isAuthenticated]);

  const crud = (resource) => ({
    create: async (payload) => { const row = await api.post(`/${resource}`, payload); setData((d) => ({...d,[resource]:[row,...d[resource]]})); return row; },
    update: async (id, payload) => { const row = await api.put(`/${resource}/${id}`, payload); setData((d) => ({...d,[resource]:d[resource].map((x)=>x._id===id?row:x)})); return row; },
    remove: async (id) => { await api.del(`/${resource}/${id}`); setData((d) => ({...d,[resource]:d[resource].filter((x)=>x._id!==id)})); },
  });

  const value = useMemo(() => ({
    ...data, loading, error, refresh: load,
    customersApi: crud("customers"), scalesApi: crud("scales"), certificatesApi: crud("certificates"),
    renewalsApi: crud("renewals"), followupsApi: crud("followups"), paymentsApi: crud("payments"),
    invoicesApi: crud("invoices"), usersApi: crud("users"),
  }), [data, loading, error, isAuthenticated]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export const useData = () => useContext(DataContext);
