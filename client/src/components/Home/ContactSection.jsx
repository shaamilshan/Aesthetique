import { useState } from "react";
import bgImage from "../../assets/others/formbg.png"; // Import your image

const testimonials = [
  {
    name: "Ramesh",
    role: "Co-founder of Forpeople",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Gokul Sahaya",
    role: "Design director of Perfect Illustration",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Abhay",
    role: "Sr. Designer",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section
      className="relative px-12 py-0 my-0 rounded-3xl mx-auto max-w-5xl text-center min-h-screen flex items-center justify-center
      bg-center bg-contain bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }} // Ensures full background image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-60 rounded-3xl"></div>

      <div className="relative z-10">
        {/* Title and Description */}
        <h2 className="text-sm text-gray-500 uppercase">Our Client</h2>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">Testimonial</h3>
        <p className="text-gray-600 mt-3 text-sm max-w-lg mx-auto">
        When applied to building block a website or similar work product, a Visual Guide can be an intermediate step toward the end goal of a complete website. By creating a visual guide along the way, the designer or developer can get input from the other people involved in the website such as the customer, their manager, and other members of the team.
        </p>

        {/* Testimonials */}
        <div className="mt-8 flex overflow-hidden justify-center gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-500 p-4 rounded-xl bg-gray-100 flex items-center gap-4 w-64 ${
                activeIndex === index ? "scale-105 shadow-md" : "opacity-60"
              }`}
            >
              <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-red-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="relative mt-6 w-full h-1 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
          ></div>
        </div>

        {/* Auto-scroll (simulating slider behavior) */}
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full"
          onClick={nextTestimonial}
        >
          ➜
        </button>
      </div>
    </section>
  );
}
