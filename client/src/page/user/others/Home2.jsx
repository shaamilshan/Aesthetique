// import CategoriesGroup from "@/components/Home/CategoriesGroup";
import ImageSlider from "@/components/Home/ImageSlider";
// import LogoSlider from "@/components/Home/LogoSlider";
// import NewArrivals from "@/components/Home/NewArrivals";
import OurProducts from "@/components/Home/OurProducts";
// import ReviewSlider from "@/components/Home/ReviewSlider";
// import BestSellers from "@/components/Others/BestSellers";
// import CategorySection from "../../../components/Home/CategoryBar";
// import BannerSection from "../../../components/Home/InstaBanner"
// import ShopCatogories from "@/components/Others/ShopCatogories";
// import Marquee from "@/components/Home/Marquee";
// import RedBanner from "@/components/Home/redBanner";
import AboutUs from "@/components/Home/AboutUs";
import CounterStats from "@/components/Home/CounterStats";
import TestimonialSection from "@/components/Home/testimonials";
import ContactSection from "@/components/Home/ContactSection";
import MotionSection from "@/components/MotionSection";
import BannerCarousel from '@/components/Home/BannerCarousel';
import { FaWhatsapp } from "react-icons/fa";
import useBanner from "@/hooks/useBanner";
import { URL } from "@/Common/api";
import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import popupBg from "@/assets/others/about.jpg";

function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/7539995287"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg p-4 flex items-center justify-center hover:scale-105 transition"
      style={{ boxShadow: "0 4px 28px rgba(39, 174, 96, 0.24)" }}
      aria-label="WhatsApp"
    >
      <FaWhatsapp className="text-white text-3xl" />
    </a>
  );
}

