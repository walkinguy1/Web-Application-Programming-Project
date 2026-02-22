import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Facebook, Twitter, Globe, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure page starts at top when navigating from footer
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      console.log("Form Submitted:", formData);
      alert("Message received! Our team will reach out to you shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 font-sans">
      
      {/* BREADCRUMB / MINI NAV */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-gray-900">Contact Us</span>
      </div>

      {/* HEADER SECTION */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Customer Support
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">
            Let's <span className="text-blue-600">Connect.</span>
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl max-w-3xl font-medium leading-tight">
            We’re here to help you with anything you need. From order tracking to product advice, just drop us a line.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: CONTACT INFO (Col 4) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-xl bg-gray-900 text-white group-hover:bg-blue-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Email</h4>
                </div>
                <p className="text-lg font-bold text-gray-600 pl-14">support@zappstore.com</p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-xl bg-gray-900 text-white group-hover:bg-blue-600 transition-colors">
                    <Phone size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Phone</h4>
                </div>
                <p className="text-lg font-bold text-gray-600 pl-14">+977 9800000000</p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-xl bg-gray-900 text-white group-hover:bg-blue-600 transition-colors">
                    <MapPin size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Office</h4>
                </div>
                <p className="text-lg font-bold text-gray-600 pl-14">New Baneshwor, Kathmandu</p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-xl bg-gray-900 text-white group-hover:bg-blue-600 transition-colors">
                    <Clock size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Availability</h4>
                </div>
                <p className="text-lg font-bold text-gray-600 pl-14">Sun - Fri, 10AM - 7PM</p>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Socials</p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                  <button key={idx} className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM (Col 8) */}
          <div className="lg:col-span-8">
            <div className="bg-gray-50 p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sujal Shrestha"
                      className="w-full px-6 py-5 rounded-2xl bg-white border border-transparent focus:border-blue-500 outline-none transition-all font-bold shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sujal@example.com"
                      className="w-full px-6 py-5 rounded-2xl bg-white border border-transparent focus:border-blue-500 outline-none transition-all font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full px-6 py-5 rounded-2xl bg-white border border-transparent focus:border-blue-500 outline-none transition-all font-bold shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                  <textarea
                    required
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="w-full px-6 py-5 rounded-2xl bg-white border border-transparent focus:border-blue-500 outline-none transition-all font-bold shadow-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden px-10 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MINI FAQ SECTION */}
      <div className="max-w-7xl mx-auto px-6 mt-32 text-center">
        <h2 className="text-3xl font-black italic mb-12 tracking-tighter uppercase">Common Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-shadow">
            <h4 className="font-black text-sm uppercase mb-4 text-blue-600">Where is my order?</h4>
            <p className="text-gray-500 text-sm font-bold">You can track your order in real-time through the "Profile" section after logging in.</p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-shadow">
            <h4 className="font-black text-sm uppercase mb-4 text-blue-600">Return Policy?</h4>
            <p className="text-gray-500 text-sm font-bold">We offer a 7-day hassle-free return policy on most items if the seal is unbroken.</p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl transition-shadow">
            <h4 className="font-black text-sm uppercase mb-4 text-blue-600">Bulk Orders?</h4>
            <p className="text-gray-500 text-sm font-bold">Contact our corporate team at bulk@zappstore.com for special pricing.</p>
          </div>
        </div>
      </div>

    </div>
  );
}