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

function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/918137011855"
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

  return (
    <>
      <div id="home">
        <MotionSection className="w-full">
         <ImageSlider />
        </MotionSection>
      </div>

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

      {/* Full-width OurProducts section */}
      <MotionSection className="w-full">
        <OurProducts id="products" />
      </MotionSection>

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
    </>
  );
}
