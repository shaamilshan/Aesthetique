import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { commonRequest } from "../../../../Common/api";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    title: "",
    content: "",
    status: "active",
    priority: "medium",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    isMarquee: true,
    // new customization options
    bgColor: "#ffffff",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    fontSize: 16,
    fontColor: '#111827'
  });

  // font key -> CSS font-family mapping
  const FONT_MAP = {
    system: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    Arial: "Arial, Helvetica, sans-serif",
    Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    Georgia: "Georgia, 'Times New Roman', Times, serif",
    Times: "'Times New Roman', Times, serif",
    Poppins: "'Poppins', 'Helvetica Neue', Arial, sans-serif",
    Montserrat: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
    Roboto: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    Lato: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  };

  const GOOGLE_FONTS = ["Poppins", "Montserrat", "Roboto", "Lato"];

  const loadGoogleFont = (fontName) => {
    if (!fontName) return;
    try {
      const familyParam = encodeURIComponent(fontName);
      const id = `gf-${fontName.replace(/\s+/g, '-')}`;
      if (document.getElementById(id)) return; // already loaded

      // preconnect for performance (only once)
      if (!document.getElementById('gf-preconnect')) {
        const pre1 = document.createElement('link');
        pre1.rel = 'preconnect';
        pre1.href = 'https://fonts.googleapis.com';
        pre1.id = 'gf-preconnect';
        document.head.appendChild(pre1);
        const pre2 = document.createElement('link');
        pre2.rel = 'preconnect';
        pre2.href = 'https://fonts.gstatic.com';
        pre2.crossOrigin = '';
        document.head.appendChild(pre2);
      }

      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      // request common weights to be safe
      link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    } catch (err) {
      // fail silently
      console.warn('Failed to load google font', fontName, err);
    }
  };
  
  // load a custom Google Fonts link (user-provided)
  const loadCustomGoogleLink = (link) => {
    if (!link) return;
    try {
      const id = `gf-custom-${btoa(link).slice(0, 8)}`;
      if (document.getElementById(id)) return;

      // remove any previous custom gf links we've added to avoid duplicates
      Array.from(document.querySelectorAll('[id^="gf-custom-"]')).forEach((el) => el.remove());

      const l = document.createElement('link');
      l.id = id;
      l.rel = 'stylesheet';
      l.href = link;
      document.head.appendChild(l);

      // attempt to parse family name from the link and set fontFamily
      const m = link.match(/[?&]family=([^:&]+)/);
      if (m && m[1]) {
        const fam = decodeURIComponent(m[1]).split(':')[0].replace(/\+/g, ' ');
        // set a sensible CSS font-family using the parsed family
        setCurrentAnnouncement((s) => ({ ...s, fontFamily: `"${fam}", ${FONT_MAP.system}` }));
      }
    } catch (err) {
      console.warn('Failed to load custom google link', err);
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("manage"); // 'manage' or 'marquee'

  const loadAnnouncements = async (page = 1) => {
    setLoading(true);
    try {
      const res = await commonRequest("get", `/admin/announcements?page=${page}&limit=10`);
      if (res.success) {
        setAnnouncements(res.data || []);
        setTotalPages(res.totalPages || 1);
        setCurrentPage(res.currentPage || 1);
      }
    } catch (err) {
      console.error("Failed to load announcements", err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "manage") {
      loadAnnouncements();
    }
  }, [activeTab]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let res;
      // Force announcements to always be marquee-enabled
      const payload = { ...currentAnnouncement, isMarquee: true };
      if (isEditing) {
        res = await commonRequest("patch", `/admin/announcements/${currentAnnouncement._id}`, payload);
      } else {
        res = await commonRequest("post", "/admin/announcements", payload);
      }
      
      if (res.success) {
        setSuccess(isEditing ? "Announcement updated successfully" : "Announcement created successfully");
        loadAnnouncements();
        setIsModalOpen(false);
        setCurrentAnnouncement({
          title: "",
          content: "",
          status: "active",
          priority: "medium",
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          isMarquee: true,
          bgColor: "#ffffff",
          fontFamily: FONT_MAP.system,
          fontSize: 16,
          fontColor: '#111827',
          useGoogleFont: false,
          googleFontLink: ""
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error saving announcement", err);
      setError("Error saving announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await commonRequest("delete", `/admin/announcements/${id}`);
      if (res.success) {
        setSuccess("Announcement deleted successfully");
        loadAnnouncements();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting announcement", err);
      setError("Error deleting announcement");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentAnnouncement({
      title: "",
      content: "",
      status: "active",
      priority: "medium",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      isMarquee: true,
      bgColor: "#ffffff",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      fontSize: 16,
      fontColor: '#111827',
      useGoogleFont: false,
      googleFontLink: ""
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (announcement) => {
    setCurrentAnnouncement({
      ...announcement,
      startDate: announcement.startDate ? new Date(announcement.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: announcement.endDate ? new Date(announcement.endDate).toISOString().split('T')[0] : "",
      // ensure marquee is always enabled (hide the toggle in UI)
      isMarquee: true
      ,
      // preserve customization fields if present, otherwise set defaults
      bgColor: announcement.bgColor || "#ffffff",
      fontFamily: announcement.fontFamily || "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      fontSize: announcement.fontSize || 16,
      fontColor: announcement.fontColor || '#111827',
      // google link support
      useGoogleFont: announcement.useGoogleFont || false,
      googleFontLink: announcement.googleFontLink || ""
    });
    // If the announcement already had a custom google link, load it so preview shows correctly
    if (announcement.useGoogleFont && announcement.googleFontLink) {
      loadCustomGoogleLink(announcement.googleFontLink);
    }
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No end date";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "inactive":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case "high":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "medium":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "low":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // For backward compatibility - marquee management
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [marqueeLoading, setMarqueeLoading] = useState(false);

  const loadMarquee = async () => {
    setMarqueeLoading(true);
    try {
      const res = await commonRequest("get", "/admin/setting/marquee");
      // admin endpoint may return an object like { value: [...] } or an array
      let val = null;
      if (res && typeof res === "object" && Object.prototype.hasOwnProperty.call(res, "value")) {
        val = res.value;
      } else {
        val = res;
      }

      // Normalize to an array of {id, content} for editing
      if (Array.isArray(val)) {
        setMarqueeItems(val.map((v, idx) => ({ id: `marquee-${idx}-${Date.now()}`, content: v == null ? "" : String(v) })));
      } else if (typeof val === "string") {
        if (val.includes("\n")) {
          setMarqueeItems(val.split("\n").map((s) => s.trim()).filter(Boolean).map((s, idx) => ({ id: `marquee-${idx}-${Date.now()}`, content: s })));
        } else if (val.trim() === "") setMarqueeItems([]);
        else setMarqueeItems([{ id: `marquee-0-${Date.now()}`, content: val }]);
      } else {
        setMarqueeItems([]);
      }
    } catch (err) {
      console.warn("Failed to load marquee", err);
    } finally {
      setMarqueeLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "marquee") {
      loadMarquee();
    }
  }, [activeTab]);

  const handleMarqueeSave = async () => {
    setMarqueeLoading(true);
    try {
      // Prepare payload as an array of strings. Filter out empty entries.
      let payload = marqueeItems.map((it) => (it.content == null ? "" : String(it.content))).map((s) => s.trim()).filter(Boolean);
      
      await commonRequest("put", "/admin/setting/marquee", { value: payload });
      setSuccess("Marquee saved successfully");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setError("Error saving marquee");
    } finally {
      setMarqueeLoading(false);
    }
  };

  const addMarqueeItem = () => {
    setMarqueeItems(prev => [...prev, { id: `marquee-${prev.length}-${Date.now()}`, content: "" }]);
  };

  const updateMarqueeItem = (id, content) => {
    setMarqueeItems(prev => prev.map(item => item.id === id ? { ...item, content } : item));
  };

  const removeMarqueeItem = (id) => {
    setMarqueeItems(prev => prev.filter(item => item.id !== id));
  };

  const moveMarqueeItem = (id, direction) => {
    setMarqueeItems(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index === -1) return prev;
      
      const newItems = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
      
      // Swap items
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      return newItems;
    });
  };

  return (
    <div className="p-5 w-full text-sm">
      <div className="font-semibold">
        <h1 className="font-bold text-2xl">Announcement Management</h1>
        <BreadCrumbs list={["Dashboard", "Announcements"]} />
      </div>

      {/* Tabs for switching between management views */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "manage"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Manage Announcements
          </button>
          {/* <button
            onClick={() => setActiveTab("marquee")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "marquee"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Marquee Management
          </button> */}
        </nav>
      </div>

      {success && (
        <div className="mt-4 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {activeTab === "manage" && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Announcements</h2>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
            >
              + Add New Announcement
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading announcements...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {announcements && announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <tr key={announcement._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate" title={announcement.content}>
                              {announcement.content}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(announcement.status)}>
                              {announcement.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getPriorityBadge(announcement.priority)}>
                              {announcement.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(announcement.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(announcement.endDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openEditModal(announcement)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(announcement._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No announcements found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * 10, announcements.length + (currentPage - 1) * 10)}
                        </span> of{" "}
                        <span className="font-medium">{announcements.length + (currentPage - 1) * 10}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? "z-10 bg-black border-black text-white"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "marquee" && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Marquee Text</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Marquee Announcements (one per line)</label>
                <div className="space-y-2">
                  {marqueeItems.map((item, idx) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item.content}
                        onChange={(e) => updateMarqueeItem(item.id, e.target.value)}
                        className="w-full border px-3 py-2 rounded text-sm"
                        placeholder="Enter marquee text..."
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveMarqueeItem(item.id, 'up')}
                          disabled={idx === 0}
                          className={`px-2 py-1 text-xs rounded ${idx === 0 ? 'text-gray-300' : 'bg-gray-100'}`}
                          aria-label="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMarqueeItem(item.id, 'down')}
                          disabled={idx === marqueeItems.length - 1}
                          className={`px-2 py-1 text-xs rounded ${idx === marqueeItems.length - 1 ? 'text-gray-300' : 'bg-gray-100'}`}
                          aria-label="Move down"
                        >
                          ▼
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMarqueeItem(item.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      onClick={addMarqueeItem}
                      className="px-4 py-2 bg-gray-100 rounded text-sm"
                    >
                      + Add Marquee Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleMarqueeSave} 
                  disabled={marqueeLoading} 
                  className="px-4 py-2 bg-black text-white rounded text-sm"
                >
                  {marqueeLoading ? 'Saving...' : 'Save Marquee'}
                </button>
                <button 
                  onClick={loadMarquee} 
                  disabled={marqueeLoading} 
                  className="px-4 py-2 border rounded text-sm"
                >
                  Reload
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="p-3 border rounded text-sm text-gray-800">
              {marqueeItems && marqueeItems.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {marqueeItems.map((item, i) => (
                    <li key={item.id}>{item.content || <span className="text-gray-400">(empty)</span>}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500">(empty)</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating/editing announcements */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isEditing ? "Edit Announcement" : "Create New Announcement"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={currentAnnouncement.title}
                    onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, title: e.target.value})}
                    className="w-full border px-3 py-2 rounded text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    value={currentAnnouncement.content}
                    onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, content: e.target.value})}
                    className="w-full border px-3 py-2 rounded text-sm h-24"
                    required
                  />
                </div>

                {/* Customization controls: bg color, font family, font size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background color</label>
                    <input
                      type="color"
                      value={currentAnnouncement.bgColor}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, bgColor: e.target.value})}
                      className="w-full h-10 p-1 rounded"
                    />
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font color</label>
                      <input
                        type="color"
                        value={currentAnnouncement.fontColor}
                        onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, fontColor: e.target.value})}
                        className="w-full h-10 p-1 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font family</label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={currentAnnouncement.useGoogleFont || false}
                          onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, useGoogleFont: e.target.checked})}
                          className="mr-2"
                        />
                        <span>Use Google font (paste link)</span>
                      </label>
                    </div>
                    {!currentAnnouncement.useGoogleFont && (
                      <select
                        value={Object.keys(FONT_MAP).find(k => FONT_MAP[k] === currentAnnouncement.fontFamily) || 'system'}
                        onChange={(e) => {
                          const key = e.target.value;
                          const family = FONT_MAP[key] || FONT_MAP.system;
                          setCurrentAnnouncement({ ...currentAnnouncement, fontFamily: family });
                          if (GOOGLE_FONTS.includes(key)) loadGoogleFont(key);
                        }}
                        className="w-full border px-3 py-2 rounded text-sm mt-2"
                      >
                        <option value={"system"}>System</option>
                        <option value={"Arial"}>Arial</option>
                        <option value={"Helvetica"}>Helvetica</option>
                        <option value={"Georgia"}>Georgia</option>
                        <option value={"Times"}>Times</option>
                        <option value={"Poppins"}>Poppins (Google)</option>
                        <option value={"Montserrat"}>Montserrat (Google)</option>
                        <option value={"Roboto"}>Roboto (Google)</option>
                        <option value={"Lato"}>Lato (Google)</option>
                      </select>
                    )}
                    {currentAnnouncement.useGoogleFont && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Paste Google Fonts URL (https://fonts.googleapis.com/...)"
                          value={currentAnnouncement.googleFontLink || ''}
                          onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, googleFontLink: e.target.value})}
                          className="w-full border px-3 py-2 rounded text-sm"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => loadCustomGoogleLink(currentAnnouncement.googleFontLink)}
                            className="px-3 py-2 bg-black text-white rounded text-sm"
                          >
                            Apply Link
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentAnnouncement({...currentAnnouncement, googleFontLink: ''});
                              // remove previous custom links
                              Array.from(document.querySelectorAll('[id^="gf-custom-"]')).forEach((el) => el.remove());
                            }}
                            className="px-3 py-2 border rounded text-sm"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font size (px)</label>
                    <input
                      type="number"
                      min="10"
                      max="48"
                      value={currentAnnouncement.fontSize}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, fontSize: parseInt(e.target.value || 16)})}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                  </div>
                </div>

                {/* Live preview */}
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview</p>
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: currentAnnouncement.bgColor,
                      fontFamily: currentAnnouncement.fontFamily,
                      fontSize: `${currentAnnouncement.fontSize}px`,
                      color: currentAnnouncement.fontColor || '#111827'
                    }}
                  >
                    {currentAnnouncement.content || <span className="text-gray-500">(preview)</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={currentAnnouncement.status}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, status: e.target.value})}
                      className="w-full border px-3 py-2 rounded text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={currentAnnouncement.priority}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, priority: e.target.value})}
                      className="w-full border px-3 py-2 rounded text-sm"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={currentAnnouncement.startDate}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, startDate: e.target.value})}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={currentAnnouncement.endDate}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, endDate: e.target.value})}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  {/* Marquee is always enabled; hide the checkbox and keep a hidden value for semantics */}
                  <input type="hidden" name="isMarquee" value="true" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;