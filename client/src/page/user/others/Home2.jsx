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
import { FaWhatsapp } from "react-icons/fa";
import useBanner from "@/hooks/useBanner";
import { URL } from "@/Common/api";
import fallbackBanner from "@/assets/homebnnr/b1.jpg";

function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/918137011855"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg p-5 flex items-center justify-center hover:scale-105 transition"
      style={{ boxShadow: "0 4px 32px rgba(39, 174, 96, 0.25)" }}
      aria-label="WhatsApp"
    >
      <FaWhatsapp className="text-white text-4xl" />
    </a>
  );
}

export default function Home2(props) {
  const { banners, loading, error } = useBanner();

  return (
    <>
      <div id="home">
        <ImageSlider />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4">
        <AboutUs id="about"/>
      </div>

      {/* Banner 1 - Between About Us and Products */}
      {!loading && banners.banner1?.image && (
        <div className="px-4 md:px-8 lg:px-12">
          <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] w-full rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={`${URL}/img/${banners.banner1.image}`}
              alt="Home Banner" 
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </div>
        </div>
      )}

      {/* Fallback banner 1 if no image */}
      {!loading && !banners.banner1?.image && (
        <div className="px-4 md:px-8 lg:px-12">
          <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] w-full rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={fallbackBanner} 
              alt="The Greatest Natural Beauty is Happening to You" 
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </div>
        </div>
      )}

      {/* Banner 2 - Right below Banner 1, before Products */}
      {!loading && banners.banner2?.image && (
        <div className="px-4 md:px-8 lg:px-12 mt-16">
          <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] w-full rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={`${URL}/img/${banners.banner2.image}`}
              alt="Home Banner 2" 
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </div>
        </div>
      )}

      {/* Full-width OurProducts section */}
      <OurProducts id="products" />

      {/* Banner 3 - Between Products and Contact */}
      {!loading && banners.banner3?.image && (
        <div className="px-4 md:px-8 lg:px-12 my-16">
          <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] w-full rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={`${URL}/img/${banners.banner3.image}`}
              alt="Home Banner 3" 
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto px-4">
        {/* <CounterStats/> */}
        <TestimonialSection id="testimonials"/>
        <ContactSection id="contact"/>
      </div>

      <WhatsAppFloatingButton />
    </>
  );
}
