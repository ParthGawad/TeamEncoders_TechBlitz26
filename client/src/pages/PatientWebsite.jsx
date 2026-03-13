import React from 'react';
import { Link } from 'react-router-dom';

const PatientWebsite = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">SUNRISE</h1>
              <span className="text-[11px] font-bold text-sky-600 tracking-[0.2em] uppercase">Medical Center</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-bold text-white bg-sky-500 px-4 py-2 rounded-full hover:bg-sky-600 transition-colors">Home</a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">About Us</a>
            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Services</a>
            <a href="#doctors" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Our Doctors</a>
            <a href="#hours" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Contact Us</a>
          </nav>

          <Link
            to="/book"
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-sky-900 to-teal-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-teal-300">Trusted by 10,000+ Patients</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              A Pioneer in Complete and Comprehensive
              <span className="bg-gradient-to-r from-sky-300 to-teal-300 bg-clip-text text-transparent"> Healthcare</span>
            </h2>
            <p className="text-lg text-slate-300 mt-6 leading-relaxed max-w-lg">
              Delivering world-class medical care with compassion and cutting-edge technology for over 20 years.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/book"
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 text-white font-bold rounded-2xl shadow-2xl shadow-sky-500/30 hover:shadow-sky-500/50 transition-all hover:-translate-y-0.5 text-lg flex items-center gap-3"
              >
                Book Appointment
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a href="#about" className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all">
                Read More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '20+', label: 'Years Experience' },
              { num: '50+', label: 'Expert Doctors' },
              { num: '10K+', label: 'Happy Patients' },
              { num: '24/7', label: 'Emergency Care' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">{stat.num}</div>
                <p className="text-sm font-semibold text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">About Us</span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 leading-tight">Committed to Delivering the Best Medical Care</h3>
              <p className="text-slate-600 mt-6 leading-relaxed">
                Sunrise Medical Center has been at the forefront of healthcare excellence for over two decades. Our state-of-the-art facility combines advanced medical technology with compassionate care, ensuring every patient receives personalized attention.
              </p>
              <p className="text-slate-600 mt-4 leading-relaxed">
                With a team of 50+ specialized doctors across multiple disciplines, we offer comprehensive healthcare solutions — from routine check-ups to complex surgical procedures.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {['Advanced Technology', 'Expert Doctors', 'Patient-Centric', '24/7 Support'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-sky-50 text-sky-700 font-semibold rounded-full text-sm border border-sky-100">{tag}</span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-sky-100 to-teal-50 rounded-3xl p-8 aspect-square flex items-center justify-center border border-sky-100">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-sky-500 to-teal-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-sky-200">
                    <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">World-Class Facility</h4>
                  <p className="text-slate-500 mt-2">Equipped with the latest medical tech</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-400 rounded-2xl rotate-12 opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sky-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">Our Services</span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Comprehensive Healthcare Solutions</h3>
            <p className="text-slate-500 mt-4">We provide a wide range of medical services to cater to all your healthcare needs under one roof.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🫀', title: 'Cardiology', desc: 'Advanced cardiac care with latest diagnostic and treatment technologies.' },
              { icon: '🧠', title: 'Neurology', desc: 'Expert neurological evaluations and treatments for brain and spine conditions.' },
              { icon: '🦴', title: 'Orthopedics', desc: 'Comprehensive bone, joint, and muscle care including minimally invasive surgery.' },
              { icon: '👁️', title: 'Ophthalmology', desc: 'Complete eye care from routine exams to laser treatments and surgeries.' },
              { icon: '👶', title: 'Pediatrics', desc: 'Specialized healthcare for infants, children, and adolescents.' },
              { icon: '🩺', title: 'General Medicine', desc: 'Primary care, health check-ups, and preventive medicine programs.' },
            ].map((svc) => (
              <div key={svc.title} className="group p-8 bg-slate-50 hover:bg-gradient-to-br hover:from-sky-500 hover:to-teal-400 rounded-3xl border border-slate-100 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-1">
                <div className="text-4xl mb-4">{svc.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors">{svc.title}</h4>
                <p className="text-slate-500 group-hover:text-white/80 mt-3 transition-colors leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">Our Doctors</span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Meet Our Experts</h3>
            <p className="text-slate-500 mt-4">Our team of highly qualified and experienced doctors are dedicated to providing the best care.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Dr. Anika Sharma', spec: 'Cardiologist', exp: '15+ Years', color: 'from-rose-400 to-pink-500' },
              { name: 'Dr. Rajesh Patel', spec: 'Neurologist', exp: '20+ Years', color: 'from-sky-400 to-blue-500' },
              { name: 'Dr. Priya Menon', spec: 'Orthopedic Surgeon', exp: '12+ Years', color: 'from-teal-400 to-emerald-500' },
              { name: 'Dr. Vikram Singh', spec: 'Ophthalmologist', exp: '18+ Years', color: 'from-amber-400 to-orange-500' },
            ].map((doc) => (
              <div key={doc.name} className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
                <div className={`w-24 h-24 bg-gradient-to-br ${doc.color} rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{doc.name}</h4>
                <p className="text-sky-600 font-semibold text-sm mt-1">{doc.spec}</p>
                <p className="text-slate-400 text-sm mt-1">{doc.exp} Experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section id="hours" className="py-20 bg-gradient-to-br from-slate-900 via-sky-900 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-teal-300 uppercase tracking-widest">Timings</span>
            <h3 className="text-3xl md:text-4xl font-black text-white mt-3">Opening Hours</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="space-y-4">
                {[
                  { day: 'Monday – Thursday', time: '9:00 AM – 5:30 PM' },
                  { day: 'Friday', time: '9:00 AM – 4:00 PM' },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center py-3 border-b border-white/10 last:border-none">
                    <span className="font-bold text-white">{item.day}</span>
                    <span className="font-semibold text-teal-300">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="space-y-4">
                {[
                  { day: 'Saturday', time: '11:00 AM – 6:00 PM' },
                  { day: 'Sunday', time: 'Closed' },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between items-center py-3 border-b border-white/10 last:border-none">
                    <span className="font-bold text-white">{item.day}</span>
                    <span className={`font-semibold ${item.time === 'Closed' ? 'text-red-400' : 'text-teal-300'}`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 text-white font-bold rounded-2xl shadow-2xl shadow-sky-500/30 transition-all hover:-translate-y-0.5 text-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Book Your Appointment Now
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-400 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white leading-none">SUNRISE</h4>
                  <span className="text-[10px] font-bold text-sky-400 tracking-[0.2em] uppercase">Medical Center</span>
                </div>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-md">
                A trusted name in healthcare, providing comprehensive medical services with state-of-the-art facilities and a team of experienced professionals.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="hover:text-sky-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-sky-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition-colors">Services</a></li>
                <li><a href="#doctors" className="hover:text-sky-400 transition-colors">Our Doctors</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Contact Info</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  123 Health Avenue, Medical District, City — 411001
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  info@sunrisemedical.com
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm text-slate-600">
            <p>© {new Date().getFullYear()} Sunrise Medical Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientWebsite;
