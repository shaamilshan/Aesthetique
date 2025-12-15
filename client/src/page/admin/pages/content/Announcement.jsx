import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { commonRequest } from "../../../../Common/api";

const Announcement = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await commonRequest("get", "/admin/setting/marquee");
      // admin endpoint returns the whole document with `value`
      const val = res && (res.value || res);
      setText(typeof val === "string" ? val : JSON.stringify(val));
    } catch (err) {
      console.warn("Failed to load announcement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await commonRequest("put", "/admin/setting/marquee", { value: text });
      setSuccess("Saved");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-full text-sm">
      <div className="font-semibold">
        <h1 className="font-bold text-2xl">Announcement / Marquee</h1>
        <BreadCrumbs list={["Dashboard", "Announcement"]} />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Marquee Text</h3>
            {success && <div className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded">{success}</div>}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Text shown in site marquee</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border px-3 py-2 rounded h-32 text-sm" />
            </div>

            <div className="flex gap-2">
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-black text-white rounded text-sm">{loading ? 'Saving...' : 'Save'}</button>
              <button onClick={load} disabled={loading} className="px-4 py-2 border rounded text-sm">Reload</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-medium mb-2">Preview</h3>
          <div className="p-3 border rounded text-sm text-gray-800">
            {text || <span className="text-gray-500">(empty)</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
