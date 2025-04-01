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


export default function Home2() {
  return (
    <div>
      <ImageSlider />

      <div className="max-w-screen-2xl mx-auto px-4">
        <AboutUs id="about"/>
      </div>

      {/* Full-width OurProducts section */}
      <OurProducts id="products" />

      <div className="max-w-screen-2xl mx-auto px-4">
        <CounterStats/>
        <TestimonialSection id="testimonials"/>
        <ContactSection id="contact"/>
      </div>
    </div>
  );
}
