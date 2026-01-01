import React, { useEffect, useState, useRef } from "react";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { commonRequest } from "../../../../Common/api";
import { Edit2, Trash2, Search } from "lucide-react";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "", order: 0, isActive: true });
  const [query, setQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const formRef = useRef(null);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const res = await commonRequest("get", "/admin/faqs");
      const data = res && res.faqs ? res.faqs : (res && res.data && res.data.faqs ? res.data.faqs : []);
      setFaqs(data);
    } catch (err) {
      console.warn("Failed to load faqs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await commonRequest("patch", `/admin/faq/${editing}`, form);
      else await commonRequest("post", "/admin/faq", form);
      setForm({ question: "", answer: "", order: 0, isActive: true });
      setEditing(null);
      await loadFaqs();
      setSuccessMessage(editing ? "FAQ updated" : "FAQ created");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (f) => {
    setEditing(f._id);
    setForm({ question: f.question, answer: f.answer, order: f.order || 0, isActive: f.isActive });
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await commonRequest("delete", `/admin/faq/${id}`);
      await loadFaqs();
      setSuccessMessage("FAQ deleted");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = faqs.filter((f) => f.question.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-5 w-full overflow-x-auto text-sm">
      <div className="font-semibold">
        <h1 className="font-bold text-2xl">FAQ Management</h1>
        <BreadCrumbs list={["Dashboard", "FAQ Management"]} />
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">All FAQs</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions" className="pl-10 pr-3 py-2 border rounded w-72 text-sm" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <button
                  onClick={() => {
                    setEditing(null);
                    setForm({ question: "", answer: "", order: 0, isActive: true });
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-black text-white rounded text-sm"
                >
                  New FAQ
                </button>
              </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((f) => (
                  <div key={f._id} className="flex items-start justify-between gap-4 p-4 border rounded hover:shadow-sm transition">
                    <div className="flex-1 pr-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-semibold text-gray-900">{f.question}</div>
                        <div className="flex items-center gap-2">
                          <div className={`text-xs px-2 py-1 rounded-full ${f.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{f.isActive ? "Active" : "Inactive"}</div>
                          <div className="text-xs text-gray-500">Order: {f.order || 0}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 line-clamp-3">{f.answer}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => handleEdit(f)} className="flex items-center gap-2 px-3 py-1 rounded bg-yellow-50 text-yellow-800 text-sm"><Edit2 size={14} /> Edit</button>
                      <button onClick={() => handleDelete(f._id)} className="flex items-center gap-2 px-3 py-1 rounded bg-red-50 text-red-700 text-sm"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && <div className="text-sm text-gray-500">No FAQs found.</div>}
              </div>
            )}
          </div>
        </div>

        <div ref={formRef}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">{editing ? "Edit FAQ" : "Create FAQ"}</h3>
              {successMessage && <div className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded">{successMessage}</div>}
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Question</label>
                <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full border px-3 py-2 rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Answer</label>
                <textarea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full border px-3 py-2 rounded h-32 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full border px-3 py-2 rounded text-sm" />
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-black text-white rounded text-sm">{editing ? "Update" : "Create"}</button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ question: "", answer: "", order: 0, isActive: true }); }} className="px-4 py-2 border rounded text-sm">Cancel</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
