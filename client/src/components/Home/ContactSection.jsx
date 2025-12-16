
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { commonRequest } from '../../Common/api';
import FAQAccordion from '../../components/FAQAccordion';


export default function ContactSection({ id }) {
  const [openIndex, setOpenIndex] = useState(null);

  const defaultFaqs = [
    {
      q: "How often should I apply sunscreen?",
      a: "Apply sunscreen every morning as the last step of your skincare routine and reapply every 2-3 hours when exposed to the sun, or after swimming/sweating.",
    },
    {
      q: "Can I use serum and sunscreen together?",
      a: "Yes — apply your serum first, allow it to absorb, then follow with sunscreen. Our RadiantBoost serum layers well under AquaShield sunscreen.",
    },
    {
      q: "Is AquaShield suitable for oily skin?",
      a: "AquaShield is formulated to be lightweight and non-greasy, making it suitable for most skin types including oily and combination skin.",
    },
    {
      q: "Do your products contain fragrances?",
      a: "Some of our products are fragrance-free; check the product page for full ingredient lists. We strive to provide gentle formulations for sensitive skin.",
    },
    {
      q: "What SPF level do your sunscreens provide?",
      a: "Our AquaShield sunscreen provides broad-spectrum protection with SPF 50+, protecting against both UVA and UVB rays. Always check the product label for specific SPF and reapply as needed.",
    },
    {
      q: "Are your products safe to use during pregnancy or breastfeeding?",
      a: "Many of our formulations are considered safe during pregnancy, but ingredient sensitivities can vary. If you're pregnant or nursing, consult your healthcare provider or check the product ingredient list before use.",
    },
    {
      q: "How water-resistant is the sunscreen?",
      a: "Our sunscreen is water-resistant for up to 80 minutes. After swimming or heavy sweating, reapply immediately for continued protection.",
    },
    {
      q: "Do I need to patch test new skincare products?",
      a: "Patch testing is recommended for those with sensitive or reactive skin. Apply a small amount to the inner forearm for 48 hours to check for irritation before regular use.",
    },
    {
      q: "How should I store the products and what's the shelf life?",
      a: "Store products in a cool, dry place away from direct sunlight. Most products have a 12–24 month shelf life unopened; once opened, follow the PAO (period-after-opening) symbol on the packaging.",
    },
    {
      q: "What is your returns and exchange policy for skincare products?",
      a: "We accept returns and exchanges for unopened products within 14 days of delivery. Opened products can be returned only if they arrive damaged or defective—contact our support team with your order details.",
    },
  ];


  const [faqs, setFaqs] = useState(defaultFaqs);
  const [faqsLoading, setFaqsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchFaqs = async () => {
      setFaqsLoading(true);
      try {
        // Public endpoint
        const res = await commonRequest('get', '/public/faqs');
        // commonRequest returns axios response object or data depending on interceptor; handle both
        const data = res && res.faqs ? res.faqs : (res && res.data && res.data.faqs) ? res.data.faqs : null;
        if (mounted && Array.isArray(data)) setFaqs(data.map(f => ({ q: f.question, a: f.answer })));
      } catch (err) {
        // keep defaults on error
        console.warn('Failed to load FAQs', err);
      } finally {
        if (mounted) setFaqsLoading(false);
      }
    };
    fetchFaqs();
    return () => { mounted = false; };
  }, []);
  return (
    <>
      <section className="py-16 bg-white" id={id}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Large heading + contact details */}
            <div className="order-2 md:order-1">
              <button
                className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
                type="button"
              >
                Get in touch
              </button>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                We are always ready to help you and answer your <span className="font-serif italic">questions</span>
              </h1>
              <p className="text-sm text-gray-500 mb-8 max-w-lg">Reach out for consultations, product advice, or any questions about our sunscreen and serum range. We'll get back to you promptly.</p>

              <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Call Center</h4>
                  <div>800 100 975 20 34<br />(+123) 1800-234-5678</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Our Location</h4>
                  <div>Coimbatore, Tamil Nadu<br />Opposite Amirtha School</div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <div>bmaesthetique@gmail.com</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <a href="#" className="text-gray-500 hover:text-gray-800"><FaInstagram /></a>
                    <a href="#" className="text-gray-500 hover:text-gray-800"><FaFacebookF /></a>
                    <a href="#" className="text-gray-500 hover:text-gray-800"><FaLinkedinIn /></a>
                    <a href="#" className="text-gray-500 hover:text-gray-800"><FaWhatsapp /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div className="order-1 md:order-2">
              <div className="bg-gray-50 rounded-3xl p-8 md:p-12  border border-gray-100 max-w-md ml-auto">
                <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-sm text-gray-500 mb-6">Define your goals and identify areas where our products can add value to your skincare routine.</p>

                <form className="space-y-4">
                  <div>
                    <input placeholder="Full name" className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none" />
                  </div>
                  <div>
                    <input placeholder="Email" className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none" />
                  </div>
                  <div>
                    <input placeholder="Subject" className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none" />
                  </div>
                  <div>
                    <textarea placeholder="Message" className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none h-28 resize-none" />
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-full">
                      <span>Send a message</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </form>
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
      {/* FAQ Section - styled as left heading + right accordion like reference */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <button
                className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
                type="button"
              >
                Frequently asked questions
              </button>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Frequently asked <span className="font-serif italic ">questions</span></h2>

              <p className="text-sm text-gray-500 max-w-md">Find clear answers to common questions about our sunscreens and serums. From ingredients to usage and safety, everything is transparent, simple, and honest.</p>
            </div>

            <div>
              <FAQAccordion faqs={faqs} initialOpen={0} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}