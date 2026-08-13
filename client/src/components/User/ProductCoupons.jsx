import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Tag, Ticket, Check, Copy, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

const ProductCoupons = ({ productId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const fetchProductCoupons = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${URL}/user/product-coupons/${productId}`,
          { ...config, withCredentials: true }
        );
        if (data && data.coupons) {
          setCoupons(data.coupons);
        }
      } catch (error) {
        console.error("Failed to fetch product coupons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductCoupons();
  }, [productId]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="my-4 p-4 rounded-xl border border-dashed border-gray-200 bg-emerald-50/30 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
        <div className="h-16 w-full bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return null; // Don't show anything if no coupons are available
  }

  const displayedCoupons = expanded ? coupons : coupons.slice(0, 2);

  return (
    <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-emerald-100/30 border border-emerald-200/70 shadow-xs transition-all duration-300">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/50">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
            <Tag size={16} />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5">
              Available Offers & Coupons
              <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            </h3>
            <p className="text-xs text-gray-500">
              {coupons.length} coupon{coupons.length > 1 ? "s" : ""} applicable for this product
            </p>
          </div>
        </div>
        {coupons.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-100/60 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                View All ({coupons.length}) <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Coupons List */}
      <div className="space-y-2.5">
        {displayedCoupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          const discountLabel =
            coupon.type === "percentage"
              ? `${coupon.value}% OFF`
              : `₹${coupon.value} OFF`;

          return (
            <div
              key={coupon._id || coupon.code}
              className="group relative bg-white hover:bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden"
            >
              {/* Left edge ticket notch design effect */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 hidden sm:block"></div>

              {/* Coupon Info */}
              <div className="flex items-start gap-3 sm:pl-3">
                <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-700 font-bold shrink-0 mt-0.5">
                  <Ticket size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300/60 tracking-wide font-mono">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-gray-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {discountLabel}
                    </span>
                    {coupon.isFirstOrder && (
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                        First Order
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-medium line-clamp-1">
                    {coupon.description}
                  </p>
                </div>
              </div>

              {/* Copy Code Button */}
              <div className="shrink-0 self-end sm:self-center w-full sm:w-auto">
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className={`w-full sm:w-auto text-xs font-bold px-3.5 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 border cursor-pointer ${
                    isCopied
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCoupons;
