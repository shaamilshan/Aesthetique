
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";


export default function ContactSection({ id }) {
  return (
    <>
      <section className="py-16 bg-white" id={id}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Header Section - Center Aligned */}
          <div className="text-center mb-12">
            <button
              className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
              type="button"
            >
              Contact Us
            </button>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Get In <span className="font-serif italic">Touch</span>
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              We'd love to hear from you! Reach out for consultations, inquiries, or feedback about our skincare solutions.
            </p>
          </div>


          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Contact Form */}
            <div className="bg-gray-50 rounded-3xl  p-8 flex flex-col justify-center border border-gray-100">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                  <input type="text" required placeholder="Enter your full name" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required placeholder="your.email@example.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
                  <textarea required placeholder="Tell us how we can help you..." className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-colors" />
                </div>
                <button type="submit" className="w-full bg-black text-white font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-200">
                  <span><svg width="18" height="18" fill="currentColor" className="inline"><path d="M2 16l14-7-14-7v5l9 2-9 2z"/></svg></span>
                  Send Message
                </button>
              </form>
            </div>
            {/* Right: Contact Info Cards */}
            <div className="flex flex-col gap-4 justify-center">
              <div className="bg-white rounded-3xl  p-6 flex gap-4 items-start border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <FaMapMarkerAlt className="text-[#A53030] text-xl mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm text-gray-900 mb-2">ADDRESS</div>
                  <div className="text-gray-600 text-sm leading-relaxed">BEST MED AESTHETIQUE PVT LTD<br />2nd floor, No-16, Alex Square,<br />Opposite to Amirtha School, Ettimadai,<br />Coimbatore, Tamil Nadu - 641112</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl  p-6 flex gap-4 items-center border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <FaEnvelope className="text-[#A53030] text-xl flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm text-gray-900 mb-2">EMAIL</div>
                  <div className="text-gray-600 text-sm">bmaesthetique@gmail.com</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl  p-6 flex gap-4 items-center border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <FaPhoneAlt className="text-[#A53030] text-xl flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm text-gray-900 mb-2">PHONE</div>
                  <div className="text-gray-600 text-sm">+91 81370 11855</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl  p-6 flex gap-4 items-center border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <FaClock className="text-[#A53030] text-xl flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm text-gray-900 mb-2">BUSINESS HOURS</div>
                  <div className="text-gray-600 text-sm leading-relaxed">Mon - Sat: 10:00 AM - 5:00 PM<br />Sundays: Closed</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl  p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="font-bold text-sm text-gray-900 mb-3">FOLLOW US</div>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#A53030] hover:bg-[#A53030] hover:text-white transition-colors duration-200"><FaInstagram /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#A53030] hover:bg-[#A53030] hover:text-white transition-colors duration-200"><FaFacebookF /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#A53030] hover:bg-[#A53030] hover:text-white transition-colors duration-200"><FaTwitter /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#A53030] hover:bg-[#A53030] hover:text-white transition-colors duration-200"><FaLinkedinIn /></a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#A53030] hover:bg-[#A53030] hover:text-white transition-colors duration-200"><FaWhatsapp /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <button
              className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
              type="button"
            >
              Visit Us
            </button>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Us On The <span className="font-serif italic">Map</span></h3>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.324232747081!2d76.9148583153347!3d10.90276349222159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85a7e2e2e2e2f%3A0x2e2e2e2e2e2e2e2e!2sBEST%20MED%20AESTHETIQUE%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}