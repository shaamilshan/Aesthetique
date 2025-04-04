import React from "react";

export default function ContactSection({id}) {
  return (
    <section className="p-8 bg-gray-50" id={id} >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Contact Form and Information */}
        <div >
          {/* Section Title */}
          <h2 data-aos="fade-up"  className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p data-aos="fade-up" className="text-gray-600 mb-6">
          Feel free to get in touch if you have any questions or need assistance!
          </p>

          {/* Contact Form */}
          <form data-aos="fade-up" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone number *</label>
              <input
                type="tel"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">How did you find us?</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#A53030] text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              SEND
            </button>
          </form>

          {/* Contact Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-sm font-medium text-gray-700">PHONE</h3>
              <p className="text-gray-600">03 5432 1234</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">FAX</h3>
              <p className="text-gray-600">03 5432 1234</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">EMAIL</h3>
              <p className="text-gray-600">info@marcc.com.au</p>
            </div>
          </div>
        </div>

        {/* Right Side: Map */}
        <div    className="h-full">
          <h3 data-aos="fade-up" className="text-lg font-bold text-gray-800 mb-4">Our Locations</h3>
          <div data-aos="fade-up" className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d6a32f7f1f8e!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633033226785!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}