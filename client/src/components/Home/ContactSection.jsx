
import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { commonRequest } from '../../Common/api';
import FAQAccordion from '../../components/FAQAccordion';
import emailjs from '@emailjs/browser';


export default function ContactSection({ id }) {
  const [openIndex, setOpenIndex] = useState(null);
  const formRef = useRef();

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSubmitMessage({ type: '', text: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare template parameters with submitted_at timestamp
      const templateParams = {
        full_name: formData.full_name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submitted_at: new Date().toLocaleString()
      };

      // Send email using EmailJS
      await emailjs.send(
        'service_4fs8no7',      // Service ID
        'template_jtlajch',     // Template ID
        templateParams,
        '157EmcNlKJNcCyE25'     // Public Key
      );

      // Success
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
      });

      // Clear form
      setFormData({
        full_name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Oops! Something went wrong. Please try again or contact us directly at help.bmaesthetique@gmail.com'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // External directions/share link provided by user (used for the external open link)
  const externalMapUrl = "https://www.google.com/maps/dir//2nd+Floor,+Room+No.+16,+Alex+Square,+Best+Med+Aesthetique+Pvt+Ltd,+opposite+to+Amritha+School,+Ettimadai,+Coimbatore,+Tamil+Nadu+641112/@11.3075357,75.8882503,15z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x3ba85b8f99aa4db7:0x5ef94650ef08df91!2m2!1d76.9241763!2d10.9590929?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D";

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
              <p className="text-sm text-gray-500 mb-8 max-w-lg">reach out for product advice, product advice, or any questions about our sunscreen and serum range. We'll get back to you promptly.</p>

              <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Our Location</h4>
                  <div>2nd floor, No-16, Alex Square,<br></br> opposite to Amirtha School, Ettimadai,<br></br> Coimbatore, Tamil Nadu <br></br>PIN CODE - 641112</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Call Center</h4>
                  <div className="mt-1"><a href="tel:8137011855" className="text-blue-600 hover:underline"> +91 837011855</a></div>
                </div>


                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <div className="text-xs md:text-sm break-words">help.bmaesthetique@gmail.com</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <a href="#" className="text-gray-500 hover:text-gray-800"><FaInstagram /></a>
                    <a href="#" className="text-gray-500 hover:text-gray-800"><FaFacebookF /></a>
                    {/* <a href="#" className="text-gray-500 hover:text-gray-800"><FaLinkedinIn /></a> */}
                    <a href="https://wa.me/918137011855" className="text-gray-500 hover:text-gray-800"><FaWhatsapp /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div className="order-1 md:order-2">
              <div className="bg-gray-50 rounded-3xl p-8 md:p-12  border border-gray-100 max-w-md ml-auto">
                <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-sm text-gray-500 mb-6">Define your goals and identify areas where our products can add value to your skincare routine.</p>

                {/* Success/Error Message */}
                {submitMessage.text && (
                  <div className={`mb-4 p-4 rounded-lg ${submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <p className="text-sm">{submitMessage.text}</p>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className={`w-full bg-transparent border-b py-3 focus:outline-none ${errors.full_name ? 'border-red-500' : 'border-gray-200'
                        }`}
                      disabled={isSubmitting}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`w-full bg-transparent border-b py-3 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      className={`w-full bg-transparent border-b py-3 focus:outline-none ${errors.subject ? 'border-red-500' : 'border-gray-200'
                        }`}
                      disabled={isSubmitting}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Message"
                      className={`w-full bg-transparent border-b py-3 focus:outline-none h-28 resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'
                        }`}
                      disabled={isSubmitting}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-full transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                        }`}
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send a message'}</span>
                      {!isSubmitting && (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      )}
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
            {/* Optional external map link (opens in new tab) */}
            <div className="p-4 text-right">
              <a
                href={externalMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.0566577919026!2d76.92160127510279!3d10.959092889201038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85b8f99aa4db7%3A0x5ef94650ef08df91!2sBest%20Med%20Aesthetique%20Pvt%20Ltd.!5e0!3m2!1sen!2sin!4v1767626523992!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
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