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
  return (
    <>
      <ImageSlider />

      <div className="max-w-screen-2xl mx-auto px-4">
        <AboutUs id="about"/>
      </div>

      {/* Full-width OurProducts section */}
      <OurProducts id="products" />

      <div className="max-w-screen-2xl mx-auto px-4">
        {/* <CounterStats/> */}
        {/* <TestimonialSection id="testimonials"/> */}
        <ContactSection id="contact"/>
      </div>

      <WhatsAppFloatingButton />
    </>
  );
}
