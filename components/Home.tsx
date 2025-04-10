'use client'

import { useEffect, useRef } from 'react';
import { SignIn } from '@stackframe/stack';
import { gsap } from 'gsap';
import { UserButton } from '@stackframe/stack';
// import { useRouter } from 'next/router';

export default function Home() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
//   const router = useRouter();

  // Function to handle login/signup redirects
//   const handleAuth = (type) => {
//     router.push(`/auth/${type}`);
//   };

  useEffect(() => {
    // Hero animations
    gsap.fromTo(
      '.hero-content',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo(
      '.hero-image',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: 'power3.out' }
    );
    
    // Features animation
    gsap.fromTo('.feature-card', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 75%',
      }
    },{
        opacity: 1,
        
    });
    
    // CTA animation
    gsap.fromTo('.cta-content', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top 80%',
      }
    },{
        opacity: 1,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">


      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-6 px-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CIDROY</h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserButton/>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 px-6">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                AI-Powered <span className="text-green-600">Littering Detection</span> for a Cleaner Panjim
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                CIDROY's smart monitoring system uses AI to detect littering, create public awareness, and build civic accountability across Panjim, Goa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <button className='p-5 bg-green-300 rounded-4xl px-8'>Sign In</button>
                {/* <SignIn
                    fullPage={true}
                    automaticRedirect={true}
                    firstTab='password'
                    extraInfo={<>When signing in, you agree to our <a href="/terms">Terms</a></>}
                /> */}
                </div>
                <button className="bg-white hover:bg-gray-50 text-green-600 border border-green-600 py-3 px-8 rounded-lg font-medium transition duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="hero-image relative h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20"></div>
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-600/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section ref={featuresRef} className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">How CIDROY Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card p-6 rounded-xl shadow-md bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Detection</h3>
                <p className="text-gray-600">AI cameras installed across Panjim detect littering incidents in real-time with high accuracy.</p>
              </div>
              
              <div className="feature-card p-6 rounded-xl shadow-md bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Public Awareness</h3>
                <p className="text-gray-600">Digital screens display anonymized footage of littering incidents to create social accountability.</p>
              </div>
              
              <div className="feature-card p-6 rounded-xl shadow-md bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Data Analytics</h3>
                <p className="text-gray-600">Comprehensive dashboard with data visualizations identifying hotspots and trends for targeted action.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Proven Results</h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Our pilot program has already shown significant impact in areas where CIDROY has been deployed.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">73%</div>
                <p className="text-gray-600">Reduction in Littering</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">65%</div>
                <p className="text-gray-600">Increase in Proper Disposal</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">32</div>
                <p className="text-gray-600">Smart Screens Deployed</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
                <p className="text-gray-600">Public Awareness</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">What People Say</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 mb-4">
                  "The CIDROY system has transformed how our city handles littering. The real-time detection and public awareness approach works incredibly well."
                </p>
                <div>
                  <p className="font-medium text-gray-800">Mayor Rajesh Patel</p>
                  <p className="text-sm text-gray-500">Panjim Municipal Corporation</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 mb-4">
                  "As a business owner near the beach, I've seen firsthand how much cleaner our area has become since CIDROY was installed. Tourism has improved too."
                </p>
                <div>
                  <p className="font-medium text-gray-800">Priya Naik</p>
                  <p className="text-sm text-gray-500">Local Business Owner</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 mb-4">
                  "The data analytics provided by CIDROY have been invaluable for our environmental department in planning targeted awareness campaigns."
                </p>
                <div>
                  <p className="font-medium text-gray-800">Dr. Sanjay Verma</p>
                  <p className="text-sm text-gray-500">Environmental Scientist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 px-6 bg-green-600">
          <div className="container mx-auto text-center cta-content">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Join the CIDROY Initiative?</h2>
            <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto">
              Sign up today to access the dashboard and be part of building a cleaner, more beautiful Panjim.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-green-600 py-3 px-8 rounded-lg font-medium transition duration-300">
                    Sign Up
                </button>
                <button className="bg-gray-800 text-white py-3 px-8 rounded-lg font-medium transition duration-300">
                    Contact Us
                </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-10 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h2 className="text-xl font-bold">CIDROY</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center md:text-left">
            <p className="text-gray-400">© 2025 CIDROY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}