export default function Home2(props) {
  const { banners, loading, error } = useBanner();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const lastClosed = localStorage.getItem("newsletter_popup_last_closed");
    const now = Date.now();
    
    // Show if never closed before, or if 1 minute (1 * 60 * 1000 ms) has passed
    if (!lastClosed || (now - parseInt(lastClosed, 10)) > 1 * 60 * 1000) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("newsletter_popup_last_closed", Date.now().toString());
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed successfully!");
      setShowModal(false);
      localStorage.setItem("newsletter_popup_last_closed", Date.now().toString());
    }
  };

  return (
    <>
      <div id="home">
        <MotionSection className="w-full">
         <ImageSlider />
        </MotionSection>
      </div>

         {/* Full-width OurProducts section */}
      <MotionSection className="w-full">
        <OurProducts id="products" />
      </MotionSection>

      <div className="max-w-screen-2xl mx-auto px-4">
        <MotionSection className="w-full">
          <AboutUs id="about" />
        </MotionSection>
      </div>

      {/* Banner 1 - Between About Us and Products */}
  {!loading && banners.banner1?.images && banners.banner1.images.length > 0 && (
  // small horizontal padding on mobile so banners have a little breathing room
  <MotionSection className="px-2 md:px-8 lg:px-12">
          {/* Use responsive aspect-ratio + min-height so the hero keeps its composition on small screens
              - lg: use the wide desktop ratio derived from current layout (152/45)
              - md: use 16:9 for tablets
              - default/mobile: 16:9 with a min height to avoid collapsing to a tiny/square area */}
          <div className="relative w-full rounded-md md:rounded-3xl overflow-hidden shadow-xl lg:aspect-[152/45] md:aspect-[16/9] aspect-[16/9] min-h-[220px]">
            {banners.banner1?.images && banners.banner1.images.length > 1 ? (
              <BannerCarousel
                images={banners.banner1.images.map(src => src.startsWith?.("http") ? src : `${URL}/img/${src}`)}
                alt="Home Banner"
              />
            ) : (
              <img
                src={banners.banner1.images?.[0]?.startsWith?.("http") ? banners.banner1.images?.[0] : `${URL}/img/${banners.banner1.image}`}
                alt="Home Banner"
                className="w-full h-full object-cover object-[50%_20%]"
              />
            )}
          </div>
        </MotionSection>
      )}

      {/* Banner 2 - Right below Banner 1, before Products */}
  {!loading && banners.banner2?.images && banners.banner2.images.length > 0 && (
  // reduce vertical gap on mobile; keep larger spacing on md/lg
  <MotionSection className="px-2 md:px-8 lg:px-12 mt-4 md:mt-16" delay={0.06}>
          {/* Match Banner1 behaviour on smaller screens to keep ratio consistent and avoid square crops */}
          <div className="relative w-full rounded-md md:rounded-3xl overflow-hidden shadow-xl lg:aspect-[152/45] md:aspect-[16/9] aspect-[16/9] min-h-[220px]">
            {banners.banner2?.images && banners.banner2.images.length > 1 ? (
              <BannerCarousel
                images={banners.banner2.images.map(src => src.startsWith?.("http") ? src : `${URL}/img/${src}`)}
                alt="Home Banner 2"
              />
            ) : (
              <img
                src={banners.banner2.images?.[0]?.startsWith?.("http") ? banners.banner2.images?.[0] : `${URL}/img/${banners.banner2.image}`}
                alt="Home Banner 2"
                className="w-full h-full object-cover object-[50%_20%]"
              />
            )}
          </div>
        </MotionSection>
      )}

   

      {/* Banner 3 - Between Products and Contact */}
  {!loading && banners.banner3?.images && banners.banner3.images.length > 0 && (
        // reduce vertical gap on mobile; keep larger spacing on md/lg (match Banner2)
        <MotionSection className="px-2 md:px-8 lg:px-12 mt-4 md:mt-16" delay={0.08}>
          {/* Match Banner1/Banner2 behaviour so all banners share the same responsive ratio and spacing */}
          <div className="relative w-full rounded-md md:rounded-3xl overflow-hidden shadow-xl lg:aspect-[152/45] md:aspect-[16/9] aspect-[16/9] min-h-[220px]">
            {banners.banner3?.images && banners.banner3.images.length > 1 ? (
              <BannerCarousel
                images={banners.banner3.images.map(src => src.startsWith?.("http") ? src : `${URL}/img/${src}`)}
                alt="Home Banner 3"
              />
            ) : (
              <img
                src={banners.banner3.images?.[0]?.startsWith?.("http") ? banners.banner3.images?.[0] : `${URL}/img/${banners.banner3.image}`}
                alt="Home Banner 3"
                className="w-full h-full object-cover object-[50%_20%]"
              />
            )}
          </div>
        </MotionSection>
      )}

      <div className="max-w-screen-2xl mx-auto px-4">
        {/* <CounterStats/> */}
        <MotionSection className="w-full" delay={0.04}>
          <TestimonialSection id="testimonials" />
        </MotionSection>
        <MotionSection className="w-full" delay={0.06}>
          <ContactSection id="contact" />
        </MotionSection>
      </div>

      <WhatsAppFloatingButton />

      {/* Newsletter Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row min-h-[450px] border border-gray-100">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black hover:scale-110 bg-white/80 rounded-full p-1.5 shadow-sm transition-all"
            >
              <HiX className="w-5 h-5" />
            </button>

            {/* Left Side: Newsletter Form */}
            <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center text-center md:text-left bg-white">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold tracking-widest text-gray-800 uppercase font-serif">
                  AESTHETIQUE
                </h2>
                <p className="text-[10px] tracking-widest text-gray-400 font-medium">
                  CANADA'S BEAUTY STORE
                </p>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 text-center uppercase tracking-tight font-serif leading-tight">
                WELCOME TO OUR WORLD OF BEAUTY
              </h3>

              <p className="text-gray-600 text-xs sm:text-sm text-center mb-4 leading-relaxed font-medium">
                Sign up to the Aesthetique newsletter & receive <span className="font-bold text-red-500">2X the points</span> on your first purchase.
              </p>

              <div className="text-center mb-6 text-gray-500 text-[11px] sm:text-xs font-semibold flex flex-wrap justify-center gap-1">
                <span>Exclusive offers</span>
                <span>•</span>
                <span>New Arrivals</span>
                <span>•</span>
                <span>Promotions</span>
                <span>•</span>
                <span>Beauty News</span>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3 w-full max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded transition-all text-xs sm:text-sm uppercase tracking-widest shadow"
                >
                  SUBSCRIBE
                </button>
              </form>

              <p className="text-[8px] text-gray-400 mt-4 leading-relaxed text-center">
                By submitting your email address, you agree to receive marketing emails. You can withdraw your consent at any time. View our Privacy Policy.
              </p>
            </div>

            {/* Right Side: Skincare Image */}
            <div className="hidden md:block md:w-[45%] relative overflow-hidden bg-gray-50">
              <img
                src={popupBg}
                alt="Skincare Products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
