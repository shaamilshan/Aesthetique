import { useState } from "react";

export default function FAQAccordion({ faqs = [], initialOpen = null }) {
  const [openIndex, setOpenIndex] = useState(initialOpen);

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-4 py-4 md:py-5 text-left"
              aria-expanded={open}
            >
              <span className="font-medium text-gray-800">{f.q}</span>
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-100">
                <svg className={`w-4 h-4 text-violet-600 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            <div
              className={`px-4 pb-5 text-sm text-gray-600 transition-all duration-300 ${open ? 'block' : 'hidden'}`}
            >
              {f.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
