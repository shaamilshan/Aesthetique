
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";


export default function ContactSection({ id }) {
  return (
    <>
      <section className="py-16 bg-[#fffaf7]" id={id}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Get In Touch</h2>
          <p className="text-center text-gray-600 mb-10">We'd love to hear from you! Reach out for consultations, inquiries, or feedback about our skincare solutions.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Contact Form */}
            <div className="bg-white rounded-xl shadow p-8 flex flex-col justify-center">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input type="text" required placeholder="Enter your full name" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input type="email" required placeholder="your.email@example.com" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Message *</label>
                  <textarea required placeholder="Tell us how we can help you..." className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <button type="submit" className="w-full bg-orange-500 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-orange-600 transition">
                  <span><svg width="18" height="18" fill="currentColor" className="inline"><path d="M2 16l14-7-14-7v5l9 2-9 2z"/></svg></span>
                  Send Message
                </button>
              </form>
            </div>
            {/* Right: Contact Info Cards */}
            <div className="flex flex-col gap-4 justify-center">
              <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-start">
                <FaMapMarkerAlt className="text-orange-500 text-xl mt-1" />
                <div>
                  <div className="font-bold text-sm text-gray-700 mb-1">ADDRESS</div>
                  <div className="text-gray-700 text-sm">BEST MED AESTHETIQUE PVT LTD<br />2nd floor, No-16, Alex Square,<br />Opposite to Amirtha School, Ettimadai,<br />Coimbatore, Tamil Nadu - 641112</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-center">
                <FaEnvelope className="text-orange-500 text-xl" />
                <div>
                  <div className="font-bold text-sm text-gray-700 mb-1">EMAIL</div>
                  <div className="text-gray-700 text-sm">bmaesthetique@gmail.com</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-center">
                <FaPhoneAlt className="text-orange-500 text-xl" />
                <div>
                  <div className="font-bold text-sm text-gray-700 mb-1">PHONE</div>
                  <div className="text-gray-700 text-sm">+91 81370 11855</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-center">
                <FaClock className="text-orange-500 text-xl" />
                <div>
                  <div className="font-bold text-sm text-gray-700 mb-1">BUSINESS HOURS</div>
                  <div className="text-gray-700 text-sm">Mon - Sat: 10:00 AM - 5:00 PM<br />Sundays: Closed</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-center">
                <div className="font-bold text-sm text-gray-700 mb-1">FOLLOW US</div>
                <div className="flex gap-3 mt-1">
                  <a href="#" className="text-orange-500 hover:text-orange-600"><FaInstagram /></a>
                  <a href="#" className="text-orange-500 hover:text-orange-600"><FaFacebookF /></a>
                  <a href="#" className="text-orange-500 hover:text-orange-600"><FaTwitter /></a>
                  <a href="#" className="text-orange-500 hover:text-orange-600"><FaLinkedinIn /></a>
                  <a href="#" className="text-orange-500 hover:text-orange-600"><FaWhatsapp /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Us On The Map</h3>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.324232747081!2d76.9148583153347!3d10.90276349222159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85a7e2e2e2e2f%3A0x2e2e2e2e2e2e2e2e!2sBEST%20MED%20AESTHETIQUE%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
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